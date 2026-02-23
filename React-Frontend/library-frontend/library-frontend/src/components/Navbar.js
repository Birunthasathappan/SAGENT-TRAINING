import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navItems = {
  STUDENT: [
    { path: '/student/dashboard', label: '📚 Dashboard' },
    { path: '/student/books',     label: '🔍 Browse Books' },
    { path: '/student/borrows',   label: '📖 My Borrows' },
    { path: '/student/fines',     label: '💰 My Fines' },
    { path: '/student/notifications', label: '🔔 Notifications' },
  ],
  STAFF: [
    { path: '/staff/dashboard',   label: '📋 Dashboard' },
    { path: '/staff/books',       label: '📚 Books' },
    { path: '/staff/members',     label: '👥 Members' },
    { path: '/staff/borrows',     label: '🔄 Borrows' },
    { path: '/staff/notifications', label: '🔔 Notifications' },
  ],
  LIBRARIAN: [
    { path: '/librarian/dashboard', label: '🏛️ Dashboard' },
    { path: '/librarian/books',     label: '📚 Manage Books' },
    { path: '/librarian/members',   label: '👥 Members' },
    { path: '/librarian/borrows',   label: '🔄 Borrows' },
    { path: '/librarian/fines',     label: '💰 Fines' },
    { path: '/librarian/notifications', label: '🔔 Notify' },
  ],
};

const roleColors = {
  STUDENT: '#4a6741',
  STAFF:   '#1e40af',
  LIBRARIAN: '#7c2d12',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const items = navItems[user.role] || [];
  const roleColor = roleColors[user.role] || '#c9922a';
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">⚜️</span>
        <span className="navbar-title">LibraVault</span>
        <span className="navbar-role-badge" style={{ background: roleColor }}>
          {user.role}
        </span>
      </div>

      <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {items.map(item => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-profile">
        <button
          className="profile-avatar"
          style={{ background: roleColor }}
          onClick={() => setProfileOpen(!profileOpen)}
        >
          {initials}
        </button>
        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <div className="profile-avatar-lg" style={{ background: roleColor }}>{initials}</div>
              <div>
                <div className="profile-name">{user.name}</div>
                <div className="profile-email">{user.email}</div>
                <span className="badge" style={{ background: roleColor, color: '#fff', marginTop: 4 }}>
                  {user.role}
                </span>
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
            <div className="profile-meta">
              <span>🆔 Library ID: <strong>{user.id || 'N/A'}</strong></span>
              {user.libraryId && <span>📋 {user.libraryId}</span>}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
            <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
