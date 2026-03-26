import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { eventsAPI, screeningsAPI, venuesAPI } from '../../services/api';

const statusColors = { UPCOMING: 'badge-info', ONGOING: 'badge-success', COMPLETED: 'badge-neutral', CANCELLED: 'badge-error' };
const screeningStatusColors = { ACTIVE: 'badge-success', CANCELLED: 'badge-error', COMPLETED: 'badge-neutral' };

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [venues, setVenues] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('All');

  useEffect(() => {
    Promise.all([eventsAPI.getById(id), screeningsAPI.getByEvent(id), venuesAPI.getAll()])
      .then(([ev, scrs, vens]) => {
        setEvent(ev);
        setScreenings(scrs);
        const vmap = {};
        vens.forEach(v => { vmap[v.venueId] = v; });
        setVenues(vmap);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const dates = ['All', ...new Set(screenings.map(s => s.screenDate))].sort();
  const filtered = selectedDate === 'All' ? screenings : screenings.filter(s => s.screenDate === selectedDate);
  const active = filtered.filter(s => s.status === 'ACTIVE');

  if (loading) return (
    <div className="page-wrapper"><Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  if (!event) return (
    <div className="page-wrapper"><Navbar />
      <div style={{ paddingTop: 'var(--nav-height)', padding: '80px 32px' }} className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h3>Event not found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-height)' }}>

        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(232,184,75,0.1) 0%, rgba(10,10,15,0) 60%)',
          borderBottom: '1px solid var(--border)', padding: '40px 32px'
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}
              style={{ marginBottom: 20 }}>← Back</button>

            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {/* Poster */}
              <div style={{
                width: 200, height: 280, flexShrink: 0, borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 72, border: '1px solid var(--border)'
              }}>
                {event.category === 'Movie' ? '🎬' : event.category === 'Concert' ? '🎵' : '🎭'}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span className={`badge ${statusColors[event.showStatus] || 'badge-neutral'}`}>
                    {event.showStatus}
                  </span>
                  {event.tag && <span className="tag">{event.tag}</span>}
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
                  {event.title}
                </h1>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                  {[
                    { label: '📁 Category', value: event.category },
                    { label: '🎵 Genre', value: event.genre },
                    { label: '🗣 Language', value: event.language },
                    { label: '⏱ Duration', value: `${event.duration} min` },
                  ].map(({ label, value }) => value && (
                    <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {event.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 600 }}>
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Screenings */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 20 }}>
            Book Tickets
          </h2>

          {/* Date filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {dates.map(date => (
              <button key={date} className={`filter-chip ${selectedDate === date ? 'active' : ''}`}
                onClick={() => setSelectedDate(date)}>
                {date === 'All' ? '📅 All Dates' : new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎬</div>
              <h3>No screenings available</h3>
              <p style={{ fontSize: 14 }}>No shows scheduled for this date</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map(s => {
                const venue = venues[s.venue?.venueId];
                const isBookable = s.status === 'ACTIVE' && (s.remainingSeats > 0);
                return (
                  <div key={s.screeningId} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>
                            {s.startTime}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Ends {s.endTime}
                          </div>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{venue?.venueName || 'Unknown Venue'}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            📍 {venue?.district}, {venue?.region}
                          </div>
                        </div>
                        <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: s.remainingSeats > 10 ? 'var(--success)' : s.remainingSeats > 0 ? 'var(--warning)' : 'var(--accent)' }}>
                            {s.remainingSeats > 0 ? `${s.remainingSeats} seats left` : 'Housefull'}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {new Date(s.screenDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <span className={`badge ${screeningStatusColors[s.status] || 'badge-neutral'}`}>
                          {s.status}
                        </span>
                      </div>

                      <button
                        className={`btn ${isBookable ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => isBookable && navigate(`/event/${id}/screening/${s.screeningId}/seats`)}
                        disabled={!isBookable}
                      >
                        {s.status === 'CANCELLED' ? 'Cancelled' : s.remainingSeats === 0 ? 'Housefull' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
