// ═══════════════════════════════════════════════════════════════
// shared/services/bhoktaService.js
// Firestore CRUD for Bhoktas — invited brahmins who partake in the
// ritual meal during Pitru Karyam (ancestral rites).
// Shared between web and mobile. Mirrors vendorService / priestService.
// ═══════════════════════════════════════════════════════════════

import { APPROVAL_STATUS } from '../types';

/**
 * Fetch all approved bhoktas, optionally filtered.
 *   filters: { state, language, ritual, needsRide }
 */
export async function getApprovedBhoktas(db, filters = {}) {
  const { collection, query, where, getDocs } = await import('firebase/firestore');

  const constraints = [where('status', '==', APPROVAL_STATUS.APPROVED)];
  if (filters.state && filters.state !== 'all') {
    constraints.push(where('state', '==', filters.state));
  }
  if (filters.language && filters.language !== 'all') {
    constraints.push(where('languages', 'array-contains', filters.language));
  }

  const q = query(collection(db, 'bhoktas'), ...constraints);
  const snap = await getDocs(q);
  let results = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Client-side filters
  if (filters.ritual && filters.ritual !== 'all') {
    results = results.filter(b => (b.rituals || []).includes(filters.ritual));
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(b =>
      (b.name || '').toLowerCase().includes(s) ||
      (b.city || '').toLowerCase().includes(s) ||
      (b.rituals || []).some(r => r.toLowerCase().includes(s)),
    );
  }
  if (filters.needsRide === false) {
    results = results.filter(b => !b.needsRide);
  }
  return results;
}

export async function getBhoktaById(db, bhoktaId) {
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'bhoktas', bhoktaId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Submit a new bhokta profile (pending admin approval).
 * data: { name, email, phone, languages[], rituals[], maxDistanceMiles,
 *         needsRide, state, city, notes, userId }
 */
export async function submitBhoktaProfile(db, data) {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

  const bhoktaDoc = {
    ...data,
    status: APPROVAL_STATUS.PENDING,
    verified: false,
    rating: 0,
    reviews: 0,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, 'bhoktas'), bhoktaDoc);
  return { id: ref.id, ...bhoktaDoc };
}

export async function approveBhokta(db, bhoktaId) {
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'bhoktas', bhoktaId), {
    status: APPROVAL_STATUS.APPROVED,
    verified: true,
  });
}

export async function rejectBhokta(db, bhoktaId, reason = '') {
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'bhoktas', bhoktaId), {
    status: APPROVAL_STATUS.REJECTED,
    rejectionReason: reason,
  });
}

export async function getPendingBhoktas(db) {
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  const q = query(collection(db, 'bhoktas'), where('status', '==', APPROVAL_STATUS.PENDING));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
