// web/src/pages/BookingsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { AuthContext, ToastContext } from '../App';
import { getUserBookings, cancelBooking } from '../../../shared/services/bookingService';
import { BOOKING_STATUS } from '../../../shared/types';

const statusColors = {
  pending:   { bg: '#FFF3EB', color: '#E8712A' },
  confirmed: { bg: '#E8F5E9', color: '#2E7D32' },
  cancelled: { bg: '#FFEBEE', color: '#C62828' },
  completed: { bg: '#E3F2FD', color: '#1565C0' },
};

export default function BookingsPage() {
  const { user, profile } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserBookings(db, user.uid)
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(db, bookingId, 'user');
      setBookings(b => b.map(bk => bk.id === bookingId ? { ...bk, status: BOOKING_STATUS.CANCELLED } : bk));
      addToast('Booking Cancelled', 'Cancellation email and push notification sent.', 'error');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  if (loading) {
    return <main className="max-w-5xl mx-auto px-4 py-12 text-center"><div className="animate-spin w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full mx-auto" /></main>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <div className="text-gray-400 mb-4">No bookings yet. Find a priest and book a pooja!</div>
          <Link to="/priests" className="inline-block px-5 py-2.5 rounded-lg text-white text-sm font-semibold no-underline" style={{ background: '#E8712A' }}>Browse Priests</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => {
            const sc = statusColors[b.status] || statusColors.pending;
            return (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base text-gray-900">{b.poojaType}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase" style={{ background: sc.bg, color: sc.color }}>{b.status}</span>
                    </div>
                    <div className="text-sm text-gray-600">Priest: <strong>{b.priestName}</strong></div>
                    <div className="text-xs text-gray-400 mt-1">
                      <span className="mr-3">📅 {b.requestedDate} {b.requestedTime}</span>
                      <span>📍 {b.address}</span>
                    </div>
                    {b.confirmedPrice && <div className="text-sm font-semibold mt-2" style={{ color: '#2E7D32' }}>Confirmed Price: {b.confirmedPrice}</div>}

                    {b.status === BOOKING_STATUS.CONFIRMED && (
                      <div className="mt-3 p-3 rounded-lg" style={{ background: '#FFF3EB' }}>
                        <div className="text-xs font-semibold" style={{ color: '#E8712A' }}>📧 Confirmation sent to: {b.userEmail}</div>
                        <div className="text-[11px] text-gray-500">🔔 Push notification delivered</div>
                      </div>
                    )}
                    {b.status === BOOKING_STATUS.CANCELLED && (
                      <div className="mt-3 p-3 rounded-lg" style={{ background: '#FFEBEE' }}>
                        <div className="text-xs font-semibold" style={{ color: '#C62828' }}>📧 Cancellation email sent</div>
                        <div className="text-[11px] text-gray-500">🔔 Push notification + SMS sent</div>
                      </div>
                    )}
                  </div>
                  <div>
                    {b.status === BOOKING_STATUS.CONFIRMED && (
                      <button onClick={() => handleCancel(b.id)}
                        className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold" style={{ background: '#C62828' }}>Cancel</button>
                    )}
                  </div>
                </div>

                {b.suggestedItems?.length > 0 && b.status !== BOOKING_STATUS.CANCELLED && (
                  <div className="mt-4 p-3 rounded-lg border" style={{ background: '#FBF7ED', borderColor: '#D4A843' }}>
                    <div className="text-xs font-bold text-gray-900 mb-1.5">🛒 Suggested Items for {b.poojaType}</div>
                    <div className="flex gap-1 flex-wrap">
                      {b.suggestedItems.map(item => <span key={item} className="text-[11px] px-2 py-0.5 rounded-full bg-white" style={{ color: '#D4A843' }}>{item}</span>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
