import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBooks, getMembers, getBorrows } from '../../api';
import '../student/Dashboard.css';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ books: 0, members: 0, borrows: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getBooks(), getMembers(), getBorrows()])
      .then(([b, m, br]) => {
        const borrows = br.status === 'fulfilled' ? br.value.data : [];
        setStats({
          books: b.status === 'fulfilled' ? b.value.data.length : 0,
          members: m.status === 'fulfilled' ? m.value.data.length : 0,
          borrows: borrows.length,
          active: borrows.filter(bw => !bw.returned).length,
        });
        setLoading(false);
      });
  }, []);

  const cards = [
    { icon: '📚', label: 'Total Books',   value: stats.books,   color: '#4a6741', bg: '#f0fdf4' },
    { icon: '👥', label: 'Total Members', value: stats.members, color: '#1e40af', bg: '#eff6ff' },
    { icon: '🔄', label: 'Total Borrows', value: stats.borrows, color: '#7c2d12', bg: '#fff7ed' },
    { icon: '⏳', label: 'Active Borrows',value: stats.active,  color: '#b45309', bg: '#fffbeb' },
  ];

  return (
    <div className="dashboard fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Staff Dashboard <span>📋</span></h1>
          <p className="dashboard-subtitle">Hello {user.name} — manage members, books and borrows</p>
        </div>
        <div className="dashboard-badge staff-badge">🏢 Staff</div>
      </div>
      {loading ? <div className="spinner" /> : (
        <div className="stat-grid">
          {cards.map(c => (
            <div key={c.label} className="stat-card card" style={{ background: c.bg, borderColor: c.color + '30' }}>
              <div className="stat-icon" style={{ background: c.color + '15', color: c.color }}>{c.icon}</div>
              <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="dashboard-grid">
        <div className="card dash-card">
          <h3>🛠️ Staff Responsibilities</h3>
          <ul className="guide-list">
            <li>📚 <strong>Books</strong> — view and search the entire book catalog</li>
            <li>👥 <strong>Members</strong> — view all registered library members</li>
            <li>🔄 <strong>Borrows</strong> — track all borrow and return activities</li>
            <li>🔔 <strong>Notifications</strong> — view all system notifications</li>
          </ul>
        </div>
        <div className="card dash-card">
          <h3>📌 Your Profile</h3>
          <div className="profile-display">
            <div className="profile-display-avatar" style={{ background: '#1e40af' }}>
              {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user.email}</div>
              <span className="badge badge-blue" style={{ marginTop: 6, display: 'inline-block' }}>🏢 Staff</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}