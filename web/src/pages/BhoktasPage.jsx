// web/src/pages/BhoktasPage.jsx
// Bhoktas — invited brahmins who partake in the ritual meal during
// Pitru Karyam (ancestral rites). Browse approved bhoktas and register
// as one via the "Become a Bhokta" form.

import React, { useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { AuthContext, ToastContext } from '../App';
import {
  STATES, LANGUAGES, PITRU_RITUALS, TRAVEL_DISTANCE_OPTIONS,
} from '../../../shared/types';
import {
  getApprovedBhoktas, submitBhoktaProfile,
} from '../../../shared/services/bhoktaService';

const BRAND_MAROON = '#7A1F2B';
const BRAND_DEEP   = '#3B0A14';
const BRAND_GOLD   = '#C99A2E';

function openWhatsApp(number, name) {
  if (!number) return;
  const msg = encodeURIComponent(
    `Namaste ${name} ji 🙏, I found you on Samskara as a bhokta for Pitru Karyam and would like to invite you to a ritual.`
  );
  window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${msg}`, '_blank');
}

function distanceLabel(miles) {
  const opt = TRAVEL_DISTANCE_OPTIONS.find(o => o.value === miles);
  return opt ? opt.label : (miles ? `Within ${miles} miles` : '—');
}

// ─── Page ────────────────────────────────────────────────────────────
export default function BhoktasPage() {
  const { user, profile } = useContext(AuthContext);
  const toast = useContext(ToastContext);

  const [bhoktas, setBhoktas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');
  const [ritualFilter, setRitualFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getApprovedBhoktas(db, {});
      setBhoktas(data);
    } catch (err) {
      console.warn('getApprovedBhoktas failed', err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = bhoktas.filter(b => {
    if (stateFilter !== 'all' && b.state !== stateFilter) return false;
    if (langFilter !== 'all' && !(b.languages || []).includes(langFilter)) return false;
    if (ritualFilter !== 'all' && !(b.rituals || []).includes(ritualFilter)) return false;
    if (search) {
      const s = search.toLowerCase();
      if (
        !(b.name || '').toLowerCase().includes(s) &&
        !(b.city || '').toLowerCase().includes(s) &&
        !(b.rituals || []).some(r => r.toLowerCase().includes(s))
      ) return false;
    }
    return true;
  });

  return (
    <main style={{
      width: '100%', maxWidth: 1600, margin: '0 auto',
      padding: 'clamp(16px, 2.5vw, 36px) clamp(16px, 3vw, 40px)',
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    }}>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${BRAND_DEEP} 0%, ${BRAND_MAROON} 60%, ${BRAND_DEEP} 100%)`,
        borderRadius: 24, padding: '32px clamp(20px, 3vw, 40px) 28px',
        marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,154,46,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '35%', width: 220, height: 220, borderRadius: '50%', background: 'rgba(201,154,46,0.08)' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18 }}>
          <div style={{ maxWidth: 640 }}>
            <p style={{ color: BRAND_GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
              ✦ Pitru Karyam · Ancestral Rites
            </p>
            <h1 style={{ color: '#fff', fontFamily: "'Noto Serif', Georgia, serif", fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2 }}>
              Bhoktas
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15, lineHeight: 1.6, margin: '0 0 18px' }}>
              Bhoktas are invited brahmins who partake in the ritual meal during Pitru Karyam,
              representing the pitrus (forefathers). Their presence is essential to complete the ceremony.
              Find a bhokta near you, or join the community to serve.
            </p>
            <button
              onClick={() => setShowRegister(true)}
              style={{
                padding: '12px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: BRAND_GOLD, color: BRAND_DEEP, border: 'none', cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(201,154,46,0.35)',
              }}
            >
              🪔 Become a Bhokta
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              ['🪔', filtered.length, 'Available'],
              ['🛕', PITRU_RITUALS.length, 'Rituals'],
              ['🗣️', LANGUAGES.length, 'Languages'],
            ].map(([icon, num, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 16px', minWidth: 70 }}>
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderRadius: 14, padding: 14,
        marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid #F3F4F6',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10,
      }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search name, city, ritual…"
          style={inputStyle}
        />
        <Select value={stateFilter} onChange={setStateFilter}>
          <option value="all">All states</option>
          {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>
        <Select value={langFilter} onChange={setLangFilter}>
          <option value="all">All languages</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </Select>
        <Select value={ritualFilter} onChange={setRitualFilter}>
          <option value="all">All rituals</option>
          {PITRU_RITUALS.map(r => <option key={r} value={r}>{r}</option>)}
        </Select>
      </div>

      {/* ── List ────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>Loading bhoktas…</div>
      ) : filtered.length === 0 ? (
        <EmptyState onRegister={() => setShowRegister(true)} hasAny={bhoktas.length > 0} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
          {filtered.map(b => <BhoktaCard key={b.id} bhokta={b} />)}
        </div>
      )}

      {/* ── Register Modal ──────────────────────────────────── */}
      {showRegister && (
        <RegisterBhoktaModal
          user={user}
          profile={profile}
          onClose={() => setShowRegister(false)}
          onSubmitted={() => {
            setShowRegister(false);
            toast?.addToast?.(
              'Application submitted',
              'Your bhokta profile is pending admin approval. You will be notified once approved.',
              'success',
            );
            load();
          }}
        />
      )}
    </main>
  );
}

// ─── Bhokta card ─────────────────────────────────────────────────────
function BhoktaCard({ bhokta }) {
  const initials = (bhokta.name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div style={{
      background: '#fff', borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 2px 14px rgba(0,0,0,0.07)', border: '1px solid #F3F4F6',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.07)'; }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${BRAND_MAROON}, ${BRAND_GOLD})` }} />
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${BRAND_MAROON}, ${BRAND_DEEP})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16, flexShrink: 0,
          }}>{initials || '🙏'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>{bhokta.name}</h3>
              {bhokta.verified && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: '#ECFDF5', color: '#059669' }}>✓ Verified</span>}
              {bhokta.needsRide && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: '#FEF3C7', color: '#92400E' }}>🚗 Needs ride</span>}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              📍 {bhokta.city ? `${bhokta.city}, ` : ''}{bhokta.state || '—'}
            </div>
            <div style={{ fontSize: 12, color: '#374151', marginTop: 4, fontWeight: 600 }}>
              ✈️ {distanceLabel(bhokta.maxDistanceMiles)}
            </div>
          </div>
        </div>

        {bhokta.languages?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {bhokta.languages.map(l => <Pill key={l}>{l}</Pill>)}
            </div>
          </div>
        )}

        {bhokta.rituals?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Rituals supported</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {bhokta.rituals.map(r => <Pill key={r} tone="maroon">{r}</Pill>)}
            </div>
          </div>
        )}

        {bhokta.notes && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#4B5563', fontStyle: 'italic' }}>“{bhokta.notes}”</div>
        )}

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #F3F4F6', display: 'flex', gap: 8, alignItems: 'center' }}>
          {bhokta.phone && <span style={{ fontSize: 12, color: '#6B7280', flex: 1 }}>📞 {bhokta.phone}</span>}
          {bhokta.phone && (
            <button onClick={() => openWhatsApp(bhokta.phone, bhokta.name)} style={{
              padding: '8px 12px', borderRadius: 10, background: 'linear-gradient(135deg,#25D366,#128C7E)',
              color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer',
            }}>WhatsApp</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Pill({ children, tone }) {
  const styles = tone === 'maroon'
    ? { background: '#FDECEE', color: BRAND_MAROON }
    : { background: '#F3F4F6', color: '#374151' };
  return (
    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 500, ...styles }}>{children}</span>
  );
}

function EmptyState({ onRegister, hasAny }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 18, border: '1px dashed #E5E7EB',
      padding: '40px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>🪔</div>
      <h3 style={{ margin: '0 0 6px', fontSize: 18, color: '#111' }}>
        {hasAny ? 'No bhoktas match your filters' : 'No bhoktas registered yet'}
      </h3>
      <p style={{ margin: '0 0 16px', color: '#6B7280', fontSize: 14 }}>
        {hasAny
          ? 'Try widening your state, language, or ritual filters.'
          : 'Be the first to join the community of bhoktas serving Pitru Karyam in New England.'}
      </p>
      <button onClick={onRegister} style={{
        padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700,
        background: BRAND_MAROON, color: '#fff', border: 'none', cursor: 'pointer',
      }}>Become a Bhokta</button>
    </div>
  );
}

// ─── Register modal ─────────────────────────────────────────────────
function RegisterBhoktaModal({ user, profile, onClose, onSubmitted }) {
  const [form, setForm] = useState({
    name: profile?.name || user?.displayName || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    state: '',
    city: '',
    languages: [],
    rituals: [],
    maxDistanceMiles: 25,
    needsRide: false,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleIn = (k, v) => setForm(f => ({
    ...f,
    [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v],
  }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Name, email, and phone are required.');
      return;
    }
    if (!form.state) {
      setError('Please select your state.');
      return;
    }
    if (form.languages.length === 0) {
      setError('Please select at least one language you speak.');
      return;
    }
    if (form.rituals.length === 0) {
      setError('Please select at least one ritual you can support.');
      return;
    }
    setSubmitting(true);
    try {
      await submitBhoktaProfile(db, { ...form, userId: user?.uid || null });
      onSubmitted();
    } catch (err) {
      console.error('submitBhoktaProfile failed', err);
      setError(err?.message || 'Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: 640,
        maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${BRAND_DEEP} 0%, ${BRAND_MAROON} 100%)`,
          borderRadius: '24px 24px 0 0', padding: '28px 28px 22px',
          position: 'relative', color: '#fff',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8,
            color: '#fff', width: 32, height: 32, cursor: 'pointer', fontSize: 16,
          }}>✕</button>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🪔</div>
          <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 22, fontWeight: 700, margin: 0 }}>Become a Bhokta</h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 13, marginTop: 4 }}>
            Join the community of bhoktas serving Pitru Karyam in New England. Your profile will be reviewed before going live.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ padding: '22px 28px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Full name *" full>
              <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} required />
            </Field>
            <Field label="Email *">
              <input type="email" style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} required />
            </Field>
            <Field label="Phone *">
              <input type="tel" style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" required />
            </Field>
            <Field label="State *">
              <Select value={form.state} onChange={v => set('state', v)}>
                <option value="">Select a state…</option>
                {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </Field>
            <Field label="City / Town">
              <input style={inputStyle} value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Boston" />
            </Field>
          </div>

          {/* Languages */}
          <Field label="Languages spoken *" full top={16}>
            <ChipGroup
              options={LANGUAGES}
              selected={form.languages}
              onToggle={v => toggleIn('languages', v)}
            />
          </Field>

          {/* Rituals */}
          <Field label="Rituals you can support *" full top={14}>
            <ChipGroup
              options={PITRU_RITUALS}
              selected={form.rituals}
              onToggle={v => toggleIn('rituals', v)}
              tone="maroon"
            />
          </Field>

          {/* Distance / Ride */}
          <Field label="Maximum distance you can travel *" full top={14}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
              {TRAVEL_DISTANCE_OPTIONS.map(opt => {
                const active = form.maxDistanceMiles === opt.value;
                return (
                  <button type="button" key={opt.value}
                    onClick={() => set('maxDistanceMiles', opt.value)}
                    style={{
                      padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'center',
                      background: active ? BRAND_MAROON : '#F9FAFB',
                      color: active ? '#fff' : '#374151',
                      border: `1.5px solid ${active ? BRAND_MAROON : '#E5E7EB'}`,
                    }}>{opt.label}</button>
                );
              })}
            </div>
          </Field>

          <Field full top={12}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#374151', padding: '10px 12px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10 }}>
              <input
                type="checkbox" checked={form.needsRide}
                onChange={e => set('needsRide', e.target.checked)}
                style={{ width: 18, height: 18 }}
              />
              <span>🚗 I will need a ride to the venue</span>
            </label>
          </Field>

          {/* Notes */}
          <Field label="Notes (gotra, sampradayam, availability…)" full top={14}>
            <textarea
              rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Optional — e.g., Bharadwaja gotra, available weekends, vegetarian/sattvic diet…"
            />
          </Field>

          {error && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13 }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '11px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              background: '#fff', color: '#374151', border: '1px solid #E5E7EB', cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{
              padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: BRAND_MAROON, color: '#fff', border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
            }}>{submitting ? 'Submitting…' : 'Submit application'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tiny UI helpers ────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px 12px',
  border: '1.5px solid #E5E7EB', borderRadius: 10,
  fontSize: 14, outline: 'none', boxSizing: 'border-box',
  background: '#fff',
};

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
      {children}
    </select>
  );
}

function Field({ label, children, full, top }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined, marginTop: top || 0 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</div>}
      {children}
    </div>
  );
}

function ChipGroup({ options, selected, onToggle, tone }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        const activeBg = tone === 'maroon' ? BRAND_MAROON : '#1F2937';
        return (
          <button type="button" key={opt} onClick={() => onToggle(opt)} style={{
            padding: '7px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: `1.5px solid ${active ? activeBg : '#E5E7EB'}`,
            background: active ? activeBg : '#fff',
            color: active ? '#fff' : '#374151',
            cursor: 'pointer',
          }}>{opt}</button>
        );
      })}
    </div>
  );
}
