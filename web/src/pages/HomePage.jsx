// web/src/pages/HomePage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { POOJA_CATEGORIES } from '../../../shared/types';
import CampaignCarousel from '../components/CampaignCarousel';

const font = "'IBM Plex Sans', system-ui, sans-serif";
const serif = "'Noto Serif', Georgia, serif";

export default function HomePage() {
  const { profile } = useContext(AuthContext);

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px', fontFamily: font }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a00 0%, #3d1500 50%, #1a0a00 100%)',
        borderRadius: 24, padding: '40px 40px 36px',
        marginBottom: 28, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(232,113,42,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -70, left: '40%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(232,113,42,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>✦ Trusted Hindu Services — NE USA</p>
            <h1 style={{ color: '#fff', fontFamily: serif, fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2 }}>
              Namaste, {profile?.name || 'Devotee'}! 🙏
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 15, maxWidth: 440, lineHeight: 1.65, margin: '0 0 22px' }}>
              Find trusted Hindu priests for poojas, homams, pitru karyams & more across Boston, New Hampshire & Connecticut.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/priests" style={{
                display: 'inline-block', padding: '11px 24px', borderRadius: 10, fontSize: 14,
                fontWeight: 700, textDecoration: 'none', fontFamily: font,
                background: 'rgba(255,255,255,0.96)', color: '#C5561A',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}>Find a Priest</Link>
              <Link to="/vendors" style={{
                display: 'inline-block', padding: '11px 24px', borderRadius: 10, fontSize: 14,
                fontWeight: 700, textDecoration: 'none', fontFamily: font,
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>Browse Vendors</Link>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[['🙏','12+','Priests'],['🏪','6+','Vendors'],['📍','3','States'],['🔥','40+','Services']].map(([icon, num, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 16px', minWidth: 60 }}>
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Campaign Carousel (Firestore-driven) ──────────────── */}
      <CampaignCarousel />

      {/* ── Browse by Category ────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Browse by Category</h3>
        <Link to="/priests" style={{ fontSize: 13, color: '#E8712A', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, marginBottom: 32 }}>
        {POOJA_CATEGORIES.map(cat => (
          <Link key={cat.name} to={`/priests?category=${encodeURIComponent(cat.types[0])}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 16, border: '1px solid #F3F4F6',
              padding: '18px 12px', textAlign: 'center',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.18s, box-shadow 0.18s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>{cat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2, fontFamily: font }}>{cat.name}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{cat.types.length} services</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Join section ──────────────────────────────────────── */}
      <h3 style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 14px' }}>Join PoojaConnect</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          { icon: '🙏', title: 'Are you a Priest?', desc: 'Register yourself and reach devotees in New England. Admin approval required.', color: '#E8712A' },
          { icon: '🏪', title: 'Are you a Vendor?', desc: 'Flower shops, pooja supply stores — join our marketplace. Admin approval required.', color: '#D4A843' },
        ].map(({ icon, title, desc, color }) => (
          <Link key={title} to="/register" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 16, borderLeft: `4px solid ${color}`,
              padding: '20px 20px 20px 18px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              transition: 'box-shadow 0.18s', cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 5px 18px rgba(0,0,0,0.09)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'}
            >
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 6, fontFamily: font }}>{icon} {title}</div>
              <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55, fontFamily: font }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}

