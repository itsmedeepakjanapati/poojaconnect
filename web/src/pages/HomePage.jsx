// web/src/pages/HomePage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { POOJA_CATEGORIES } from '../../../shared/types';
import { getApprovedPriests } from '../../../shared/services/priestService';
import { getApprovedVendors } from '../../../shared/services/vendorService';

import { db } from '../firebase';
import CampaignCarousel from '../components/CampaignCarousel';
import HeroPanchangCard from '../components/HeroPanchangCard';

const font = "'IBM Plex Sans', system-ui, sans-serif";
const serif = "'Noto Serif', Georgia, serif";

// Total distinct services across all categories — computed once at module load.
const TOTAL_SERVICES = POOJA_CATEGORIES.reduce(
  (n, c) => n + (c.types?.length || 0), 0,
);

export default function HomePage() {
  const { user, profile } = useContext(AuthContext);
  const displayName =
    profile?.name ||
    user?.displayName ||
    (user?.email ? user.email.split('@')[0] : '') ||
    'Devotee';

  const [counts, setCounts] = useState({
    priests: null, vendors: null, states: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [priests, vendors] = await Promise.all([
          getApprovedPriests(db),
          getApprovedVendors(db),
        ]);
        if (cancelled) return;
        const states = new Set(priests.map(p => p.state).filter(Boolean));
        setCounts({
          priests: priests.length,
          vendors: vendors.length,
          states: states.size,
        });
      } catch (err) {
        console.warn('Failed to load hero counts', err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const fmt = (n) => (n == null ? '…' : String(n));

  const stats = [
    ['🙏', fmt(counts.priests), 'Priests'],
    ['🏪', fmt(counts.vendors), 'Vendors'],
    ['📍', fmt(counts.states),  'States'],
    ['🔥', String(TOTAL_SERVICES), 'Services'],
  ];

  return (
    <main style={{
      width: '100%',
      maxWidth: 1600,
      margin: '0 auto',
      padding: 'clamp(16px, 2.5vw, 36px) clamp(16px, 3vw, 40px)',
      fontFamily: font,
    }}>

      {/* ── Unified Hero + Today's Panchang ─────────────────── */}
      <HeroPanchangCard displayName={displayName} stats={stats} />

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

    </main>
  );
}

