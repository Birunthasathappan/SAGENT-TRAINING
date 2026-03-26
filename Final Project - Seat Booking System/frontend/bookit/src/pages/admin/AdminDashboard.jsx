import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/common/AdminSidebar';
import { eventsAPI, bookingsAPI, paymentsAPI, usersAPI, screeningsAPI, cancellationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .pk {
    --pink:        #f472b6;
    --pink2:       #ec4899;
    --pink3:       #fbcfe8;
    --pink4:       #fdf2f8;
    --pink5:       #fce7f3;
    --pink-glow:   rgba(244,114,182,0.20);
    --pink-border: rgba(244,114,182,0.28);
    --pink-mid:    rgba(244,114,182,0.12);

    --rose:        #fb7185;
    --rose2:       #fda4af;
    --mauve:       #c084fc;
    --lavender:    #a78bfa;
    --teal:        #2dd4bf;
    --green:       #4ade80;
    --amber:       #fbbf24;
    --red:         #f87171;

    --bg:          #fff5fb;
    --card:        #ffffff;
    --card2:       #fff9fd;

    --border:      #fce7f3;
    --border2:     rgba(244,114,182,0.22);

    --ink:         #1e0a17;
    --ink2:        #6b3a54;
    --ink3:        #a87090;
    --ink4:        #d4a8be;

    --sh:    0 1px 4px rgba(30,10,23,0.06), 0 0 0 1px rgba(244,114,182,0.07);
    --sh-up: 0 14px 44px rgba(244,114,182,0.16), 0 4px 12px rgba(30,10,23,0.06);

    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  .pk * { box-sizing: border-box; margin: 0; padding: 0; }

  .pk-main {
    flex: 1;
    margin-left: var(--sidebar-width, 240px);
    min-height: 100vh;
    background: var(--bg);
    overflow-y: auto;
    position: relative;
  }

  .pk-blob1 {
    position: fixed; top: -120px; right: -80px;
    width: 460px; height: 460px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,114,182,0.10) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }
  .pk-blob2 {
    position: fixed; bottom: -100px; left: 60px;
    width: 380px; height: 380px; border-radius: 50%;
    background: radial-gradient(circle, rgba(192,132,252,0.07) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  .pk-inner { padding: 38px 36px 64px; position: relative; z-index: 1; }

  .pk-hero {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
    animation: pkUp 0.4s ease both;
  }

  .pk-hero-left { display: flex; align-items: center; gap: 18px; }

  .pk-av-wrap { position: relative; }

  .pk-av-ring {
    position: absolute; inset: -3px; border-radius: 20px;
    background: linear-gradient(135deg, var(--pink), var(--mauve), var(--rose));
    background-size: 200% 200%;
    animation: pkGrad 4s ease-in-out infinite;
    z-index: 0;
  }

  @keyframes pkGrad {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }

  .pk-av {
    position: relative; z-index: 1;
    width: 56px; height: 56px; border-radius: 17px;
    background: linear-gradient(135deg, var(--pink2), var(--mauve));
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 800; color: #fff;
    margin: 3px;
    box-shadow: 0 4px 16px var(--pink-glow);
    font-family: 'DM Sans', sans-serif;
  }

  .pk-greet-tag {
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.18em;
    color: var(--pink2); margin-bottom: 5px;
    display: flex; align-items: center; gap: 6px;
  }

  .pk-greet-tag::before { content: '✦'; font-size: 8px; color: var(--pink2); }

  .pk-greet-name {
    font-family: 'Playfair Display', serif;
    font-size: 30px; font-weight: 800;
    letter-spacing: -0.02em; line-height: 1;
    color: var(--ink);
  }

  .pk-greet-name em { font-style: italic; color: var(--pink2); }

  .pk-greet-sub { font-size: 13.5px; color: var(--ink3); margin-top: 6px; font-weight: 400; }

  .pk-date {
    background: var(--card);
    border: 1.5px solid var(--pink-border);
    border-radius: 18px;
    padding: 14px 22px; text-align: center;
    box-shadow: var(--sh), 0 0 0 5px var(--pink5);
  }

  .pk-date-num {
    font-family: 'Playfair Display', serif;
    font-size: 34px; font-weight: 800;
    color: var(--pink2); line-height: 1;
  }

  .pk-date-str {
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--ink3); margin-top: 4px;
  }

  .pk-bento {
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 14px;
    margin-bottom: 22px;
    animation: pkUp 0.45s 0.07s ease both;
  }

  .pk-stat-hero {
    grid-row: 1 / 3;
    background: linear-gradient(150deg, var(--pink2) 0%, #d946a8 40%, var(--mauve) 100%);
    border-radius: 22px; padding: 28px 26px;
    display: flex; flex-direction: column; justify-content: space-between;
    text-decoration: none; position: relative; overflow: hidden;
    box-shadow: 0 10px 40px rgba(236,72,153,0.28);
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;
  }

  .pk-stat-hero:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 22px 60px rgba(236,72,153,0.36);
  }

  .pk-stat-hero::before {
    content: '';
    position: absolute; bottom: -60px; right: -50px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,0.10); pointer-events: none;
  }

  .pk-stat-hero::after {
    content: '';
    position: absolute; top: -30px; right: 50px;
    width: 110px; height: 110px; border-radius: 50%;
    background: rgba(255,255,255,0.07); pointer-events: none;
  }

  .pk-stat-hero .deco-hearts {
    position: absolute; top: 18px; right: 20px;
    font-size: 28px; opacity: 0.18;
    animation: pkFloat 3s ease-in-out infinite;
  }

  @keyframes pkFloat {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }

  .pk-sh-tag {
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.14em;
    color: rgba(255,255,255,0.70);
    display: flex; align-items: center; gap: 8px;
  }

  .pk-sh-icon { font-size: 26px; }

  .pk-sh-val {
    font-family: 'Playfair Display', serif;
    font-size: 56px; font-weight: 800;
    color: #fff; letter-spacing: -2px;
    line-height: 0.95; margin: 14px 0 6px;
    position: relative; z-index: 1;
  }

  .pk-sh-sub {
    font-size: 12px; font-weight: 600;
    color: rgba(255,255,255,0.68);
    text-transform: uppercase; letter-spacing: 0.09em;
  }

  .pk-stat {
    background: var(--card);
    border-radius: 18px; padding: 20px 18px;
    text-decoration: none; display: block;
    border: 1.5px solid var(--border);
    box-shadow: var(--sh); position: relative; overflow: hidden;
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), border-color 0.2s, box-shadow 0.2s;
  }

  .pk-stat:hover { transform: translateY(-4px); box-shadow: var(--sh-up); }

  .pk-stat-ico {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 13px;
  }

  .pk-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 34px; font-weight: 800;
    letter-spacing: -1px; color: var(--ink);
    line-height: 1; margin-bottom: 4px;
  }

  .pk-stat-lbl {
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.11em;
    color: var(--ink3);
  }

  .pk-stat-line {
    position: absolute; bottom: 0; left: 0;
    height: 3px; width: 0%;
    border-radius: 0 3px 0 18px;
    transition: width 0.3s ease;
  }

  .pk-stat:hover .pk-stat-line { width: 100%; }

  .pk-bottom {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 18px;
    animation: pkUp 0.45s 0.13s ease both;
  }

  .pk-qa {
    background: var(--card); border-radius: 20px;
    border: 1.5px solid var(--border); box-shadow: var(--sh); overflow: hidden;
  }

  .pk-card-head {
    padding: 18px 20px 14px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
  }

  .pk-card-title {
    font-size: 12.5px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.13em; color: var(--ink);
    display: flex; align-items: center; gap: 8px;
  }

  .pk-title-gem {
    width: 10px; height: 10px;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    border-radius: 3px; transform: rotate(45deg);
    box-shadow: 0 0 8px var(--pink-glow);
  }

  .pk-qa-list { padding: 10px 12px; display: flex; flex-direction: column; gap: 7px; }

  .pk-qa-btn {
    text-decoration: none;
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px; border-radius: 13px;
    background: var(--card2); border: 1.5px solid var(--border);
    color: var(--ink2); font-size: 14px; font-weight: 600;
    transition: all 0.22s cubic-bezier(.34,1.56,.64,1);
    position: relative; overflow: hidden;
  }

  .pk-qa-btn::after {
    content: '→'; position: absolute; right: 14px;
    color: var(--pink2); font-size: 14px;
    opacity: 0; transform: translateX(-8px);
    transition: opacity 0.2s, transform 0.2s;
  }

  .pk-qa-btn:hover {
    background: var(--pink5); border-color: var(--pink-border);
    color: var(--pink2); transform: translateX(4px); padding-right: 34px;
  }

  .pk-qa-btn:hover::after { opacity: 1; transform: translateX(0); }
  .pk-qa-emoji { font-size: 20px; line-height: 1; }

  .pk-book {
    background: var(--card); border-radius: 20px;
    border: 1.5px solid var(--border); box-shadow: var(--sh); overflow: hidden;
  }

  .pk-book-head {
    padding: 18px 22px 14px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }

  .pk-viewall {
    text-decoration: none; font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px; font-weight: 600; color: var(--pink2);
    letter-spacing: 0.06em; padding: 5px 14px; border-radius: 99px;
    background: var(--pink5); border: 1.5px solid var(--pink-border);
    text-transform: uppercase; transition: all 0.15s;
  }

  .pk-viewall:hover {
    background: var(--pink3);
    box-shadow: 0 4px 14px var(--pink-glow); transform: translateY(-1px);
  }

  .pk-table { width: 100%; border-collapse: collapse; }
  .pk-table thead tr { border-bottom: 2px solid var(--border); }
  .pk-table th {
    text-align: left; padding: 10px 14px 12px;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink4);
  }
  .pk-table th:first-child { padding-left: 22px; }
  .pk-table tbody tr { border-bottom: 1px solid var(--border); transition: background 0.12s; }
  .pk-table tbody tr:last-child { border-bottom: none; }
  .pk-table tbody tr:hover { background: var(--pink4); }
  .pk-table td { padding: 13px 14px; font-size: 13px; color: var(--ink); vertical-align: middle; }
  .pk-table td:first-child { padding-left: 22px; }

  .pk-ref {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600;
    color: #0d9488; background: rgba(13,148,136,0.08);
    border: 1px solid rgba(13,148,136,0.18); padding: 4px 9px; border-radius: 6px;
  }

  .pk-amt { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: var(--pink2); }

  .pk-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 11px; border-radius: 99px;
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em;
  }

  .pk-pill::before { content: ''; width: 5px; height: 5px; border-radius: 50%; animation: pkBlink 2.5s ease-in-out infinite; }
  @keyframes pkBlink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

  .pc { background:rgba(74,222,128,0.10); color:#15803d; border:1px solid rgba(74,222,128,0.25); }
  .pc::before { background:#16a34a; }
  .pp { background:rgba(251,191,36,0.10); color:#b45309; border:1px solid rgba(251,191,36,0.25); }
  .pp::before { background:var(--amber); }
  .pr { background:rgba(248,113,113,0.10); color:#dc2626; border:1px solid rgba(248,113,113,0.25); }
  .pr::before { background:var(--red); }
  .pn { background:rgba(168,112,144,0.09); color:var(--ink3); border:1px solid rgba(168,112,144,0.18); }
  .pn::before { background:var(--ink3); }

  .pk-datemono { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink4); }
  .pk-empty { display:flex; flex-direction:column; align-items:center; padding:44px 0; gap:10px; }
  .pk-empty-icon { font-size:36px; opacity:0.3; }
  .pk-empty-txt { font-size:13px; color:var(--ink3); font-weight:500; }

  .pk-spin { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .pk-spinner {
    width:42px; height:42px; border:3px solid var(--pink5);
    border-top-color:var(--pink2); border-radius:50%;
    animation:pkSpin 0.75s linear infinite; box-shadow:0 0 18px var(--pink-glow);
  }

  @keyframes pkSpin  { to { transform:rotate(360deg); } }
  @keyframes pkUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

  @media (max-width:1100px) {
    .pk-bento { grid-template-columns:1fr 1fr; }
    .pk-stat-hero { grid-row:auto; }
    .pk-bottom { grid-template-columns:1fr; }
  }

  @media (max-width:768px) {
    .pk-inner { padding:22px 14px 48px; }
    .pk-bento { grid-template-columns:1fr 1fr; }
    .pk-greet-name { font-size:24px; }
  }
`;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ events:0, bookings:0, revenue:0, users:0, screenings:0, cancellations:0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ FIXED — Both ADMIN and ORGANIZER use getAll() for events
    // ORGANIZER: sees all events (platform-wide count)
    // ADMIN: sees all events + users
    const queries = user.role === 'ORGANIZER'
      ? [
          eventsAPI.getAll(),          // ✅ CHANGED: was getByOrganizer(user.userId) → now getAll()
          bookingsAPI.getAll(),
          paymentsAPI.getAll(),
          Promise.resolve([]),          // users — organizer can't see
          screeningsAPI.getAll(),
          cancellationsAPI.getAll(),
        ]
      : [
          eventsAPI.getAll(),
          bookingsAPI.getAll(),
          paymentsAPI.getAll(),
          usersAPI.getAll(),
          screeningsAPI.getAll(),
          cancellationsAPI.getAll(),
        ];

    Promise.all(queries).then(([events, bookings, payments, users, screenings, cancellations]) => {
      const revenue = payments
        .filter(p => p.status === 'SUCCESS')
        .reduce((s, p) => s + parseFloat(p.amount || 0), 0);
      setStats({
        events: events.length,
        bookings: bookings.length,
        revenue,
        users: users.length,
        screenings: screenings.length,
        cancellations: cancellations.length,
      });
      setRecentBookings(bookings.slice(-6).reverse());
    }).finally(() => setLoading(false));
  }, [user]);

  const gridStats = [
    { label:'Total Events',   value:stats.events,        icon:'🎭', accent:'#ec4899', bg:'rgba(236,72,153,0.09)',  link:'/admin/events' },
    { label:'Total Bookings', value:stats.bookings,      icon:'🎟️', accent:'#0d9488', bg:'rgba(13,148,136,0.09)', link:'/admin/analytics' },
    { label:'Screenings',     value:stats.screenings,    icon:'🎬', accent:'#7c3aed', bg:'rgba(124,58,237,0.09)', link:'/admin/screenings' },
    ...(user.role === 'ADMIN' ? [{ label:'Users', value:stats.users, icon:'👥', accent:'#0d9488', bg:'rgba(13,148,136,0.09)', link:'#' }] : []),
    { label:'Cancellations',  value:stats.cancellations, icon:'❌', accent:'#f87171', bg:'rgba(248,113,113,0.09)', link:'/admin/cancellations' },
  ];

  const quickActions = [
    { label:'Create Event',   icon:'🎭', link:'/admin/events' },
    { label:'Add Screening',  icon:'🎬', link:'/admin/screenings' },
    { label:'Manage Seats',   icon:'💺', link:'/admin/seats' },
    { label:'View Analytics', icon:'📈', link:'/admin/analytics' },
  ];

  const pillClass = s => ({ CONFIRMED:'pc', PENDING:'pp', CANCELLED:'pr' }[s] ?? 'pn');

  const now  = new Date();
  const day  = now.toLocaleDateString('en-IN', { day:'numeric' });
  const rest = now.toLocaleDateString('en-IN', { weekday:'short', month:'short', year:'numeric' });

  return (
    <div className="pk" style={{ display:'flex', minHeight:'100vh', background:'#fff5fb' }}>
      <style>{S}</style>
      <AdminSidebar />

      <main className="pk-main">
        <div className="pk-blob1" /><div className="pk-blob2" />

        <div className="pk-inner">

          {/* ── HERO ── */}
          <div className="pk-hero">
            <div className="pk-hero-left">
              <div className="pk-av-wrap">
                <div className="pk-av-ring" />
                <div className="pk-av">{user?.name?.[0]?.toUpperCase()}</div>
              </div>
              <div>
                <div className="pk-greet-tag">{user.role} DASHBOARD</div>
                <div className="pk-greet-name">
                  Welcome back, <em>{user?.name?.split(' ')[0]}</em>! 👋
                </div>
                <div className="pk-greet-sub">
                  Here's what's happening with your {user.role === 'ORGANIZER' ? 'events' : 'platform'} today.
                </div>
              </div>
            </div>
            <div className="pk-date">
              <div className="pk-date-num">{day}</div>
              <div className="pk-date-str">{rest}</div>
            </div>
          </div>

          {loading ? (
            <div className="pk-spin"><div className="pk-spinner" /></div>
          ) : (
            <>
              {/* ── BENTO ── */}
              <div className="pk-bento">
                <Link to="/admin/payments" className="pk-stat-hero">
                  <div className="deco-hearts">🌸</div>
                  <div className="pk-sh-tag">
                    <span className="pk-sh-icon">💰</span> Total Revenue
                  </div>
                  <div>
                    <div className="pk-sh-val">
                      ₹{stats.revenue.toLocaleString('en-IN', { maximumFractionDigits:0 })}
                    </div>
                    <div className="pk-sh-sub">Confirmed Payments</div>
                  </div>
                </Link>

                {gridStats.map(({ label, value, icon, accent, bg, link }) => (
                  <Link key={label} to={link} className="pk-stat"
                    onMouseEnter={e => e.currentTarget.style.borderColor = accent + '44'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                    <div className="pk-stat-ico" style={{ background: bg }}>{icon}</div>
                    <div className="pk-stat-val">{value}</div>
                    <div className="pk-stat-lbl">{label}</div>
                    <div className="pk-stat-line" style={{ background: `linear-gradient(90deg,${accent},${accent}66)` }} />
                  </Link>
                ))}
              </div>

              {/* ── BOTTOM ── */}
              <div className="pk-bottom">
                <div className="pk-qa">
                  <div className="pk-card-head">
                    <div className="pk-card-title">
                      <div className="pk-title-gem" /> Quick Actions
                    </div>
                  </div>
                  <div className="pk-qa-list">
                    {quickActions.map(({ label, icon, link }) => (
                      <Link key={label} to={link} className="pk-qa-btn">
                        <span className="pk-qa-emoji">{icon}</span>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pk-book">
                  <div className="pk-book-head">
                    <div className="pk-card-title">
                      <div className="pk-title-gem" /> Recent Bookings
                    </div>
                    <Link to="/admin/analytics" className="pk-viewall">View All →</Link>
                  </div>

                  {recentBookings.length === 0 ? (
                    <div className="pk-empty">
                      <div className="pk-empty-icon">🎟️</div>
                      <div className="pk-empty-txt">No bookings yet</div>
                    </div>
                  ) : (
                    <div style={{ overflowX:'auto' }}>
                      <table className="pk-table">
                        <thead>
                          <tr>
                            <th>Ref Code</th><th>User</th><th>Event</th>
                            <th>Amount</th><th>Status</th><th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map(b => (
                            <tr key={b.bookingId}>
                              <td><span className="pk-ref">{b.refCode}</span></td>
                              <td style={{ fontWeight:600 }}>{b.user?.name || `#${b.user?.userId}`}</td>
                              <td style={{ maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'var(--ink3)' }}>
                                {b.screening?.event?.title || '—'}
                              </td>
                              <td><span className="pk-amt">₹{Number(b.totalCost||0).toFixed(2)}</span></td>
                              <td><span className={`pk-pill ${pillClass(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                              <td><span className="pk-datemono">{b.bookedAt ? new Date(b.bookedAt).toLocaleDateString('en-IN') : '—'}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}