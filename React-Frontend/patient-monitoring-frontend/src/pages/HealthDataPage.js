import React, { useEffect, useState } from 'react';
import { healthDataAPI, patientAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Modal({ item, patients, onClose, onSave, isDoctor }) {
  const [form, setForm] = useState(item ? {
    pastRecords: item.pastRecords, recordedDate: item.recordedDate,
    recordedTime: item.recordedTime,
    patient: { patientId: item.patient?.patientId }
  } : { pastRecords: '', recordedDate: '', recordedTime: '', patient: { patientId: '' } });

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => { e.preventDefault(); await onSave(form); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{item ? 'Edit Health Record' : 'Add Health Record'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              {isDoctor && (
                <div className="form-group full">
                  <label>Patient</label>
                  <select value={form.patient.patientId}
                    onChange={e => setForm(f => ({ ...f, patient: { patientId: parseInt(e.target.value) } }))} required>
                    <option value="">Select patient</option>
                    {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group"><label>Recorded Date</label><input name="recordedDate" type="date" value={form.recordedDate} onChange={change} required /></div>
              <div className="form-group"><label>Recorded Time</label><input name="recordedTime" type="time" value={form.recordedTime} onChange={change} /></div>
              <div className="form-group full">
                <label>Past Records / Medical History</label>
                <textarea name="pastRecords" value={form.pastRecords} onChange={change}
                  placeholder="Enter medical history, past illnesses, medications..."
                  style={{ minHeight: '100px' }} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HealthDataPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [h, p] = await Promise.all([healthDataAPI.getAll(), patientAPI.getAll()]);

      if (isPatient) {
        const myData = h.data.filter(hd => hd.patient?.patientId === user.id);
        setItems(myData);
      } else {
        setItems(h.data);
      }

      setPatients(p.data);
    } catch { setError('Could not load health data.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    const saveData = isPatient
      ? { ...data, patient: { patientId: user.id } }
      : data;
    try {
      if (modal?.healthId) await healthDataAPI.update(modal.healthId, saveData);
      else await healthDataAPI.create(saveData);
      setModal(null); load();
    } catch { setError('Failed to save.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await healthDataAPI.delete(id); load(); }
    catch { setError('Failed to delete.'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Health Data</div>
        <div className="page-subtitle">
          {isPatient ? 'Your medical history and past records' : 'All patient medical history and records'}
        </div>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '20px', marginBottom: '16px',
          background: isDoctor ? 'rgba(124,58,237,0.15)' : 'rgba(0,212,255,0.15)',
          border: isDoctor ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(0,212,255,0.3)',
          color: isDoctor ? '#a78bfa' : 'var(--accent)', fontSize: '13px', fontWeight: 600
        }}>
          {isDoctor ? '🩺 Doctor View — All Patients Health Data' : '👤 Patient View — My Health Data Only'}
        </div>

        <div className="card">
          <div className="section-header">
            <div className="card-title" style={{ marginBottom: 0 }}>
              🗂️ {isPatient ? 'My Health Records' : 'All Health Records'} ({items.length})
            </div>
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              + Add Record
            </button>
          </div>

          {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : (
            <div className="table-wrap" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    {isDoctor && <th>Patient</th>}
                    <th>Date</th>
                    <th>Time</th>
                    <th>Past Records</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>
                        {isPatient ? 'No health records found. Add your first record!' : 'No health records yet.'}
                      </td>
                    </tr>
                  ) : items.map(h => (
                    <tr key={h.healthId}>
                      <td>#{h.healthId}</td>
                      {isDoctor && (
                        <td style={{ color: 'var(--text)', fontWeight: 600 }}>{h.patient?.name || '—'}</td>
                      )}
                      <td>{h.recordedDate}</td>
                      <td>{h.recordedTime}</td>
                      <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {h.pastRecords}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setModal(h)}>Edit</button>
                          {isDoctor && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(h.healthId)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {modal && (
        <Modal
          item={modal === 'add' ? null : modal}
          patients={patients}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isDoctor={isDoctor}
        />
      )}
    </>
  );
}
