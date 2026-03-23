// web/src/pages/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { registerUser } from '../../../shared/services/authService';
import { USER_ROLES } from '../../../shared/types';
import { ToastContext } from '../App';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: USER_ROLES.USER });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useContext(ToastContext) || {};

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(auth, db, form);
      addToast?.('Account Created! 🙏', `Welcome ${form.name}! Push notifications enabled.`, 'success');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(170deg, #FEFCF6 0%, #FFF8F0 50%, #FFF3EB 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🙏</div>
          <h1 className="text-2xl font-serif font-bold" style={{ color: '#E8712A' }}>Join PoojaConnect</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-7 border border-gray-100">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400"
                placeholder="Your full name" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400"
                placeholder="+1 (555) 000-0000" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400"
                placeholder="you@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400"
                placeholder="At least 6 characters" required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">I am a...</label>
              <select value={form.role} onChange={e => update('role', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-400">
                <option value="user">Devotee (User)</option>
                <option value="priest">Priest / Pandit</option>
                <option value="vendor">Vendor / Shop Owner</option>
              </select>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity disabled:opacity-50"
              style={{ background: '#E8712A' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account? <Link to="/login" className="font-semibold" style={{ color: '#E8712A' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
