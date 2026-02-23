import React, { useEffect, useState } from 'react';
import { getBooks, borrowBook } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';
import './Dashboard.css';

export default function StudentBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBooks()
      .then(r => { setBooks(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleBorrow = async (bookId) => {
    console.log('User ID:', user.id, 'Book ID:', bookId);
    try {
      await borrowBook(user.id, bookId);
      setToast({ message: 'Book borrowed successfully!', type: 'success' });
      // ← reload books list after borrow
      getBooks().then(r => setBooks(r.data));
    } catch (e) {
      setToast({ message: e.response?.data?.message || 'Could not borrow book.', type: 'error' });
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
        <div>
          <h1 className="page-title">📚 Browse Books</h1>
          <p className="page-subtitle">Search and borrow from our collection</p>
        </div>
      </div>
      <div className="card table-card">
        <div className="card-toolbar">
          <input className="search-input" placeholder="🔍 Search by title or author..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>
            {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>
        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No books found matching your search.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  {/* <tr>
                    <th>#</th><th>Title</th><th>Author</th><th>Genre</th><th>Status</th><th>Action</th>
                  </tr> */}
                  <tr>
                    <th>#</th><th>Title</th><th>Author</th><th>Genre</th><th>Quantity</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                      <td><strong>{b.title || '—'}</strong></td>
                      <td>{b.author || '—'}</td>
                      {/* <td>{b.genre || b.genreName || '—'}</td>
                      <td>
                        {/* <span className={`badge ${b.available === false ? 'badge-red' : 'badge-green'}`}>
                          {b.available === false ? '🔴 Unavailable' : '🟢 Available'}
                        </span> 

                        <span className={`badge ${b.status === 'NOT_AVAILABLE' ? 'badge-red' : 'badge-green'}`}>
  {b.status === 'NOT_AVAILABLE' ? '🔴 Unavailable' : '🟢 Available'}
</span>

                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                          disabled={b.available === false}
                          onClick={() => handleBorrow(b.id)}
                        >
                          📖 Borrow
                        </button>
                      </td> */}

                       <td>{b.genre || '—'}</td>
                      <td style={{ fontWeight: 600 }}>{b.quantity ?? '—'}</td>
                      <td>
                        <span className={`badge ${b.status === 'NOT_AVAILABLE' ? 'badge-red' : 'badge-green'}`}>
                          {b.status === 'NOT_AVAILABLE' ? '🔴 Unavailable' : '🟢 Available'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                          disabled={b.status === 'NOT_AVAILABLE'}
                          onClick={() => handleBorrow(b.id)}
                        >
                          📖 Borrow
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}