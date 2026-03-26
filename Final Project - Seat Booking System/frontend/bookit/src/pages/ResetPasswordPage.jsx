import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const otp = state?.otp;

  useEffect(() => {
    if (!email || !otp) navigate('/forgot-password');
  }, [email, otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) return setError('Password must be at least 6 characters!');
    if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match!');
    setError('');
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp, newPassword: form.newPassword });
      navigate('/login', { state: { resetSuccess: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Too short', color: '#ef4444', width: '20%' };
    if (pwd.length < 8) return { label: 'Weak', color: '#f59e0b', width: '40%' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: 'Medium', color: '#3b82f6', width: '65%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };

  const pwdStrength = strength(form.newPassword);

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', bottom: -200, right: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(77,217,192,0.05) 0%, transparent 70%)',
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
            }}>🔑</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
              Reset Password
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Create a strong new password for your account
            </p>
          </div>

          {error && (
            <div style={{
              background: 'var(--accent-dim)', border: '1px solid rgba(240,90,90,0.3)',
              borderRadius: 8, padding: '12px 16px',
              color: 'var(--accent)', fontSize: 14, marginBottom: 20
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showNew ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.newPassword}
                  onChange={e => setForm({ ...form, newPassword: e.target.value })}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)'
                  }}>
                  {showNew ? '🙈' : '👁️'}
                </button>
              </div>

              {pwdStrength && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: pwdStrength.width,
                      background: pwdStrength.color,
                      borderRadius: 4, transition: 'all 0.3s'
                    }} />
                  </div>
                  <p style={{ fontSize: 12, marginTop: 4, color: pwdStrength.color, fontWeight: 500 }}>
                    {pwdStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)'
                  }}>
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>

              {form.confirmPassword && (
                <p style={{
                  fontSize: 12, marginTop: 4, fontWeight: 500,
                  color: form.newPassword === form.confirmPassword ? '#22c55e' : '#ef4444'
                }}>
                  {form.newPassword === form.confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : '🔐 Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}