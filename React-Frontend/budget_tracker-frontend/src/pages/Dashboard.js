import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import { getIncomes, getExpenses, getBudgets, getGoals, addExpense } from '../services/api';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// 🔑 Replace with your Gemini API key
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const CATS = ['Food','Transport','Housing','Healthcare','Education','Entertainment','Shopping','Utilities','Other'];
const CAT_ICONS = {
  Food:'🍔', Transport:'🚗', Housing:'🏠', Healthcare:'🏥',
  Education:'📚', Entertainment:'🎬', Shopping:'🛍️', Utilities:'⚡', Other:'📦'
};
const CAT_COLORS = {
  Food:'#10B981', Transport:'#3B82F6', Housing:'#8B5CF6',
  Healthcare:'#EF4444', Education:'#F59E0B', Entertainment:'#EC4899',
  Shopping:'#F97316', Utilities:'#06B6D4', Other:'#6B7280'
};

const Card = ({ children, style }) => (
  <div style={{
    background:'#fff', borderRadius:16, padding:'24px 28px',
    boxShadow:'0 2px 12px rgba(15,44,78,0.07)',
    border:'1px solid #DDE5EE', ...style,
  }}>{children}</div>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position:'fixed', inset:0, background:'rgba(15,44,78,0.45)',
    display:'flex', alignItems:'center', justifyContent:'center',
    zIndex:1000, backdropFilter:'blur(4px)', padding:20,
  }}>
    <div style={{
      background:'#fff', borderRadius:20, width:'100%', maxWidth:540,
      boxShadow:'0 24px 64px rgba(15,44,78,0.2)', overflow:'hidden',
      animation:'slideUp 0.25s ease',
    }}>
      <div style={{
        background:'linear-gradient(135deg, #0F2C4E, #0EA5A0)',
        padding:'20px 28px', display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <span style={{ color:'#fff', fontWeight:800, fontSize:18 }}>{title}</span>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.8)', fontSize:22, cursor:'pointer', lineHeight:1 }}>×</button>
      </div>
      <div style={{ padding:'28px', maxHeight:'80vh', overflowY:'auto' }}>{children}</div>
    </div>
  </div>
);

const iS = {
  width:'100%', padding:'11px 14px', borderRadius:10,
  border:'1.5px solid #DDE5EE', fontSize:14, background:'#F8FAFB',
  color:'#0D1B2A', outline:'none', fontFamily:'Outfit, sans-serif',
  boxSizing:'border-box', transition:'border-color 0.15s',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ incomes:[], expenses:[], budgets:[], goals:[] });
  const [loading, setLoading] = useState(true);

  // Bill Upload modal state
  const [showBillModal, setShowBillModal] = useState(false);
  const [billPreview, setBillPreview] = useState(null);
  const [billBase64, setBillBase64] = useState(null);
  const [billMime, setBillMime] = useState('image/jpeg');
  const [billForm, setBillForm] = useState({ category:'', description:'', eAmount:'', eDate:'' });
  const [billSaving, setBillSaving] = useState(false);
  const [aiExtracting, setAiExtracting] = useState(false);
  const [aiExtracted, setAiExtracted] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    if (!user) return;
    const uid = user.userId;
    Promise.all([getIncomes(uid), getExpenses(uid), getBudgets(uid), getGoals(uid)])
      .then(([i, e, b, g]) => {
        setData({ incomes:i.data, expenses:e.data, budgets:b.data, goals:g.data });
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user]);

  const { incomes, expenses, budgets, goals } = data;
  const totalIncome  = incomes.reduce((s, i) => s + (i.amount || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + (e.eAmount || 0), 0);
  const balance  = totalIncome - totalExpense;
  const pctSpent = totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(2) : '0.00';
  const fmt = n => 'Rs ' + Number(n).toLocaleString('en-IN');
  const today = () => new Date().toISOString().split('T')[0];

  const monthlyMap = {};
  incomes.forEach(i => {
    const m = i.incomeDate?.slice(0,7) || 'N/A';
    monthlyMap[m] = monthlyMap[m] || { month:m, Income:0, Expenses:0 };
    monthlyMap[m].Income += i.amount || 0;
  });
  expenses.forEach(e => {
    const m = e.eDate?.slice(0,7) || 'N/A';
    monthlyMap[m] = monthlyMap[m] || { month:m, Income:0, Expenses:0 };
    monthlyMap[m].Expenses += e.eAmount || 0;
  });
  const chartData = Object.values(monthlyMap).sort((a,b) => a.month.localeCompare(b.month)).slice(-6);

  const catMap = {};
  expenses.forEach(e => { catMap[e.category] = (catMap[e.category]||0) + (e.eAmount||0); });
  const catData = Object.entries(catMap).map(([name,value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  const stats = [
    { label:'TOTAL INCOME',      value:fmt(totalIncome),  accent:'#10B981', desc:'All income sources' },
    { label:'TOTAL EXPENSE',     value:fmt(totalExpense), accent:'#EF4444', desc:'All spending' },
    { label:'REMAINING BALANCE', value:fmt(balance),      accent:'#3B5FC0', desc: balance >= 0 ? 'Surplus' : 'Deficit' },
    { label:'INCOME SPENT',      value:pctSpent+'%',      accent:'#F59E0B', desc:'Displayed as percentage' },
  ];

  // ── Convert file to base64 ────────────────────────────────────────────────
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // ── Gemini Vision: extract bill data ─────────────────────────────────────
  const extractBillWithAI = async (base64, mime) => {
    const prompt = `You are a bill/receipt data extractor. Analyze this bill/receipt image and extract the following information. Respond ONLY with a valid JSON object, no extra text, no markdown:
{
  "amount": <total amount as a number, e.g. 450.00>,
  "date": "<date in YYYY-MM-DD format, use today if not found>",
  "description": "<short description of what was purchased, max 60 chars>",
  "category": "<one of: Food, Transport, Housing, Healthcare, Education, Entertainment, Shopping, Utilities, Other>"
}
If you cannot find a value, use reasonable defaults. For date use "${today()}".`;

    const response = await fetch(GEMINI_VISION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mime, data: base64 } }
          ]
        }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.1 }
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  };

  // ── Handle file selection ─────────────────────────────────────────────────
  const handleBillFile = async (file) => {
    if (!file) return;
    setBillPreview(URL.createObjectURL(file));
    setBillMime(file.type || 'image/jpeg');
    setBillForm({ category:'', description:'', eAmount:'', eDate: today() });
    setAiExtracted(false);

    try {
      setAiExtracting(true);
      const base64 = await fileToBase64(file);
      setBillBase64(base64);

      // Auto-extract with Gemini Vision
      const extracted = await extractBillWithAI(base64, file.type || 'image/jpeg');

      setBillForm({
        category: CATS.includes(extracted.category) ? extracted.category : 'Other',
        description: extracted.description || '',
        eAmount: extracted.amount ? String(extracted.amount) : '',
        eDate: extracted.date || today(),
      });
      setAiExtracted(true);
    } catch (err) {
      console.error('AI extraction failed:', err);
      // Fall back to empty form — user fills manually
      setBillForm({ category:'', description:'', eAmount:'', eDate: today() });
    } finally {
      setAiExtracting(false);
    }
  };

  const handleBillDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleBillFile(file);
  };

  const handleBillSave = async (e) => {
    e.preventDefault();
    setBillSaving(true);
    try {
      await addExpense({
        category: billForm.category,
        description: billForm.description,
        eAmount: parseFloat(billForm.eAmount),
        eDate: billForm.eDate,
        user: { userId: user.userId },
      });
      await load();
      setShowBillModal(false);
      setBillPreview(null);
      setBillBase64(null);
      setAiExtracted(false);
      setBillForm({ category:'', description:'', eAmount:'', eDate:'' });
    } catch(err) {
      alert('Error saving: ' + (err.response?.data || err.message));
    } finally {
      setBillSaving(false);
    }
  };

  const openBillModal = () => {
    setBillPreview(null);
    setBillBase64(null);
    setAiExtracted(false);
    setBillForm({ category:'', description:'', eAmount:'', eDate: today() });
    setShowBillModal(true);
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)' }}>
      <style>{`
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
      <Navbar />
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 28px' }}>

        {/* Hero Banner */}
        <div style={{
          background:'linear-gradient(135deg, #0EA5A0 0%, #3B5FC0 60%, #0F2C4E 100%)',
          borderRadius:20, padding:'40px 48px', marginBottom:28,
          position:'relative', overflow:'hidden', animation:'fadeUp 0.4s ease',
        }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
          <div style={{ position:'absolute', bottom:-80, right:80, width:200, height:200, borderRadius:'50%', background:'rgba(109,213,209,0.12)' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <h1 style={{ color:'#fff', fontSize:32, fontWeight:800, marginBottom:8 }}>Financial Dashboard</h1>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:15 }}>
              Monitor income, expenses, budgets, and savings goals in one view.
            </p>
          </div>
        </div>

        {/* ── Upload Bill Button only ── */}
        <div style={{ display:'flex', gap:14, marginBottom:28, animation:'fadeUp 0.4s ease 0.05s both' }}>
          <button
            onClick={openBillModal}
            style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'13px 28px', borderRadius:12, border:'none', cursor:'pointer',
              background:'linear-gradient(135deg, #EF4444, #DC2626)',
              color:'#fff', fontSize:14, fontWeight:700,
              boxShadow:'0 4px 14px rgba(239,68,68,0.3)', transition:'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(239,68,68,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(239,68,68,0.3)'; }}
          >
            <span style={{ fontSize:18 }}>📄</span>
            Upload Bill & Add Expense
          </button>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'#6B7C93', fontSize:15 }}>
            <div style={{ width:32, height:32, border:'3px solid #DDE5EE', borderTop:'3px solid #0EA5A0', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
            Loading your financial data...
          </div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24, animation:'fadeUp 0.5s ease 0.1s both' }}>
              {stats.map(s => (
                <Card key={s.label} style={{ borderLeft:`4px solid ${s.accent}`, padding:'20px 22px', transition:'transform 0.2s, box-shadow 0.2s', cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(15,44,78,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(15,44,78,0.07)'; }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#A8B6C8', letterSpacing:'0.08em', marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontSize:26, fontWeight:800, color:'#0D1B2A', marginBottom:4, fontFamily:'Outfit, sans-serif' }}>{s.value}</div>
                  <div style={{ fontSize:12, color:'#6B7C93' }}>{s.desc}</div>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:24, animation:'fadeUp 0.5s ease 0.2s both' }}>
              <Card>
                <div style={{ fontWeight:700, fontSize:17, color:'#0D1B2A', marginBottom:20 }}>Income vs Expenses Overview</div>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5A0" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#0EA5A0" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                      <XAxis dataKey="month" tick={{ fontSize:12, fill:'#6B7C93' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} tickFormatter={v => 'Rs'+(v/1000)+'k'} />
                      <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius:10, border:'1px solid #DDE5EE', fontSize:13 }} />
                      <Area type="monotone" dataKey="Income" stroke="#0EA5A0" fill="url(#gInc)" strokeWidth={2.5} />
                      <Area type="monotone" dataKey="Expenses" stroke="#EF4444" fill="url(#gExp)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#A8B6C8', fontSize:14, flexDirection:'column', gap:8 }}>
                    <span style={{ fontSize:36 }}>📊</span>
                    Add income and expenses to see your chart
                  </div>
                )}
              </Card>

              <Card>
                <div style={{ fontWeight:700, fontSize:17, color:'#0D1B2A', marginBottom:20 }}>Spending by Category</div>
                {catData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={catData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} tickFormatter={v => 'Rs'+(v/1000)+'k'} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize:12, fill:'#334E68' }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius:10, border:'1px solid #DDE5EE', fontSize:13 }} />
                      <Bar dataKey="value" fill="#0EA5A0" radius={[0,4,4,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#A8B6C8', fontSize:14, flexDirection:'column', gap:8 }}>
                    <span style={{ fontSize:36 }}>🛍️</span>
                    No expense categories yet
                  </div>
                )}
              </Card>
            </div>

            {/* Budget Status */}
            <div style={{ marginBottom:24, animation:'fadeUp 0.5s ease 0.3s both' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h2 style={{ fontSize:18, fontWeight:700, color:'#0D1B2A' }}>Budget Status</h2>
                <button onClick={() => navigate('/budgets')} style={{ background:'none', border:'none', color:'#0EA5A0', fontSize:13, fontWeight:700, cursor:'pointer' }}>View All →</button>
              </div>
              {budgets.length === 0 ? (
                <Card style={{ textAlign:'center', padding:'40px', color:'#A8B6C8' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
                  <div>No budgets set yet. <span onClick={() => navigate('/budgets')} style={{ color:'#0EA5A0', cursor:'pointer', fontWeight:600 }}>Create one →</span></div>
                </Card>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
                  {budgets.map(b => {
                    const spent = expenses.filter(e => e.category === b.bCategory).reduce((s,e) => s+(e.eAmount||0), 0);
                    const pct = Math.min(100, Math.round((spent/b.bAmount)*100));
                    const over = spent > b.bAmount;
                    return (
                      <Card key={b.bId} style={{ padding:'18px 22px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                          <span style={{ fontWeight:700, fontSize:15, color:'#0D1B2A' }}>{b.bCategory}</span>
                          <span style={{ fontSize:13, color: over?'#EF4444':'#6B7C93', fontWeight:600 }}>{fmt(spent)} / {fmt(b.bAmount)}</span>
                        </div>
                        <div style={{ background:'#EEF2F7', borderRadius:99, height:10, overflow:'hidden', marginBottom:6 }}>
                          <div style={{ width:pct+'%', height:'100%', borderRadius:99, background: over?'#EF4444':'linear-gradient(90deg,#0EA5A0,#3B5FC0)', transition:'width 0.5s', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ fontSize:9, color:'#fff', fontWeight:700 }}>{pct > 20 ? pct+'%' : ''}</span>
                          </div>
                        </div>
                        <div style={{ fontSize:12, color: over?'#EF4444':'#10B981', fontWeight:600 }}>
                          {over ? `⚠ Over by ${fmt(spent-b.bAmount)}` : `✓ ${fmt(b.bAmount-spent)} remaining`}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Savings Goals */}
            <div style={{ animation:'fadeUp 0.5s ease 0.4s both' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h2 style={{ fontSize:18, fontWeight:700, color:'#0D1B2A' }}>Savings Goals</h2>
                <button onClick={() => navigate('/goals')} style={{ background:'none', border:'none', color:'#0EA5A0', fontSize:13, fontWeight:700, cursor:'pointer' }}>View All →</button>
              </div>
              {goals.length === 0 ? (
                <Card style={{ textAlign:'center', padding:'40px', color:'#A8B6C8' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🎯</div>
                  <div>No goals set. <span onClick={() => navigate('/goals')} style={{ color:'#0EA5A0', cursor:'pointer', fontWeight:600 }}>Create a goal →</span></div>
                </Card>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
                  {goals.map(g => {
                    const pct = Math.min(100, Math.round((g.savedAmount/g.totalAmount)*100));
                    const done = pct >= 100;
                    return (
                      <Card key={g.gId} style={{ padding:'18px 22px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                          <span style={{ fontWeight:700, fontSize:15 }}>{done?'🏆':'🎯'} {g.goalName}</span>
                          <span style={{ fontWeight:700, color: done?'#10B981':'#0EA5A0', fontSize:15 }}>{pct}%</span>
                        </div>
                        <div style={{ background:'#EEF2F7', borderRadius:99, height:8, overflow:'hidden', marginBottom:6 }}>
                          <div style={{ width:pct+'%', height:'100%', borderRadius:99, background: done?'#10B981':'linear-gradient(90deg,#6DD5D1,#0EA5A0)', transition:'width 0.5s' }} />
                        </div>
                        <div style={{ fontSize:12, color:'#6B7C93' }}>{fmt(g.savedAmount)} of {fmt(g.totalAmount)}</div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════
          MODAL — Bill Upload + Gemini AI Extract
      ══════════════════════════════════════════ */}
      {showBillModal && (
        <Modal title="📄 Upload Bill — AI Auto-Fill" onClose={() => setShowBillModal(false)}>
          <form onSubmit={handleBillSave}>

            {/* Image upload/drop area */}
            <div
              onDrop={handleBillDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => !billPreview && fileInputRef.current?.click()}
              style={{
                border: billPreview ? '2px solid #0EA5A0' : '2px dashed #DDE5EE',
                borderRadius:12, padding: billPreview ? 0 : '28px 20px',
                textAlign:'center', marginBottom:16,
                cursor: billPreview ? 'default' : 'pointer',
                background: billPreview ? 'transparent' : '#F8FAFB',
                overflow:'hidden', transition:'all 0.2s',
              }}
            >
              {billPreview ? (
                <div style={{ position:'relative' }}>
                  <img src={billPreview} alt="Bill preview" style={{ width:'100%', maxHeight:180, objectFit:'contain', display:'block', borderRadius:10 }} />
                  <button type="button"
                    onClick={e => { e.stopPropagation(); setBillPreview(null); setBillBase64(null); setAiExtracted(false); setBillForm({ category:'', description:'', eAmount:'', eDate: today() }); }}
                    style={{ position:'absolute', top:8, right:8, background:'rgba(239,68,68,0.9)', border:'none', borderRadius:'50%', width:28, height:28, color:'#fff', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize:40, marginBottom:10 }}>📄</div>
                  <div style={{ fontWeight:700, color:'#334E68', fontSize:14, marginBottom:4 }}>Click or drag & drop your bill</div>
                  <div style={{ fontSize:12, color:'#A8B6C8' }}>AI will automatically read & fill the details</div>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => handleBillFile(e.target.files[0])} />

            {/* AI Extracting status */}
            {aiExtracting && (
              <div style={{
                display:'flex', alignItems:'center', gap:10, padding:'12px 16px',
                borderRadius:10, marginBottom:16,
                background:'linear-gradient(90deg, #EBF8F8, #F0F4FF, #EBF8F8)',
                backgroundSize:'200% 100%',
                animation:'shimmer 1.5s linear infinite',
                border:'1px solid #6DD5D1',
              }}>
                <div style={{ width:18, height:18, border:'2.5px solid #DDE5EE', borderTop:'2.5px solid #0EA5A0', borderRadius:'50%', animation:'spin 0.7s linear infinite', flexShrink:0 }} />
                <span style={{ fontSize:13, fontWeight:600, color:'#0B7E7A' }}>🤖 Gemini AI is reading your bill...</span>
              </div>
            )}

            {/* AI success badge */}
            {aiExtracted && !aiExtracting && (
              <div style={{
                display:'flex', alignItems:'center', gap:8, padding:'10px 16px',
                borderRadius:10, marginBottom:16,
                background:'#ECFDF5', border:'1px solid #6EE7B7',
              }}>
                <span style={{ fontSize:16 }}>✅</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#065F46' }}>AI extracted data from your bill! Review and save below.</span>
              </div>
            )}

            {/* Form fields */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Category *
                  {aiExtracted && <span style={{ marginLeft:6, fontSize:10, color:'#0EA5A0', fontWeight:600 }}>✨ AI</span>}
                </label>
                <select style={iS} value={billForm.category}
                  onChange={e => setBillForm(f => ({...f, category:e.target.value}))} required
                  onFocus={e => e.target.style.borderColor='#EF4444'}
                  onBlur={e => e.target.style.borderColor='#DDE5EE'}>
                  <option value="">Select</option>
                  {CATS.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Amount (Rs) *
                  {aiExtracted && <span style={{ marginLeft:6, fontSize:10, color:'#0EA5A0', fontWeight:600 }}>✨ AI</span>}
                </label>
                <input style={iS} type="number" min="0" step="0.01" placeholder="0.00"
                  value={billForm.eAmount}
                  onChange={e => setBillForm(f => ({...f, eAmount:e.target.value}))} required
                  onFocus={e => e.target.style.borderColor='#EF4444'}
                  onBlur={e => e.target.style.borderColor='#DDE5EE'} />
              </div>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                Date *
                {aiExtracted && <span style={{ marginLeft:6, fontSize:10, color:'#0EA5A0', fontWeight:600 }}>✨ AI</span>}
              </label>
              <input style={iS} type="date" value={billForm.eDate}
                onChange={e => setBillForm(f => ({...f, eDate:e.target.value}))} required
                onFocus={e => e.target.style.borderColor='#EF4444'}
                onBlur={e => e.target.style.borderColor='#DDE5EE'} />
            </div>

            <div style={{ marginBottom:22 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                Description
                {aiExtracted && <span style={{ marginLeft:6, fontSize:10, color:'#0EA5A0', fontWeight:600 }}>✨ AI</span>}
              </label>
              <input style={iS} placeholder="e.g. Grocery bill from BigBazaar"
                value={billForm.description}
                onChange={e => setBillForm(f => ({...f, description:e.target.value}))}
                onFocus={e => e.target.style.borderColor='#EF4444'}
                onBlur={e => e.target.style.borderColor='#DDE5EE'} />
            </div>

            <div style={{ display:'flex', gap:12 }}>
              <button type="button" onClick={() => setShowBillModal(false)}
                style={{ flex:1, padding:'12px', border:'1.5px solid #DDE5EE', borderRadius:10, background:'transparent', color:'#6B7C93', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={billSaving || aiExtracting}
                style={{ flex:2, padding:'12px', background:'linear-gradient(135deg,#EF4444,#DC2626)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor: (billSaving||aiExtracting)?'not-allowed':'pointer', opacity: (billSaving||aiExtracting)?0.7:1 }}>
                {billSaving ? 'Saving...' : aiExtracting ? 'Reading bill...' : '💾 Save Expense'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <Chatbot />
    </div>
  );
}