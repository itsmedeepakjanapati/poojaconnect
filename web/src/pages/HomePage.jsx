// web/src/pages/HomePage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { POOJA_CATEGORIES } from '../../../shared/types';

export default function HomePage() {
  const { profile } = useContext(AuthContext);

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="rounded-2xl p-8 text-white mb-6" style={{ background: 'linear-gradient(135deg, #E8712A, #8B1A1A)' }}>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Namaste, {profile?.name || 'Devotee'}! 🙏</h1>
        <p className="text-sm opacity-90 mb-5 max-w-lg leading-relaxed">
          Find trusted Hindu priests for poojas, homams, pitru karyams & more across Boston, New Hampshire & Connecticut.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/priests" className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold no-underline"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#C5561A' }}>
            Find a Priest
          </Link>
          <Link to="/vendors" className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold no-underline"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>
            Browse Vendors
          </Link>
        </div>
      </div>

      {/* Categories */}
      <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">Browse by Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
        {POOJA_CATEGORIES.map(cat => (
          <Link key={cat.name} to={`/priests?category=${encodeURIComponent(cat.types[0])}`}
            className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow no-underline">
            <div className="text-3xl mb-1">{cat.icon}</div>
            <div className="text-sm font-semibold text-gray-900">{cat.name}</div>
            <div className="text-xs text-gray-400">{cat.types.length} services</div>
          </Link>
        ))}
      </div>

      {/* Join section */}
      <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">Join PoojaConnect</h3>
      <div className="grid md:grid-cols-2 gap-3 mb-8">
        <Link to="/register" className="bg-white rounded-xl border-l-4 p-5 no-underline hover:shadow-md transition-shadow" style={{ borderLeftColor: '#E8712A' }}>
          <div className="font-bold text-gray-900 mb-1">🙏 Are you a Priest?</div>
          <div className="text-sm text-gray-500">Register yourself and reach devotees in New England. Admin approval required.</div>
        </Link>
        <Link to="/register" className="bg-white rounded-xl border-l-4 p-5 no-underline hover:shadow-md transition-shadow" style={{ borderLeftColor: '#D4A843' }}>
          <div className="font-bold text-gray-900 mb-1">🏪 Are you a Vendor?</div>
          <div className="text-sm text-gray-500">Flower shops, pooja supply stores — join our marketplace. Admin approval required.</div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: '🙏', num: '12+', label: 'Verified Priests' },
          { icon: '🏪', num: '5+', label: 'Vendors' },
          { icon: '📍', num: '3', label: 'States Covered' },
          { icon: '🔥', num: '40+', label: 'Services Offered' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl">{s.icon}</div>
            <div className="text-xl font-bold mt-1" style={{ color: '#E8712A' }}>{s.num}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Architecture info */}
      <div className="rounded-xl p-5 border" style={{ background: '#FBF7ED', borderColor: '#D4A843' }}>
        <h4 className="font-serif font-bold text-gray-900 mb-2">☁️ Cost-Optimized Architecture</h4>
        <div className="text-xs text-gray-600 leading-relaxed space-y-1">
          <p><strong>Platform:</strong> Google Firebase — cheapest for this scale (~$0–25/month)</p>
          <p><strong>Auth:</strong> Firebase Auth (50K MAU free) · <strong>DB:</strong> Firestore · <strong>Push:</strong> FCM (free, unlimited)</p>
          <p><strong>Email:</strong> SendGrid via Cloud Functions · <strong>SMS:</strong> Twilio · <strong>Mobile:</strong> React Native (Expo)</p>
        </div>
      </div>
    </main>
  );
}
