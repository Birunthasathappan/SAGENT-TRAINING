import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { eventsAPI, screeningsAPI } from '../../services/api';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=JetBrains+Mono:wght@400;600&display=swap');

  .hp {
    --pink:        #ec4899;
    --pink2:       #db2777;
    --pink3:       #f9a8d4;
    --pink4:       #fdf2f8;
    --pink5:       #fff0f9;
    --pink6:       #fce7f3;
    --pink-glow:   rgba(236,72,153,0.20);
    --pink-border: rgba(236,72,153,0.22);
    --mauve:       #c084fc;
    --mauve2:      #a855f7;
    --teal:        #0d9488;
    --green:       #16a34a;
    --amber:       #d97706;
    --red:         #dc2626;
    --bg:          #fff5fb;
    --card:        #ffffff;
    --ink:         #1e0a17;
    --ink2:        #6b3a54;
    --ink3:        #a87090;
    --ink4:        #d4a8be;
    --border:      #fce7f3;
    --sh:          0 2px 12px rgba(236,72,153,0.10), 0 0 0 1px rgba(244,114,182,0.08);
    --sh-up:       0 20px 60px rgba(236,72,153,0.18), 0 4px 16px rgba(30,10,23,0.08);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    background: var(--bg);
    min-height: 100vh;
  }

  .hp * { box-sizing: border-box; margin: 0; padding: 0; }
  .hp button, .hp input, .hp select, .hp textarea { font-family: 'DM Sans', sans-serif; }

  /* ── HERO ── */
  .hp-hero {
    position: relative; overflow: hidden;
    background: linear-gradient(145deg, #fff5fb 0%, #fdf2f8 40%, #f5f0ff 100%);
    padding: 72px 40px 56px;
    border-bottom: 1.5px solid var(--border);
  }

  .hp-hero-blob1 {
    position: absolute; top: -140px; right: -80px;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%);
    pointer-events: none;
  }

  .hp-hero-blob2 {
    position: absolute; bottom: -120px; left: -60px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(192,132,252,0.10) 0%, transparent 65%);
    pointer-events: none;
  }

  .hp-hero-blob3 {
    position: absolute; top: 30%; right: 30%;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 65%);
    pointer-events: none;
  }

  .hp-hero-inner {
    max-width: 1200px; margin: 0 auto; position: relative; z-index: 1;
    display: grid; grid-template-columns: 1fr 420px; gap: 48px; align-items: center;
  }

  .hp-offer-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, rgba(236,72,153,0.10), rgba(192,132,252,0.10));
    border: 1.5px solid var(--pink-border);
    border-radius: 99px; padding: 7px 18px;
    font-size: 13px; font-weight: 600; color: var(--pink2);
    margin-bottom: 24px; animation: hpUp 0.5s ease both;
  }

  .hp-headline {
    font-family: 'Playfair Display', serif;
    font-size: 58px; font-weight: 800;
    line-height: 1.05; letter-spacing: -0.02em;
    color: var(--ink); margin-bottom: 20px;
    animation: hpUp 0.5s 0.05s ease both;
  }

  .hp-headline em { font-style: italic; color: var(--pink2); }
  .hp-headline .hl-mauve { color: var(--mauve2); }

  .hp-sub {
    font-size: 17px; color: var(--ink3); line-height: 1.7;
    margin-bottom: 32px; max-width: 480px;
    animation: hpUp 0.5s 0.1s ease both;
  }

  /* Search */
  .hp-search-wrap {
    display: flex; align-items: center; gap: 12;
    background: #fff; border: 2px solid var(--border);
    border-radius: 18px; padding: 6px 6px 6px 20px;
    max-width: 560px; box-shadow: var(--sh);
    transition: border-color 0.2s, box-shadow 0.2s;
    animation: hpUp 0.5s 0.15s ease both;
    margin-bottom: 32px;
  }

  .hp-search-wrap:focus-within {
    border-color: var(--pink);
    box-shadow: 0 0 0 4px rgba(236,72,153,0.10), var(--sh);
  }

  .hp-search-input {
    flex: 1; border: none; outline: none; background: transparent;
    font-size: 15px; color: var(--ink); padding: 10px 12px 10px 8px;
  }

  .hp-search-input::placeholder { color: var(--ink4); }

  .hp-search-btn {
    padding: 10px 22px; border-radius: 12px;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border: none; cursor: pointer;
    font-size: 14px; font-weight: 700;
    box-shadow: 0 4px 14px var(--pink-glow);
    transition: all 0.2s;
    white-space: nowrap;
  }

  .hp-search-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 22px var(--pink-glow); }

  /* Stats */
  .hp-stats {
    display: flex; gap: 32px; flex-wrap: wrap;
    animation: hpUp 0.5s 0.2s ease both;
  }

  .hp-stat-item { display: flex; align-items: baseline; gap: 6px; }

  .hp-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 800; color: var(--pink2);
  }

  .hp-stat-lbl { font-size: 13px; color: var(--ink3); font-weight: 500; }

  /* Hero right — featured card */
  .hp-featured {
    background: var(--card); border: 1.5px solid var(--border);
    border-radius: 28px; overflow: hidden;
    box-shadow: var(--sh-up);
    animation: hpUp 0.5s 0.08s ease both;
  }

  .hp-featured-poster {
    width: 100%; height: 220px; position: relative; overflow: hidden;
  }
  .hp-featured-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; z-index: 0;
  }

  .hp-featured-body { padding: 20px 22px 22px; }

  .hp-featured-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border-radius: 99px; padding: 4px 12px;
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; margin-bottom: 10px;
  }

  .hp-featured-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 800; color: var(--ink);
    margin-bottom: 10px; line-height: 1.2;
  }

  /* Countdown */
  .hp-countdown {
    display: flex; gap: 10px; margin: 14px 0;
  }

  .hp-countdown-unit {
    background: var(--pink4); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 8px 12px; text-align: center; flex: 1;
  }

  .hp-countdown-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px; font-weight: 700; color: var(--pink2); line-height: 1;
  }

  .hp-countdown-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink3); margin-top: 3px; }

  .hp-featured-book {
    width: 100%; padding: 12px; border-radius: 14px;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border: none; cursor: pointer;
    font-size: 14px; font-weight: 700;
    box-shadow: 0 4px 16px var(--pink-glow);
    transition: all 0.2s; margin-top: 4px;
  }

  .hp-featured-book:hover { transform: translateY(-2px); box-shadow: 0 8px 24px var(--pink-glow); }

  /* ── FILTERS ── */
  .hp-filters-bar {
    background: #fff; border-bottom: 1.5px solid var(--border);
    position: sticky; top: 64px; z-index: 50;
    box-shadow: 0 2px 12px rgba(30,10,23,0.04);
  }

  .hp-filters-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 12px 40px;
    display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
  }

  .hp-cat-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 16px; border-radius: 99px; font-size: 13px;
    cursor: pointer; transition: all 0.2s; font-weight: 600;
    border: 1.5px solid var(--border); background: #fff;
    color: var(--ink3); white-space: nowrap;
  }

  .hp-cat-btn:hover { border-color: var(--pink-border); color: var(--pink2); background: var(--pink5); }

  .hp-cat-btn.active {
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 14px var(--pink-glow);
  }

  .hp-divider { width: 1px; height: 24px; background: var(--border); margin: 0 4px; flex-shrink: 0; }

  .hp-select {
    padding: 7px 14px; border-radius: 11px; font-size: 13px;
    border: 1.5px solid var(--border); background: #fff;
    color: var(--ink2); outline: none; cursor: pointer;
    transition: border-color 0.2s; font-weight: 500;
  }

  .hp-select:focus { border-color: var(--pink-border); }

  .hp-clear-btn {
    padding: 7px 14px; border-radius: 99px; font-size: 13px;
    border: 1.5px solid rgba(220,38,38,0.22);
    background: rgba(220,38,38,0.07); color: #dc2626;
    cursor: pointer; font-weight: 600; transition: all 0.15s;
  }

  .hp-clear-btn:hover { background: rgba(220,38,38,0.14); }

  .hp-result-count {
    margin-left: auto; font-size: 13px; color: var(--ink3);
    font-weight: 500; white-space: nowrap;
  }

  .hp-result-count strong { color: var(--ink); }

  /* ── GRID ── */
  .hp-grid-section { max-width: 1200px; margin: 0 auto; padding: 36px 40px 72px; }

  .hp-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }

  .hp-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 800; color: var(--ink);
    display: flex; align-items: center; gap: 10px;
  }

  .hp-section-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    box-shadow: 0 0 0 3px var(--pink5);
  }

  .hp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 22px;
  }

  /* ── EVENT CARD ── */
  .hp-card {
    background: var(--card); border: 1.5px solid var(--border);
    border-radius: 22px; overflow: hidden; cursor: pointer;
    transition: all 0.28s cubic-bezier(.34,1.56,.64,1);
    box-shadow: var(--sh); position: relative;
  }

  .hp-card:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: var(--sh-up);
    border-color: var(--pink-border);
  }

  .hp-card-poster {
    width: 100%; aspect-ratio: 2/3;
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .hp-card-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; z-index: 0;
  }

  .hp-card-poster-emoji {
    font-size: 64px;
    filter: drop-shadow(0 4px 16px rgba(0,0,0,0.25));
    z-index: 1;
  }

  .hp-card-overlay {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 60%; pointer-events: none;
    background: linear-gradient(to top, rgba(0,0,0,0.65), transparent);
  }

  .hp-card-status {
    position: absolute; top: 10px; right: 10px; z-index: 3;
    padding: 4px 10px; border-radius: 99px;
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  }

  .hp-card-tag {
    position: absolute; bottom: 10px; left: 10px; z-index: 3;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border-radius: 6px; padding: 3px 10px;
    font-size: 10.5px; font-weight: 700;
  }

  .hp-card-shows {
    position: absolute; bottom: 10px; right: 10px; z-index: 3;
    background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
    color: #fff; border-radius: 8px; padding: 3px 9px;
    font-size: 10.5px; font-weight: 600;
  }

  /* Wishlist heart */
  .hp-card-wish {
    position: absolute; top: 10px; left: 10px; z-index: 4;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.90); backdrop-filter: blur(6px);
    border: 1.5px solid rgba(236,72,153,0.22);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px;
    transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .hp-card-wish:hover { transform: scale(1.15); background: #fff; }
  .hp-card-wish.wished { background: linear-gradient(135deg, var(--pink), var(--mauve)); border-color: transparent; }

  /* Trending badge */
  .hp-trending-badge {
    position: absolute; top: 0; left: 0; z-index: 5;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: #fff; font-size: 9px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.08em;
    padding: 4px 10px 4px 8px;
    clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
  }

  .hp-card-body { padding: 14px 16px 16px; }

  .hp-card-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700; font-size: 15px; margin-bottom: 8px;
    color: var(--ink); overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap; letter-spacing: -0.01em;
  }

  .hp-card-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }

  .hp-card-chip {
    padding: 3px 10px; border-radius: 99px; font-size: 11px;
    font-weight: 500; background: var(--pink4); color: var(--ink2);
    border: 1px solid var(--border);
  }

  .hp-card-footer {
    display: flex; align-items: center; justify-content: space-between;
  }

  .hp-card-dur { font-size: 12px; color: var(--ink3); }

  .hp-book-btn {
    font-size: 12px; font-weight: 700; padding: 5px 14px;
    border-radius: 99px; border: none; cursor: pointer;
    transition: all 0.18s;
  }

  .hp-book-btn.active {
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; box-shadow: 0 4px 12px var(--pink-glow);
  }

  .hp-book-btn.active:hover { transform: scale(1.06); }

  .hp-book-btn.inactive {
    background: var(--pink4); color: var(--ink3);
    border: 1.5px solid var(--border);
  }

  /* ── WISHLIST SECTION ── */
  .hp-wish-section {
    background: linear-gradient(135deg, var(--pink4), #f5f0ff);
    border: 1.5px solid var(--pink-border);
    border-radius: 24px; padding: 24px 28px; margin-bottom: 32px;
    position: relative; overflow: hidden;
  }

  .hp-wish-section::before {
    content: '🌸'; position: absolute; right: 24px; top: 50%;
    transform: translateY(-50%); font-size: 64px; opacity: 0.15;
  }

  /* ── EMPTY ── */
  .hp-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 72px 0; gap: 14px; text-align: center;
  }

  .hp-empty-icon { font-size: 56px; opacity: 0.25; }

  .hp-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 800; color: var(--ink);
  }

  .hp-empty-sub { font-size: 14px; color: var(--ink3); }

  .hp-empty-btn {
    padding: 10px 24px; border-radius: 12px;
    background: linear-gradient(135deg, var(--pink), var(--mauve));
    color: #fff; border: none; cursor: pointer;
    font-size: 14px; font-weight: 700;
    box-shadow: 0 4px 14px var(--pink-glow);
    transition: all 0.18s; margin-top: 4px;
  }

  /* ── SPINNER ── */
  .hp-spin-wrap { display:flex; align-items:center; justify-content:center; padding:100px 0; }
  .hp-spinner {
    width:44px; height:44px; border:3px solid var(--pink4); border-top-color:var(--pink);
    border-radius:50%; animation:hpSpin 0.75s linear infinite;
    box-shadow:0 0 18px var(--pink-glow);
  }

  @keyframes hpSpin { to{transform:rotate(360deg);} }
  @keyframes hpUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

  /* Status pill colors */
  .s-upcoming  { background:rgba(14,165,233,0.12); color:#0284c7; border:1px solid rgba(14,165,233,0.25); }
  .s-ongoing   { background:rgba(22,163,74,0.12);  color:#15803d; border:1px solid rgba(22,163,74,0.25); }
  .s-completed { background:rgba(100,116,139,0.12);color:#475569; border:1px solid rgba(100,116,139,0.25); }
  .s-cancelled { background:rgba(220,38,38,0.12);  color:#dc2626; border:1px solid rgba(220,38,38,0.25); }

  @media(max-width:900px) {
    .hp-hero-inner { grid-template-columns:1fr; }
    .hp-featured { display:none; }
    .hp-headline { font-size:40px; }
    .hp-hero { padding:48px 20px 40px; }
    .hp-filters-inner { padding:12px 20px; }
    .hp-grid-section { padding:24px 20px 48px; }
  }
`;

// ✅ CHANGE 1: Only Movie, Concert, Events
const GRADIENTS = {
  Movie:   'linear-gradient(135deg,#667eea,#764ba2)',
  Concert: 'linear-gradient(135deg,#f093fb,#f5576c)',
  Events:  'linear-gradient(135deg,#4facfe,#00f2fe)',
  default: 'linear-gradient(135deg,#ec4899,#c084fc)',
};

// ✅ CHANGE 2: Only Movie, Concert, Events
const ICONS = { Movie:'🎬', Concert:'🎵', Events:'🎭', default:'🎟️' };
const icon = c => ICONS[c] || ICONS.default;

const statusClass = s => ({ UPCOMING:'s-upcoming', ONGOING:'s-ongoing', COMPLETED:'s-completed', CANCELLED:'s-cancelled' }[s] || 's-upcoming');

/* Countdown hook */
function useCountdown(targetDate) {
  const [time, setTime] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTime({ d:0,h:0,m:0,s:0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

/* Featured card with countdown */
function FeaturedCard({ event, screenings, onBook }) {
  const nextScreen = screenings
    .filter(s => s.event?.eventId === event?.eventId && new Date(s.screenDate) >= new Date())
    .sort((a,b) => new Date(a.screenDate) - new Date(b.screenDate))[0];

  const countdown = useCountdown(nextScreen ? `${nextScreen.screenDate}T${nextScreen.startTime || '10:00'}` : null);

  if (!event) return null;
  const gradient = GRADIENTS[event.category] || GRADIENTS.default;
  const poster = event.imageUrl || event.posterUrl || event.image || '';

  return (
    <div className="hp-featured">
      <div className="hp-featured-poster" style={{ background: gradient }}>
        {poster && <img className="hp-featured-img" src={poster} alt={event.title} />}
        {!poster && (
          <span style={{ fontSize: 80, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))', position: 'relative', zIndex: 1 }}>
            {icon(event.category)}
          </span>
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', zIndex:0 }} />
      </div>
      <div className="hp-featured-body">
        <div className="hp-featured-tag">🔥 Featured Event</div>
        <div className="hp-featured-title">{event.title}</div>
        <div style={{ fontSize:12.5, color:'#a87090', marginBottom:4 }}>
          {event.category} · {event.language} · {event.duration} min
        </div>
        {nextScreen && (
          <>
            <div style={{ fontSize:12, color:'#a87090', marginBottom:8 }}>
              📅 Next show: {nextScreen.screenDate}
            </div>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#d4a8be', marginBottom:8 }}>
              Starts in
            </div>
            <div className="hp-countdown">
              {[['d','Days'],['h','Hrs'],['m','Min'],['s','Sec']].map(([k,l]) => (
                <div key={k} className="hp-countdown-unit">
                  <div className="hp-countdown-num">{String(countdown[k]).padStart(2,'0')}</div>
                  <div className="hp-countdown-lbl">{l}</div>
                </div>
              ))}
            </div>
          </>
        )}
        <button className="hp-featured-book" onClick={() => onBook(event.eventId)}>
          🎫 Book Now
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [events, setEvents]         = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [languages, setLanguages]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');
  const [sortBy, setSortBy]         = useState('default');
  const [wishlist, setWishlist]     = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('bk_wish') || '[]')); }
    catch { return new Set(); }
  });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      eventsAPI.getAll(),
      screeningsAPI.getAll(),
      eventsAPI.getLanguages(),
    ])
      .then(([evs, scrs, langs]) => {
        setEvents(evs);
        setScreenings(scrs);
        setLanguages(langs);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleWish = useCallback((id, e) => {
    e.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('bk_wish', JSON.stringify([...next]));
      return next;
    });
  }, []);

  // ✅ CHANGE 3: Hardcoded — only Movie, Concert, Events
  const cats = ['All', 'Movie', 'Concert', 'Events'];

  const langs = useMemo(() => ['All', ...languages], [languages]);

  const scCount = id => screenings.filter(s=>s.event?.eventId===id).length;

  const trendingIds = useMemo(() => {
    const sorted = [...events].sort((a,b) => scCount(b.eventId) - scCount(a.eventId));
    return new Set(sorted.slice(0, 3).map(e => e.eventId));
  }, [events, screenings]);

  const featured = useMemo(() => events.find(e => e.showStatus === 'ONGOING') || events[0], [events]);

  const filtered = useMemo(() => {
    let r = [...events];
    if (search) { const q = search.toLowerCase(); r = r.filter(e => e.title?.toLowerCase().includes(q) || e.genre?.toLowerCase().includes(q)); }
    if (catFilter !== 'All')    r = r.filter(e => e.category === catFilter);
    if (statusFilter !== 'All') r = r.filter(e => e.showStatus === statusFilter);
    if (langFilter !== 'All')   r = r.filter(e => e.language === langFilter);
    if (sortBy === 'title-asc')     r.sort((a,b)=>a.title?.localeCompare(b.title));
    if (sortBy === 'title-desc')    r.sort((a,b)=>b.title?.localeCompare(a.title));
    if (sortBy === 'duration-asc')  r.sort((a,b)=>(a.duration||0)-(b.duration||0));
    if (sortBy === 'duration-desc') r.sort((a,b)=>(b.duration||0)-(a.duration||0));
    if (sortBy === 'screenings')    r.sort((a,b)=>scCount(b.eventId)-scCount(a.eventId));
    if (sortBy === 'wishlist')      r.sort((a,b)=>(wishlist.has(b.eventId)?1:0)-(wishlist.has(a.eventId)?1:0));
    return r;
  }, [events, search, catFilter, statusFilter, langFilter, sortBy, wishlist]);

  const wishlistEvents = useMemo(() => events.filter(e => wishlist.has(e.eventId)), [events, wishlist]);
  const hasFilters = search || catFilter!=='All' || statusFilter!=='All' || langFilter!=='All';
  const clearFilters = () => { setSearch(''); setCatFilter('All'); setStatusFilter('All'); setLangFilter('All'); };

  return (
    <div className="hp">
      <style>{S}</style>
      <Navbar />
      <div style={{ paddingTop: 64 }}>

        {/* ── HERO ── */}
        <div className="hp-hero">
          <div className="hp-hero-blob1" />
          <div className="hp-hero-blob2" />
          <div className="hp-hero-blob3" />
          <div className="hp-hero-inner">
            <div>
              <div className="hp-offer-badge">
                🎉 First booking? Get <strong style={{ marginLeft:4 }}>25% OFF</strong> automatically!
              </div>
              <h1 className="hp-headline">
                Discover &amp;{' '}
                <em>Book</em>
                <br />
                <span>Unforgettable </span>
                <span className="hl-mauve">Experiences</span>
              </h1>
              <p className="hp-sub">
                Movies, concerts, events — find what's happening near you.
              </p>

              <div className="hp-search-wrap">
                <span style={{ fontSize:18, color:'#d4a8be' }}>🔍</span>
                <input
                  className="hp-search-input"
                  placeholder="Search events, movies, artists, genres..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{
                    background:'#fdf2f8', border:'none', color:'#a87090',
                    cursor:'pointer', width:28, height:28, borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:16, marginRight:4,
                  }}>×</button>
                )}
                <button className="hp-search-btn">Search</button>
              </div>

              <div className="hp-stats">
                {[
                  { label:'Live Events',  value: events.length },
                  { label:'Total Shows',  value: screenings.length },
                  { label:'Happy Users',  value: '100' },
                ].map(({ label, value }) => (
                  <div key={label} className="hp-stat-item">
                    <span className="hp-stat-num">{value}+</span>
                    <span className="hp-stat-lbl">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <FeaturedCard event={featured} screenings={screenings} onBook={id => navigate(`/event/${id}`)} />
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div className="hp-filters-bar">
          <div className="hp-filters-inner">
            {cats.map(cat => (
              <button key={cat}
                className={`hp-cat-btn${catFilter===cat?' active':''}`}
                onClick={() => setCatFilter(cat)}>
                {cat !== 'All' && <span>{icon(cat)}</span>}
                {cat}
              </button>
            ))}

            <div className="hp-divider" />

            <select className="hp-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {['All','UPCOMING','ONGOING','COMPLETED','CANCELLED'].map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>

            <select className="hp-select" value={langFilter} onChange={e => setLangFilter(e.target.value)}>
              {langs.map(l => <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>)}
            </select>

            <select className="hp-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
              <option value="duration-asc">Duration ↑</option>
              <option value="duration-desc">Duration ↓</option>
              <option value="screenings">Most Shows</option>
              <option value="wishlist">My Wishlist First</option>
            </select>

            {hasFilters && (
              <button className="hp-clear-btn" onClick={clearFilters}>✕ Clear</button>
            )}

            <div className="hp-result-count">
              <strong>{filtered.length}</strong> event{filtered.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* ── GRID SECTION ── */}
        <div className="hp-grid-section">

          {/* Wishlist strip */}
          {wishlistEvents.length > 0 && (
            <div className="hp-wish-section" style={{ marginBottom: 32 }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 18, fontWeight: 800, color: '#1e0a17', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>💖</span> Your Wishlist ({wishlistEvents.length})
              </div>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                {wishlistEvents.map(e => (
                  <div key={e.eventId}
                    onClick={() => navigate(`/event/${e.eventId}`)}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:8,
                      background:'#fff', border:'1.5px solid rgba(236,72,153,0.22)',
                      borderRadius:12, padding:'8px 14px', cursor:'pointer',
                      transition:'all 0.18s', boxShadow:'0 2px 8px rgba(236,72,153,0.08)',
                    }}
                    onMouseEnter={e2 => e2.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e2 => e2.currentTarget.style.transform = 'none'}>
                    <span>{icon(e.category)}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:'#1e0a17' }}>{e.title}</span>
                    <button
                      onClick={ev => toggleWish(e.eventId, ev)}
                      style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, color:'#ec4899', padding:0 }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="hp-section-header">
            <div className="hp-section-title">
              <div className="hp-section-dot" />
              {hasFilters ? 'Search Results' : 'All Events'}
            </div>
          </div>

          {loading ? (
            <div className="hp-spin-wrap"><div className="hp-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="hp-empty">
              <div className="hp-empty-icon">🎭</div>
              <div className="hp-empty-title">No events found</div>
              <div className="hp-empty-sub">Try adjusting your filters</div>
              <button className="hp-empty-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="hp-grid">
              {filtered.map(event => {
                const cnt = scCount(event.eventId);
                const gradient = GRADIENTS[event.category] || GRADIENTS.default;
                const wished = wishlist.has(event.eventId);
                const trending = trendingIds.has(event.eventId);
                const poster = event.imageUrl || event.posterUrl || event.image || '';
                return (
                  <div key={event.eventId} className="hp-card"
                    onClick={() => navigate(`/event/${event.eventId}`)}>

                    {trending && cnt > 0 && (
                      <div className="hp-trending-badge">🔥 Trending</div>
                    )}

                    <div className="hp-card-poster" style={{ background: gradient }}>
                      {poster && <img className="hp-card-img" src={poster} alt={event.title} />}
                      <button
                        className={`hp-card-wish${wished ? ' wished' : ''}`}
                        onClick={e => toggleWish(event.eventId, e)}
                        title={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
                        {wished ? '❤️' : '🤍'}
                      </button>

                      {!poster && <span className="hp-card-poster-emoji">{icon(event.category)}</span>}
                      <div className="hp-card-overlay" />

                      <span className={`hp-card-status ${statusClass(event.showStatus)}`}>
                        {event.showStatus}
                      </span>

                      {event.tag && <div className="hp-card-tag">{event.tag}</div>}

                      {cnt > 0 && (
                        <div className="hp-card-shows">{cnt} shows</div>
                      )}
                    </div>

                    <div className="hp-card-body">
                      <div className="hp-card-title">{event.title}</div>
                      <div className="hp-card-tags">
                        {[event.category, event.language].filter(Boolean).map(t => (
                          <span key={t} className="hp-card-chip">{t}</span>
                        ))}
                      </div>
                      <div className="hp-card-footer">
                        <span className="hp-card-dur">⏱ {event.duration} min</span>
                        <button
                          className={`hp-book-btn ${cnt > 0 ? 'active' : 'inactive'}`}
                          onClick={e => { e.stopPropagation(); if (cnt > 0) navigate(`/event/${event.eventId}`); }}>
                          {cnt > 0 ? '🎫 Book Now' : 'No shows'}
                        </button>
                      </div>
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