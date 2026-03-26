import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: -200, right: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,184,75,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--primary)', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
            color: 'var(--bg)', margin: '0 auto 16px'
          }}>B</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800 }}>BOOKIT</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>Movies, Events & Concerts</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(232,24,75,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 32
            }}>🔐</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
              Forgot Password?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 }}>
              Enter your email and we'll send you an OTP to reset your password.
            </p>
          </div>

          {error && (
            <div style={{
              background: 'var(--accent-dim)', border: '1px solid rgba(240,90,90,0.3)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px',
              color: 'var(--accent)', fontSize: 14, marginBottom: 20
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : '📨 Send OTP'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}