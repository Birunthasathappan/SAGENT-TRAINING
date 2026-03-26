import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Password reset success message
  const resetSuccess = location.state?.resetSuccess;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await authAPI.login(form);
      login(data.token, data.user);
      navigate(data.user.role === 'USER' ? '/' : '/admin');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
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
      <div style={{
        position: 'absolute', bottom: -200, left: -200,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(77,217,192,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--primary)', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
            color: 'var(--bg)', margin: '0 auto 16px'
          }}>B</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>
            BOOKIT
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>
            Movies, Events & Concerts
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
            Sign in to your account
          </p>

          {/* ✅ Password Reset Success Message */}
          {resetSuccess && (
            <div style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px',
              color: '#22c55e', fontSize: 14, marginBottom: 20
            }}>✅ Password reset successful! Please login.</div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'var(--accent-dim)', border: '1px solid rgba(240,90,90,0.3)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px',
              color: 'var(--accent)', fontSize: 14, marginBottom: 20
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="form-group">
              {/* ✅ Forgot Password link */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
              <input className="form-input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>

            <button type="submit" className="btn btn-primary btn-lg"
              style={{ marginTop: 8, width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}