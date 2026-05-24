// web/src/pages/PriestsPage.jsx
import React, { useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { AuthContext, ToastContext } from '../App';
import { PRIESTS_SEED, VENDORS_SEED } from '../../../shared/data/seedData';
import { STATES, LANGUAGES } from '../../../shared/types';
import { createBooking } from '../../../shared/services/bookingService';
import BookingModal from '../components/BookingModal';

function openWhatsApp(number, priestName) {
  const msg = encodeURIComponent(`Namaste ${priestName} ji 🙏, I found you on Samskara and would like to enquire about your pooja services.`);
  window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${msg}`, '_blank');
}

function WhatsAppButton({ number, name, style = {} }) {
  if (!number) return null;
  return (
    <button onClick={() => openWhatsApp(number, name)} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '10px 12px', borderRadius: 10,
      background: 'linear-gradient(135deg, #25D366, #128C7E)',
      color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(37,211,102,0.4)',
      flexShrink: 0,
      ...style,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.85L0 24l6.334-1.51C8.01 23.447 9.967 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.638-.497-5.157-1.367l-.369-.218-3.766.898.938-3.667-.239-.38C2.497 15.638 2 13.88 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
      WhatsApp
    </button>
  );
}

// Deterministic avatar colours per priest id
const AVATAR_GRADIENTS = [
  ['#FF6B35','#F7931E'],['#8B5CF6','#6366F1'],['#10B981','#059669'],
  ['#EC4899','#BE185D'],['#3B82F6','#1D4ED8'],['#F59E0B','#D97706'],
  ['#EF4444','#DC2626'],['#14B8A6','#0D9488'],['#A855F7','#7C3AED'],
  ['#84CC16','#65A30D'],['#F97316','#EA580C'],['#06B6D4','#0891B2'],
];

function PriestAvatar({ priest, index, size = 72 }) {
  const [grad1, grad2] = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const initials = priest.name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');
  if (priest.photoURL) {
    return (
      <img src={priest.photoURL} alt={priest.name}
        style={{ width: size, height: size, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }} />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 16, flexShrink: 0,
      background: `linear-gradient(135deg, ${grad1}, ${grad2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 700, color: '#fff', letterSpacing: 1,
      boxShadow: `0 4px 14px ${grad1}55`,
    }}>
      {initials || '🙏'}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#F59E0B' : '#E5E7EB'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
}

// ─── Custom Request Form Modal ──────────────────────────────────────────────
function CustomRequestModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', eventDate: '',
    poojaType: '', location: '', budget: '', notes: '', preferredLang: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: 540,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #E8712A 0%, #c4520f 100%)',
          borderRadius: '24px 24px 0 0', padding: '28px 28px 20px',
          position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8,
            color: '#fff', width: 32, height: 32, cursor: 'pointer', fontSize: 16,
          }}>✕</button>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
          <h2 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, margin: 0 }}>
            Custom Pooja Request
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>
            Tell us your specific needs and we'll match you with the right priest
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Your Name *', key: 'name', type: 'text', placeholder: 'Full name', required: true, full: false },
              { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'you@email.com', required: true, full: false },
              { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '(555) 000-0000', full: false },
              { label: 'Event Date', key: 'eventDate', type: 'date', full: false },
              { label: 'Pooja / Ceremony Type *', key: 'poojaType', type: 'text', placeholder: 'e.g. Grihapravesham, Wedding…', required: true, full: true },
              { label: 'Event Location / City', key: 'location', type: 'text', placeholder: 'City, State', full: false },
              { label: 'Preferred Budget', key: 'budget', type: 'text', placeholder: 'e.g. $200–$400', full: false },
              { label: 'Preferred Language', key: 'preferredLang', type: 'text', placeholder: 'Telugu, Tamil, Hindi…', full: false },
            ].map(({ label, key, type, placeholder, required, full }) => (
              <div key={key} style={{ gridColumn: full ? '1 / -1' : undefined }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                  placeholder={placeholder} required={required}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                    border: '1.5px solid #E5E7EB', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#E8712A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                Additional Notes / Special Requirements
              </label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                rows={4} placeholder="Describe any specific traditions, guest count, dietary requirements, or other details…"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                  border: '1.5px solid #E5E7EB', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#E8712A'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>
          <button type="submit" disabled={submitting} style={{
            marginTop: 20, width: '100%', padding: '14px 0', borderRadius: 12,
            background: submitting ? '#ccc' : 'linear-gradient(135deg, #E8712A, #c4520f)',
            color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
            cursor: submitting ? 'default' : 'pointer',
            boxShadow: '0 4px 14px rgba(232,113,42,0.4)',
            transition: 'opacity 0.2s',
          }}>
            {submitting ? 'Submitting…' : '🙏 Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function PriestsPage() {
  const { user, profile } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [searchParams] = useSearchParams();

  const [priests] = useState(PRIESTS_SEED);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');
  const [poojaFilter] = useState(searchParams.get('category') || 'all');
  const [selectedPriest, setSelectedPriest] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const filtered = priests.filter(p => {
    if (p.status !== 'approved') return false;
    if (search) {
      const s = search.toLowerCase();
      if (!p.name.toLowerCase().includes(s) && !p.poojas.some(pj => pj.toLowerCase().includes(s))) return false;
    }
    if (stateFilter !== 'all' && p.state !== stateFilter) return false;
    if (langFilter !== 'all' && !p.languages.includes(langFilter)) return false;
    if (poojaFilter !== 'all' && !p.poojas.some(pj => pj.toLowerCase().includes(poojaFilter.toLowerCase()))) return false;
    return true;
  });

  const handleBook = async (formData) => {
    try {
      await createBooking(db, {
        userId: user.uid,
        userName: profile.name,
        userEmail: profile.email,
        userPhone: profile.phone,
        priestId: selectedPriest.id,
        priestName: selectedPriest.name,
        ...formData,
      });
      setBookingOpen(false);
      addToast('Request Sent! 🙏', `Your ${formData.poojaType} request has been sent to ${selectedPriest.name}.`, 'success');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleCustomRequest = async (form) => {
    // In production this would write to Firestore; for now show success
    await new Promise(r => setTimeout(r, 800));
    setRequestOpen(false);
    addToast('Request Submitted! 🙏', 'Our team will match you with the perfect priest and reach out within 24 hours.', 'success');
  };

  return (
    <main style={{
      width: '100%', maxWidth: 1600, margin: '0 auto',
      padding: 'clamp(16px, 2.5vw, 36px) clamp(16px, 3vw, 40px)',
    }}>

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a00 0%, #3d1500 50%, #1a0a00 100%)',
        borderRadius: 24, padding: '36px 36px 32px', marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(232,113,42,0.15)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: '40%', width: 250, height: 250,
          borderRadius: '50%', background: 'rgba(232,113,42,0.08)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: '#F59E0B', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                ✦ Verified Vedic Priests
              </p>
              <h1 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2 }}>
                Find Your Perfect Priest
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 420, lineHeight: 1.6, margin: 0 }}>
                Connect with trusted Hindu priests across MA, CT & NH — for weddings, homams, grihapraveshams and more.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {[['🕉️', filtered.length, 'Priests'], ['⭐', '4.7+', 'Avg Rating'], ['🎉', '500+', 'Ceremonies']].map(([icon, val, lbl]) => (
                  <div key={lbl} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 14px' }}>
                    <div style={{ fontSize: 18 }}>{icon}</div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{val}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setRequestOpen(true)} style={{
                background: 'linear-gradient(135deg, #E8712A, #c4520f)',
                border: 'none', borderRadius: 12, color: '#fff',
                padding: '12px 22px', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(232,113,42,0.5)',
                letterSpacing: 0.3,
              }}>
                ✉️ Submit Custom Request
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '18px 20px',
        marginBottom: 22, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid #F3F4F6',
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Search */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>Search</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 14 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Name or ceremony type…"
                style={{
                  width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
                  border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#E8712A'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* State */}
          <div style={{ flex: '0 1 160px' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>State</label>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff', cursor: 'pointer' }}>
              <option value="all">All States</option>
              {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Language */}
          <div style={{ flex: '0 1 160px' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>Language</label>
            <select value={langFilter} onChange={e => setLangFilter(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff', cursor: 'pointer' }}>
              <option value="all">All Languages</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            {/* View toggle */}
            <div style={{ display: 'flex', border: '1.5px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
              {['grid','list'].map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={{
                  padding: '8px 12px', border: 'none', cursor: 'pointer', fontSize: 14,
                  background: viewMode === m ? '#E8712A' : '#fff',
                  color: viewMode === m ? '#fff' : '#6B7280',
                }}>
                  {m === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
            {/* Clear */}
            {(search || stateFilter !== 'all' || langFilter !== 'all') && (
              <button onClick={() => { setSearch(''); setStateFilter('all'); setLangFilter('all'); }}
                style={{ padding: '9px 14px', borderRadius: 10, border: '1.5px solid #FED7AA', background: '#FFF7ED', color: '#E8712A', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Clear
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            Showing <strong style={{ color: '#111' }}>{filtered.length}</strong> priests
          </span>
          <button onClick={() => setRequestOpen(true)} style={{
            fontSize: 13, color: '#E8712A', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
          }}>
            Can't find what you need? Submit a custom request →
          </button>
        </div>
      </div>

      {/* ── Priest Grid / List ──────────────────────────────────── */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {filtered.map((priest, idx) => (
            <div key={priest.id} style={{
              background: '#fff', borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #F3F4F6',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; }}
            >
              {/* Card top */}
              <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <PriestAvatar priest={priest} index={idx} size={60} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.3 }}>{priest.name}</h3>
                    {priest.verified && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: '#ECFDF5', color: '#059669' }}>✓ Verified</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{priest.temple}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <StarRating rating={priest.rating} />
                    <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{priest.rating}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>({priest.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: 12, padding: '12px 20px', flexWrap: 'wrap' }}>
                {[
                  { icon: '📍', val: priest.location },
                  { icon: '🎓', val: `${priest.experience} yrs` },
                  { icon: '💰', val: priest.priceRange },
                ].map(({ icon, val }) => (
                  <span key={val} style={{ fontSize: 11, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}>
                    {icon} {val}
                  </span>
                ))}
              </div>

              {/* Languages */}
              <div style={{ padding: '0 20px 10px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {priest.languages.slice(0, 4).map(l => (
                  <span key={l} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#EEF2FF', color: '#4F46E5', fontWeight: 600 }}>{l}</span>
                ))}
                {priest.languages.length > 4 && (
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280' }}>+{priest.languages.length - 4}</span>
                )}
              </div>

              {/* Poojas */}
              <div style={{ padding: '0 20px 14px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {priest.poojas.slice(0, 3).map(p => (
                  <span key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#FFF7ED', color: '#C2410C', fontWeight: 500 }}>{p}</span>
                ))}
                {priest.poojas.length > 3 && (
                  <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280' }}>+{priest.poojas.length - 3} more</span>
                )}
              </div>

              {/* Divider + CTA */}
              <div style={{ borderTop: '1px solid #F3F4F6', padding: '14px 20px', display: 'flex', gap: 8 }}>
                <button onClick={() => { setSelectedPriest(priest); setBookingOpen(true); }} style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  background: 'linear-gradient(135deg, #E8712A, #c4520f)',
                  color: '#fff', fontWeight: 700, fontSize: 13, border: 'none',
                  cursor: 'pointer', boxShadow: '0 3px 10px rgba(232,113,42,0.35)',
                }}>
                  Book Now
                </button>
                <WhatsAppButton number={priest.whatsappNumber} name={priest.name} />
                {!priest.whatsappNumber && (
                  <button onClick={() => { setSelectedPriest(priest); setRequestOpen(true); }} style={{
                    padding: '10px 14px', borderRadius: 10, border: '1.5px solid #FED7AA',
                    background: '#FFF7ED', color: '#E8712A', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  }}>
                    ✉️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── List View ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((priest, idx) => (
            <div key={priest.id} style={{
              background: '#fff', borderRadius: 16, padding: '18px 20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6',
              display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
              transition: 'box-shadow 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
            >
              <PriestAvatar priest={priest} index={idx} size={64} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>{priest.name}</h3>
                  {priest.verified && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: '#ECFDF5', color: '#059669' }}>✓ Verified</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>{priest.temple} · {priest.location}</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><StarRating rating={priest.rating} /><span style={{ fontSize: 12, fontWeight: 600 }}>{priest.rating}</span></span>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>🎓 {priest.experience} yrs</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#E8712A' }}>{priest.priceRange}</span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {priest.poojas.slice(0, 4).map(p => (
                    <span key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#FFF7ED', color: '#C2410C', fontWeight: 500 }}>{p}</span>
                  ))}
                  {priest.poojas.length > 4 && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280' }}>+{priest.poojas.length - 4}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                <button onClick={() => { setSelectedPriest(priest); setBookingOpen(true); }} style={{
                  padding: '10px 24px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #E8712A, #c4520f)',
                  color: '#fff', fontWeight: 700, fontSize: 13, border: 'none',
                  cursor: 'pointer', boxShadow: '0 3px 10px rgba(232,113,42,0.35)',
                }}>
                  Book Now
                </button>
                {priest.whatsappNumber
                  ? <WhatsAppButton number={priest.whatsappNumber} name={priest.name} style={{ justifyContent: 'center' }} />
                  : <button onClick={() => setRequestOpen(true)} style={{
                      padding: '8px 24px', borderRadius: 10, border: '1.5px solid #FED7AA',
                      background: '#FFF7ED', color: '#E8712A', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                    }}>Custom Request</button>
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{
          background: '#fff', borderRadius: 20, padding: '60px 24px', textAlign: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>No priests found</h3>
          <p style={{ color: '#9CA3AF', marginBottom: 20 }}>Try adjusting your filters or submit a custom request</p>
          <button onClick={() => setRequestOpen(true)} style={{
            padding: '12px 28px', borderRadius: 12,
            background: 'linear-gradient(135deg, #E8712A, #c4520f)',
            color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
          }}>
            Submit Custom Request
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {bookingOpen && selectedPriest && (
        <BookingModal
          priest={selectedPriest}
          vendors={VENDORS_SEED}
          onClose={() => setBookingOpen(false)}
          onBook={handleBook}
        />
      )}

      {/* Custom Request Modal */}
      {requestOpen && (
        <CustomRequestModal
          onClose={() => setRequestOpen(false)}
          onSubmit={handleCustomRequest}
        />
      )}
    </main>
  );
}
