import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputs = useRef([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t > 0 ? t - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpStr = otp.join('');
    if (otpStr.length < 6) return setError('Please enter all 6 digits');
    setLoading(true);
    setError('');
    try {
      await authAPI.verifyOtp({ email, otp: otpStr });
      navigate('/reset-password', { state: { email, otp: otpStr } });
    } catch (err) {
      setError(err.message);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setTimer(300);
      setOtp(['', '', '', '', '', '']);
      setResendSuccess(true);
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

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

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--primary)', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
            color: 'var(--bg)', margin: '0 auto 16px'
          }}>B</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>
            Check your email
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 14 }}>
            OTP sent to <strong style={{ color: 'var(--text)' }}>{email}</strong>
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>

          {error && (
            <div style={{
              background: 'var(--accent-dim)', border: '1px solid rgba(240,90,90,0.3)',
              borderRadius: 8, padding: '12px 16px',
              color: 'var(--accent)', fontSize: 14, marginBottom: 20
            }}>{error}</div>
          )}

          {resendSuccess && (
            <div style={{
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 8, padding: '12px 16px',
              color: '#22c55e', fontSize: 14, marginBottom: 20
            }}>✅ New OTP sent to your email!</div>
          )}

          {/* OTP Boxes */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                maxLength={1}
                inputMode="numeric"
                style={{
                  width: 48, height: 56,
                  textAlign: 'center',
                  fontSize: 24, fontWeight: 700,
                  border: `2px solid ${digit ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 12,
                  background: digit ? 'rgba(232,24,75,0.05)' : 'var(--card)',
                  color: 'var(--text)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  cursor: 'text'
                }}
              />
            ))}
          </div>

          {/* Timer */}
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
            {timer > 0 ? (
              <>OTP expires in{' '}
                <strong style={{ color: timer < 60 ? '#f59e0b' : 'var(--primary)' }}>
                  {formatTime(timer)}
                </strong>
              </>
            ) : (
              <span style={{ color: 'var(--accent)' }}>⚠️ OTP expired! Please resend.</span>
            )}
          </p>

          <button
            onClick={handleVerify}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
            disabled={loading || otp.join('').length < 6}
          >
            {loading ? 'Verifying...' : '✅ Verify OTP'}
          </button>

          <button
            onClick={handleResend}
            className="btn"
            style={{
              width: '100%', justifyContent: 'center',
              opacity: timer > 0 ? 0.5 : 1,
              cursor: timer > 0 ? 'not-allowed' : 'pointer',
              border: '1px solid var(--border)'
            }}
            disabled={resending || timer > 0}
          >
            {resending ? '⏳ Sending...' : '🔄 Resend OTP'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Wrong email?{' '}
            <span
              onClick={() => navigate('/forgot-password')}
              style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Go back
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}