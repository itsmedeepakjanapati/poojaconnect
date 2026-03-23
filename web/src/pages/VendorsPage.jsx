// web/src/pages/VendorsPage.jsx
import React, { useState } from 'react';
import { VENDORS_SEED } from '../../../shared/data/seedData';

export default function VendorsPage() {
  const [vendors] = useState(VENDORS_SEED.filter(v => v.status === 'approved'));

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl font-bold text-gray-900">Pooja Vendors & Suppliers</h2>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#FBF7ED', color: '#D4A843' }}>
          {vendors.length} listed
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {vendors.map(vendor => (
          <div key={vendor.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: '#FBF7ED' }}>🏪</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">{vendor.name}</div>
                <div className="text-xs text-gray-400">{vendor.type}</div>
              </div>
              {vendor.verified && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#2E7D32' }}>✓</span>}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2 mb-3">
              <span>📍 {vendor.location}</span>
              <span>⭐ {vendor.rating}</span>
            </div>
            <div className="flex gap-1 flex-wrap mb-3">
              {vendor.items.slice(0, 5).map(item => (
                <span key={item} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#FBF7ED', color: '#D4A843' }}>{item}</span>
              ))}
              {vendor.items.length > 5 && <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">+{vendor.items.length - 5}</span>}
            </div>
            <div className="text-xs text-gray-500">📞 {vendor.phone}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
