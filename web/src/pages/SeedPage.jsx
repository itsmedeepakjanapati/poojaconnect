// web/src/pages/SeedPage.jsx
// One-time bootstrap page: self-promote current user to admin, then seed
// priests, vendors, and temples into Firestore.
import React, { useContext, useState } from 'react';
import { doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext, ToastContext } from '../App';
import { PRIESTS_SEED, VENDORS_SEED } from '../../../shared/data/seedData';
import { TEMPLES } from '../../../shared/data/templesData';

export default function SeedPage() {
  const { user, profile } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState([]);

  const append = (msg) => setLog((l) => [...l, msg]);

  const run = async () => {
    if (!user) {
      addToast('Not signed in', 'Sign in first.', 'error');
      return;
    }
    setBusy(true);
    setLog([]);
    try {
      append(`🔐 Signed in as ${user.email} (uid: ${user.uid})`);

      append(`⬆️  Promoting to admin in users/${user.uid} …`);
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || null,
          role: 'admin',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      append('   ↳ admin role set');

      // Small delay so rules-cache picks up the new role before next writes.
      await new Promise((r) => setTimeout(r, 1500));

      append(`👳 Seeding ${PRIESTS_SEED.length} priests …`);
      const b1 = writeBatch(db);
      for (const p of PRIESTS_SEED) {
        b1.set(
          doc(db, 'priests', p.id),
          { ...p, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
          { merge: true }
        );
      }
      await b1.commit();
      append('   ↳ done');

      append(`🏪 Seeding ${VENDORS_SEED.length} vendors …`);
      const b2 = writeBatch(db);
      for (const v of VENDORS_SEED) {
        b2.set(
          doc(db, 'vendors', v.id),
          { ...v, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
          { merge: true }
        );
      }
      await b2.commit();
      append('   ↳ done');

      append(`🛕 Seeding ${TEMPLES.length} temples …`);
      const b3 = writeBatch(db);
      for (const t of TEMPLES) {
        b3.set(
          doc(db, 'temples', t.id),
          { ...t, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
          { merge: true }
        );
      }
      await b3.commit();
      append('   ↳ done');

      append('✅ Seed complete.');
      addToast('Seed complete', 'Firestore is populated.', 'success');
    } catch (err) {
      console.error(err);
      append('❌ ' + (err?.code || '') + ' ' + (err?.message || err));
      addToast('Seed failed', err?.message || String(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">🌱 Seed Firestore</h2>
      <p className="text-sm text-gray-600 mb-4">
        Promotes you to <code>role: admin</code> and writes {PRIESTS_SEED.length} priests,{' '}
        {VENDORS_SEED.length} vendors, and {TEMPLES.length} temples to Firestore.
        Safe to re-run (uses <code>set(..., {'{ merge: true }'})</code>).
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 text-sm">
        <div>Signed in: <strong>{user?.email || '—'}</strong></div>
        <div>UID: <code className="text-xs">{user?.uid || '—'}</code></div>
        <div>Current role: <strong>{profile?.role || '(none)'}</strong></div>
      </div>

      <button
        onClick={run}
        disabled={busy || !user}
        className="px-5 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
        style={{ background: '#E8712A' }}
      >
        {busy ? 'Seeding…' : '🌱 Seed database now'}
      </button>

      {log.length > 0 && (
        <pre className="mt-4 bg-gray-900 text-green-200 text-xs p-4 rounded-lg overflow-auto whitespace-pre-wrap">
          {log.join('\n')}
        </pre>
      )}
    </main>
  );
}
