// web/src/components/CampaignCarousel.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Marketing campaign carousel — content is fetched from Firestore
// collection: "campaigns"  (no code change needed to add/edit/remove slides)
//
// Firestore document shape:
// {
//   id: "auto",
//   active: true,                      // set false to hide without deleting
//   order: 1,                          // lower = shown first
//   type: "deal" | "festival" | "offer" | "announcement",
//   title: "Ugadi Special",
//   subtitle: "Book before March 31st",
//   description: "Get 15% off on all Grihapravesham bookings",
//   ctaLabel: "Book Now",             // optional
//   ctaLink: "/priests",               // optional — relative path
//   badge: "🌸 Festival",             // optional top label
//   gradient: ["#1a0a00","#3d1500"],   // optional [from, to]
//   accentColor: "#F59E0B",            // optional badge / CTA color
//   emoji: "🪔",                      // large display emoji
//   expiresAt: Timestamp | null,       // auto-hides expired slides
// }
//
// To publish a new campaign: open Firebase Console → Firestore → "campaigns"
// → Add document. No deployment needed.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

// ── Fallback slides shown when Firestore is empty / loading ─────────────────
const FALLBACK_SLIDES = [
  {
    id: 'f1', type: 'festival', active: true,
    badge: '🌸 Upcoming Festival',
    title: 'Ugadi 2026',
    subtitle: 'Telugu & Kannada New Year — March 30th',
    description: 'Book an auspicious Ugadi Pooja or Panchanga Sravanam with a verified priest near you.',
    emoji: '🪔',
    ctaLabel: 'Book a Priest',
    ctaLink: '/priests?category=Festivals',
    gradient: ['#1a0a00', '#3d1500'],
    accentColor: '#F59E0B',
  },
  {
    id: 'f2', type: 'festival', active: true,
    badge: '🔥 Coming Soon',
    title: 'Ram Navami',
    subtitle: 'April 6th, 2026',
    description: 'Celebrate the birth of Lord Rama with a special Rama Archana or Katha at your home.',
    emoji: '🏹',
    ctaLabel: 'Find Priests',
    ctaLink: '/priests',
    gradient: ['#0c0033', '#1e0a5c'],
    accentColor: '#818CF8',
  },
  {
    id: 'f3', type: 'deal', active: true,
    badge: '🎉 Limited Offer',
    title: 'Spring Grihapravesham Package',
    subtitle: 'Special bundle pricing for April moves',
    description: 'New home? Our top-rated priests offer complete Grihapravesham packages including all materials when booked via Samskara.',
    emoji: '🏡',
    ctaLabel: 'See Packages',
    ctaLink: '/priests?category=Grihapravesham',
    gradient: ['#0f2417', '#1a4a28'],
    accentColor: '#34D399',
  },
  {
    id: 'f4', type: 'announcement', active: true,
    badge: '✨ New',
    title: 'Vivek Flowers — Now on Samskara',
    subtitle: 'Fresh jasmine, rose & marigold garlands delivered',
    description: 'Lowell MA\'s premier flower shop is now available to pair with any priest booking. Same-day delivery available.',
    emoji: '🌸',
    ctaLabel: 'Browse Vendors',
    ctaLink: '/vendors',
    gradient: ['#2d0a1f', '#5c1a3a'],
    accentColor: '#F9A8D4',
  },
];

const TYPE_COLORS = {
  festival:     { bg: '#FEF3C7', text: '#92400E' },
  deal:         { bg: '#D1FAE5', text: '#065F46' },
  offer:        { bg: '#EDE9FE', text: '#4C1D95' },
  announcement: { bg: '#FCE7F3', text: '#831843' },
};

function Slide({ slide }) {
  const [g1, g2] = slide.gradient || ['#1a0a00', '#3d1500'];
  const accent = slide.accentColor || '#F59E0B';
  const typeStyle = TYPE_COLORS[slide.type] || TYPE_COLORS.festival;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)`,
      borderRadius: 20, padding: '32px 36px', height: '100%',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden', minHeight: 200,
    }}>
      {/* Background decoration circles */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 180, height: 180,
        borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: '30%', width: 220, height: 220,
        borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
        pointerEvents: 'none',
      }} />

      {/* Large emoji — top right */}
      {slide.emoji && (
        <div style={{
          position: 'absolute', right: 28, top: 24,
          fontSize: 64, lineHeight: 1, opacity: 0.18,
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {slide.emoji}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        {slide.badge && (
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700,
            padding: '4px 10px', borderRadius: 20, marginBottom: 14,
            background: typeStyle.bg, color: typeStyle.text,
            letterSpacing: 0.3,
          }}>
            {slide.badge}
          </span>
        )}

        {/* Title */}
        <h2 style={{
          color: '#fff', fontFamily: 'Georgia, serif',
          fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700,
          margin: '0 0 6px', lineHeight: 1.2,
        }}>
          {slide.title}
        </h2>

        {/* Subtitle */}
        {slide.subtitle && (
          <p style={{
            color: accent, fontSize: 14, fontWeight: 600,
            margin: '0 0 10px', letterSpacing: 0.2,
          }}>
            {slide.subtitle}
          </p>
        )}

        {/* Description */}
        <p style={{
          color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.6,
          margin: '0 0 20px', maxWidth: 480,
        }}>
          {slide.description}
        </p>

        {/* CTA */}
        {slide.ctaLabel && slide.ctaLink && (
          <Link to={slide.ctaLink} style={{
            display: 'inline-block',
            background: accent,
            color: '#000',
            padding: '10px 22px', borderRadius: 10,
            fontWeight: 700, fontSize: 13, textDecoration: 'none',
            boxShadow: `0 4px 14px ${accent}55`,
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {slide.ctaLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CampaignCarousel() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // ── Fetch from Firestore ──────────────────────────────────────
  useEffect(() => {
    const now = new Date();
    const q = query(
      collection(db, 'campaigns'),
      where('active', '==', true),
      orderBy('order', 'asc'),
    );
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(d => {
          // Hide expired slides
          if (d.expiresAt && d.expiresAt.toDate && d.expiresAt.toDate() < now) return false;
          return true;
        });
      if (docs.length > 0) setSlides(docs);
      setLoading(false);
    }, () => {
      // On error fall back silently to FALLBACK_SLIDES
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const total = slides.length;

  const goTo = useCallback((idx) => {
    setActive(((idx % total) + total) % total);
  }, [total]);

  // ── Auto-advance ─────────────────────────────────────────────
  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setInterval(() => setActive(i => (i + 1) % total), 5000);
    return () => clearInterval(timerRef.current);
  }, [paused, total]);

  if (loading) return (
    <div style={{
      height: 180, borderRadius: 20,
      background: 'linear-gradient(135deg, #1a0a00, #3d1500)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 28,
    }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading campaigns…</span>
    </div>
  );

  return (
    <div style={{ marginBottom: 28, userSelect: 'none' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide wrapper */}
      <div style={{ position: 'relative' }}>
        <Slide slide={slides[active]} />

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <button
              onClick={() => goTo(active - 1)}
              aria-label="Previous"
              style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                width: 34, height: 34, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                color: '#fff', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >‹</button>
            <button
              onClick={() => goTo(active + 1)}
              aria-label="Next"
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                width: 34, height: 34, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                color: '#fff', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >›</button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 12 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === active ? 22 : 7, height: 7,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: i === active ? '#E8712A' : '#D1C4B0',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
