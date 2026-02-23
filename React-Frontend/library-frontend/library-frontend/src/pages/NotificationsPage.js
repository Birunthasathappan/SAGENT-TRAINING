import React, { useEffect, useState } from 'react';
import { getNotifications } from '../api';
import './student/Dashboard.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(r => { setNotifications(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard fade-up">
      <div className="page-header">
        <h1 className="page-title">🔔 Notifications</h1>
      </div>
      <div className="card table-card">
        {loading ? <div className="spinner" /> : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔕</div>
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            {notifications.map((n, i) => (
              <div key={n.id || i} style={{
                padding: '14px 16px',
                background: 'var(--parchment)',
                borderRadius: '8px',
                marginBottom: '10px',
                borderLeft: '4px solid var(--gold)',
                fontSize: '0.9rem',
              }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>🔔 Notification #{i + 1}</div>
                <div style={{ color: 'var(--muted)' }}>{n.message || n.content || 'No message content'}</div>
                {n.createdAt && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6 }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}