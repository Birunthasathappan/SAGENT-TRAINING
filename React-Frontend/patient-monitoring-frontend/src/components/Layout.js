import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: '⊞', label: 'Dashboard' },
  { path: '/patients', icon: '👤', label: 'Patients' },
  { path: '/doctors', icon: '🩺', label: 'Doctors' },
  { path: '/appointments', icon: '📅', label: 'Appointments' },
  { path: '/consultations', icon: '💬', label: 'Consultations' },
  { path: '/readings', icon: '📊', label: 'Daily Readings' },
  { path: '/health-data', icon: '🗂️', label: 'Health Data' },
  { path: '/messages', icon: '✉️', label: 'Messages' },
  { path: '/reports', icon: '📋', label: 'Reports' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U';

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>MediMonitor</h1>
          <span>Patient Monitoring System</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role || 'user'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>⬡</span> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
