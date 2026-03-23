// ═══════════════════════════════════════════════════════════════
// shared/services/bookingService.js
// Booking CRUD + notification triggers — shared web & mobile
// ═══════════════════════════════════════════════════════════════

import { BOOKING_STATUS } from '../types';
import { getItemsForPooja } from '../types';

/**
 * Create a new booking request
 */
export async function createBooking(db, data) {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

  const suggestedItems = getItemsForPooja(data.poojaType);

  const booking = {
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    userPhone: data.userPhone,
    priestId: data.priestId,
    priestName: data.priestName,
    poojaType: data.poojaType,
    requestedDate: data.date,
    requestedTime: data.time || '',
    address: data.address,
    notes: data.notes || '',
    status: BOOKING_STATUS.PENDING,
    confirmedDate: null,
    confirmedPrice: null,
    suggestedItems,
    suggestedVendors: [], // Populated by Cloud Function or client
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // Notification tracking
    emailSent: false,
    smsSent: false,
    pushSent: false,
  };

  const ref = await addDoc(collection(db, 'bookings'), booking);
  // Cloud Function will trigger notifications to the priest
  return { id: ref.id, ...booking };
}

/**
 * Priest confirms a booking
 */
export async function confirmBooking(db, bookingId, confirmedPrice, confirmedDate) {
  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
  await updateDoc(doc(db, 'bookings', bookingId), {
    status: BOOKING_STATUS.CONFIRMED,
    confirmedPrice,
    confirmedDate: confirmedDate || null,
    updatedAt: serverTimestamp(),
    // Cloud Function triggers email + push + SMS to user
  });
}

/**
 * Cancel a booking (by user or priest)
 */
export async function cancelBooking(db, bookingId, cancelledBy) {
  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
  await updateDoc(doc(db, 'bookings', bookingId), {
    status: BOOKING_STATUS.CANCELLED,
    cancelledBy,
    cancelledAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // Cloud Function triggers cancellation email + push + SMS
  });
}

/**
 * Mark booking as completed
 */
export async function completeBooking(db, bookingId) {
  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
  await updateDoc(doc(db, 'bookings', bookingId), {
    status: BOOKING_STATUS.COMPLETED,
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Get bookings for a user
 */
export async function getUserBookings(db, userId) {
  const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get bookings for a priest
 */
export async function getPriestBookings(db, priestId) {
  const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
  const q = query(
    collection(db, 'bookings'),
    where('priestId', '==', priestId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Admin: get all bookings
 */
export async function getAllBookings(db) {
  const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Listen to booking changes in real-time (for live updates)
 */
export function subscribeToBookings(db, userId, callback) {
  // Dynamic import not ideal for listeners; in practice import at top of file
  const { collection, query, where, onSnapshot, orderBy } = require('firebase/firestore');
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(bookings);
  });
}
