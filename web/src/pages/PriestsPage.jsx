// web/src/pages/PriestsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { AuthContext, ToastContext } from '../App';
import { PRIESTS_SEED, VENDORS_SEED } from '../../../shared/data/seedData';
import { STATES, LANGUAGES, getItemsForPooja } from '../../../shared/types';
import { createBooking } from '../../../shared/services/bookingService';
import BookingModal from '../components/BookingModal';

export default function PriestsPage() {
  const { user, profile } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [searchParams] = useSearchParams();

  const [priests, setPriests] = useState(PRIESTS_SEED);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');
  const [poojaFilter, setPoojaFilter] = useState(searchParams.get('category') || 'all');
  const [selectedPriest, setSelectedPriest] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

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
      addToast('Request Sent! 🙏', `Your ${formData.poojaType} request has been sent to ${selectedPriest.name}. You'll get a push notification when they respond.`, 'success');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl font-bold text-gray-900">Find a Priest</h2>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#FFF3EB', color: '#E8712A' }}>
          {filtered.length} available
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Search</label>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Name or pooja type..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400">
              <option value="all">All States</option>
              {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Language</label>
            <select value={langFilter} onChange={e => setLangFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400">
              <option value="all">All Languages</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            {(search || stateFilter !== 'all' || langFilter !== 'all' || poojaFilter !== 'all') && (
              <button onClick={() => { setSearch(''); setStateFilter('all'); setLangFilter('all'); setPoojaFilter('all'); }}
                className="text-sm text-orange-600 hover:underline">Clear all filters</button>
            )}
          </div>
        </div>
      </div>

      {/* Priest cards */}
      <div className="space-y-3">
        {filtered.map(priest => (
          <div key={priest.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: '#FFF3EB' }}>🙏</div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-serif text-base font-bold text-gray-900">{priest.name}</h3>
                  {priest.verified && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#2E7D32' }}>✓ Verified</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-1">{priest.temple}</div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 flex-wrap">
                  <span>📍 {priest.location}</span>
                  <span>⭐ {priest.rating} ({priest.reviews})</span>
                  <span>{priest.experience} yrs</span>
                  <span className="font-semibold" style={{ color: '#E8712A' }}>{priest.priceRange}</span>
                </div>
                <div className="text-xs text-gray-600 mb-2"><strong>Mother Tongue:</strong> {priest.motherTongue}</div>
                <div className="flex gap-1 flex-wrap mb-2">
                  {priest.languages.map(l => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#E3F2FD', color: '#1565C0' }}>{l}</span>
                  ))}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {priest.poojas.slice(0, 5).map(p => (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FFF3EB', color: '#E8712A' }}>{p}</span>
                  ))}
                  {priest.poojas.length > 5 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">+{priest.poojas.length - 5} more</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end justify-center">
                <button onClick={() => { setSelectedPriest(priest); setBookingOpen(true); }}
                  className="px-5 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: '#E8712A' }}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-gray-400">No priests found matching your criteria. Try adjusting filters.</div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingOpen && selectedPriest && (
        <BookingModal
          priest={selectedPriest}
          vendors={VENDORS_SEED}
          onClose={() => setBookingOpen(false)}
          onBook={handleBook}
        />
      )}
    </main>
  );
}
