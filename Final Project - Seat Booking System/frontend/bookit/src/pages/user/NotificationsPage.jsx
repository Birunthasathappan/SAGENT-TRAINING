import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { alertsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const typeIcons = {
  BOOKING_CONFIRMATION: '🎟️',
  CANCELLATION: '❌',
  PAYMENT: '💳',
  REMINDER: '⏰',
  UPDATE: '📢',
  default: '🔔'
};

const typeColors = {
  BOOKING_CONFIRMATION: 'var(--success)',
  CANCELLATION: 'var(--accent)',
  PAYMENT: 'var(--primary)',
  REMINDER: 'var(--teal)',
  UPDATE: 'var(--text-muted)',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchAlerts = () => {
    alertsAPI.getByUser(user.userId)
      .then(data => setAlerts(data.sort((a, b) => b.alertId - a.alertId)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlerts(); }, [user.userId]);

  const handleMarkRead = async (alertId) => {
    await alertsAPI.markAsRead(alertId);
    setAlerts(prev => prev.map(a => a.alertId === alertId ? { ...a, isRead: true } : a));
  };

  const handleMarkAllRead = async () => {
    await alertsAPI.markAllAsRead(user.userId);
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const handleDelete = async (alertId) => {
    await alertsAPI.delete(alertId);
    setAlerts(prev => prev.filter(a => a.alertId !== alertId));
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const filtered = filter === 'All' ? alerts
    : filter === 'Unread' ? alerts.filter(a => !a.isRead)
    : alerts.filter(a => a.type === filter);

  const types = ['All', 'Unread', ...new Set(alerts.map(a => a.type).filter(Boolean))];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', maxWidth: 760, margin: '0 auto', padding: 'calc(var(--nav-height) + 32px) 32px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 4 }}>Notifications</h1>
            {unreadCount > 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                You have <strong style={{ color: 'var(--primary)' }}>{unreadCount} unread</strong> notification{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
              ✓ Mark all as read
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {types.map(t => (
            <button key={t} className={`filter-chip ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}>
              {t !== 'All' && t !== 'Unread' && <span>{typeIcons[t] || typeIcons.default}</span>}
              {t === 'Unread' && unreadCount > 0 && (
                <span style={{
                  background: 'var(--accent)', color: 'white',
                  borderRadius: '50%', width: 18, height: 18,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700
                }}>{unreadCount}</span>
              )}
              {t}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex-center" style={{ padding: '80px 0' }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>All caught up!</h3>
            <p style={{ fontSize: 14 }}>No notifications to show</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(alert => (
              <div key={alert.alertId}
                className={`notif-item ${!alert.isRead ? 'unread' : ''}`}
                onClick={() => !alert.isRead && handleMarkRead(alert.alertId)}>

                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: `${typeColors[alert.type] || 'var(--text-muted)'}20`,
                  border: `1.5px solid ${typeColors[alert.type] || 'var(--border)'}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20
                }}>
                  {typeIcons[alert.type] || typeIcons.default}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                        letterSpacing: '0.05em', marginBottom: 4,
                        color: typeColors[alert.type] || 'var(--text-muted)'
                      }}>
                        {alert.type?.replace(/_/g, ' ') || 'Notification'}
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                        {alert.message}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {!alert.isRead && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(alert.alertId); }}
                        style={{
                          background: 'none', border: 'none', color: 'var(--text-dim)',
                          cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 4px',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                        title="Delete"
                      >×</button>
                    </div>
                  </div>

                  {alert.booking?.bookingId && (
                    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                      Booking #{alert.booking.bookingId}
                      {alert.booking.refCode && ` · ${alert.booking.refCode}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
