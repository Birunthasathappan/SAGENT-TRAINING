import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

export default function BookingConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { payment, selectedSeats = [], totalCost = 0, screening, event, venue } = state || {};

  return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '32px' }}>
        <div style={{ maxWidth: 520, width: '100%' }}>

          {/* Success Animation */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(76,175,130,0.15)', border: '3px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 36
            }}>✅</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: 'var(--success)', marginBottom: 8 }}>
              Booking Confirmed!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Your tickets have been booked successfully. A confirmation email has been sent.
            </p>
          </div>

          {/* Ticket Card */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden'
          }}>
            {/* Ticket Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(232,184,75,0.15), rgba(77,217,192,0.08))',
              padding: '24px', borderBottom: '2px dashed var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>{event?.title}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                    {event?.category} · {event?.language}
                  </p>
                </div>
                <span className="badge badge-success">CONFIRMED</span>
              </div>
            </div>

            {/* Ticket Body */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {[
                  { label: '📍 Venue', value: venue?.venueName || '—' },
                  { label: '🗺 Location', value: venue ? `${venue.district}, ${venue.region}` : '—' },
                  { label: '📅 Date', value: screening?.screenDate || '—' },
                  { label: '⏰ Time', value: screening?.startTime || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Seats */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>💺 Seats</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selectedSeats.map(s => (
                    <div key={s.screeningSeatsId} style={{
                      padding: '4px 12px', borderRadius: 6,
                      background: 'var(--primary-dim)', border: '1px solid rgba(232,184,75,0.3)',
                      fontSize: 13, fontWeight: 700, color: 'var(--primary)'
                    }}>
                      {s.seat?.seatNo}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

              {/* Payment info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Payment Ref</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--teal)' }}>
                    {payment?.referenceCode || '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Amount Paid</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{Number(totalCost).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>
              View My Bookings
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Browse More Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
