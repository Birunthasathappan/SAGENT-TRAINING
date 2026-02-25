import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import Navbar from '../components/Navbar';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginUser(email, password);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid email or password. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #EBF8F8 0%, #F0F4FF 50%, #E8F5F5 100%)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>

        {/* Background decorative circles */}
        <div style={{ position: 'fixed', top: '15%', left: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,160,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,95,192,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          display: 'flex', maxWidth: 900, width: '100%', gap: 40,
          alignItems: 'center', position: 'relative', zIndex: 1,
        }}>
          {/* Left info panel */}
          <div style={{ flex: 1, display: 'none', flexDirection: 'column' }} className="login-left">
            <div style={{ fontSize: 42, fontWeight: 800, color: '#0F2C4E', lineHeight: 1.1, marginBottom: 16 }}>
              Take control of your <span style={{ color: '#0EA5A0' }}>finances</span> today.
            </div>
            <p style={{ fontSize: 16, color: '#6B7C93', lineHeight: 1.7, marginBottom: 32 }}>
              Track income, manage expenses, set budgets and achieve your savings goals — all in one beautiful place.
            </p>
            {[
              { icon: '📊', title: 'Smart Dashboard', desc: 'Visual overview of your complete financial picture' },
              { icon: '🎯', title: 'Savings Goals', desc: 'Set targets and track your progress with ease' },
              { icon: '📋', title: 'Budget Control', desc: 'Prevent overspending with smart category limits' },
              { icon: '💬', title: 'AI Assistant', desc: 'Get answers to your finance questions instantly' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(14,165,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0F2C4E' }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#6B7C93' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Login card */}
          <div style={{
            background: '#fff', borderRadius: 22, padding: '48px 44px',
            boxShadow: '0 20px 60px rgba(15,44,78,0.12)',
            border: '1px solid #DDE5EE',
            width: '100%', maxWidth: 420,
            animation: 'fadeUp 0.4s ease',
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'linear-gradient(135deg, #0EA5A0, #0B7E7A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, color: '#fff', fontWeight: 800,
                boxShadow: '0 4px 14px rgba(14,165,160,0.4)',
              }}>₹</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, color: '#0F2C4E' }}>BudgetTracker</div>
                <div style={{ fontSize: 11, color: '#0EA5A0', fontWeight: 600, letterSpacing: '0.08em' }}>PERSONAL FINANCE</div>
              </div>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0D1B2A', marginBottom: 6, textAlign: 'center' }}>Welcome Back</h1>
            <p style={{ fontSize: 14, color: '#6B7C93', marginBottom: 28, textAlign: 'center' }}>Login to continue managing your finances.</p>

            {error && (
              <div style={{
                background: '#FEE2E2', border: '1px solid #FCA5A5',
                borderRadius: 10, padding: '12px 16px',
                color: '#B91C1C', fontSize: 13, marginBottom: 20,
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334E68', marginBottom: 7 }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10,
                    border: '1.5px solid #DDE5EE', fontSize: 14, outline: 'none',
                    background: '#F8FAFB', color: '#0D1B2A', boxSizing: 'border-box',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#0EA5A0'}
                  onBlur={e => e.target.style.borderColor = '#DDE5EE'}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334E68', marginBottom: 7 }}>Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10,
                    border: '1.5px solid #DDE5EE', fontSize: 14, outline: 'none',
                    background: '#F8FAFB', color: '#0D1B2A', boxSizing: 'border-box',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#0EA5A0'}
                  onBlur={e => e.target.style.borderColor = '#DDE5EE'}
                />
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? '#A8B6C8' : 'linear-gradient(135deg, #0EA5A0 0%, #3B5FC0 100%)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(14,165,160,0.4)',
                  transition: 'all 0.2s', letterSpacing: '0.02em',
                }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Logging in...
                  </span>
                ) : 'Login'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7C93' }}>
              New user?{' '}
              <Link to="/register" style={{ color: '#0EA5A0', fontWeight: 700 }}>Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
