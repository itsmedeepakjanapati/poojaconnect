// web/src/components/BookingModal.jsx
import React, { useState } from 'react';
import { getItemsForPooja } from '../../../shared/types';

export default function BookingModal({ priest, vendors, onClose, onBook }) {
  const [form, setForm] = useState({ poojaType: '', date: '', time: '', address: '', notes: '' });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const items = form.poojaType ? getItemsForPooja(form.poojaType) : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.poojaType || !form.date || !form.address) return;
    onBook(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h3 className="font-serif font-bold text-lg text-gray-900">Book {priest.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Priest summary */}
          <div className="flex gap-3 items-center p-3 rounded-xl" style={{ background: '#FFF3EB' }}>
            <span className="text-3xl">🙏</span>
            <div>
              <div className="font-bold text-sm text-gray-900">{priest.name}</div>
              <div className="text-xs text-gray-500">{priest.temple} · {priest.location}</div>
              <div className="text-xs font-semibold" style={{ color: '#E8712A' }}>{priest.priceRange}</div>
            </div>
          </div>

          {/* Pooja type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pooja / Service Type *</label>
            <select value={form.poojaType} onChange={e => update('poojaType', e.target.value)} required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400">
              <option value="">Select a service...</option>
              {priest.poojas.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Suggested items */}
          {items.length > 0 && (
            <div className="p-3 rounded-xl border" style={{ background: '#FBF7ED', borderColor: '#D4A843' }}>
              <div className="text-xs font-bold text-gray-900 mb-2">🛒 Items needed for {form.poojaType}</div>
              <div className="flex gap-1 flex-wrap">
                {items.map(item => (
                  <span key={item} className="text-xs px-2 py-0.5 rounded-full bg-white" style={{ color: '#D4A843' }}>{item}</span>
                ))}
              </div>
              <div className="text-[11px] text-gray-400 mt-2">
                🏪 Available from: {vendors.slice(0, 2).map(v => v.name).join(', ')}
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date *</label>
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)} required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time</label>
              <input type="time" value={form.time} onChange={e => update('time', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address *</label>
            <input value={form.address} onChange={e => update('address', e.target.value)} required
              placeholder="Full address for the service"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Special Notes</label>
            <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2}
              placeholder="Any special requirements..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400 resize-none" />
          </div>

          {/* Submit */}
          <button type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold text-sm" style={{ background: '#E8712A' }}>
            Send Request to Priest
          </button>
          <div className="text-xs text-center p-2 rounded-lg" style={{ background: '#E3F2FD', color: '#1565C0' }}>
            📬 You'll receive email + push notification + SMS when the priest responds.
          </div>
        </form>
      </div>
    </div>
  );
}
