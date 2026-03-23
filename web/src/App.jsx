// ═══════════════════════════════════════════════════════════════
// web/src/App.jsx
// Main web application with React Router
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, messaging } from './firebase';
import { getUserProfile, updateFcmToken } from '../../shared/services/authService';
import { requestWebPushPermission, onForegroundMessage } from '../../shared/services/notificationService';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PriestsPage from './pages/PriestsPage';
import PriestDetailPage from './pages/PriestDetailPage';
import VendorsPage from './pages/VendorsPage';
import BookingsPage from './pages/BookingsPage';
import AdminPage from './pages/AdminPage';
import NotificationsPage from './pages/NotificationsPage';

// Components
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Toast from './components/Toast';

// Context
export const AuthContext = createContext(null);
export const ToastContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const prof = await getUserProfile(db, firebaseUser.uid);
        setProfile(prof);

        // Request push notifications
        if (messaging) {
          const token = await requestWebPushPermission(messaging, import.meta.env.VITE_VAPID_KEY);
          if (token) {
            await updateFcmToken(db, firebaseUser.uid, token);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user, profile, loading } = useContext(AuthContext);
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-8 h-8 border-4 border-saffron border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/" />;
  return children;
}

function AppContent() {
  const { user, profile } = useContext(AuthContext);
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, title, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000);
  };

  // Listen for foreground push messages
  useEffect(() => {
    if (messaging && user) {
      const unsub = onForegroundMessage(messaging, (payload) => {
        addToast(payload.title, payload.body, 'info');
      });
      return unsub;
    }
  }, [user]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="min-h-screen bg-cream">
        {user && <Navbar />}
        <Toast toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />

        <Routes>
          {/* Public */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

          {/* Protected */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/priests" element={<ProtectedRoute><PriestsPage /></ProtectedRoute>} />
          <Route path="/priests/:id" element={<ProtectedRoute><PriestDetailPage /></ProtectedRoute>} />
          <Route path="/vendors" element={<ProtectedRoute><VendorsPage /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {user && <Chatbot />}
      </div>
    </ToastContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
