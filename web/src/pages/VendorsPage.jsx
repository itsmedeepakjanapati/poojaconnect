// web/src/pages/VendorsPage.jsx
import React, { useState } from 'react';
import { VENDORS_SEED } from '../../../shared/data/seedData';

function openWhatsApp(number, name) {
  const msg = encodeURIComponent(`Hi, I found you on PoojaConnect. I'd like to enquire about your pooja supplies.`);
  window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${msg}`, '_blank');
}

const TYPE_ICONS = {
  'Fresh Flowers & Garlands': '🌸',
  'Pooja Items & Flowers': '🪔',
  'Pooja Supplies': '🧧',
  'Indian Groceries & Pooja Items': '🏪',
  'Pooja Supplies & Flowers': '🌺',
  'Pooja & Homa Supplies': '🔥',
};

export default function VendorsPage() {
  const [vendors] = useState(VENDORS_SEED.filter(v => v.status === 'approved'));
  const [search, setSearch] = useState('');

  const filtered = vendors.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase()) ||
    v.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #14532d 100%)',
        borderRadius: 24, padding: '32px 32px 28px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(34,197,94,0.12)' }} />
        <p style={{ color: '#86EFAC', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>✦ Trusted Pooja Suppliers</p>
        <h1 style={{ color: '#fff', fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.2 }}>Vendors & Flower Shops</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>Find fresh flowers, garlands, havan samagri and all pooja essentials near you.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {[['🌸', filtered.length, 'Vendors'], ['📍', '3 States', 'Coverage'], ['✓', '100%', 'Verified']].map(([icon, val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 16px' }}>
              <div style={{ fontSize: 16 }}>{icon}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors, type, location…"
            style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#16A34A'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(vendor => (
          <div key={vendor.id} style={{
            background: '#fff', borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 2px 14px rgba(0,0,0,0.07)', border: '1px solid #F3F4F6',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.07)'; }}
          >
            {/* Top accent bar */}
            <div style={{ height: 4, background: vendor.id === 'v6' ? 'linear-gradient(90deg,#f472b6,#ec4899)' : 'linear-gradient(90deg,#22c55e,#16a34a)' }} />

            <div style={{ padding: '18px 18px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: vendor.id === 'v6' ? 'linear-gradient(135deg,#fce7f3,#fbcfe8)' : 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {TYPE_ICONS[vendor.type] || '🏪'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{vendor.name}</h3>
                    {vendor.verified && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: '#ECFDF5', color: '#059669' }}>✓ Verified</span>}
                    {vendor.id === 'v6' && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: '#FDF2F8', color: '#BE185D' }}>🌸 Featured</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{vendor.type}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>📍 {vendor.location}</span>
                    <span style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>⭐ {vendor.rating}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div style={{ marginTop: 12, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {vendor.items.slice(0, 5).map(item => (
                  <span key={item} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#F0FDF4', color: '#166534', fontWeight: 500 }}>{item}</span>
                ))}
                {vendor.items.length > 5 && (
                  <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280' }}>+{vendor.items.length - 5} more</span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 18px', marginTop: 12, borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#6B7280', flex: 1 }}>📞 {vendor.phone}</span>
              {vendor.whatsapp && (
                <button onClick={() => openWhatsApp(vendor.whatsapp, vendor.name)} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 12px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37,211,102,0.4)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.85L0 24l6.334-1.51C8.01 23.447 9.967 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.638-.497-5.157-1.367l-.369-.218-3.766.898.938-3.667-.239-.38C2.497 15.638 2 13.88 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  WhatsApp
                </button>
              )}
              {vendor.email && (
                <a href={`mailto:${vendor.email}`} style={{
                  padding: '7px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB',
                  color: '#374151', fontWeight: 600, fontSize: 12, textDecoration: 'none',
                }}>✉️ Email</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

