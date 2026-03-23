// web/src/components/Toast.jsx
import React from 'react';

const typeStyles = {
  success: { bg: '#E8F5E9', border: '#2E7D32', icon: '✅' },
  error:   { bg: '#FFEBEE', border: '#C62828', icon: '❌' },
  info:    { bg: '#E3F2FD', border: '#1565C0', icon: '🔔' },
};

export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(t => {
        const s = typeStyles[t.type] || typeStyles.info;
        return (
          <div key={t.id} className="rounded-xl p-3 flex gap-3 items-start shadow-lg animate-slideIn"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <span className="text-lg">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900">{t.title}</div>
              <div className="text-xs text-gray-600 mt-0.5">{t.message}</div>
            </div>
            <button onClick={() => onDismiss(t.id)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
          </div>
        );
      })}
    </div>
  );
}
