import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import Navbar from '../components/Navbar';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await registerUser(form.name, form.email, form.password);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const iStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: '1.5px solid #DDE5EE', fontSize: 14, outline: 'none',
    background: '#F8FAFB', color: '#0D1B2A', boxSizing: 'border-box',
    fontFamily: 'Outfit, sans-serif', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #EBF8F8 0%, #F0F4FF 50%, #E8F5F5 100%)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
        <div style={{ position: 'fixed', top: '10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,95,192,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          display: 'flex', maxWidth: 900, width: '100%',
          background: '#fff', borderRadius: 24,
          boxShadow: '0 24px 80px rgba(15,44,78,0.12)',
          overflow: 'hidden', border: '1px solid #DDE5EE',
          animation: 'fadeUp 0.4s ease', position: 'relative', zIndex: 1,
        }}>
          {/* Left sidebar */}
          <div style={{
            width: 280, flexShrink: 0,
            background: 'linear-gradient(170deg, #0F2C4E 0%, #1A3F6F 50%, #0EA5A0 100%)',
            padding: '52px 32px', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', marginBottom: 16 }}>₹</div>
              <div style={{ fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 8 }}>BudgetTracker</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>Start your journey to financial freedom today.</div>
            </div>

            {[
              { n: '01', t: 'Create Account', d: 'Set up your secure profile' },
              { n: '02', t: 'Add Your Data', d: 'Income, expenses & budgets' },
              { n: '03', t: 'Track & Grow', d: 'Reach your financial goals' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 14, marginBottom: 28, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(109,213,209,0.25)',
                  border: '1.5px solid rgba(109,213,209,0.5)',
                  color: '#6DD5D1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, flexShrink: 0,
                }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{s.d}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Free forever. No credit card required.</div>
          </div>

          {/* Form */}
          <div style={{ flex: 1, padding: '52px 48px' }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0D1B2A', marginBottom: 6 }}>Create your account</h1>
            <p style={{ fontSize: 14, color: '#6B7C93', marginBottom: 32 }}>Join thousands managing their finances smarter.</p>

            {error && <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '11px 15px', color: '#B91C1C', fontSize: 13, marginBottom: 20 }}>⚠ {error}</div>}
            {success && <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '11px 15px', color: '#065F46', fontSize: 13, marginBottom: 20 }}>✓ {success}</div>}

            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
              <input value={form.name} onChange={set('name')} placeholder="Arjun Sharma" required
                style={iStyle}
                onFocus={e => e.target.style.borderColor = '#0EA5A0'}
                onBlur={e => e.target.style.borderColor = '#DDE5EE'}
              />
              <div style={{ marginTop: 14 }} />

              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="arjun@example.com" required
                style={iStyle}
                onFocus={e => e.target.style.borderColor = '#0EA5A0'}
                onBlur={e => e.target.style.borderColor = '#DDE5EE'}
              />
              <div style={{ marginTop: 14, display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                  <input type="password" value={form.password} onChange={set('password')} placeholder="Min 6 chars" required
                    style={iStyle}
                    onFocus={e => e.target.style.borderColor = '#0EA5A0'}
                    onBlur={e => e.target.style.borderColor = '#DDE5EE'}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm Password</label>
                  <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required
                    style={iStyle}
                    onFocus={e => e.target.style.borderColor = '#0EA5A0'}
                    onBlur={e => e.target.style.borderColor = '#DDE5EE'}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px', marginTop: 28,
                  background: loading ? '#A8B6C8' : 'linear-gradient(135deg, #0EA5A0, #3B5FC0)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(14,165,160,0.35)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7C93' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#0EA5A0', fontWeight: 700 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
