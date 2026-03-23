// ═══════════════════════════════════════════════════════════════
// shared/services/notificationService.js
// Push + Email + SMS notification logic
//
// Push: handled client-side via FCM SDK
// Email + SMS: triggered server-side via Cloud Functions
//   (see /functions/index.js for Firestore triggers)
//
// This file handles the CLIENT-SIDE portion:
//   - Requesting push permission
//   - Getting FCM token
//   - Listening for foreground messages
// ═══════════════════════════════════════════════════════════════

/**
 * Request notification permission and get FCM token (WEB)
 * @param {object} messaging - Firebase Messaging instance
 * @param {string} vapidKey - VAPID key from Firebase console
 * @returns {string|null} FCM token
 */
export async function requestWebPushPermission(messaging, vapidKey) {
  try {
    const { getToken } = await import('firebase/messaging');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Push notification permission denied');
      return null;
    }
    const token = await getToken(messaging, { vapidKey });
    console.log('FCM Token:', token);
    return token;
  } catch (err) {
    console.error('Error getting FCM token:', err);
    return null;
  }
}

/**
 * Listen for foreground messages (WEB)
 */
export async function onForegroundMessage(messaging, callback) {
  const { onMessage } = await import('firebase/messaging');
  return onMessage(messaging, (payload) => {
    console.log('Foreground message:', payload);
    callback({
      title: payload.notification?.title || 'PoojaConnect',
      body: payload.notification?.body || '',
      data: payload.data || {},
    });
  });
}

/**
 * Build notification content for different event types
 */
export function buildNotificationContent(type, data) {
  switch (type) {
    case 'booking_created':
      return {
        title: '🙏 New Booking Request',
        body: `${data.userName} has requested ${data.poojaType} on ${data.date}`,
        data: { bookingId: data.bookingId, type: 'booking_created' },
      };
    case 'booking_confirmed':
      return {
        title: '✅ Booking Confirmed!',
        body: `${data.priestName} confirmed your ${data.poojaType} for ${data.confirmedDate}. Price: ${data.confirmedPrice}`,
        data: { bookingId: data.bookingId, type: 'booking_confirmed' },
      };
    case 'booking_cancelled':
      return {
        title: '❌ Booking Cancelled',
        body: `Your ${data.poojaType} booking with ${data.priestName} has been cancelled.`,
        data: { bookingId: data.bookingId, type: 'booking_cancelled' },
      };
    case 'booking_completed':
      return {
        title: '🎉 Service Completed',
        body: `Your ${data.poojaType} with ${data.priestName} is complete. Please leave a review!`,
        data: { bookingId: data.bookingId, type: 'booking_completed' },
      };
    case 'approval_approved':
      return {
        title: '✅ Profile Approved!',
        body: 'Your profile has been approved and is now live on PoojaConnect.',
        data: { type: 'approval_approved' },
      };
    case 'approval_rejected':
      return {
        title: '❌ Profile Not Approved',
        body: 'Your profile submission was not approved. Please contact support.',
        data: { type: 'approval_rejected' },
      };
    default:
      return {
        title: '🙏 PoojaConnect',
        body: data.message || 'You have a new notification.',
        data: { type: 'generic' },
      };
  }
}

/**
 * Email templates (used by Cloud Functions via SendGrid)
 */
export const EMAIL_TEMPLATES = {
  bookingConfirmed: (data) => ({
    subject: `✅ Booking Confirmed: ${data.poojaType} with ${data.priestName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #E8712A; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🙏 PoojaConnect</h1>
        </div>
        <div style="padding: 24px; background: #FEFCF6;">
          <h2 style="color: #1A1207;">Booking Confirmed!</h2>
          <p>Dear ${data.userName},</p>
          <p>Your <strong>${data.poojaType}</strong> booking has been confirmed.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; font-weight: bold;">Priest:</td><td style="padding: 8px;">${data.priestName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${data.confirmedDate}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Price:</td><td style="padding: 8px;">${data.confirmedPrice}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Address:</td><td style="padding: 8px;">${data.address}</td></tr>
          </table>
          ${data.suggestedItems ? `
            <h3 style="color: #D4A843;">🛒 Suggested Items</h3>
            <p>${data.suggestedItems.join(', ')}</p>
          ` : ''}
          <p style="color: #8B7355; font-size: 12px;">You received this email because you booked a service on PoojaConnect.</p>
        </div>
      </div>
    `,
  }),

  bookingCancelled: (data) => ({
    subject: `❌ Booking Cancelled: ${data.poojaType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #C62828; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🙏 PoojaConnect</h1>
        </div>
        <div style="padding: 24px; background: #FEFCF6;">
          <h2 style="color: #1A1207;">Booking Cancelled</h2>
          <p>Dear ${data.userName},</p>
          <p>Your <strong>${data.poojaType}</strong> booking with <strong>${data.priestName}</strong> has been cancelled.</p>
          <p>If you did not request this cancellation, please contact us immediately.</p>
          <p style="color: #8B7355; font-size: 12px;">You received this email because you had a booking on PoojaConnect.</p>
        </div>
      </div>
    `,
  }),
};

/**
 * SMS templates (used by Cloud Functions via Twilio)
 */
export const SMS_TEMPLATES = {
  bookingConfirmed: (data) =>
    `PoojaConnect: Your ${data.poojaType} with ${data.priestName} is confirmed for ${data.confirmedDate}. Price: ${data.confirmedPrice}`,
  bookingCancelled: (data) =>
    `PoojaConnect: Your ${data.poojaType} booking with ${data.priestName} has been cancelled.`,
};
