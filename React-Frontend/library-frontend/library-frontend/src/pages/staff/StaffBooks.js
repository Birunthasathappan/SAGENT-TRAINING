import React, { useEffect, useState } from 'react';
import { getBooks } from '../../api';
import '../student/Dashboard.css';

export default function StaffBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
      .then(r => { setBooks(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = books.filter(b =>
    (b.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.author || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard fade-up">
      <div className="page-header">
        <h1 className="page-title">📚 Book Catalog</h1>
      </div>
      <div className="card table-card">
        <div className="card-toolbar">
          <input className="search-input" placeholder="🔍 Search books..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>
            {filtered.length} books
          </span>
        </div>
        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Title</th><th>Author</th><th>Genre</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td><strong>{b.title || '—'}</strong></td>
                    <td>{b.author || '—'}</td>
                    <td>{b.genre || b.genreName || '—'}</td>
                    <td>
                      <span className={`badge ${b.available === false ? 'badge-red' : 'badge-green'}`}>
                        {b.available === false ? '🔴 Unavailable' : '🟢 Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}