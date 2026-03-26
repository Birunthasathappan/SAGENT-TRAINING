import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { bookingsAPI, paymentsAPI, cancellationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function UserProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, payments: 0, cancellations: 0, spent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingsAPI.getByUser(user.userId),
      paymentsAPI.getByUser(user.userId),
      cancellationsAPI.getByUser(user.userId),
    ]).then(([bookings, payments, cancellations]) => {
      const spent = payments
        .filter(p => p.status === 'SUCCESS')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      setStats({ bookings: bookings.length, payments: payments.length, cancellations: cancellations.length, spent });
    }).finally(() => setLoading(false));
  }, [user.userId]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', maxWidth: 760, margin: '0 auto', padding: 'calc(var(--nav-height) + 32px) 32px 48px' }}>

        {/* Profile Header */}
        <div className="card" style={{ padding: 32, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8005a, #c2185b)',  /* pink gradient — was orange (var(--primary)) */
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: '#ffffff',  /* white text */
            flexShrink: 0
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
              {user?.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>{user?.email}</p>
            <span className="badge badge-info">{user?.role}</span>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex-center" style={{ padding: '40px 0' }}><div className="spinner" /></div>
        ) : (
          <div className="grid grid-2" style={{ marginBottom: 24 }}>
            {[
              { label: 'Total Bookings', value: stats.bookings, icon: '🎟️', color: 'gold' },
              { label: 'Total Spent', value: `₹${stats.spent.toFixed(0)}`, icon: '💰', color: 'green' },
              { label: 'Payments Made', value: stats.payments, icon: '💳', color: 'teal' },
              { label: 'Cancellations', value: stats.cancellations, icon: '❌', color: 'red' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className={`stat-card ${color}`}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Account Details */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 20 }}>Account Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email Address', value: user?.email },
              { label: 'User ID', value: `#${user?.userId}` },
              { label: 'Account Type', value: user?.role },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}