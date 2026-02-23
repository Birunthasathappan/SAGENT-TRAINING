import React, { useEffect, useState } from 'react';
import { getMembers, createMember, deleteMember } from '../../api';
import Toast from '../../components/Toast';
import '../student/Dashboard.css';

const empty = { name: '', email: '', password: '', role: 'STUDENT' };

export default function LibrarianMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => getMembers().then(r => { setMembers(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      setToast({ message: 'All fields required.', type: 'error' }); return;
    }
    setSaving(true);
    try {
      await createMember(form);
      setToast({ message: 'Member registered!', type: 'success' });
      setModal(false); setForm(empty); load();
    } catch { setToast({ message: 'Failed to add member.', type: 'error' }); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this member?')) return;
    try { await deleteMember(id); setToast({ message: 'Member removed.', type: 'success' }); load(); }
    catch { setToast({ message: 'Could not delete.', type: 'error' }); }
  };

  const filtered = members.filter(m =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">👥 Members</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>➕ Add Member</button>
      </div>
      <div className="card table-card">
        <div className="card-toolbar">
          <input className="search-input" placeholder="🔍 Search members..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>{filtered.length} members</span>
        </div>
        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>ID</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', background: '#7c2d12',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700
                        }}>{(m.name || '?').slice(0,2).toUpperCase()}</div>
                        <strong>{m.name}</strong>
                      </div>
                    </td>
                    <td>{m.email}</td>
                    <td><span className={`badge ${m.role === 'STAFF' ? 'badge-blue' : 'badge-green'}`}>{m.role || 'STUDENT'}</span></td>
                    <td style={{ color: 'var(--muted)' }}>#{m.id}</td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(m.id)}>🗑️ Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>➕ Register Member</h2>
            {[['name','Full Name'],['email','Email'],['password','Password']].map(([k, l]) => (
              <div key={k} className="form-group">
                <label>{l}</label>
                <input className="form-input" type={k === 'password' ? 'password' : 'text'}
                  value={form[k]} onChange={e => set(k, e.target.value)} placeholder={l} />
              </div>
            ))}
            <div className="form-group">
              <label>Role</label>
              <select className="form-input" value={form.role} onChange={e => set('role', e.target.value)}>
                <option>STUDENT</option><option>STAFF</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
                {saving ? 'Saving...' : '✅ Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
