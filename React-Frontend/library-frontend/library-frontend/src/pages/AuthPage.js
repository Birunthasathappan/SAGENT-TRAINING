import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMember, createLibrarian, loginMember, loginLibrarian } from '../api';
import './AuthPage.css';

const ROLES = ['STUDENT', 'STAFF', 'LIBRARIAN'];

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const getDashboard = (role) => {
    if (role === 'LIBRARIAN') return '/librarian/dashboard';
    if (role === 'STAFF')     return '/staff/dashboard';
    return '/student/dashboard';
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      setError('Please fill in all fields.'); return;
    }
    setLoading(true); setError('');
    try {
      let created;
      const payload = { name: form.name, email: form.email, password: form.password };
      if (form.role === 'LIBRARIAN') {
        const res = await createLibrarian(payload);
        created = { ...res.data, role: 'LIBRARIAN' };
      } else {
        const res = await createMember({ ...payload, role: form.role });
        created = { ...res.data, role: form.role };
      }
      login({ id: created.id, name: created.name, email: created.email, role: created.role });
      navigate(getDashboard(created.role));
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed. Is Spring Boot running on port 8080?');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Please enter email and password.'); return; }
    setLoading(true); setError('');
    try {
      // Try member login first, then librarian
      let userData = null;

      try {
        const res = await loginMember({ email: form.email, password: form.password });
        userData = { ...res.data, role: res.data.role || 'STUDENT' };
      } catch {
        // not a member, try librarian
      }

      if (!userData) {
        try {
          const res = await loginLibrarian({ email: form.email, password: form.password });
          userData = { ...res.data, role: 'LIBRARIAN' };
        } catch {
          // not a librarian either
        }
      }

      if (!userData) {
        setError('Invalid email or password.'); setLoading(false); return;
      }

      login({ id: userData.id, name: userData.name, email: userData.email, role: userData.role });
      navigate(getDashboard(userData.role));
    } catch (e) {
      setError('Could not connect to backend. Please ensure Spring Boot is running on port 8080.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">⚜️</div>
          <h1 className="auth-brand">LibraVault</h1>
          <p className="auth-tagline">Your gateway to knowledge, organized beautifully.</p>
          <div className="auth-features">
            <div className="auth-feature">📚 Browse thousands of books</div>
            <div className="auth-feature">🔄 Borrow &amp; return seamlessly</div>
            <div className="auth-feature">🔔 Get due-date reminders</div>
            <div className="auth-feature">💰 Manage fines effortlessly</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card fade-up">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >Sign In</button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >Register</button>
          </div>

          <div className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" placeholder="John Doe" value={form.name}
                  onChange={e => set('name', e.target.value)} />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label>Role <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="form-input" value={form.role} onChange={e => set('role', e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <small style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>
                  Your role determines your dashboard and permissions
                </small>
              </div>
            )}

            {error && <div className="auth-error">⚠️ {error}</div>}

            <button
              className="btn btn-primary auth-submit"
              onClick={mode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading ? '⏳ Please wait...' : mode === 'login' ? '🔐 Sign In' : '🚀 Create Account'}
            </button>

            <p className="auth-switch">
              {mode === 'login'
                ? <>New here? <span onClick={() => { setMode('register'); setError(''); }}>Create account →</span></>
                : <>Already registered? <span onClick={() => { setMode('login'); setError(''); }}>Sign in →</span></>
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}