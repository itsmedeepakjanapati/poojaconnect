// web/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { logoutUser } from '../../../shared/services/authService';
import { auth } from '../firebase';

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/priests', label: 'Priests', icon: '🙏' },
  { path: '/vendors', label: 'Vendors', icon: '🏪' },
  { path: '/bookings', label: 'Bookings', icon: '📅' },
  { path: '/notifications', label: 'Alerts', icon: '🔔' },
];

export default function Navbar() {
  const { profile } = useContext(AuthContext);
  const location = useLocation();

  const allLinks = profile?.role === 'admin'
    ? [...navLinks, { path: '/admin', label: 'Admin', icon: '🛡️' }]
    : navLinks;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🙏</span>
          <span className="font-serif font-bold text-lg" style={{ color: '#E8712A' }}>PoojaConnect</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full font-semibold"
            style={{ background: '#E8F5E9', color: '#2E7D32' }}>
            {profile?.role || 'user'}
          </span>
          <span className="text-sm text-gray-600 hidden sm:inline">{profile?.name}</span>
          <button
            onClick={() => logoutUser(auth)}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <nav className="max-w-6xl mx-auto px-2 flex overflow-x-auto border-t border-gray-100">
        {allLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap no-underline transition-all border-b-2 ${
              location.pathname === link.path
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
