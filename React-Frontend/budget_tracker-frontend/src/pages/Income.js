import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getIncomes, addIncome, updateIncome, deleteIncome } from '../services/api';

const TYPES = ['Salary','Freelance','Business','Investment','Rental','Other'];

export default function Income() {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ source:'', amount:'', incomeDate:'', incomeType:'', description:'' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => getIncomes(user.userId).then(r => setIncomes(r.data)).catch(() => {});
  useEffect(() => { if (user) load(); }, [user]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const today = () => new Date().toISOString().split('T')[0];

  const openAdd = () => {
    setForm({ source:'', amount:'', incomeDate: today(), incomeType:'', description:'' });
    setEditId(null); setShowModal(true);
  };

  const openEdit = (i) => {
    setForm({ source:i.source, amount:i.amount, incomeDate:i.incomeDate, incomeType:i.incomeType, description:i.description||'' });
    setEditId(i.id); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);

    const payload = {
      source: form.source,
      amount: parseFloat(form.amount),
      incomeDate: form.incomeDate,
      incomeType: form.incomeType,
      description: form.description,
      user: { userId: user.userId }
    };

    console.log('Sending payload:', payload);

    try {
      if (editId) await updateIncome(editId, payload);
      else await addIncome(payload);
      await load(); setShowModal(false);
    } catch(err) {
      console.error('Backend error:', err.response?.data);
      alert('Error saving income: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income entry?')) return;
    setDeleting(id);
    try { await deleteIncome(id); await load(); }
    finally { setDeleting(null); }
  };

  const fmt = n => 'Rs ' + Number(n).toLocaleString('en-IN');
  const total = incomes.reduce((s,i) => s+(i.amount||0), 0);
  const filtered = incomes.filter(i =>
    i.source?.toLowerCase().includes(search.toLowerCase()) ||
    i.incomeType?.toLowerCase().includes(search.toLowerCase())
  );

  const iS = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #DDE5EE', fontSize: 14, background: '#F8FAFB',
    color: '#0D1B2A', outline: 'none', fontFamily: 'Outfit, sans-serif',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  };
  const focus = e => e.target.style.borderColor = '#0EA5A0';
  const blur = e => e.target.style.borderColor = '#DDE5EE';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFB' }}>
      <Navbar />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, animation: 'fadeUp 0.4s ease' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0D1B2A', marginBottom: 4 }}>Income</h1>
            <p style={{ color: '#6B7C93', fontSize: 14 }}>Track all your income sources in one place</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#A8B6C8', letterSpacing: '0.07em' }}>TOTAL INCOME</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981' }}>{fmt(total)}</div>
            </div>
            <button onClick={openAdd}
              style={{
                padding: '12px 22px', background: 'linear-gradient(135deg, #0EA5A0, #0B7E7A)',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(14,165,160,0.35)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >+ Add Income</button>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20, animation: 'fadeUp 0.4s ease 0.1s both' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by source or type..."
            style={{ ...iS, width: 300 }}
            onFocus={focus} onBlur={blur}
          />
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #DDE5EE', overflow: 'hidden', boxShadow: '0 2px 12px rgba(15,44,78,0.07)', animation: 'fadeUp 0.4s ease 0.15s both' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #0F2C4E, #1A3F6F)' }}>
                {['Source','Amount','Date','Type','Description','Actions'].map(h => (
                  <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center', color: '#A8B6C8', fontSize: 15 }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>💰</div>
                  {search ? 'No results found' : 'No income added yet. Click "+ Add Income" to get started!'}
                </td></tr>
              ) : filtered.map((inc, idx) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid #EEF2F7', background: idx%2===0 ? '#fff' : '#FDFEFF', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F0FAFA'}
                  onMouseLeave={e => e.currentTarget.style.background = idx%2===0 ? '#fff' : '#FDFEFF'}
                >
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0D1B2A', fontSize: 14 }}>{inc.source}</td>
                  <td style={{ padding: '14px 20px', fontSize: 15, fontWeight: 800, color: '#10B981' }}>{fmt(inc.amount)}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#6B7C93' }}>{inc.incomeDate}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: '#D1FAE5', color: '#065F46' }}>{inc.incomeType}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#6B7C93', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.description || '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(inc)}
                        style={{ padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(inc.id)} disabled={deleting === inc.id}
                        style={{ padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', cursor: 'pointer', opacity: deleting === inc.id ? 0.6 : 1 }}>
                        {deleting === inc.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editId ? 'Edit Income' : 'Add Income'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</label>
                <input style={iS} value={form.source} onChange={set('source')} placeholder="e.g. Tech Corp" required onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount (Rs)</label>
                <input style={iS} type="number" value={form.amount} onChange={set('amount')} placeholder="0" required onFocus={focus} onBlur={blur} />
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                <input style={iS} type="date" value={form.incomeDate} onChange={set('incomeDate')} required onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                <select style={iS} value={form.incomeType} onChange={set('incomeType')} required onFocus={focus} onBlur={blur}>
                  <option value="">Select type</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334E68', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description (optional)</label>
              <input style={iS} value={form.description} onChange={set('description')} placeholder="Any notes..." onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', border: '1.5px solid #DDE5EE', borderRadius: 10, background: 'transparent', color: '#6B7C93', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #0EA5A0, #0B7E7A)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : 'Save Income'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      <Chatbot />
    </div>
  );
}