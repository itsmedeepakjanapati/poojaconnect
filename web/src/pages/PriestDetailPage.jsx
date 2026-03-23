// web/src/pages/PriestDetailPage.jsx
import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRIESTS_SEED, VENDORS_SEED } from '../../../shared/data/seedData';
import { AuthContext, ToastContext } from '../App';
import { db } from '../firebase';
import { createBooking } from '../../../shared/services/bookingService';
import BookingModal from '../components/BookingModal';

export default function PriestDetailPage() {
  const { id } = useParams();
  const { user, profile } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [bookingOpen, setBookingOpen] = useState(false);

  const priest = PRIESTS_SEED.find(p => p.id === id);
  if (!priest) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-500">Priest not found.</p>
        <Link to="/priests" className="text-sm mt-3 inline-block" style={{ color: '#E8712A' }}>← Back to Priests</Link>
      </main>
    );
  }

  const handleBook = async (formData) => {
    try {
      await createBooking(db, {
        userId: user.uid, userName: profile.name,
        userEmail: profile.email, userPhone: profile.phone,
        priestId: priest.id, priestName: priest.name,
        ...formData,
      });
      setBookingOpen(false);
      addToast('Request Sent! 🙏', `Your request has been sent to ${priest.name}.`, 'success');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/priests" className="text-sm mb-4 inline-block" style={{ color: '#E8712A' }}>← Back to Priests</Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6" style={{ background: 'linear-gradient(135deg, #FFF3EB, #FEFCF6)' }}>
          <div className="flex gap-4 items-start">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ background: '#E8712A22' }}>🙏</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-serif text-xl font-bold text-gray-900">{priest.name}</h1>
                {priest.verified && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#E8F5E9', color: '#2E7D32' }}>✓ Verified</span>}
              </div>
              <div className="text-sm text-gray-600">{priest.temple}</div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span>📍 {priest.location}</span>
                <span>⭐ {priest.rating} ({priest.reviews} reviews)</span>
                <span>{priest.experience} yrs experience</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Contact</h3>
            <div className="text-sm text-gray-600">📞 {priest.phone}</div>
            <div className="text-sm text-gray-600">✉️ {priest.email}</div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Mother Tongue</h3>
            <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ background: '#FFF3EB', color: '#E8712A' }}>{priest.motherTongue}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Languages</h3>
            <div className="flex gap-1.5 flex-wrap">
              {priest.languages.map(l => <span key={l} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#E3F2FD', color: '#1565C0' }}>{l}</span>)}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Poojas & Services ({priest.poojas.length})</h3>
            <div className="flex gap-1.5 flex-wrap">
              {priest.poojas.map(p => <span key={p} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#FFF3EB', color: '#E8712A' }}>{p}</span>)}
            </div>
          </div>
          {priest.specializations?.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Specializations</h3>
              <div className="flex gap-1.5 flex-wrap">
                {priest.specializations.map(s => <span key={s} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#FBF7ED', color: '#D4A843' }}>{s}</span>)}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Price Range</h3>
            <span className="text-lg font-bold" style={{ color: '#E8712A' }}>{priest.priceRange}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Available Days</h3>
            <div className="flex gap-1.5 flex-wrap">
              {priest.availableDays.map(d => <span key={d} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{d}</span>)}
            </div>
          </div>

          <button onClick={() => setBookingOpen(true)}
            className="w-full py-3 rounded-xl text-white font-semibold text-base" style={{ background: '#E8712A' }}>
            Book This Priest
          </button>
        </div>
      </div>

      {bookingOpen && (
        <BookingModal priest={priest} vendors={VENDORS_SEED} onClose={() => setBookingOpen(false)} onBook={handleBook} />
      )}
    </main>
  );
}
