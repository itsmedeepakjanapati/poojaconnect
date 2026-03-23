// web/src/pages/AdminPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { AuthContext, ToastContext } from '../App';
import { getPendingPriests, approvePriest, rejectPriest } from '../../../shared/services/priestService';
import { getPendingVendors, approveVendor, rejectVendor } from '../../../shared/services/vendorService';
import { getAllBookings } from '../../../shared/services/bookingService';
import { PRIESTS_SEED, VENDORS_SEED } from '../../../shared/data/seedData';

const statusColors = {
  pending: { bg: '#FFF3EB', color: '#E8712A' },
  confirmed: { bg: '#E8F5E9', color: '#2E7D32' },
  cancelled: { bg: '#FFEBEE', color: '#C62828' },
  completed: { bg: '#E3F2FD', color: '#1565C0' },
};

export default function AdminPage() {
  const { addToast } = useContext(ToastContext);
  const [pendingPriests, setPendingPriests] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getPendingPriests(db).then(setPendingPriests).catch(() => {});
    getPendingVendors(db).then(setPendingVendors).catch(() => {});
    getAllBookings(db).then(setBookings).catch(() => {});
  }, []);

  const handleApprovePriest = async (id) => {
    await approvePriest(db, id);
    setPendingPriests(p => p.filter(x => x.id !== id));
    addToast('Approved ✅', 'Priest is now live on the platform.', 'success');
  };

  const handleRejectPriest = async (id) => {
    await rejectPriest(db, id);
    setPendingPriests(p => p.filter(x => x.id !== id));
    addToast('Rejected', 'Priest submission rejected.', 'error');
  };

  const handleApproveVendor = async (id) => {
    await approveVendor(db, id);
    setPendingVendors(v => v.filter(x => x.id !== id));
    addToast('Approved ✅', 'Vendor is now live.', 'success');
  };

  const handleRejectVendor = async (id) => {
    await rejectVendor(db, id);
    setPendingVendors(v => v.filter(x => x.id !== id));
    addToast('Rejected', 'Vendor submission rejected.', 'error');
  };

  const allPending = [...pendingPriests.map(p => ({ ...p, _type: 'priest' })), ...pendingVendors.map(v => ({ ...v, _type: 'vendor' }))];

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: '🙏', num: PRIESTS_SEED.length, label: 'Active Priests', color: '#E8712A' },
          { icon: '🏪', num: VENDORS_SEED.length, label: 'Active Vendors', color: '#D4A843' },
          { icon: '⏳', num: allPending.length, label: 'Pending Approvals', color: '#1565C0' },
          { icon: '📅', num: bookings.length, label: 'Total Bookings', color: '#2E7D32' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl">{s.icon}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.num}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending approvals */}
      <h3 className="font-bold text-base text-gray-900 mb-3">Pending Approvals</h3>
      {allPending.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 mb-6">No pending approvals.</div>
      ) : (
        <div className="space-y-3 mb-6">
          {allPending.map(item => (
            <div key={item.id} className="bg-white rounded-xl border-l-4 p-4 border border-gray-100" style={{ borderLeftColor: '#E8712A' }}>
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase" style={{ background: '#FFF3EB', color: '#E8712A' }}>{item._type}</span>
                  <h4 className="font-bold text-gray-900 mt-1">{item.name}</h4>
                  <div className="text-xs text-gray-400">{item.location} · {item.email || 'No email'} · {item.phone || 'No phone'}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => item._type === 'priest' ? handleApprovePriest(item.id) : handleApproveVendor(item.id)}
                    className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold" style={{ background: '#2E7D32' }}>✓ Approve</button>
                  <button onClick={() => item._type === 'priest' ? handleRejectPriest(item.id) : handleRejectVendor(item.id)}
                    className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold" style={{ background: '#C62828' }}>✕ Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All bookings */}
      <h3 className="font-bold text-base text-gray-900 mb-3">All Bookings</h3>
      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">No bookings yet.</div>
      ) : (
        <div className="space-y-2">
          {bookings.map(b => {
            const sc = statusColors[b.status] || statusColors.pending;
            return (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex justify-between items-center text-sm">
                  <span><strong>{b.poojaType}</strong> — {b.priestName}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>{b.status}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{b.userName} · {b.requestedDate} · {b.address}</div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
