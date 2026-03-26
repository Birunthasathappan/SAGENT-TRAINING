import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ 
    name: '', email: '', password: '', phoneNo: '', role: 'USER' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess('');
    setLoading(true);
    try {
      await authAPI.register(form);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500); // 1.5s delay show message
    } catch (err) {
      setError(err.message);
    } finally { 
      setLoading(false); 
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: -200, left: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,184,75,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--primary)', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
            color: 'var(--bg)', margin: '0 auto 16px'
          }}>B</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800 }}>BOOKIT</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>
            Movies, Events & Concerts
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
            Create account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
            Join us to start booking
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'var(--accent-dim)', 
              border: '1px solid rgba(240,90,90,0.3)',
              borderRadius: 'var(--radius-sm)', 
              padding: '12px 16px',
              color: 'var(--accent)', 
              fontSize: 14, 
              marginBottom: 20
            }}>{error}</div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              background: 'rgba(34,197,94,0.1)', 
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 'var(--radius-sm)', 
              padding: '12px 16px',
              color: '#22c55e', 
              fontSize: 14, 
              marginBottom: 20
            }}>✅ {success}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="John Doe"
                value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" placeholder="10-digit number"
                value={form.phoneNo} onChange={e => set('phoneNo', e.target.value)}
                maxLength={10} pattern="[0-9]{10}" />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={form.role} 
                onChange={e => set('role', e.target.value)}>
                <option value="USER">User — Browse & Book Events</option>
                <option value="ORGANIZER">Organizer — Manage Events</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              style={{ marginTop: 8, width: '100%', justifyContent: 'center' }} 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}