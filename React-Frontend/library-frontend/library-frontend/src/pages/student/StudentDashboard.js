import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBooks, getBorrows, getFines, getNotifications } from '../../api';
import './Dashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ books: 0, borrows: 0, fines: 0, notifications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getBooks(), getBorrows(), getFines(), getNotifications()])
      .then(([b, br, f, n]) => {
        setStats({
          books: b.status === 'fulfilled' ? b.value.data.length : 0,
          borrows: br.status === 'fulfilled' ? br.value.data.filter(bw => bw.memberId === user.id || !bw.returned).length : 0,
          fines: f.status === 'fulfilled' ? f.value.data.filter(fn => !fn.paid).length : 0,
          notifications: n.status === 'fulfilled' ? n.value.data.length : 0,
        });
        setLoading(false);
      });
  }, [user.id]);

  const cards = [
    { icon: '📚', label: 'Available Books', value: stats.books, color: '#4a6741', bg: '#f0fdf4' },
    { icon: '📖', label: 'Active Borrows', value: stats.borrows, color: '#1e40af', bg: '#eff6ff' },
    { icon: '💰', label: 'Pending Fines', value: stats.fines, color: '#b45309', bg: '#fffbeb' },
    { icon: '🔔', label: 'Notifications', value: stats.notifications, color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div className="dashboard fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, <span>{user.name?.split(' ')[0]}</span> 👋</h1>
          <p className="dashboard-subtitle">Here's an overview of your library activity</p>
        </div>
        <div className="dashboard-badge student-badge">🎓 Student</div>
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
          <h3>📋 Quick Guide</h3>
          <ul className="guide-list">
            <li>📚 Go to <strong>Browse Books</strong> to search and request books</li>
            <li>📖 View <strong>My Borrows</strong> to track your currently borrowed books</li>
            <li>💰 Check <strong>My Fines</strong> to pay any overdue fines</li>
            <li>🔔 See <strong>Notifications</strong> for due-date reminders</li>
          </ul>
        </div>
        <div className="card dash-card">
          <h3>📌 Your Profile</h3>
          <div className="profile-display">
            <div className="profile-display-avatar" style={{ background: '#4a6741' }}>
              {user.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user.email}</div>
              <span className="badge badge-green" style={{ marginTop: 6, display: 'inline-block' }}>🎓 Student</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
