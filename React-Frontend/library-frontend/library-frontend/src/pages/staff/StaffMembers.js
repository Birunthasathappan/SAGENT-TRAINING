import React, { useEffect, useState } from 'react';
import { getMembers } from '../../api';
import '../student/Dashboard.css';

export default function StaffMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers()
      .then(r => { setMembers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = members.filter(m =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard fade-up">
      <div className="page-header"><h1 className="page-title">👥 Members</h1></div>
      <div className="card table-card">
        <div className="card-toolbar">
          <input className="search-input" placeholder="🔍 Search members..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>
            {filtered.length} members
          </span>
        </div>
        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>ID</th></tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', background: '#4a6741',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                        }}>
                          {(m.name || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <strong>{m.name}</strong>
                      </div>
                    </td>
                    <td>{m.email}</td>
                    <td>
                      <span className={`badge ${m.role === 'STAFF' ? 'badge-blue' : 'badge-green'}`}>
                        {m.role || 'STUDENT'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>#{m.id}</td>
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