import React, { useEffect, useState } from 'react';
import { getBorrows, borrowBook, returnBook, deleteBorrow, getMembers, getBooks } from '../../api';
import Toast from '../../components/Toast';
import '../student/Dashboard.css';

export default function LibrarianBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ memberId: '', bookId: '' });
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.allSettled([getBorrows(), getMembers(), getBooks()]).then(([br, m, b]) => {
      if (br.status === 'fulfilled') setBorrows(br.value.data);
      if (m.status === 'fulfilled') setMembers(m.value.data);
      if (b.status === 'fulfilled') setBooks(b.value.data);
      setLoading(false);
    });
  };
  useEffect(() => { load(); }, []);

  const handleIssue = async () => {
    if (!form.memberId || !form.bookId) { setToast({ message: 'Select member and book.', type: 'error' }); return; }
    setSaving(true);
    try {
      await borrowBook(form.memberId, form.bookId);
      setToast({ message: 'Book issued successfully!', type: 'success' });
      setModal(false); setForm({ memberId: '', bookId: '' }); load();
    } catch (e) { setToast({ message: e.response?.data?.message || 'Failed to issue book.', type: 'error' }); }
    setSaving(false);
  };

  const handleReturn = async (id) => {
    try { await returnBook(id); setToast({ message: 'Book returned!', type: 'success' }); load(); }
    catch { setToast({ message: 'Return failed.', type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await deleteBorrow(id); load(); } catch {}
  };

  return (
    <div className="dashboard fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">🔄 Borrow Management</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>📖 Issue Book</button>
      </div>
      <div className="card table-card">
        {loading ? <div className="spinner" /> : borrows.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No borrow records.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>#</th><th>Member</th><th>Book</th><th>Borrow Date</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {borrows.map((b, i) => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td>{b.memberName || b.member?.name || `#${b.memberId}`}</td>
                    <td><strong>{b.bookTitle || b.book?.title || `#${b.bookId}`}</strong></td>
                    <td>{b.borrowDate ? new Date(b.borrowDate).toLocaleDateString() : '—'}</td>
                    <td>{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`badge ${b.returned ? 'badge-green' : 'badge-yellow'}`}>
                        {b.returned ? '✅ Returned' : '⏳ Active'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {!b.returned && (
                        <button className="btn btn-success" style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                          onClick={() => handleReturn(b.id)}>↩️ Return</button>
                      )}
                      <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                        onClick={() => handleDelete(b.id)}>🗑️</button>
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
            <h2>📖 Issue a Book</h2>
            <div className="form-group">
              <label>Member</label>
              <select className="form-input" value={form.memberId}
                onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))}>
                <option value="">— Select Member —</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Book</label>
              <select className="form-input" value={form.bookId}
                onChange={e => setForm(f => ({ ...f, bookId: e.target.value }))}>
                <option value="">— Select Book —</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.title} - {b.author}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleIssue} disabled={saving}>
                {saving ? 'Issuing...' : '✅ Issue Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
