import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBooks, getMembers, getBorrows, getFines } from '../../api';
import '../student/Dashboard.css';

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ books: 0, members: 0, activeBorrows: 0, unpaidFines: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getBooks(), getMembers(), getBorrows(), getFines()])
      .then(([b, m, br, f]) => {
        setStats({
          books: b.status === 'fulfilled' ? b.value.data.length : 0,
          members: m.status === 'fulfilled' ? m.value.data.length : 0,
          activeBorrows: br.status === 'fulfilled' ? br.value.data.filter(x => !x.returned).length : 0,
          unpaidFines: f.status === 'fulfilled' ? f.value.data.filter(x => !x.paid).length : 0,
        });
        setLoading(false);
      });
  }, []);

  const cards = [
    { icon: '📚', label: 'Books in Catalog', value: stats.books, color: '#7c2d12', bg: '#fff7ed' },
    { icon: '👥', label: 'Registered Members', value: stats.members, color: '#4a6741', bg: '#f0fdf4' },
    { icon: '⏳', label: 'Active Borrows', value: stats.activeBorrows, color: '#1e40af', bg: '#eff6ff' },
    { icon: '💰', label: 'Unpaid Fines', value: stats.unpaidFines, color: '#dc2626', bg: '#fef2f2' },
  ];

  return (
    <div className="dashboard fade-up">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">🏛️ Librarian Control Panel</h1>
          <p className="dashboard-subtitle">Welcome, {user.name} — full administrative access</p>
        </div>
        <div className="dashboard-badge librarian-badge">🏛️ Librarian</div>
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
          <h3>⚙️ Admin Capabilities</h3>
          <ul className="guide-list">
            <li>📚 <strong>Manage Books</strong> — add, view, and delete books</li>
            <li>👥 <strong>Members</strong> — register and manage all members</li>
            <li>🔄 <strong>Borrows</strong> — issue books and process returns</li>
            <li>💰 <strong>Fines</strong> — track and manage all overdue fines</li>
            <li>🔔 <strong>Notify</strong> — send notifications to members</li>
          </ul>
        </div>
        <div className="card dash-card">
          <h3>📌 Your Profile</h3>
          <div className="profile-display">
            <div className="profile-display-avatar" style={{ background: '#7c2d12' }}>
              {user.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user.email}</div>
              <span className="badge badge-red" style={{ marginTop: 6, display: 'inline-block' }}>🏛️ Librarian</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
