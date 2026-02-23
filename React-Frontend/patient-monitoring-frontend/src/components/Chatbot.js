import React, { useState, useRef, useEffect } from 'react';
import { consultationAPI, appointmentAPI, patientAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

async function getAIReply(userMessage, context) {
  const systemPrompt = `You are MediBot, a helpful assistant for MediMonitor — a Patient Monitoring System.

The logged-in user is: ${context.name} (Role: ${context.role}, ID: ${context.id})

Current data for this user:
${context.dataInfo}

Answer questions based on this data. Be concise and friendly. Use emojis where helpful.
If asked about appointments, consultations, or patients — refer to the data above.
If asked something unrelated to the system, politely redirect.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  const data = await response.json();
  return data.content?.[0]?.text || "Sorry, I couldn't get a response right now.";
}

export default function Chatbot() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Hi! I\'m MediBot, your health assistant. Ask me about your appointments, consultations, or anything about the system!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextData, setContextData] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load user-specific data for AI context
  useEffect(() => {
    if (!user) return;
    const loadContext = async () => {
      try {
        const [appts, consults, patients] = await Promise.all([
          appointmentAPI.getAll().catch(() => ({ data: [] })),
          consultationAPI.getAll().catch(() => ({ data: [] })),
          isDoctor ? patientAPI.getAll().catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
        ]);

        let dataInfo = '';

        if (isDoctor) {
          const myAppts = appts.data.filter(a => a.doctor?.doctorId === user.id);
          const myConsults = consults.data.filter(c => c.doctor?.doctorId === user.id);
          dataInfo = `
Appointments assigned to this doctor (${myAppts.length} total):
${myAppts.map(a => `- Patient: ${a.patient?.name}, Date: ${a.appointmentDate}, Status: ${a.status}`).join('\n') || 'None'}

Consultations assigned to this doctor (${myConsults.length} total):
${myConsults.map(c => `- Patient: ${c.patient?.name}, Date: ${c.date}, Fee: ₹${c.consultFee}, Payment: ${c.paymentStatus}`).join('\n') || 'None'}

All Patients (${patients.data.length} total):
${patients.data.map(p => `- ${p.name} (ID: ${p.patientId})`).join('\n') || 'None'}`;

        } else if (isPatient) {
          const myAppts = appts.data.filter(a => a.patient?.patientId === user.id);
          const myConsults = consults.data.filter(c => c.patient?.patientId === user.id);
          dataInfo = `
My Appointments (${myAppts.length} total):
${myAppts.map(a => `- Doctor: Dr.${a.doctor?.name}, Date: ${a.appointmentDate}, Status: ${a.status}`).join('\n') || 'None'}

My Consultations (${myConsults.length} total):
${myConsults.map(c => `- Doctor: Dr.${c.doctor?.name}, Date: ${c.date}, Fee: ₹${c.consultFee}, Payment: ${c.paymentStatus}, Remark: ${c.remark}`).join('\n') || 'None'}`;
        }

        setContextData({
          name: user.name || user.username || 'User',
          role: user.role,
          id: user.id,
          dataInfo
        });
      } catch (e) {
        console.error('Context load failed', e);
      }
    };
    loadContext();
  }, [user]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await getAIReply(input, contextData || {
        name: user?.name || 'User',
        role: user?.role || 'unknown',
        id: user?.id,
        dataInfo: 'No data loaded yet.'
      });
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: '⚠️ Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter') send(); };

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div className="chat-bot-avatar">🤖</div>
            <div>
              <div className="chat-title">MediBot Assistant</div>
              <div className="chat-status">● Online</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '18px' }}
            >×</button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot" style={{ opacity: 0.6 }}>
                ⏳ Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <input
              className="chat-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button className="chat-send" onClick={send} disabled={loading}>➤</button>
          </div>
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen(!open)}>
        {open ? '×' : '🤖'}
      </button>
    </>
  );
}