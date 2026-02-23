import React, { useEffect, useState } from 'react';
import { getBooks, createBook, deleteBook } from '../../api';
import Toast from '../../components/Toast';
import '../student/Dashboard.css';

const empty = { title: '', author: '', genre: '', quantity: 1 };

export default function LibrarianBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  //const load = () => getBooks().then(r => { setBooks(r.data); setLoading(false); }).catch(() => setLoading(false));

  const load = () => {
    setLoading(true);
    getBooks().then(r => { setBooks(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.title || !form.author) { setToast({ message: 'Title and Author are required.', type: 'error' }); return; }
    setSaving(true);
    try {
      await createBook(form);
      setToast({ message: 'Book added successfully!', type: 'success' });
      setModal(false); setForm(empty); load();
    } catch {
      setToast({ message: 'Failed to add book.', type: 'error' });
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await deleteBook(id);
      setToast({ message: 'Book deleted.', type: 'success' });
      load();
    } catch {
      setToast({ message: 'Could not delete book.', type: 'error' });
    }
  };

  const filtered = books.filter(b =>
    (b.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.author || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard fade-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="page-header">
        <h1 className="page-title">📚 Manage Books</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>➕ Add Book</button>
      </div>
      <div className="card table-card">
        <div className="card-toolbar">
          <input className="search-input" placeholder="🔍 Search books..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>{filtered.length} books</span>
        </div>
        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📭</div><p>No books found.</p></div>
            ) : (
              <table className="data-table">
                {/* <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Genre</th><th>Status</th><th>Action</th></tr></thead> */}

                 <thead><tr><th>#</th><th>Title</th><th>Author</th><th>Genre</th><th>Quantity</th><th>Status</th><th>Action</th></tr></thead>

                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                      <td><strong>{b.title}</strong></td>
                      <td>{b.author || '—'}</td>
                      {/* <td>{b.genre || b.genreName || '—'}</td>
                      {/* <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{b.isbn || '—'}</td> */}
                       {/* <td> */}
                        {/* <span className={`badge ${b.available === false ? 'badge-red' : 'badge-green'}`}>
                          {b.available === false ? '🔴 Out' : '🟢 Available'}
                        </span> 

                        <span className={`badge ${b.status === 'NOT_AVAILABLE' ? 'badge-red' : 'badge-green'}`}>
  {b.status === 'NOT_AVAILABLE' ? '🔴 Not Available' : '🟢 Available'}
</span>
                      </td> */}

                       <td>{b.genre || '—'}</td>
                      <td style={{ fontWeight: 600 }}>{b.quantity ?? '—'}</td>
                      <td>
                        <span className={`badge ${b.status === 'NOT_AVAILABLE' ? 'badge-red' : 'badge-green'}`}>
                          {b.status === 'NOT_AVAILABLE' ? '🔴 Not Available' : '🟢 Available'}
                        </span>
                      </td>

                      <td>
                        <button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleDelete(b.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>➕ Add New Book</h2>
            {[['title','Title *'],['author','Author *'],['genre','Genre']].map(([k, l]) => (
              <div key={k} className="form-group">
                <label>{l}</label>
                <input className="form-input" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={l} />
              </div>
            ))}
            <div className="form-group">
              <label>Quantity</label>
              <input className="form-input" type="number" min="1" value={form.quantity}
                onChange={e => set('quantity', parseInt(e.target.value))} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
                {saving ? 'Saving...' : '✅ Add Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
