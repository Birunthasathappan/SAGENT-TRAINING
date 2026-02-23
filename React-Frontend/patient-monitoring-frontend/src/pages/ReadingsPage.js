import React, { useEffect, useState } from 'react';
import { dailyReadingAPI, patientAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Modal({ item, patients, onClose, onSave, isDoctor }) {
  const [form, setForm] = useState(item ? {
    heartRate: item.heartRate, bloodPressure: item.bloodPressure,
    oxygenLevel: item.oxygenLevel, temperature: item.temperature,
    recordedDate: item.recordedDate,
    patient: { patientId: item.patient?.patientId }
  } : { heartRate: '', bloodPressure: '', oxygenLevel: '', temperature: '', recordedDate: '', patient: { patientId: '' } });

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    await onSave({
      ...form,
      heartRate: parseInt(form.heartRate),
      oxygenLevel: parseInt(form.oxygenLevel),
      temperature: parseFloat(form.temperature)
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{item ? 'Edit Reading' : 'Add Daily Reading'}</div>
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
              <div className="form-group"><label>Heart Rate (bpm)</label><input name="heartRate" type="number" value={form.heartRate} onChange={change} required /></div>
              <div className="form-group"><label>Blood Pressure</label><input name="bloodPressure" value={form.bloodPressure} onChange={change} placeholder="e.g. 120/80" required /></div>
              <div className="form-group"><label>Oxygen Level (%)</label><input name="oxygenLevel" type="number" value={form.oxygenLevel} onChange={change} required /></div>
              <div className="form-group"><label>Temperature (°C)</label><input name="temperature" type="number" step="0.1" value={form.temperature} onChange={change} required /></div>
              <div className="form-group full"><label>Recorded Date</label><input name="recordedDate" type="date" value={form.recordedDate} onChange={change} required /></div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Reading</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const getStatus = (hr) => {
  if (hr < 60) return { label: 'Low', cls: 'badge-orange' };
  if (hr > 100) return { label: 'High', cls: 'badge-red' };
  return { label: 'Normal', cls: 'badge-green' };
};

export default function ReadingsPage() {
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
      const [r, p] = await Promise.all([dailyReadingAPI.getAll(), patientAPI.getAll()]);

      if (isPatient) {
        const myReadings = r.data.filter(rd => rd.patient?.patientId === user.id);
        setItems(myReadings);
      } else {
        setItems(r.data);
      }

      setPatients(p.data);
    } catch { setError('Could not load readings.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    const saveData = isPatient
      ? { ...data, patient: { patientId: user.id } }
      : data;
    try {
      if (modal?.readingId) await dailyReadingAPI.update(modal.readingId, saveData);
      else await dailyReadingAPI.create(saveData);
      setModal(null); load();
    } catch { setError('Failed to save.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await dailyReadingAPI.delete(id); load(); }
    catch { setError('Failed to delete.'); }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Daily Readings</div>
        <div className="page-subtitle">
          {isPatient ? 'Your daily health vitals' : 'Record and monitor all patients daily health vitals'}
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
          {isDoctor ? '🩺 Doctor View — All Patients Readings' : '👤 Patient View — My Readings Only'}
        </div>

        <div className="card">
          <div className="section-header">
            <div className="card-title" style={{ marginBottom: 0 }}>
              📊 {isPatient ? 'My Health Readings' : 'All Health Readings'} ({items.length})
            </div>
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              + Add Reading
            </button>
          </div>

          {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : (
            <div className="table-wrap" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    {isDoctor && <th>Patient</th>}
                    <th>Heart Rate</th>
                    <th>Blood Pressure</th>
                    <th>Oxygen</th>
                    <th>Temp</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>
                        {isPatient ? 'No readings found. Add your first reading!' : 'No readings yet.'}
                      </td>
                    </tr>
                  ) : items.map(r => {
                    const s = getStatus(r.heartRate);
                    return (
                      <tr key={r.readingId}>
                        <td>#{r.readingId}</td>
                        {isDoctor && (
                          <td style={{ color: 'var(--text)', fontWeight: 600 }}>{r.patient?.name || '—'}</td>
                        )}
                        <td style={{ color: '#ef4444', fontWeight: 600 }}>{r.heartRate} bpm</td>
                        <td>{r.bloodPressure}</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>{r.oxygenLevel}%</td>
                        <td style={{ color: '#f59e0b', fontWeight: 600 }}>{r.temperature}°C</td>
                        <td>{r.recordedDate}</td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setModal(r)}>Edit</button>
                            {isDoctor && (
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.readingId)}>Delete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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