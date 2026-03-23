// ═══════════════════════════════════════════════════════════════
// shared/services/priestService.js
// Firestore CRUD for priests — shared between web and mobile
// ═══════════════════════════════════════════════════════════════

import { APPROVAL_STATUS } from '../types';

/**
 * Fetch all approved priests, optionally filtered
 */
export async function getApprovedPriests(db, filters = {}) {
  const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');

  let constraints = [where('status', '==', APPROVAL_STATUS.APPROVED)];

  if (filters.state && filters.state !== 'all') {
    constraints.push(where('state', '==', filters.state));
  }
  if (filters.language && filters.language !== 'all') {
    constraints.push(where('languages', 'array-contains', filters.language));
  }

  const q = query(collection(db, 'priests'), ...constraints);
  const snap = await getDocs(q);
  let results = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Client-side filters for text search and pooja type
  if (filters.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.poojas.some(pj => pj.toLowerCase().includes(s))
    );
  }
  if (filters.poojaType && filters.poojaType !== 'all') {
    const pt = filters.poojaType.toLowerCase();
    results = results.filter(p =>
      p.poojas.some(pj => pj.toLowerCase().includes(pt))
    );
  }

  return results;
}

/**
 * Get a single priest by ID
 */
export async function getPriestById(db, priestId) {
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'priests', priestId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Submit a new priest profile (pending admin approval)
 */
export async function submitPriestProfile(db, data) {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

  const priestDoc = {
    ...data,
    status: APPROVAL_STATUS.PENDING,
    verified: false,
    rating: 0,
    reviews: 0,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, 'priests'), priestDoc);
  return { id: ref.id, ...priestDoc };
}

/**
 * Admin: approve a priest
 */
export async function approvePriest(db, priestId) {
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'priests', priestId), {
    status: APPROVAL_STATUS.APPROVED,
    verified: true,
  });
}

/**
 * Admin: reject a priest
 */
export async function rejectPriest(db, priestId, reason = '') {
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'priests', priestId), {
    status: APPROVAL_STATUS.REJECTED,
    rejectionReason: reason,
  });
}

/**
 * Admin: get all pending priests
 */
export async function getPendingPriests(db) {
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  const q = query(collection(db, 'priests'), where('status', '==', APPROVAL_STATUS.PENDING));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Seed priests from local data (run once)
 */
export async function seedPriests(db, priestsData) {
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  for (const priest of priestsData) {
    await setDoc(doc(db, 'priests', priest.id), {
      ...priest,
      createdAt: serverTimestamp(),
    });
  }
}
