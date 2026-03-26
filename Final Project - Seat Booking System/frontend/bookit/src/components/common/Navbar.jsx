import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { alertsAPI } from '../../services/api';

// ✅ Pink theme tokens — replaces var(--primary) orange everywhere
const PINK       = '#ec4899';
const PINK2      = '#db2777';
const PINK_DIM   = 'rgba(236,72,153,0.10)';
const PINK_GLOW  = 'rgba(236,72,153,0.20)';
const PINK_BORD  = 'rgba(236,72,153,0.22)';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      alertsAPI.countUnread(user.userId).then(setUnreadCount).catch(() => {});
      const interval = setInterval(() => {
        alertsAPI.countUnread(user.userId).then(setUnreadCount).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--nav-height)',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1.5px solid ${PINK_BORD}`,
      zIndex: 100,
      display: 'flex', alignItems: 'center', padding: '0 28px', gap: '32px',
      boxShadow: `0 1px 12px ${PINK_GLOW}`,
    }}>

      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{
          width: 34, height: 34,
          background: `linear-gradient(135deg, ${PINK}, ${PINK2})`, // ✅ pink gradient — was var(--primary) orange
          borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff',
          fontFamily: 'var(--font-display)',
          boxShadow: `0 2px 8px ${PINK_GLOW}`,
        }}>B</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          BOOKIT
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
        {[
          { path: '/', label: 'Discover' },
          { path: '/my-bookings', label: 'My Bookings' },
        ].map(({ path, label }) => (
          <Link key={path} to={path} style={{
            padding: '7px 16px', borderRadius: 'var(--radius-sm)',
            fontSize: 14, fontWeight: isActive(path) ? 600 : 500,
            color: isActive(path) ? PINK2 : 'var(--text-muted)',           // ✅ pink — was var(--primary)
            background: isActive(path) ? PINK_DIM : 'transparent',         // ✅ pink dim — was var(--primary-dim)
            border: isActive(path) ? `1.5px solid ${PINK_BORD}` : '1.5px solid transparent', // ✅ pink border
            transition: 'all 0.2s', textDecoration: 'none',
          }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Notifications */}
        <Link to="/notifications" style={{
          position: 'relative', width: 40, height: 40, borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isActive('/notifications') ? PINK_DIM : 'var(--bg-elevated)',       // ✅ pink dim
          border: '1.5px solid',
          borderColor: isActive('/notifications') ? PINK_BORD : 'var(--border)',           // ✅ pink border
          color: isActive('/notifications') ? PINK2 : 'var(--text-muted)',                 // ✅ pink
          transition: 'all 0.2s', textDecoration: 'none', fontSize: 17,
        }}>
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 3, right: 3,
              width: 17, height: 17, borderRadius: '50%',
              background: PINK,          // ✅ pink badge — was var(--accent) orange
              color: 'white',
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff',
            }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </Link>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px 6px 6px',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${PINK_BORD}`,   // ✅ pink border
            background: '#fff',
            color: 'var(--text)', cursor: 'pointer',
            fontSize: 14, fontFamily: 'var(--font-body)',
            boxShadow: `0 1px 4px ${PINK_GLOW}`,  // ✅ pink glow
            transition: 'all 0.2s',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: `linear-gradient(135deg, ${PINK}, ${PINK2})`, // ✅ pink — was var(--primary)
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>▼</span>
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff',
              border: `1.5px solid ${PINK_BORD}`,  // ✅ pink border
              borderRadius: 'var(--radius)',
              padding: '6px',
              minWidth: 170,
              boxShadow: `0 8px 32px ${PINK_GLOW}`, // ✅ pink shadow
              zIndex: 200,
            }}>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)', fontSize: 14,
                transition: 'all 0.15s', textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = PINK_DIM; e.currentTarget.style.color = PINK2; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                👤 Profile
              </Link>
              <div style={{ height: 1, background: PINK_BORD, margin: '4px 0' }} />
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', textAlign: 'left',
                padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                color: 'var(--accent)', fontSize: 14,
                background: 'none', border: 'none', cursor: 'pointer',
                transition: 'all 0.15s', fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
}