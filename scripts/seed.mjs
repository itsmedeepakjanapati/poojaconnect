// ═══════════════════════════════════════════════════════════════
// scripts/seed.mjs — Seed Firestore with priests, vendors, temples
// ─────────────────────────────────────────────────────────────────
// Uses the Firebase client SDK to:
//   1. Sign in with the email/password you pass on the command line
//   2. Promote that user to role='admin' in users/{uid}
//   3. Upsert PRIESTS_SEED, VENDORS_SEED, TEMPLES into Firestore
//
// Usage (from repo root):
//   node scripts/seed.mjs <email> <password>
//
// The email must belong to a Firebase Auth user. Register one via the
// web app first if needed.
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';

import firebaseConfig from '../shared/config/firebase.js';
import { PRIESTS_SEED, VENDORS_SEED } from '../shared/data/seedData.js';
import { TEMPLES } from '../shared/data/templesData.js';

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error('Usage: node scripts/seed.mjs <email> <password>');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  console.log(`🔐 Signing in as ${email} …`);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  console.log(`   ↳ uid = ${uid}`);

  console.log('⬆️  Promoting to admin (users/' + uid + ') …');
  await setDoc(
    doc(db, 'users', uid),
    {
      uid,
      email,
      role: 'admin',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Firestore batch limit is 500 writes; we have ~44 docs so one batch is fine.
  const batch = writeBatch(db);

  console.log(`👳 Seeding ${PRIESTS_SEED.length} priests …`);
  for (const p of PRIESTS_SEED) {
    batch.set(
      doc(db, 'priests', p.id),
      { ...p, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true }
    );
  }

  console.log(`🏪 Seeding ${VENDORS_SEED.length} vendors …`);
  for (const v of VENDORS_SEED) {
    batch.set(
      doc(db, 'vendors', v.id),
      { ...v, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true }
    );
  }

  console.log(`🛕 Seeding ${TEMPLES.length} temples …`);
  for (const t of TEMPLES) {
    batch.set(
      doc(db, 'temples', t.id),
      { ...t, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true }
    );
  }

  await batch.commit();
  console.log('✅ Seed complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
