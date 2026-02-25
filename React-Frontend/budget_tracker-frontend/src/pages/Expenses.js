import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/api';

const CATS = ['Food','Transport','Housing','Healthcare','Education','Entertainment','Shopping','Utilities','Other'];
const CAT_COLORS = { 
  Food:'#10B981', Transport:'#3B82F6', Housing:'#8B5CF6', 
  Healthcare:'#EF4444', Education:'#F59E0B', Entertainment:'#EC4899', 
  Shopping:'#F97316', Utilities:'#06B6D4', Other:'#6B7280' 
};

export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ category:'', description:'', eAmount:'', eDate:'' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = () => getExpenses(user.userId)
    .then(r => {
      console.log('Expenses loaded:', r.data);
      setExpenses(r.data);
    })
    .catch(err => console.error('Load error:', err));

  useEffect(() => { if (user) load(); }, [user]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const today = () => new Date().toISOString().split('T')[0];

  const openAdd = () => {
    setForm({ category:'', description:'', eAmount:'', eDate: today() });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (ex) => {
    setForm({
      category: ex.category,
      description: ex.description || '',
      eAmount: ex.eAmount,
      eDate: ex.eDate
    });
    setEditId(ex.eId);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      category: form.category,
      description: form.description,
      eAmount: parseFloat(form.eAmount),
      eDate: form.eDate,
      user: { userId: user.userId }
    };
    console.log('Saving expense payload:', JSON.stringify(payload));
    try {
      if (editId) await updateExpense(editId, payload);
      else await addExpense(payload);
      await load();
      setShowModal(false);
    } catch(err) {
      console.error('Save error:', err.response?.data || err.message);
      alert('Error saving expense: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log('Deleting expense with id:', id);
    if (!id) {
      alert('Cannot delete: missing expense ID');
      return;
    }
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      await load();
    } catch(err) {
      console.error('Delete error:', err.response?.data || err.message);
      alert('Error deleting: ' + (err.response?.data || err.message));
    }
  };

  const fmt = n => {
    const num = Number(n);
    if (isNaN(num)) return 'Rs 0';
    return 'Rs ' + num.toLocaleString('en-IN');
  };

  const total = expenses.reduce((s, e) => s + (Number(e.eAmount) || 0), 0);

  const filtered = expenses.filter(e =>
    (!filter || e.category === filter) &&
    (!search || e.description?.toLowerCase().includes(search.toLowerCase()) ||
     e.category?.toLowerCase().includes(search.toLowerCase()))
  );

  const iS = {
    width:'100%', padding:'11px 14px', borderRadius:10,
    border:'1.5px solid #DDE5EE', fontSize:14, background:'#F8FAFB',
    color:'#0D1B2A', outline:'none', fontFamily:'Outfit, sans-serif',
    boxSizing:'border-box', transition:'border-color 0.15s'
  };
  const focus = e => e.target.style.borderColor = '#EF4444';
  const blur  = e => e.target.style.borderColor = '#DDE5EE';

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFB' }}>
      <Navbar />
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 28px' }}>
        
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'#0D1B2A', marginBottom:4 }}>Expenses</h1>
            <p style={{ color:'#6B7C93', fontSize:14 }}>Track and categorize all your spending</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#A8B6C8', letterSpacing:'0.07em' }}>TOTAL SPENT</div>
              <div style={{ fontSize:24, fontWeight:800, color:'#EF4444' }}>{fmt(total)}</div>
            </div>
            <button onClick={openAdd}
              style={{ padding:'12px 22px', background:'linear-gradient(135deg, #EF4444, #DC2626)', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(239,68,68,0.35)' }}
            >+ Add Expense</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..."
            style={{ ...iS, width:240 }}
            onFocus={e => e.target.style.borderColor='#0EA5A0'}
            onBlur={e => e.target.style.borderColor='#DDE5EE'} />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...iS, width:'auto', paddingRight:32 }}>
            <option value="">All Categories</option>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #DDE5EE', overflow:'hidden', boxShadow:'0 2px 12px rgba(15,44,78,0.07)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
                {['Category','Amount','Date','Description','Actions'].map(h => (
                  <th key={h} style={{ padding:'13px 20px', textAlign:'left', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.8)', letterSpacing:'0.07em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding:'60px 20px', textAlign:'center', color:'#A8B6C8', fontSize:15 }}>
                    <div style={{ fontSize:36, marginBottom:10 }}>💳</div>
                    {search || filter ? 'No matching expenses' : 'No expenses yet. Click "+ Add Expense" to start!'}
                  </td>
                </tr>
              ) : filtered.map((exp, idx) => (
                <tr key={exp.eId || idx}
                  style={{ borderBottom:'1px solid #EEF2F7', background:idx%2===0?'#fff':'#FFFBFB' }}
                  onMouseEnter={e => e.currentTarget.style.background='#FFF5F5'}
                  onMouseLeave={e => e.currentTarget.style.background=idx%2===0?'#fff':'#FFFBFB'}
                >
                  <td style={{ padding:'14px 20px' }}>
                    <span style={{ padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:700, background:(CAT_COLORS[exp.category]||'#6B7280')+'20', color:CAT_COLORS[exp.category]||'#6B7280' }}>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:15, fontWeight:800, color:'#EF4444' }}>
                    {fmt(exp.eAmount)}
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:13, color:'#6B7C93' }}>
                    {exp.eDate || '—'}
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:13, color:'#6B7C93', maxWidth:200 }}>
                    {exp.description || '—'}
                  </td>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => openEdit(exp)}
                        style={{ padding:'5px 14px', borderRadius:7, fontSize:12, fontWeight:600, background:'#FEF3C7', color:'#92400E', border:'1px solid #FCD34D', cursor:'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(exp.eId)}
                        style={{ padding:'5px 14px', borderRadius:7, fontSize:12, fontWeight:600, background:'#FEE2E2', color:'#991B1B', border:'1px solid #FCA5A5', cursor:'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editId ? 'Edit Expense' : 'Add Expense'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <div style={{ display:'flex', gap:14 }}>
              <div style={{ flex:1 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Category</label>
                <select style={iS} value={form.category} onChange={set('category')} required onFocus={focus} onBlur={blur}>
                  <option value="">Select category</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex:1 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Amount (Rs)</label>
                <input style={iS} type="number" min="0" step="0.01" value={form.eAmount} onChange={set('eAmount')} placeholder="0" required onFocus={focus} onBlur={blur} />
              </div>
            </div>
            <div style={{ marginTop:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Date</label>
              <input style={iS} type="date" value={form.eDate} onChange={set('eDate')} required onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ marginTop:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#334E68', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Description (optional)</label>
              <input style={iS} value={form.description} onChange={set('description')} placeholder="Add details..." onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button type="button" onClick={() => setShowModal(false)}
                style={{ flex:1, padding:'12px', border:'1.5px solid #DDE5EE', borderRadius:10, background:'transparent', color:'#6B7C93', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex:1, padding:'12px', background:'linear-gradient(135deg, #EF4444, #DC2626)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1 }}>
                {loading ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      <Chatbot />
    </div>
  );
}