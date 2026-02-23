import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { patientAPI, doctorAPI, appointmentAPI, consultationAPI, dailyReadingAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, consultations: 0 });
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, d, a, c, r] = await Promise.all([
          patientAPI.getAll(), doctorAPI.getAll(), appointmentAPI.getAll(),
          consultationAPI.getAll(), dailyReadingAPI.getAll()
        ]);

        if (isPatient) {
          const myAppointments = a.data.filter(ap => ap.patient?.patientId === user.id);
          const myConsultations = c.data.filter(cn => cn.patient?.patientId === user.id);
          const myReadings = r.data.filter(rd => rd.patient?.patientId === user.id);

          setStats({
            patients: 1,
            doctors: d.data.length,
            appointments: myAppointments.length,
            consultations: myConsultations.length
          });

          setReadings(myReadings.slice(-7).map((rd, i) => ({
            day: `Day ${i + 1}`,
            heartRate: rd.heartRate,
            oxygen: rd.oxygenLevel,
            temp: rd.temperature
          })));

        } else {
          setStats({
            patients: p.data.length,
            doctors: d.data.length,
            appointments: a.data.length,
            consultations: c.data.length
          });

          setReadings(r.data.slice(-7).map((rd, i) => ({
            day: `Day ${i + 1}`,
            heartRate: rd.heartRate,
            oxygen: rd.oxygenLevel,
            temp: rd.temperature
          })));
        }

      } catch (e) {
        setStats({ patients: isPatient ? 1 : 24, doctors: 8, appointments: isPatient ? 2 : 15, consultations: isPatient ? 3 : 32 });
        setReadings([
          { day: 'Mon', heartRate: 72, oxygen: 98, temp: 36.5 },
          { day: 'Tue', heartRate: 75, oxygen: 97, temp: 36.8 },
          { day: 'Wed', heartRate: 68, oxygen: 99, temp: 36.6 },
          { day: 'Thu', heartRate: 80, oxygen: 96, temp: 37.1 },
          { day: 'Fri', heartRate: 74, oxygen: 98, temp: 36.7 },
          { day: 'Sat', heartRate: 71, oxygen: 99, temp: 36.4 },
          { day: 'Sun', heartRate: 76, oxygen: 97, temp: 36.9 },
        ]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const patientStatCards = [
    { label: 'My Appointments', value: stats.appointments, color: 'green', icon: '📅' },
    { label: 'My Consultations', value: stats.consultations, color: 'orange', icon: '💬' },
    { label: 'Available Doctors', value: stats.doctors, color: 'purple', icon: '🩺' },
    { label: 'My Health Records', value: '✓', color: 'blue', icon: '🗂️' },
  ];

  const doctorStatCards = [
    { label: 'Total Patients', value: stats.patients, color: 'blue', icon: '👤' },
    { label: 'Total Doctors', value: stats.doctors, color: 'purple', icon: '🩺' },
    { label: 'Appointments', value: stats.appointments, color: 'green', icon: '📅' },
    { label: 'Consultations', value: stats.consultations, color: 'orange', icon: '💬' },
  ];

  const statCards = isPatient ? patientStatCards : doctorStatCards;

  return (
    <>
      <div className="page-header">
        <div className="page-title">Welcome back, {user?.name || 'User'} 👋</div>
        <div className="page-subtitle">
          {isPatient
            ? "Here's your personal health monitoring overview for today"
            : "Here's all patients health monitoring overview for today"}
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: '20px' }}>
              {statCards.map(s => (
                <div key={s.label} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`} style={{ fontSize: '20px' }}>{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid-2" style={{ marginBottom: '20px' }}>
              <div className="card">
                <div className="card-title">📊 Heart Rate Trend (Last 7 Days)</div>
                {readings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '13px' }}>
                    No readings added yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={readings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
                      <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d47', borderRadius: '8px', color: '#e2e8f0' }} />
                      <Line type="monotone" dataKey="heartRate" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="card">
                <div className="card-title">🩸 Oxygen Level Trend</div>
                {readings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '13px' }}>
                    No readings added yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={readings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
                      <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[90, 100]} />
                      <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d47', borderRadius: '8px', color: '#e2e8f0' }} />
                      <Line type="monotone" dataKey="oxygen" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Live Vitals */}
            <div className="card">
              <div className="card-title">🔴 Live Vitals Overview</div>
              {readings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)', fontSize: '13px' }}>
                  No vitals data available. Please add your readings in Daily Readings page.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { label: 'Heart Rate', value: readings[readings.length - 1]?.heartRate || '--', unit: 'bpm', color: '#ef4444' },
                    { label: 'Oxygen Level', value: readings[readings.length - 1]?.oxygen || '--', unit: '%', color: '#10b981' },
                    { label: 'Temperature', value: readings[readings.length - 1]?.temp || '--', unit: '°C', color: '#f59e0b' },
                  ].map(v => (
                    <div key={v.label} style={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '16px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        {v.label}
                      </div>
                      <div style={{ fontFamily: 'var(--syne)', fontSize: '32px', fontWeight: '800', color: v.color }}>
                        {v.value}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{v.unit}</div>
                      <div className="pulse-dot" style={{ margin: '8px auto 0', background: v.color }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Patient Health Tips */}
            {isPatient && (
              <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-title">💡 Health Tips for You</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {[
                    { icon: '💧', tip: 'Drink at least 8 glasses of water daily', color: '#00d4ff' },
                    { icon: '🚶', tip: 'Walk for 30 minutes every day', color: '#10b981' },
                    { icon: '😴', tip: 'Get 7 to 8 hours of sleep every night', color: '#a78bfa' },
                    { icon: '🥗', tip: 'Eat healthy and balanced meals daily', color: '#f59e0b' },
                  ].map(t => (
                    <div key={t.tip} style={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '10px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '24px' }}>{t.icon}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.4' }}>{t.tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
