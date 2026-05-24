// web/src/components/HeroPanchangCard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MhahPanchang } from 'mhah-panchang';
import SunCalc from 'suncalc';

const BRAND_GOLD = '#E8B84B';

const DEFAULT_LOCATION = { lat: 42.3601, lon: -71.0589, label: 'Boston, MA' };

const RAHU_SLOT      = [7, 1, 6, 4, 5, 3, 2];
const YAMAGANDA_SLOT = [4, 3, 2, 1, 0, 6, 5];
const GULIKA_SLOT    = [6, 5, 4, 3, 2, 1, 0];
const DURMUHURTAM_SLOTS = [
  [14], [12, 14], [4, 9], [9], [8, 12, 14], [5, 9], [2, 4],
];

const NOTABLE_TITHIS = {
  'Ekadashi':   { icon: '🌟', label: 'Ekadashi',           desc: 'Auspicious fasting day · Vishnu worship' },
  'Purnima':    { icon: '🌕', label: 'Purnima',             desc: 'Full Moon · Auspicious for all rituals' },
  'Amavasya':   { icon: '🌑', label: 'Amavasya',            desc: 'New Moon · Day for Pitru Tarpana' },
  'Trayodashi': { icon: '🕉️', label: 'Pradosh',             desc: 'Pradosh Kalam · Shiva worship' },
  'Chaturthi':  { icon: '🐘', label: 'Vinayaka Chaturthi',  desc: 'Auspicious for Ganesh worship' },
  'Navami':     { icon: '🙏', label: 'Navami',              desc: 'Auspicious for Devi worship' },
  'Dwadashi':   { icon: '✨', label: 'Dwadashi',            desc: 'Auspicious · Vishnu worship' },
};

function fmtTime(date, tz) {
  if (!date) return '—';
  try {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz,
    });
  } catch {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
}

function slotRange(sunrise, sunset, idx) {
  const seg = (sunset - sunrise) / 8;
  const start = new Date(sunrise.getTime() + idx * seg);
  return { start, end: new Date(start.getTime() + seg) };
}

function rng(s, e, tz) {
  return fmtTime(s, tz) + '–' + fmtTime(e, tz);
}

export default function HeroPanchangCard({ displayName, stats = [] }) {
  const [now, setNow] = useState(new Date());
  const [loc, setLoc] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' }),
      () => {},
      { timeout: 4000, maximumAge: 600000 },
    );
  }, []);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const data = useMemo(() => {
    try {
      const mhah = new MhahPanchang();
      const p = mhah.calculate(now);
      const cal = mhah.calendar(now, loc.lat, loc.lon);
      const sun = SunCalc.getTimes(now, loc.lat, loc.lon);
      const sunrise = sun.sunrise;
      const sunset  = sun.sunset;
      const refDate = now < sunrise ? new Date(now.getTime() - 86400000) : now;
      const wd = refDate.getDay();
      const muhurta = (sunset - sunrise) / 15;
      const durmuhurtam = DURMUHURTAM_SLOTS[wd].map(s1 => ({
        start: new Date(sunrise.getTime() + (s1 - 1) * muhurta),
        end:   new Date(sunrise.getTime() + s1 * muhurta),
      }));
      const tithi = p?.Tithi?.name_en_IN || '';
      const notableKey = Object.keys(NOTABLE_TITHIS).find(k => tithi.includes(k));
      return {
        tithi,
        tithiEnd: p?.Tithi?.end,
        nakshatra: p?.Nakshatra?.name_en_IN || '',
        nakshatraEnd: p?.Nakshatra?.end,
        masa: cal?.Masa?.name_en_IN || p?.Masa?.name_en_IN || '',
        notable: notableKey ? NOTABLE_TITHIS[notableKey] : null,
        sunrise, sunset,
        rahu:      slotRange(sunrise, sunset, RAHU_SLOT[wd]),
        yamaganda: slotRange(sunrise, sunset, YAMAGANDA_SLOT[wd]),
        gulika:    slotRange(sunrise, sunset, GULIKA_SLOT[wd]),
        durmuhurtam,
      };
    } catch (err) {
      console.warn('Panchang error', err);
      return null;
    }
  }, [now, loc.lat, loc.lon]);

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

  return (
    <section
      aria-label="Home hero"
      style={{
        background: 'linear-gradient(135deg, #1a0a00 0%, #3d1500 50%, #1a0a00 100%)',
        borderRadius: 24,
        padding: 'clamp(22px, 3vw, 36px) clamp(22px, 3vw, 40px)',
        marginBottom: 28,
        position: 'relative', overflow: 'hidden',
        color: '#fff',
        boxShadow: '0 12px 36px rgba(26,10,0,0.22)',
      }}
    >
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(232,113,42,0.14)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -90, left: '38%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(232,184,75,0.07)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Greeting + right panel ──────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 28, alignItems: 'flex-start',
          marginBottom: 20,
        }}>
          {/* Left */}
          <div style={{ minWidth: 0 }}>
            <p style={{ color: BRAND_GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 10px' }}>
              ✦ Trusted Hindu Services — New England
            </p>
            <h1 style={{
              fontFamily: "'Noto Serif', Georgia, serif",
              fontSize: 'clamp(26px, 4.5vw, 40px)',
              fontWeight: 700, margin: '0 0 10px', lineHeight: 1.15,
            }}>
              Namaste, {displayName || 'Devotee'}! 🙏
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.72)', fontSize: 15, maxWidth: 520,
              lineHeight: 1.6, margin: '0 0 18px',
            }}>
              Connecting you with trusted priests, vendors and rituals across MA, CT, NH, RI, VT and ME.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/priests" style={{
                display: 'inline-block', padding: '11px 22px', borderRadius: 10,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                background: 'rgba(255,255,255,0.96)', color: '#C5561A',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              }}>Find a Priest</Link>
              <Link to="/vendors" style={{
                display: 'inline-block', padding: '11px 22px', borderRadius: 10,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>Browse Vendors</Link>
            </div>
          </div>

          {/* Right — date/time, sunrise/sunset, panchang, auspicious badge */}
          <div style={{ textAlign: 'right', minWidth: 200 }}>
            <div style={{ fontSize: 'clamp(13px, 1.2vw, 15px)', fontWeight: 600, color: 'rgba(255,255,255,0.65)', lineHeight: 1.3 }}>
              {dateStr}
            </div>
            <div style={{
              fontFamily: "'Noto Serif', Georgia, serif",
              fontSize: 'clamp(28px, 3.2vw, 38px)', fontWeight: 700,
              fontVariantNumeric: 'tabular-nums', lineHeight: 1.05, marginTop: 4,
            }}>{timeStr}</div>

            {/* Sunrise / Sunset pill — clearly visible */}
            {data && (
              <div style={{
                display: 'inline-flex', gap: 10, marginTop: 8,
                background: 'rgba(255,200,100,0.15)',
                border: '1px solid rgba(255,200,100,0.35)',
                borderRadius: 10, padding: '6px 14px',
                fontSize: 13, fontWeight: 600, color: '#FFE0A0',
              }}>
                <span>🌅 {fmtTime(data.sunrise, tz)}</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span>🌇 {fmtTime(data.sunset, tz)}</span>
              </div>
            )}

            {/* Tithi / Nakshatra / Masam */}
            {data && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
                {[
                  ['Thidhi',    data.tithi,     data.tithiEnd],
                  ['Nakshatra', data.nakshatra, data.nakshatraEnd],
                  ['Masam',     data.masa,      null],
                ].map(([lbl, val, end]) => (
                  <div key={lbl} style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.3 }}>
                    <span style={{ color: BRAND_GOLD, fontWeight: 700, marginRight: 6, fontSize: 11, letterSpacing: 0.5 }}>{lbl}</span>
                    <span style={{ fontWeight: 600 }}>{val || '—'}</span>
                    {end && (
                      <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 5, fontSize: 11 }}>
                        until {fmtTime(end, tz)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Auspicious badge — only on notable days */}
            {data?.notable && (
              <div style={{
                display: 'inline-block', marginTop: 10,
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(232,184,75,0.2)',
                border: '1px solid rgba(232,184,75,0.4)',
                fontSize: 12, fontWeight: 700, color: BRAND_GOLD,
              }}>
                {data.notable.icon} {data.notable.label}
                <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(232,184,75,0.7)', marginTop: 2 }}>
                  {data.notable.desc}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats — inline compact strip ───────────────────── */}
        {stats.length > 0 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px 20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 0', marginBottom: 12,
            fontSize: 13, color: 'rgba(255,255,255,0.65)',
          }}>
            {stats.map(([icon, num, lbl]) => (
              <span key={lbl} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {icon} <b style={{ color: '#fff', marginRight: 3 }}>{num}</b>{lbl}
              </span>
            ))}
          </div>
        )}

        {/* ── Inauspicious times — compact text row ─────────── */}
        {data && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            <span>🔴 <b style={{ color: 'rgba(255,160,160,0.9)' }}>Rahu</b> {rng(data.rahu.start, data.rahu.end, tz)}</span>
            <span>🔴 <b style={{ color: 'rgba(255,160,160,0.9)' }}>Yamaganda</b> {rng(data.yamaganda.start, data.yamaganda.end, tz)}</span>
            <span>🔴 <b style={{ color: 'rgba(255,160,160,0.9)' }}>Gulika</b> {rng(data.gulika.start, data.gulika.end, tz)}</span>
            {data.durmuhurtam.map((d, i) => (
              <span key={i}>🟡 <b style={{ color: 'rgba(255,220,100,0.9)' }}>Durmuhurtam</b> {rng(d.start, d.end, tz)}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
