// ═══════════════════════════════════════════════════════════════
// shared/services/vendorService.js
// Firestore CRUD for vendors — shared between web and mobile
// ═══════════════════════════════════════════════════════════════

import { APPROVAL_STATUS } from '../types';

export async function getApprovedVendors(db, filters = {}) {
  const { collection, query, where, getDocs } = await import('firebase/firestore');

  let constraints = [where('status', '==', APPROVAL_STATUS.APPROVED)];
  if (filters.state && filters.state !== 'all') {
    constraints.push(where('state', '==', filters.state));
  }

  const q = query(collection(db, 'vendors'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function submitVendorProfile(db, data) {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  const vendorDoc = {
    ...data,
    status: APPROVAL_STATUS.PENDING,
    verified: false,
    rating: 0,
    reviews: 0,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, 'vendors'), vendorDoc);
  return { id: ref.id, ...vendorDoc };
}

export async function approveVendor(db, vendorId) {
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'vendors', vendorId), {
    status: APPROVAL_STATUS.APPROVED,
    verified: true,
  });
}

export async function rejectVendor(db, vendorId) {
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'vendors', vendorId), {
    status: APPROVAL_STATUS.REJECTED,
  });
}

export async function getPendingVendors(db) {
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  const q = query(collection(db, 'vendors'), where('status', '==', APPROVAL_STATUS.PENDING));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function seedVendors(db, vendorsData) {
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  for (const vendor of vendorsData) {
    await setDoc(doc(db, 'vendors', vendor.id), {
      ...vendor,
      createdAt: serverTimestamp(),
    });
  }
}
