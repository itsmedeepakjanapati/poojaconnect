// web/src/components/Navbar.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { logoutUser } from '../../../shared/services/authService';
import { auth } from '../firebase';

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/priests', label: 'Priests', icon: '🙏' },
  { path: '/temples', label: 'Temples', icon: '🛕' },
  { path: '/vendors', label: 'Vendors', icon: '🏪' },
  { path: '/bhoktas', label: 'Bhoktas', icon: '👤' },
  { path: '/bookings', label: 'Bookings', icon: '📅' },
  { path: '/notifications', label: 'Alerts', icon: '🔔' },
];

const BRAND_MAROON = '#7A1F2B';

export default function Navbar() {
  const { user, profile } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isAdmin = profile?.role === 'admin';

  const fullName = profile?.name || user?.displayName || (user?.email ? user.email.split('@')[0] : '');
  const firstName = fullName ? fullName.trim().split(/\s+/)[0] : '';

  // Close dropdown on outside click or route change
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200"
      style={{ boxShadow: '0 1px 3px rgba(122,31,43,0.06), 0 4px 14px rgba(122,31,43,0.04)' }}
    >
      {/* Top row: logo + (desktop) nav links + user menu */}
      <div className="w-full mx-auto h-20 flex items-center gap-6" style={{ maxWidth: 1600, paddingLeft: 'clamp(16px, 3vw, 40px)', paddingRight: 'clamp(16px, 3vw, 40px)' }}>
        <Link
          to="/"
          className="flex items-center no-underline shrink-0 transition-transform hover:scale-[1.02]"
          aria-label="Samskara — Tradition, made simple"
        >
          <img
            src="/logo.png"
            alt="Samskara — Tradition, made simple"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav — inline with logo */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium no-underline transition-all ${
                  active
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                style={active ? { background: BRAND_MAROON } : undefined}
              >
                <span className="text-base leading-none">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side — user dropdown menu */}
        <div className="ml-auto lg:ml-0 shrink-0 relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="max-w-[140px] truncate">{firstName || 'Guest'}</span>
            <svg
              width="14" height="14" viewBox="0 0 20 20" fill="none"
              className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              aria-hidden
            >
              <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 py-1.5 overflow-hidden"
              style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
            >
              <div className="px-4 py-2.5 border-b border-gray-100">
                <div className="text-xs text-gray-500">Signed in as</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{fullName || 'Guest'}</div>
                {user?.email && (
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                )}
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 no-underline"
                >
                  <span>🛡️</span>
                  <span>Admin</span>
                  <span
                    className="ml-auto text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: '#FDECEE', color: BRAND_MAROON, letterSpacing: '0.08em' }}
                  >
                    Admin
                  </span>
                </Link>
              )}

              <button
                type="button"
                role="menuitem"
                onClick={() => { setMenuOpen(false); logoutUser(auth); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
              >
                <span>↩︎</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile / tablet nav — scrollable row below header */}
      <nav className="lg:hidden w-full mx-auto flex overflow-x-auto border-t border-gray-100" style={{ maxWidth: 1600, paddingLeft: 8, paddingRight: 8 }}>
        {navLinks.map(link => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap no-underline transition-all border-b-2 ${
                active ? 'text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              style={active ? { borderColor: BRAND_MAROON, color: BRAND_MAROON } : undefined}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}


