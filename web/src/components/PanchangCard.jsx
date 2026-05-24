// web/src/components/PanchangCard.jsx
// Live Panchang (Hindu almanac) for the user's current date, time, and location.
// Computed locally via mhah-panchang (Drik-style ephemeris) + suncalc (sunrise/sunset),
// so no API key or backend call is required.

import React, { useEffect, useMemo, useState } from 'react';
import { MhahPanchang } from 'mhah-panchang';
import SunCalc from 'suncalc';

const BRAND_MAROON = '#7A1F2B';
const BRAND_SAFFRON = '#E8712A';

// Default to Boston, MA (NE USA — matches Samskara's regional focus) until/if
// the browser grants geolocation.
const DEFAULT_LOCATION = { lat: 42.3601, lon: -71.0589, label: 'Boston, MA' };

// Rahu / Yamaganda / Gulika: which 1/8 slot of daytime, indexed by JS getDay() (Sun=0).
const RAHU_SLOT      = [7, 1, 6, 4, 5, 3, 2]; // 0-indexed slot positions
const YAMAGANDA_SLOT = [4, 3, 2, 1, 0, 6, 5];
const GULIKA_SLOT    = [6, 5, 4, 3, 2, 1, 0];

// Durmuhurtam: 1-indexed muhurtas (of 15 in daytime) per weekday (Sun..Sat)
const DURMUHURTAM_SLOTS = [
  [14],          // Sun
  [12, 14],      // Mon
  [4, 9],        // Tue
  [9],           // Wed
  [8, 12, 14],   // Thu
  [5, 9],        // Fri
  [2, 4],        // Sat
];

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

function range(start, end, tz) {
  return `${fmtTime(start, tz)} – ${fmtTime(end, tz)}`;
}

function slotRange(sunrise, sunset, idx, slots = 8) {
  const segment = (sunset - sunrise) / slots;
  const start = new Date(sunrise.getTime() + idx * segment);
  const end = new Date(start.getTime() + segment);
  return { start, end };
}

export default function PanchangCard() {
  const [now, setNow] = useState(new Date());
  const [loc, setLoc] = useState(DEFAULT_LOCATION);

  // Live-tick the clock every second.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Try to use browser geolocation; silently fall back to default.
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        label: 'Your location',
      }),
      () => { /* keep default */ },
      { timeout: 4000, maximumAge: 10 * 60 * 1000 }
    );
  }, []);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const data = useMemo(() => {
    try {
      const mhah = new MhahPanchang();

      // Tithi / Nakshatra / Yoga / Karana — instantaneous values at `now`.
      const p = mhah.calculate(now);

      // Solar calendar (Masa, Ritu, weekday) using sunrise rule for the location.
      const cal = mhah.calendar(now, loc.lat, loc.lon);

      // Sunrise / sunset for the user's day at their location.
      const sun = SunCalc.getTimes(now, loc.lat, loc.lon);

      const sunrise = sun.sunrise;
      const sunset = sun.sunset;
      const solarNoon = sun.solarNoon;

      // For Rahu/Yamaganda/Gulika the relevant weekday is the Hindu calendar
      // day (changes at sunrise). If we're before sunrise, use yesterday.
      const refDate = now < sunrise ? new Date(now.getTime() - 24 * 3600 * 1000) : now;
      const wd = refDate.getDay();

      const rahu      = slotRange(sunrise, sunset, RAHU_SLOT[wd]);
      const yamaganda = slotRange(sunrise, sunset, YAMAGANDA_SLOT[wd]);
      const gulika    = slotRange(sunrise, sunset, GULIKA_SLOT[wd]);

      // Abhijit Muhurta — ~48 min centered on solar noon (not observed on Wed by some traditions).
      const abhijit = {
        start: new Date(solarNoon.getTime() - 24 * 60 * 1000),
        end:   new Date(solarNoon.getTime() + 24 * 60 * 1000),
      };

      // Durmuhurtam — slots out of 15 muhurtas in daytime.
      const muhurta = (sunset - sunrise) / 15;
      const durmuhurtam = DURMUHURTAM_SLOTS[wd].map(slot1 => {
        const start = new Date(sunrise.getTime() + (slot1 - 1) * muhurta);
        const end = new Date(start.getTime() + muhurta);
        return { start, end };
      });

      return {
        tithi: p?.Tithi?.name_en_IN,
        tithiEnd: p?.Tithi?.end,
        nakshatra: p?.Nakshatra?.name_en_IN,
        nakshatraEnd: p?.Nakshatra?.end,
        yoga: p?.Yoga?.name_en_IN,
        karana: p?.Karna?.name_en_IN,
        masa: cal?.Masa?.name_en_IN || p?.Masa?.name_en_IN,
        ritu: cal?.Ritu?.name_en_IN || p?.Ritu?.name_en_IN,
        day: p?.Day?.name_en_IN,
        sunrise, sunset,
        rahu, yamaganda, gulika, abhijit, durmuhurtam,
      };
    } catch (err) {
      console.warn('Panchang calculation failed', err);
      return null;
    }
  }, [now, loc.lat, loc.lon]);

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FBEBD5 100%)',
        border: `1px solid ${BRAND_MAROON}22`,
        borderRadius: 20,
        padding: '22px 24px',
        marginBottom: 28,
        boxShadow: '0 6px 22px rgba(122,31,43,0.08)',
      }}
      aria-label="Today's Panchang"
    >
      {/* Header: date, live clock, location */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: BRAND_MAROON, marginBottom: 4 }}>
            ✦ Today’s Panchang
          </div>
          <div style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 20, fontWeight: 700, color: '#1F1410', lineHeight: 1.25 }}>
            {dateStr}
          </div>
          <div style={{ fontSize: 13, color: '#7A5A3A', marginTop: 2 }}>
            {tz} · {loc.label} ({loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°)
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 26, fontWeight: 700, color: BRAND_MAROON, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {timeStr}
          </div>
          {data && (
            <div style={{ fontSize: 12, color: '#7A5A3A', marginTop: 6 }}>
              🌅 {fmtTime(data.sunrise, tz)} &nbsp; · &nbsp; 🌇 {fmtTime(data.sunset, tz)}
            </div>
          )}
        </div>
      </div>

      {!data && (
        <div style={{ fontSize: 13, color: '#7A5A3A' }}>
          Panchang data unavailable right now.
        </div>
      )}

      {data && (
        <>
          {/* Panchanga five limbs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
            marginBottom: 14,
          }}>
            <Tile label="Tithi"     value={data.tithi}     sub={data.tithiEnd     ? `until ${fmtTime(data.tithiEnd, tz)}` : ''} accent={BRAND_SAFFRON} />
            <Tile label="Nakshatra" value={data.nakshatra} sub={data.nakshatraEnd ? `until ${fmtTime(data.nakshatraEnd, tz)}` : ''} accent={BRAND_SAFFRON} />
            <Tile label="Yoga"      value={data.yoga}      accent={BRAND_SAFFRON} />
            <Tile label="Karana"    value={data.karana}    accent={BRAND_SAFFRON} />
            <Tile label="Masa"      value={data.masa}      sub={data.ritu ? `Ritu · ${data.ritu}` : ''} accent={BRAND_SAFFRON} />
          </div>

          {/* Auspicious / Inauspicious times */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 10,
          }}>
            <Tile
              label="🟢 Abhijit Muhurta"
              value={range(data.abhijit.start, data.abhijit.end, tz)}
              sub="Most auspicious window"
              accent="#1E7D3C"
            />
            <Tile
              label="🟢 Durmuhurtam to avoid"
              value={data.durmuhurtam.map(d => range(d.start, d.end, tz)).join('  •  ')}
              sub="Inauspicious muhurtas"
              accent="#8A6D00"
            />
            <Tile
              label="🔴 Rahu Kalam"
              value={range(data.rahu.start, data.rahu.end, tz)}
              sub="Avoid new beginnings"
              accent="#B23A48"
            />
            <Tile
              label="🔴 Yamaganda"
              value={range(data.yamaganda.start, data.yamaganda.end, tz)}
              sub="Inauspicious"
              accent="#B23A48"
            />
            <Tile
              label="🔴 Gulika Kalam"
              value={range(data.gulika.start, data.gulika.end, tz)}
              sub="Inauspicious"
              accent="#B23A48"
            />
          </div>

          <div style={{ marginTop: 14, fontSize: 11, color: '#9A7B5A', fontStyle: 'italic' }}>
            Computed locally using Drik-style ephemeris (mhah-panchang) and sunrise/sunset for your location.
            For ritual decisions, please consult your priest.
          </div>
        </>
      )}
    </section>
  );
}

function Tile({ label, value, sub, accent }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${accent}33`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 12,
      padding: '10px 12px',
      minHeight: 60,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: accent, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1F1410', lineHeight: 1.3 }}>
        {value || '—'}
      </div>
      {sub && <div style={{ fontSize: 11, color: '#7A5A3A', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
