import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { screeningsAPI, screeningSeatsAPI, eventsAPI, venuesAPI, bookingsAPI, bookingItemsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const HOLD_SECONDS = 120;

const getLayout = (category = '') => {
  const c = category.toLowerCase();
  if (['sports'].some(x => c.includes(x)))                              return 'stadium';
  if (['concert','dance','festival','music'].some(x => c.includes(x))) return 'concert';
  return 'theatre';
};

const CAT = {
  vip:          { fill:'#fce7f3', stroke:'#ec4899', text:'#db2777', label:'VIP'          },
  premium:      { fill:'#fce7f3', stroke:'#ec4899', text:'#db2777', label:'Premium'       },
  front:        { fill:'#fce7f3', stroke:'#ec4899', text:'#db2777', label:'Front'         },
  golden:       { fill:'#fef9c3', stroke:'#eab308', text:'#854d0e', label:'Golden Circle' },
  golden_circle:{ fill:'#fef9c3', stroke:'#eab308', text:'#854d0e', label:'Golden Circle' },
  silver:       { fill:'#f0f9ff', stroke:'#38bdf8', text:'#0369a1', label:'Silver'        },
  pit:          { fill:'#fdf4ff', stroke:'#a855f7', text:'#7e22ce', label:'Pit'           },
  pavilion:     { fill:'#fdf2f8', stroke:'#ec4899', text:'#db2777', label:'Pavilion'      },
  north:        { fill:'#eff6ff', stroke:'#3b82f6', text:'#1d4ed8', label:'North Stand'   },
  south:        { fill:'#f0fdf4', stroke:'#22c55e', text:'#15803d', label:'South Stand'   },
  east:         { fill:'#fff7ed', stroke:'#f97316', text:'#c2410c', label:'East Stand'    },
  west:         { fill:'#faf5ff', stroke:'#a855f7', text:'#7e22ce', label:'West Stand'    },
  standard:     { fill:'#eff6ff', stroke:'#3b82f6', text:'#1d4ed8', label:'Standard'      },
  middle:       { fill:'#eff6ff', stroke:'#3b82f6', text:'#1d4ed8', label:'Middle'        },
  general:      { fill:'#f0fdf4', stroke:'#22c55e', text:'#15803d', label:'General'       },
  back:         { fill:'#f5f3ff', stroke:'#8b5cf6', text:'#6d28d9', label:'Back'          },
  balcony:      { fill:'#ecfdf5', stroke:'#10b981', text:'#065f46', label:'Balcony'       },
  bronze:       { fill:'#fff7ed', stroke:'#f97316', text:'#c2410c', label:'Bronze'        },
  default:      { fill:'#fdf2f8', stroke:'#d4a8be', text:'#6b3a54', label:'Regular'       },
};

const getCat = (cat) => {
  if (!cat) return CAT.default;
  const k = cat.toLowerCase().replace(/\s+/g,'_');
  for (const key of Object.keys(CAT)) {
    if (k.includes(key)) return CAT[key];
  }
  return CAT.default;
};

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  .ss { font-family:'DM Sans',sans-serif; background:#fff5fb; min-height:100vh; }

  .ss-bar {
    background:#fff; border-bottom:1.5px solid #fce7f3;
    padding:12px 28px;
    position:sticky; top:var(--nav-height,64px); z-index:90;
    box-shadow:0 2px 12px rgba(236,72,153,0.08);
  }
  .ss-bar-inner {
    max-width:1200px; margin:0 auto;
    display:flex; align-items:center;
    justify-content:space-between; flex-wrap:wrap; gap:10px;
  }
  .ss-back { background:none; border:none; cursor:pointer; font-size:13px; font-weight:600; color:#a87090; font-family:'DM Sans',sans-serif; transition:color .15s; }
  .ss-back:hover { color:#ec4899; }
  .ss-etitle { font-family:'Playfair Display',serif; font-size:19px; font-weight:800; color:#1e0a17; margin-top:2px; }
  .ss-emeta  { font-size:12px; color:#a87090; margin-top:2px; }

  .ss-layout-tag {
    display:inline-flex; align-items:center; gap:6px;
    padding:5px 12px; border-radius:99px;
    font-size:11.5px; font-weight:700; letter-spacing:.04em;
    background:linear-gradient(135deg,#fce7f3,#f5f3ff);
    color:#db2777; border:1px solid rgba(236,72,153,0.22);
    margin-top:4px;
  }

  .ss-timer {
    display:flex; align-items:center; gap:9px;
    padding:9px 16px; border-radius:13px; border:2px solid;
    font-family:'JetBrains Mono',monospace;
  }
  .ss-timer.safe   { background:#fff0f9; border-color:rgba(236,72,153,0.3); color:#db2777; }
  .ss-timer.warn   { background:#fff7ed; border-color:rgba(249,115,22,0.4); color:#c2410c; }
  .ss-timer.danger { background:#fef2f2; border-color:rgba(220,38,38,0.5);  color:#dc2626; animation:ssPulse .8s ease-in-out infinite; }
  @keyframes ssPulse { 0%,100%{opacity:1;} 50%{opacity:.55;} }
  .ss-t-ring { width:34px; height:34px; position:relative; flex-shrink:0; }
  .ss-t-svg  { transform:rotate(-90deg); }
  .ss-t-track{ fill:none; stroke:rgba(0,0,0,0.08); stroke-width:3; }
  .ss-t-arc  { fill:none; stroke-width:3; stroke-linecap:round; transition:stroke-dashoffset .9s linear,stroke .3s; }
  .ss-t-num  { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:9.5px; font-weight:800; }
  .ss-t-lbl  { font-size:10px; font-weight:700; letter-spacing:.06em; opacity:.8; }
  .ss-t-cnt  { font-size:17px; font-weight:800; line-height:1; }
  .ss-t-sub  { font-size:9px; opacity:.65; }

  .ss-legend { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
  .ss-leg    { display:flex; align-items:center; gap:5px; font-size:11.5px; color:#a87090; font-weight:600; }
  .ss-legdot { width:13px; height:13px; border-radius:3px; }

  .ss-body {
    max-width:1200px; margin:0 auto;
    padding:24px 28px; display:flex;
    gap:24px; align-items:flex-start; flex-wrap:wrap;
  }
  .ss-map  { flex:1; min-width:280px; }
  .ss-side { width:290px; flex-shrink:0; position:sticky; top:130px; }

  .seat-btn {
    display:inline-flex; align-items:center; justify-content:center;
    font-family:'JetBrains Mono',monospace;
    font-weight:700; cursor:pointer; border:1.5px solid;
    transition:transform .15s, box-shadow .15s, background .15s;
    user-select:none; position:relative;
  }
  .seat-btn:hover:not(.booked):not(.held) {
    transform:translateY(-4px) scale(1.14);
    box-shadow:0 6px 18px rgba(236,72,153,0.28);
    z-index:3;
  }
  .seat-btn.selected {
    background:linear-gradient(135deg,#ec4899,#c084fc)!important;
    border-color:#ec4899!important; color:#fff!important;
    box-shadow:0 4px 14px rgba(236,72,153,0.42);
    transform:translateY(-2px) scale(1.08);
  }
  .seat-btn.booked { background:#f3f4f6!important; border-color:#e5e7eb!important; color:#d1d5db!important; cursor:not-allowed!important; opacity:.55; }
  .seat-btn.held   { background:#fff7ed!important; border-color:#fed7aa!important; color:#f97316!important; cursor:not-allowed!important; }

  .tl-wrap { display:flex; flex-direction:column; align-items:center; }
  .tl-screen-wrap { width:100%; display:flex; justify-content:center; margin-bottom:28px; }
  .tl-screen {
    width:68%; max-width:440px; height:46px;
    background:linear-gradient(180deg,rgba(236,72,153,0.12),rgba(192,132,252,0.07));
    border:1.5px solid rgba(236,72,153,0.22);
    border-radius:50% 50% 0 0 / 100% 100% 0 0;
    display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden;
  }
  .tl-screen::before {
    content:''; position:absolute; top:0;left:0;right:0; height:2.5px;
    background:linear-gradient(90deg,transparent,#ec4899,#c084fc,#ec4899,transparent);
  }
  .tl-screen-txt { font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:.18em; color:#db2777; opacity:.75; padding-top:10px; }
  .tl-cat-legend { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:16px; }
  .tl-rows { overflow-x:auto; width:100%; }
  .tl-row  { display:flex; align-items:center; gap:5px; margin-bottom:7px; justify-content:center; }
  .tl-rlbl { width:20px; text-align:right; flex-shrink:0; font-size:10px; font-weight:800; color:#a87090; font-family:'JetBrains Mono',monospace; margin-right:5px; }
  .tl-seat { width:34px; height:34px; border-radius:8px 8px 5px 5px; font-size:9.5px; }
  .tl-seat::before {
    content:''; position:absolute; top:-4px; left:22%; right:22%;
    height:4px; border-radius:3px 3px 0 0;
    background:inherit; filter:brightness(.82);
  }
  .tl-sec-label {
    text-align:center; margin:12px 0 6px;
    font-size:10px; font-weight:800; text-transform:uppercase;
    letter-spacing:.14em; color:#a87090;
    display:flex; align-items:center; gap:8px;
  }
  .tl-sec-label::before,.tl-sec-label::after {
    content:''; flex:1; height:1px; background:#fce7f3;
  }

  .cl-wrap { display:flex; flex-direction:column; align-items:center; gap:0; }
  .cl-stage {
    width:70%; max-width:460px; padding:16px 0;
    background:linear-gradient(180deg,rgba(236,72,153,0.15),rgba(192,132,252,0.10));
    border:2px solid rgba(236,72,153,0.28);
    border-radius:18px 18px 0 0;
    text-align:center; position:relative; overflow:hidden; margin-bottom:0;
  }
  .cl-stage::before {
    content:''; position:absolute; top:0;left:0;right:0; height:3px;
    background:linear-gradient(90deg,transparent,#ec4899,#c084fc,#ec4899,transparent);
  }
  .cl-stage-lights { display:flex; justify-content:center; gap:18px; margin-bottom:6px; }
  .cl-light { width:10px; height:10px; border-radius:50%; animation:clBlink 1.5s ease-in-out infinite; }
  .cl-light:nth-child(2) { animation-delay:.3s; }
  .cl-light:nth-child(3) { animation-delay:.6s; }
  .cl-light:nth-child(4) { animation-delay:.9s; }
  .cl-light:nth-child(5) { animation-delay:1.2s; }
  @keyframes clBlink { 0%,100%{opacity:1;} 50%{opacity:.2;} }
  .cl-stage-txt { font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:.2em; color:#db2777; }
  .cl-stage-sub { font-size:10px; color:#a87090; margin-top:3px; }
  .cl-sections { width:100%; display:flex; flex-direction:column; gap:0; }
  .cl-section { border:1.5px solid; border-top:none; padding:14px 16px 10px; position:relative; }
  .cl-section:last-child { border-radius:0 0 16px 16px; }
  .cl-sec-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .cl-sec-name { font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; }
  .cl-sec-price { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:800; }
  .cl-sec-avail { font-size:10.5px; color:#a87090; font-weight:600; }
  .cl-sec-rows  { display:flex; flex-direction:column; gap:5px; align-items:center; }
  .cl-row       { display:flex; align-items:center; gap:4px; }
  .cl-rlbl      { width:18px; text-align:right; font-size:9.5px; font-weight:800; color:#a87090; font-family:'JetBrains Mono',monospace; margin-right:4px; flex-shrink:0; }
  .cl-seat      { width:30px; height:30px; border-radius:6px 6px 4px 4px; font-size:9px; }
  .cl-standing  { display:flex; align-items:center; justify-content:center; gap:10px; padding:14px; flex-wrap:wrap; }
  .cl-stand-seat { width:26px; height:26px; border-radius:50%; font-size:8.5px; }

  .sl-wrap { display:flex; flex-direction:column; align-items:center; }
  .sl-svg-wrap { width:100%; overflow-x:auto; display:flex; justify-content:center; }
  .sl-stands-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:18px; width:100%; }
  .sl-stand { background:#fff; border:1.5px solid #fce7f3; border-radius:16px; padding:14px 16px; box-shadow:0 1px 4px rgba(30,10,23,0.06); }
  .sl-stand-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .sl-stand-name { font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; }
  .sl-stand-price { font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:800; }
  .sl-stand-rows  { display:flex; flex-direction:column; gap:4px; }
  .sl-row  { display:flex; align-items:center; gap:3px; }
  .sl-rlbl { width:16px; font-size:9px; font-weight:800; color:#a87090; font-family:'JetBrains Mono',monospace; flex-shrink:0; }
  .sl-seat { width:26px; height:26px; border-radius:5px; font-size:8.5px; }

  .ss-card { background:#fff; border:1.5px solid #fce7f3; border-radius:20px; overflow:hidden; box-shadow:0 4px 24px rgba(236,72,153,0.10); position:relative; }
  .ss-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,#ec4899,#c084fc); }
  .ss-card-head { padding:16px 18px 12px; border-bottom:1.5px solid #fce7f3; background:#fdf2f8; }
  .ss-card-title { font-family:'Playfair Display',serif; font-size:16px; font-weight:800; color:#1e0a17; }
  .ss-timer-mini { margin-top:8px; font-size:12px; font-weight:700; color:#a87090; display:flex; align-items:center; gap:6px; }
  .ss-card-body { padding:14px 18px; }
  .ss-empty { display:flex; flex-direction:column; align-items:center; padding:20px 0; gap:7px; color:#a87090; font-size:13px; }
  .ss-sitem { display:flex; justify-content:space-between; align-items:center; padding:8px 11px; background:#fdf2f8; border:1px solid #fce7f3; border-radius:10px; margin-bottom:6px; }
  .ss-sname  { font-weight:700; font-size:13px; color:#1e0a17; }
  .ss-scat   { font-size:10.5px; color:#a87090; margin-top:1px; }
  .ss-sprice { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:13px; color:#db2777; }
  .ss-xbtn   { background:none; border:none; cursor:pointer; color:#d4a8be; font-size:16px; transition:color .15s; }
  .ss-xbtn:hover { color:#ec4899; }
  .ss-divider { height:1px; background:#fce7f3; margin:12px 0; }
  .ss-total-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
  .ss-tlbl { font-size:13px; color:#a87090; }
  .ss-tval { font-family:'Playfair Display',serif; font-size:21px; font-weight:800; color:#ec4899; }
  .ss-fnote { font-size:10.5px; color:#d4a8be; margin-bottom:14px; }
  .ss-pay-btn {
    width:100%; padding:12px; border-radius:12px; border:none; cursor:pointer;
    background:linear-gradient(135deg,#ec4899,#c084fc);
    color:#fff; font-size:14px; font-weight:800;
    font-family:'DM Sans',sans-serif;
    box-shadow:0 5px 18px rgba(236,72,153,0.28);
    transition:all .22s cubic-bezier(.34,1.56,.64,1);
    display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .ss-pay-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.02); box-shadow:0 9px 26px rgba(236,72,153,0.38); }
  .ss-pay-btn:disabled { opacity:.5; cursor:not-allowed; transform:none!important; }
  .ss-maxnote { font-size:10.5px; color:#d4a8be; text-align:center; margin-top:8px; }

  .ss-exp-overlay {
    position:fixed; inset:0; z-index:2000;
    background:rgba(30,10,23,0.6); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:ssFadeIn .22s ease both;
  }
  @keyframes ssFadeIn { from{opacity:0;} to{opacity:1;} }
  .ss-exp-box {
    background:#fff; border-radius:22px; border:1.5px solid #fce7f3;
    box-shadow:0 24px 80px rgba(236,72,153,0.20);
    padding:34px 30px; max-width:380px; width:100%; text-align:center;
    animation:ssSlide .28s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes ssSlide { from{opacity:0;transform:translateY(26px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
  .ss-exp-icon  { font-size:50px; margin-bottom:12px; }
  .ss-exp-title { font-family:'Playfair Display',serif; font-size:21px; font-weight:800; color:#1e0a17; margin-bottom:8px; }
  .ss-exp-sub   { font-size:13.5px; color:#a87090; margin-bottom:22px; line-height:1.6; }
  .ss-exp-btn   {
    padding:11px 26px; border-radius:12px; border:none; cursor:pointer;
    background:linear-gradient(135deg,#ec4899,#c084fc); color:#fff;
    font-size:13.5px; font-weight:800; font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 14px rgba(236,72,153,0.26); transition:all .18s;
  }
  .ss-exp-btn:hover { transform:translateY(-2px); }

  .ss-spin { display:flex; align-items:center; justify-content:center; height:80vh; }
  .ss-spinner { width:42px; height:42px; border:3px solid #fce7f3; border-top-color:#ec4899; border-radius:50%; animation:ssSpin .75s linear infinite; box-shadow:0 0 16px rgba(236,72,153,0.18); }
  @keyframes ssSpin { to{transform:rotate(360deg);} }

  @media(max-width:768px){
    .ss-body{ padding:14px; flex-direction:column; }
    .ss-side{ width:100%; position:static; }
    .sl-stands-grid{ grid-template-columns:1fr; }
  }
`;

function TimerRing({ seconds, total }) {
  const r = 14, circ = 2 * Math.PI * r;
  const offset = circ * (1 - seconds / total);
  const color  = seconds > 60 ? '#ec4899' : seconds > 30 ? '#f97316' : '#dc2626';
  const cls    = seconds > 60 ? 'safe' : seconds > 30 ? 'warn' : 'danger';
  const mm = String(Math.floor(seconds / 60)).padStart(2,'0');
  const ss = String(seconds % 60).padStart(2,'0');
  return (
    <div className={`ss-timer ${cls}`}>
      <div className="ss-t-ring">
        <svg width="34" height="34" className="ss-t-svg">
          <circle className="ss-t-track" cx="17" cy="17" r={r}/>
          <circle className="ss-t-arc" cx="17" cy="17" r={r}
            stroke={color} strokeDasharray={circ} strokeDashoffset={offset}/>
        </svg>
        <div className="ss-t-num" style={{color}}>{seconds}</div>
      </div>
      <div>
        <div className="ss-t-lbl">⏱ SEAT HOLD</div>
        <div className="ss-t-cnt">{mm}:{ss}</div>
        <div className="ss-t-sub">remaining</div>
      </div>
    </div>
  );
}

function TheatreLayout({ sortedRows, rows, selectedSeats, toggleSeat, categories }) {
  const getCatForRow = (row) => {
    const first = rows[row]?.[0];
    return first?.seatCategory || first?.seat?.seatCategory || 'Regular';
  };
  let lastCat = null;
  return (
    <div className="tl-wrap">
      <div className="tl-screen-wrap">
        <div className="tl-screen">
          <span className="tl-screen-txt">🎬 Screen</span>
        </div>
      </div>
      <div className="tl-cat-legend">
        {categories.map(cat => {
          const cs = getCat(cat);
          return (
            <div key={cat} className="ss-leg">
              <div className="ss-legdot" style={{background:cs.fill,border:`1.5px solid ${cs.stroke}`}}/>
              <span style={{color:cs.text,fontWeight:700}}>{cat}</span>
            </div>
          );
        })}
      </div>
      <div className="tl-rows">
        {sortedRows.map(row => {
          const cat = getCatForRow(row);
          const showDivider = cat !== lastCat;
          lastCat = cat;
          const cs = getCat(cat);
          return (
            <div key={row}>
              {showDivider && (
                <div className="tl-sec-label" style={{color:cs.text}}>{cs.label}</div>
              )}
              <div className="tl-row">
                <span className="tl-rlbl">{row}</span>
                {rows[row]
                  .sort((a,b)=>(a.seatNo||a.seat?.seatNo||'').localeCompare(b.seatNo||b.seat?.seatNo||'',undefined,{numeric:true}))
                  .map(seat => {
                    const isSelected = selectedSeats.some(s=>s.screeningSeatsId===seat.screeningSeatsId);
                    const avail = seat.availability?.toLowerCase();
                    const cs2   = getCat(seat.seatCategory || seat.seat?.seatCategory);
                    return (
                      <div key={seat.screeningSeatsId}
                        className={`seat-btn tl-seat ${isSelected?'selected':avail}`}
                        style={!isSelected&&avail==='available'?{background:cs2.fill,borderColor:cs2.stroke,color:cs2.text}:{}}
                        onClick={()=>toggleSeat(seat)}
                        title={`${seat.seatNo || seat.seat?.seatNo} · ${seat.seatCategory || seat.seat?.seatCategory} · ₹${seat.price} · ${seat.availability}`}>
                        {(seat.seatNo || seat.seat?.seatNo)?.replace(/[A-Za-z]/g,'')||''}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConcertLayout({ sortedRows, rows, selectedSeats, toggleSeat }) {
  const catRowMap = {};
  sortedRows.forEach(row => {
    const cat = rows[row]?.[0]?.seatCategory || rows[row]?.[0]?.seat?.seatCategory || 'General';
    if (!catRowMap[cat]) catRowMap[cat] = [];
    catRowMap[cat].push(row);
  });
  const ORDER = ['pit','golden','vip','premium','silver','standard','bronze','back','general','balcony','default'];
  const orderedCats = Object.keys(catRowMap).sort((a,b) => {
    const ai = ORDER.findIndex(x => a.toLowerCase().includes(x));
    const bi = ORDER.findIndex(x => b.toLowerCase().includes(x));
    return (ai===-1?99:ai) - (bi===-1?99:bi);
  });
  const isPit = (cat) => cat.toLowerCase().includes('pit') || cat.toLowerCase().includes('standing') || cat.toLowerCase().includes('general');
  const lightColors = ['#ec4899','#f97316','#eab308','#22c55e','#3b82f6'];
  return (
    <div className="cl-wrap">
      <div className="cl-stage" style={{width:'72%',maxWidth:460}}>
        <div className="cl-stage-lights">
          {lightColors.map((c,i)=>(
            <div key={i} className="cl-light" style={{background:c,boxShadow:`0 0 8px ${c}`}}/>
          ))}
        </div>
        <div className="cl-stage-txt">🎵 STAGE</div>
        <div className="cl-stage-sub">Main Performance Area</div>
      </div>
      <div className="cl-sections" style={{width:'100%',maxWidth:'100%'}}>
        {orderedCats.map((cat) => {
          const cs       = getCat(cat);
          const catRows  = catRowMap[cat];
          const catSeats = catRows.flatMap(r=>rows[r]||[]);
          const price    = catSeats[0]?.price || 0;
          const avail    = catSeats.filter(s=>s.availability==='AVAILABLE').length;
          const standing = isPit(cat);
          return (
            <div key={cat} className="cl-section" style={{background:cs.fill+'99',borderColor:cs.stroke+'55'}}>
              <div className="cl-sec-head">
                <div>
                  <span className="cl-sec-name" style={{color:cs.text}}>{cs.label}</span>
                  {standing && <span style={{marginLeft:6,fontSize:9.5,background:cs.stroke+'22',color:cs.text,padding:'2px 6px',borderRadius:99,fontWeight:700}}>STANDING</span>}
                  <div className="cl-sec-avail">{avail} seats available</div>
                </div>
                <span className="cl-sec-price" style={{color:cs.text}}>₹{price}</span>
              </div>
              {standing ? (
                <div className="cl-standing">
                  {catRows.flatMap(r=>
                    (rows[r]||[])
                      .sort((a,b)=>(a.seatNo||a.seat?.seatNo||'').localeCompare(b.seatNo||b.seat?.seatNo||'',undefined,{numeric:true}))
                      .map(seat => {
                        const isSel = selectedSeats.some(s=>s.screeningSeatsId===seat.screeningSeatsId);
                        const avl   = seat.availability?.toLowerCase();
                        return (
                          <div key={seat.screeningSeatsId}
                            className={`seat-btn cl-stand-seat ${isSel?'selected':avl}`}
                            style={!isSel&&avl==='available'?{background:cs.fill,borderColor:cs.stroke,color:cs.text}:{}}
                            onClick={()=>toggleSeat(seat)}
                            title={`${seat.seatNo || seat.seat?.seatNo} · ₹${seat.price}`}>
                            {(seat.seatNo || seat.seat?.seatNo)?.replace(/[A-Za-z]/g,'')||''}
                          </div>
                        );
                      })
                  )}
                </div>
              ) : (
                <div className="cl-sec-rows">
                  {catRows.map(row => (
                    <div key={row} className="cl-row">
                      <span className="cl-rlbl">{row}</span>
                      {(rows[row]||[])
                        .sort((a,b)=>(a.seatNo||a.seat?.seatNo||'').localeCompare(b.seatNo||b.seat?.seatNo||'',undefined,{numeric:true}))
                        .map(seat => {
                          const isSel = selectedSeats.some(s=>s.screeningSeatsId===seat.screeningSeatsId);
                          const avl   = seat.availability?.toLowerCase();
                          return (
                            <div key={seat.screeningSeatsId}
                              className={`seat-btn cl-seat ${isSel?'selected':avl}`}
                              style={!isSel&&avl==='available'?{background:cs.fill,borderColor:cs.stroke,color:cs.text}:{}}
                              onClick={()=>toggleSeat(seat)}
                              title={`${seat.seatNo || seat.seat?.seatNo} · ${cat} · ₹${seat.price}`}>
                              {(seat.seatNo || seat.seat?.seatNo)?.replace(/[A-Za-z]/g,'')||''}
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StadiumLayout({ sortedRows, rows, selectedSeats, toggleSeat }) {
  const standMap = {};
  sortedRows.forEach(row => {
    const cat = rows[row]?.[0]?.seatCategory || rows[row]?.[0]?.seat?.seatCategory || 'General';
    if (!standMap[cat]) standMap[cat] = [];
    standMap[cat].push(row);
  });
  const W=500, H=320, cx=W/2, cy=H/2+20;
  const pitchRx=80, pitchRy=50;
  return (
    <div className="sl-wrap">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{maxWidth:'100%'}}>
        <defs>
          <radialGradient id="pitch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bbf7d0"/>
            <stop offset="100%" stopColor="#4ade80"/>
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={cy} rx={200} ry={140} fill="none" stroke="#fce7f3" strokeWidth="16" strokeDasharray="6 4"/>
        <ellipse cx={cx} cy={cy} rx={pitchRx} ry={pitchRy} fill="url(#pitch)" stroke="#86efac" strokeWidth="2"/>
        <rect x={cx-8} y={cy-pitchRy+10} width={16} height={pitchRy*2-20} fill="none" stroke="#fff" strokeWidth="1.5" rx="2"/>
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="11" fontWeight="800" fill="#15803d" letterSpacing="1">🏏 PITCH</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize="8" fill="#16a34a" fontWeight="600">CRICKET GROUND</text>
        {[['N',cx,30],['S',cx,H-10],['W',22,cy+4],['E',W-14,cy+4]].map(([l,x,y])=>(
          <text key={l} x={x} y={y} textAnchor="middle" fontSize="11" fontWeight="800" fill="#d4a8be">{l}</text>
        ))}
      </svg>
      <div className="sl-stands-grid">
        {Object.keys(standMap).map(cat => {
          const cs       = getCat(cat);
          const catRows  = standMap[cat];
          const catSeats = catRows.flatMap(r=>rows[r]||[]);
          const price    = catSeats[0]?.price || 0;
          const avail    = catSeats.filter(s=>s.availability==='AVAILABLE').length;
          return (
            <div key={cat} className="sl-stand" style={{borderColor:cs.stroke+'44'}}>
              <div className="sl-stand-head">
                <div>
                  <span className="sl-stand-name" style={{color:cs.text}}>{cs.label}</span>
                  <div style={{fontSize:10.5,color:'#a87090',marginTop:2}}>{avail} available</div>
                </div>
                <span className="sl-stand-price" style={{color:cs.text}}>₹{price}</span>
              </div>
              <div className="sl-stand-rows">
                {catRows.map(row=>(
                  <div key={row} className="sl-row">
                    <span className="sl-rlbl">{row}</span>
                    {(rows[row]||[])
                      .sort((a,b)=>(a.seatNo||a.seat?.seatNo||'').localeCompare(b.seatNo||b.seat?.seatNo||'',undefined,{numeric:true}))
                      .map(seat=>{
                        const isSel = selectedSeats.some(s=>s.screeningSeatsId===seat.screeningSeatsId);
                        const avl   = seat.availability?.toLowerCase();
                        return (
                          <div key={seat.screeningSeatsId}
                            className={`seat-btn sl-seat ${isSel?'selected':avl}`}
                            style={!isSel&&avl==='available'?{background:cs.fill,borderColor:cs.stroke,color:cs.text}:{}}
                            onClick={()=>toggleSeat(seat)}
                            title={`${seat.seatNo || seat.seat?.seatNo} · ${cat} · ₹${seat.price}`}>
                            {(seat.seatNo || seat.seat?.seatNo)?.replace(/[A-Za-z]/g,'')||''}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SeatSelectionPage() {
  const { eventId, screeningId } = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [screening, setScreening]         = useState(null);
  const [event, setEvent]                 = useState(null);
  const [venue, setVenue]                 = useState(null);
  const [seats, setSeats]                 = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [booking, setBooking]             = useState(false);
  const [timeLeft, setTimeLeft]           = useState(HOLD_SECONDS);
  const [timerActive, setTimerActive]     = useState(false);
  const [expired, setExpired]             = useState(false);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(HOLD_SECONDS); setTimerActive(true); setExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerActive(false); setExpired(true); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current); setTimerActive(false); setTimeLeft(HOLD_SECONDS); setExpired(false);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  useEffect(() => {
    Promise.all([
      screeningsAPI.getById(screeningId),
      eventsAPI.getById(eventId),
      screeningSeatsAPI.getByScreening(screeningId),
    ]).then(([scr, ev, scts]) => {
      setScreening(scr); setEvent(ev); setSeats(scts);
      venuesAPI.getById(scr.venue?.venueId).then(setVenue).catch(()=>{});
    }).finally(() => setLoading(false));
  }, [screeningId, eventId]);

  const rows = {};
  seats.forEach(seat => {
    const r = seat.seatRow || seat.seat?.seatRow || 'A';
    if (!rows[r]) rows[r] = [];
    rows[r].push(seat);
  });
  const sortedRows = Object.keys(rows).sort();
  const categories = [...new Set(seats.map(s=>s.seatCategory || s.seat?.seatCategory).filter(Boolean))];
  const totalCost  = selectedSeats.reduce((s,x) => s + parseFloat(x.price||0), 0);
  const layout     = getLayout(event?.category);

  const LAYOUT_META = {
    theatre: { icon:'🎬', label:'Cinema / Theatre Layout' },
    concert: { icon:'🎵', label:'Concert Venue Layout'    },
    stadium: { icon:'🏟️', label:'Cricket Stadium Layout'  },
  };

  const toggleSeat = (seat) => {
    if (seat.availability !== 'AVAILABLE' || expired) return;
    setSelectedSeats(prev => {
      const exists = prev.find(s=>s.screeningSeatsId===seat.screeningSeatsId);
      let next;
      if (exists) { next = prev.filter(s=>s.screeningSeatsId!==seat.screeningSeatsId); }
      else { if (prev.length>=10) return prev; next=[...prev,seat]; }
      if (next.length>0 && prev.length===0) startTimer();
      if (next.length===0) stopTimer();
      return next;
    });
  };

  const handleExpireRetry = () => {
    setSelectedSeats([]); setExpired(false); setTimeLeft(HOLD_SECONDS);
    screeningSeatsAPI.getByScreening(screeningId).then(setSeats);
  };

  // ✅ FIXED — send seat.seatId instead of screeningSeats
  const handleProceed = async () => {
    if (!selectedSeats.length || expired) return;
    setBooking(true); clearInterval(timerRef.current); setTimerActive(false);
    try {
      const bookingData = await bookingsAPI.create({
        user: { userId: user.userId },
        screening: { screeningId: parseInt(screeningId) },
        totalCost, discounts: 0,
      });
      await Promise.all(selectedSeats.map(async ss => {
        await screeningSeatsAPI.updateAvailability(ss.screeningSeatsId, 'HELD');
        await bookingItemsAPI.create({
          booking: { bookingId: bookingData.bookingId },
          seat: { seatId: ss.seat?.seatId ?? ss.seatId },  // ✅ FIXED
          price: ss.price,
          status: 'ACTIVE',
        });
      }));
      navigate(`/payment/${bookingData.bookingId}`, {
        state: { selectedSeats, totalCost, screening, event, venue }
      });
    } catch (err) { alert('Booking failed: ' + err.message); setBooking(false); }
  };

  if (loading) return <div className="ss"><Navbar/><div className="ss-spin"><div className="ss-spinner"/></div></div>;

  const meta = LAYOUT_META[layout];

  return (
    <div className="ss">
      <style>{S}</style>
      <Navbar/>

      <div className="ss-bar">
        <div className="ss-bar-inner">
          <div>
            <button className="ss-back" onClick={()=>navigate(-1)}>← Back</button>
            <div className="ss-etitle">{event?.title}</div>
            <div className="ss-emeta">📍 {venue?.venueName} · 📅 {screening?.screenDate} · ⏰ {screening?.startTime}</div>
            <div className="ss-layout-tag">{meta.icon} {meta.label}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            {timerActive && <TimerRing seconds={timeLeft} total={HOLD_SECONDS}/>}
            <div className="ss-legend">
              {[
                {bg:'#fdf2f8',bd:'#f9a8d4',label:'Available'},
                {bg:'linear-gradient(135deg,#ec4899,#c084fc)',bd:'#ec4899',label:'Selected'},
                {bg:'#f3f4f6',bd:'#e5e7eb',label:'Booked'},
                {bg:'#fff7ed',bd:'#fed7aa',label:'Held'},
              ].map(({bg,bd,label})=>(
                <div key={label} className="ss-leg">
                  <div className="ss-legdot" style={{background:bg,border:`1.5px solid ${bd}`}}/>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ss-body">
        <div className="ss-map">
          {layout === 'theatre' && (
            <TheatreLayout sortedRows={sortedRows} rows={rows}
              selectedSeats={selectedSeats} toggleSeat={toggleSeat} categories={categories}/>
          )}
          {layout === 'concert' && (
            <ConcertLayout sortedRows={sortedRows} rows={rows}
              selectedSeats={selectedSeats} toggleSeat={toggleSeat} categories={categories}/>
          )}
          {layout === 'stadium' && (
            <StadiumLayout sortedRows={sortedRows} rows={rows}
              selectedSeats={selectedSeats} toggleSeat={toggleSeat}/>
          )}
        </div>

        <div className="ss-side">
          <div className="ss-card">
            <div className="ss-card-head">
              <div className="ss-card-title">🎟️ Booking Summary</div>
              {timerActive && (
                <div className="ss-timer-mini">
                  ⏱️ Hold expires in
                  <span style={{fontFamily:'JetBrains Mono,monospace',fontWeight:800,
                    color:timeLeft>60?'#ec4899':timeLeft>30?'#f97316':'#dc2626'}}>
                    {String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}
                  </span>
                </div>
              )}
            </div>
            <div className="ss-card-body">
              {selectedSeats.length===0 ? (
                <div className="ss-empty">
                  <span style={{fontSize:34}}>💺</span>
                  <span>Select seats to continue</span>
                </div>
              ) : (
                <>
                  {selectedSeats.map(s=>(
                    <div key={s.screeningSeatsId} className="ss-sitem">
                      <div>
                        <div className="ss-sname">Seat {s.seatNo || s.seat?.seatNo}</div>
                        <div className="ss-scat">{s.seatCategory || s.seat?.seatCategory}</div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span className="ss-sprice">₹{s.price}</span>
                        <button className="ss-xbtn" onClick={()=>toggleSeat(s)}>×</button>
                      </div>
                    </div>
                  ))}
                  <div className="ss-divider"/>
                  <div className="ss-total-row">
                    <span className="ss-tlbl">{selectedSeats.length} seat{selectedSeats.length>1?'s':''}</span>
                    <span className="ss-tval">₹{totalCost.toFixed(2)}</span>
                  </div>
                  <div className="ss-fnote">+ Convenience fees may apply</div>
                </>
              )}
              <button className="ss-pay-btn"
                onClick={handleProceed}
                disabled={!selectedSeats.length||booking||expired}>
                {booking
                  ? <><div style={{width:15,height:15,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'ssSpin .6s linear infinite'}}/> Processing…</>
                  : selectedSeats.length>0 ? `Proceed to Pay · ₹${totalCost.toFixed(2)}` : 'Select Seats'}
              </button>
              <div className="ss-maxnote">Max 10 seats per booking</div>
            </div>
          </div>
        </div>
      </div>

      {expired && (
        <div className="ss-exp-overlay">
          <div className="ss-exp-box">
            <div className="ss-exp-icon">⏰</div>
            <div className="ss-exp-title">Time's Up!</div>
            <div className="ss-exp-sub">
              Your <strong>2 minute</strong> seat hold expired.<br/>
              Seats have been released. Please select again.
            </div>
            <button className="ss-exp-btn" onClick={handleExpireRetry}>🔄 Select Again</button>
          </div>
        </div>
      )}
    </div>
  );
}