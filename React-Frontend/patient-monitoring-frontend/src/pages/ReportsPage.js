import React, { useEffect, useState } from 'react';
import { reportAPI, patientAPI, healthDataAPI } from '../services/api';

function Modal({ item, patients, healthData, onClose, onSave }) {
  const [form, setForm] = useState(item ? {
    reportDetails: item.reportDetails, filePath: item.filePath,
    patient: { patientId: item.patient?.patientId },
    healthData: { healthId: item.healthData?.healthId }
  } : { reportDetails: '', filePath: '', patient: { patientId: '' }, healthData: { healthId: '' } });

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => { e.preventDefault(); await onSave(form); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{item ? 'Edit Report' : 'Add Report'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Patient</label>
                <select value={form.patient.patientId} onChange={e => setForm(f => ({ ...f, patient: { patientId: parseInt(e.target.value) } }))} required>
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Health Data</label>
                <select value={form.healthData.healthId} onChange={e => setForm(f => ({ ...f, healthData: { healthId: parseInt(e.target.value) } }))}>
                  <option value="">Select health record</option>
                  {healthData.map(h => <option key={h.healthId} value={h.healthId}>Record #{h.healthId} — {h.patient?.name}</option>)}
                </select>
              </div>
              <div className="form-group full">
                <label>Report Details</label>
                <textarea name="reportDetails" value={form.reportDetails} onChange={change} placeholder="Enter report details, diagnosis, findings..." style={{ minHeight: '100px' }} />
              </div>
              <div className="form-group full">
                <label>File Path / URL</label>
                <input name="filePath" value={form.filePath} onChange={change} placeholder="e.g. /reports/2024/report.pdf" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Report</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [r, p, h] = await Promise.all([reportAPI.getAll(), patientAPI.getAll(), healthDataAPI.getAll()]);
      setItems(r.data); setPatients(p.data); setHealthData(h.data);
    } catch { setError('Could not load reports.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    try {
      if (modal?.reportId) await reportAPI.update(modal.reportId, data);
      else await reportAPI.create(data);
      setModal(null); load();
    } catch { setError('Failed to save.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await reportAPI.delete(id); load(); } catch { setError('Failed to delete.'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Reports</div>
        <div className="page-subtitle">Patient health reports and medical documents</div>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="card">
          <div className="section-header">
            <div className="card-title" style={{ marginBottom: 0 }}>📋 All Reports ({items.length})</div>
            <button className="btn btn-primary" onClick={() => setModal('add')}>+ Add Report</button>
          </div>
          {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {items.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text3)' }}>No reports yet.</div>
              ) : items.map(r => (
                <div key={r.reportId} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '2px' }}>Report #{r.reportId}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--syne)' }}>{r.patient?.name || 'Unknown'}</div>
                    </div>
                    <span className="badge badge-blue">📋</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px', lineHeight: '1.5' }}>
                    {r.reportDetails?.slice(0, 120)}{r.reportDetails?.length > 120 ? '...' : ''}
                  </div>
                  {r.filePath && (
                    <div style={{ fontSize: '11px', color: 'var(--text3)', background: 'var(--card)', padding: '6px 10px', borderRadius: '6px', marginBottom: '12px', fontFamily: 'monospace' }}>
                      📄 {r.filePath}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setModal(r)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.reportId)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {modal && <Modal item={modal === 'add' ? null : modal} patients={patients} healthData={healthData} onClose={() => setModal(null)} onSave={handleSave} />}
    </>
  );
}
