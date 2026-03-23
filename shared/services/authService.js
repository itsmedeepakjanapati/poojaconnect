// ═══════════════════════════════════════════════════════════════
// shared/services/authService.js
// Firebase Authentication — shared between web and mobile
// ═══════════════════════════════════════════════════════════════

// NOTE: Platform-specific Firebase init happens in web/src/firebase.js
// and mobile/src/firebase.js — this file exports pure logic functions
// that accept the auth instance as a parameter.

import { USER_ROLES } from '../types';

/**
 * Register a new user with email/password
 * @param {object} auth - Firebase Auth instance
 * @param {object} db - Firestore instance
 * @param {object} data - { name, email, password, phone, role }
 */
export async function registerUser(auth, db, data) {
  const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

  const { name, email, password, phone, role = USER_ROLES.USER } = data;

  // Create auth user
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Update display name
  await updateProfile(user, { displayName: name });

  // Create Firestore user document
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    phone: phone || '',
    role,
    fcmToken: null,
    createdAt: serverTimestamp(),
    notifPrefs: { email: true, sms: true, push: true },
  });

  return user;
}

/**
 * Sign in with email/password
 */
export async function loginUser(auth, email, password) {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign in with Google (web only — mobile uses Expo Google auth)
 */
export async function loginWithGoogle(auth) {
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

/**
 * Sign out
 */
export async function logoutUser(auth) {
  const { signOut } = await import('firebase/auth');
  await signOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPassword(auth, email) {
  const { sendPasswordResetEmail } = await import('firebase/auth');
  await sendPasswordResetEmail(auth, email);
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(db, uid) {
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Update FCM token for push notifications
 */
export async function updateFcmToken(db, uid, token) {
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'users', uid), { fcmToken: token });
}
