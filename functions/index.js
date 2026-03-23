// functions/index.js
// Firebase Cloud Functions — handles server-side notifications
// Triggers on Firestore document changes (bookings, priest/vendor approvals)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// ─── Configuration (set via firebase functions:config:set) ───
// firebase functions:config:set sendgrid.key="SG.xxx" twilio.sid="ACxxx" twilio.token="xxx" twilio.from="+1555000"
// For production, use Secret Manager instead

// ═══════════════════════════════════════════════════════════════
// 1. BOOKING CREATED → Notify priest
// ═══════════════════════════════════════════════════════════════
exports.onBookingCreated = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const { priestId, userName, poojaType, requestedDate } = booking;

    try {
      // Get priest's FCM token
      const priestDoc = await db.collection('priests').doc(priestId).get();
      if (!priestDoc.exists) return;
      const priest = priestDoc.data();

      // If priest has a linked user account with FCM token
      if (priest.userId) {
        const userDoc = await db.collection('users').doc(priest.userId).get();
        if (userDoc.exists) {
          const token = userDoc.data().fcmToken;
          if (token) {
            await admin.messaging().send({
              token,
              notification: {
                title: '🙏 New Booking Request',
                body: `${userName} has requested ${poojaType} on ${requestedDate}`,
              },
              data: {
                bookingId: context.params.bookingId,
                type: 'booking_created',
              },
            });
          }
        }
      }

      console.log(`Booking created notification sent for ${context.params.bookingId}`);
    } catch (err) {
      console.error('Error sending booking created notification:', err);
    }
  });

// ═══════════════════════════════════════════════════════════════
// 2. BOOKING STATUS CHANGED → Notify user (email + push + SMS)
// ═══════════════════════════════════════════════════════════════
exports.onBookingUpdated = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only trigger on status change
    if (before.status === after.status) return;

    const bookingId = context.params.bookingId;

    try {
      // Get user
      const userDoc = await db.collection('users').doc(after.userId).get();
      if (!userDoc.exists) return;
      const user = userDoc.data();
      const notifPrefs = user.notifPrefs || { email: true, sms: true, push: true };

      // ── BOOKING CONFIRMED ──
      if (after.status === 'confirmed') {
        // Push notification
        if (notifPrefs.push && user.fcmToken) {
          await admin.messaging().send({
            token: user.fcmToken,
            notification: {
              title: '✅ Booking Confirmed!',
              body: `${after.priestName} confirmed your ${after.poojaType}. Price: ${after.confirmedPrice}`,
            },
            data: { bookingId, type: 'booking_confirmed' },
          });
        }

        // Email via SendGrid
        if (notifPrefs.email && user.email) {
          await sendEmail(user.email, {
            subject: `✅ Booking Confirmed: ${after.poojaType} with ${after.priestName}`,
            html: buildConfirmationEmail(after, user),
          });
        }

        // SMS via Twilio
        if (notifPrefs.sms && user.phone) {
          await sendSMS(user.phone,
            `PoojaConnect: Your ${after.poojaType} with ${after.priestName} is confirmed for ${after.confirmedDate || after.requestedDate}. Price: ${after.confirmedPrice}`
          );
        }

        // Update tracking flags
        await change.after.ref.update({
          emailSent: notifPrefs.email,
          smsSent: notifPrefs.sms,
          pushSent: notifPrefs.push,
        });

        console.log(`Confirmation notifications sent for booking ${bookingId}`);
      }

      // ── BOOKING CANCELLED ──
      if (after.status === 'cancelled') {
        if (notifPrefs.push && user.fcmToken) {
          await admin.messaging().send({
            token: user.fcmToken,
            notification: {
              title: '❌ Booking Cancelled',
              body: `Your ${after.poojaType} booking with ${after.priestName} has been cancelled.`,
            },
            data: { bookingId, type: 'booking_cancelled' },
          });
        }

        if (notifPrefs.email && user.email) {
          await sendEmail(user.email, {
            subject: `❌ Booking Cancelled: ${after.poojaType}`,
            html: buildCancellationEmail(after, user),
          });
        }

        if (notifPrefs.sms && user.phone) {
          await sendSMS(user.phone,
            `PoojaConnect: Your ${after.poojaType} booking with ${after.priestName} has been cancelled.`
          );
        }

        await change.after.ref.update({
          emailSent: notifPrefs.email,
          smsSent: notifPrefs.sms,
          pushSent: notifPrefs.push,
        });

        console.log(`Cancellation notifications sent for booking ${bookingId}`);
      }
    } catch (err) {
      console.error('Error in onBookingUpdated:', err);
    }
  });

// ═══════════════════════════════════════════════════════════════
// 3. PRIEST/VENDOR APPROVED → Notify them
// ═══════════════════════════════════════════════════════════════
exports.onPriestApproved = functions.firestore
  .document('priests/{priestId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status === 'pending' && after.status === 'approved' && after.email) {
      await sendEmail(after.email, {
        subject: '✅ Your PoojaConnect profile has been approved!',
        html: `<p>Namaste ${after.name},</p><p>Your priest profile is now live on PoojaConnect. Devotees can now find and book your services.</p><p>🙏 PoojaConnect Team</p>`,
      });
    }
  });

exports.onVendorApproved = functions.firestore
  .document('vendors/{vendorId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status === 'pending' && after.status === 'approved' && after.email) {
      await sendEmail(after.email, {
        subject: '✅ Your vendor listing on PoojaConnect is live!',
        html: `<p>Dear ${after.name},</p><p>Your vendor profile is now live on PoojaConnect. Users will see your shop when booking poojas that need your items.</p><p>🙏 PoojaConnect Team</p>`,
      });
    }
  });

// ═══════════════════════════════════════════════════════════════
// 4. SEED DATA (HTTP callable — run once to populate Firestore)
// ═══════════════════════════════════════════════════════════════
exports.seedDatabase = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') { res.status(405).send('POST only'); return; }

  // Import seed data
  const { PRIESTS_SEED, VENDORS_SEED } = require('./seedData');
  const batch = db.batch();

  for (const priest of PRIESTS_SEED) {
    batch.set(db.collection('priests').doc(priest.id), {
      ...priest,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  for (const vendor of VENDORS_SEED) {
    batch.set(db.collection('vendors').doc(vendor.id), {
      ...vendor,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  res.json({ success: true, priests: PRIESTS_SEED.length, vendors: VENDORS_SEED.length });
});

// ═══════════════════════════════════════════════════════════════
// HELPER: SendGrid Email
// ═══════════════════════════════════════════════════════════════
async function sendEmail(to, { subject, html }) {
  try {
    const sgMail = require('@sendgrid/mail');
    const key = functions.config().sendgrid?.key;
    if (!key) { console.warn('SendGrid key not configured'); return; }
    sgMail.setApiKey(key);
    await sgMail.send({
      to,
      from: 'noreply@poojaconnect.com',
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('SendGrid error:', err.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Twilio SMS
// ═══════════════════════════════════════════════════════════════
async function sendSMS(to, body) {
  try {
    const config = functions.config().twilio || {};
    if (!config.sid || !config.token) { console.warn('Twilio not configured'); return; }
    const twilio = require('twilio')(config.sid, config.token);
    await twilio.messages.create({ body, from: config.from, to });
    console.log(`SMS sent to ${to}`);
  } catch (err) {
    console.error('Twilio error:', err.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Email templates
// ═══════════════════════════════════════════════════════════════
function buildConfirmationEmail(booking, user) {
  const items = booking.suggestedItems?.length
    ? `<h3 style="color:#D4A843;">🛒 Suggested Items</h3><p>${booking.suggestedItems.join(', ')}</p>` : '';
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#E8712A;color:white;padding:20px;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;">🙏 PoojaConnect</h1>
      </div>
      <div style="padding:24px;background:#FEFCF6;border:1px solid #E8DCC8;border-radius:0 0 12px 12px;">
        <h2 style="color:#1A1207;">Booking Confirmed!</h2>
        <p>Dear ${user.name || 'Devotee'},</p>
        <p>Your <strong>${booking.poojaType}</strong> has been confirmed.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #E8DCC8;">Priest:</td><td style="padding:8px;border-bottom:1px solid #E8DCC8;">${booking.priestName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #E8DCC8;">Date:</td><td style="padding:8px;border-bottom:1px solid #E8DCC8;">${booking.confirmedDate || booking.requestedDate}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #E8DCC8;">Price:</td><td style="padding:8px;border-bottom:1px solid #E8DCC8;">${booking.confirmedPrice}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Address:</td><td style="padding:8px;">${booking.address}</td></tr>
        </table>
        ${items}
        <p style="color:#8B7355;font-size:12px;margin-top:20px;">You received this email from PoojaConnect.</p>
      </div>
    </div>`;
}

function buildCancellationEmail(booking, user) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#C62828;color:white;padding:20px;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;">🙏 PoojaConnect</h1>
      </div>
      <div style="padding:24px;background:#FEFCF6;border:1px solid #E8DCC8;border-radius:0 0 12px 12px;">
        <h2 style="color:#1A1207;">Booking Cancelled</h2>
        <p>Dear ${user.name || 'Devotee'},</p>
        <p>Your <strong>${booking.poojaType}</strong> booking with <strong>${booking.priestName}</strong> has been cancelled.</p>
        <p>If you did not request this cancellation, please contact us.</p>
        <p style="color:#8B7355;font-size:12px;margin-top:20px;">You received this email from PoojaConnect.</p>
      </div>
    </div>`;
}
