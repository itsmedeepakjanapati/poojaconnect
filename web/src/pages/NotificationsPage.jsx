// web/src/pages/NotificationsPage.jsx
import React, { useState } from 'react';

const prefs = [
  { key: 'bookingConfirm', label: 'Booking Confirmations', desc: 'Get notified when a priest confirms your booking', default: true },
  { key: 'bookingCancel', label: 'Booking Cancellations', desc: 'Alerts when a booking is cancelled', default: true },
  { key: 'email', label: 'Email Notifications', desc: 'Receive booking details via email', default: true },
  { key: 'sms', label: 'SMS Notifications', desc: 'Text message alerts for important updates', default: true },
  { key: 'push', label: 'Push Notifications', desc: 'Browser/mobile push for real-time alerts', default: true },
  { key: 'promo', label: 'Promotional Updates', desc: 'Festival specials and new priest listings', default: false },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState(
    Object.fromEntries(prefs.map(p => [p.key, p.default]))
  );

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h4 className="font-bold text-gray-900 mb-3">🔔 Notification Preferences</h4>
        {prefs.map(pref => (
          <div key={pref.key} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
            <div>
              <div className="text-sm font-semibold text-gray-900">{pref.label}</div>
              <div className="text-xs text-gray-400">{pref.desc}</div>
            </div>
            <button onClick={() => toggle(pref.key)}
              className="w-11 h-6 rounded-full relative transition-colors"
              style={{ background: settings[pref.key] ? '#2E7D32' : '#D1D5DB' }}>
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow transition-all"
                style={{ left: settings[pref.key] ? 22 : 2 }} />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5 border" style={{ background: '#E3F2FD', borderColor: '#1565C0' }}>
        <h4 className="font-bold mb-1" style={{ color: '#1565C0' }}>📱 Push Notification Architecture</h4>
        <div className="text-xs text-gray-600 leading-relaxed">
          <strong>Firebase Cloud Messaging (FCM)</strong> powers all push notifications — completely free with unlimited messages.
          Notifications are triggered by Cloud Functions on booking events (confirm, cancel, update).
          Email via SendGrid, SMS via Twilio. All integrated through Firebase Cloud Functions.
        </div>
      </div>
    </main>
  );
}
