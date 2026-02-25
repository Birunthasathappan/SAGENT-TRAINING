import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '⬡' },
    { path: '/income',    label: 'Income',    icon: '↑' },
    { path: '/expenses',  label: 'Expenses',  icon: '↓' },
    { path: '/budgets',   label: 'Budgets',   icon: '◈' },
    { path: '/goals',     label: 'Goals',     icon: '◎' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'linear-gradient(135deg, #0F2C4E 0%, #1A3F6F 60%, #0EA5A0 100%)',
      boxShadow: '0 2px 20px rgba(14,165,160,0.25)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/dashboard')} style={{
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0EA5A0, #6DD5D1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: '#fff', boxShadow: '0 2px 8px rgba(14,165,160,0.5)',
          }}>₹</div>
          <span style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18,
            color: '#fff', letterSpacing: '-0.02em',
          }}>Budget<span style={{ color: '#6DD5D1' }}>Tracker</span></span>
        </div>

        {/* Desktop Nav */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <button key={link.path} onClick={() => navigate(link.path)}
                  style={{
                    padding: '8px 16px', border: 'none', borderRadius: 8,
                    background: active ? 'rgba(110,213,209,0.2)' : 'transparent',
                    color: active ? '#6DD5D1' : 'rgba(255,255,255,0.75)',
                    fontSize: 14, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                    borderBottom: active ? '2px solid #6DD5D1' : '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) { e.target.style.color = '#fff'; e.target.style.background = 'rgba(255,255,255,0.08)'; } }}
                  onMouseLeave={e => { if (!active) { e.target.style.color = 'rgba(255,255,255,0.75)'; e.target.style.background = 'transparent'; } }}
                >{link.label}</button>
              );
            })}
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 20,
              background: 'rgba(255,255,255,0.08)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0EA5A0, #6DD5D1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 13,
              }}>{user.name?.charAt(0)?.toUpperCase()}</div>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout}
              style={{
                marginLeft: 4, padding: '8px 16px',
                border: '1.5px solid rgba(110,213,209,0.5)',
                borderRadius: 8, background: 'transparent',
                color: '#6DD5D1', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(110,213,209,0.15)'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; }}
            >Logout</button>
          </div>
        )}

        {!user && (
          <div style={{ display: 'flex', gap: 8 }}>
            {[{l:'Login',p:'/login'},{l:'Register',p:'/register'}].map(b => (
              <button key={b.p} onClick={() => navigate(b.p)}
                style={{
                  padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                  border: b.p === '/login' ? 'none' : '1.5px solid rgba(110,213,209,0.5)',
                  background: b.p === '/login' ? 'rgba(14,165,160,0.9)' : 'transparent',
                  color: '#fff',
                }}
              >{b.l}</button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
