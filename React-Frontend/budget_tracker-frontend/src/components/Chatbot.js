// import React, { useState, useRef, useEffect } from 'react';
// import { getIncomes, getExpenses } from '../services/api';
// import { useAuth } from '../context/AuthContext';

// const SUGGESTIONS = [
//   "What is my balance?",
//   "How do I add income?",
//   "How to set a budget?",
//   "How to track expenses?",
//   "How to create a goal?",
// ];

// const BOT_RESPONSES = {
//   greeting: [
//     "👋 Hi! I'm BudgetBot, your Budget Tracker assistant!\n\nI can help you with:\n💰 Income | 💸 Expenses | 📊 Budgets\n🎯 Goals | 🏠 Dashboard\n\nWhat would you like to know?",
//   ],
//   income: [
//     "💰 To **add income**:\n1. Click **Income** in navbar\n2. Click **+ Add Income**\n3. Fill Source, Amount, Date & Type\n4. Click **Save Income**\n\nTypes: Salary, Freelance, Business, Investment, Other",
//     "📊 On the **Income** page:\n• ➕ Add new income entries\n• ✏️ Edit with **Edit** button\n• 🗑️ Delete with **Delete** button\n• 💰 See **Total Income** at top right",
//   ],
//   expense: [
//     "💸 To **add an expense**:\n1. Go to **Expenses** page\n2. Click **+ Add Expense**\n3. Choose Category\n4. Enter Amount, Date & Description\n5. Click **Save Expense**",
//     "🔍 On **Expenses** page:\n• Search by name or category\n• Filter by category\n• ✏️ Edit any entry\n• 🗑️ Delete any entry\n• See **Total Spent** at top right",
//   ],
//   budget: [
//     "📊 To **set a budget**:\n1. Go to **Budgets** page\n2. Click **+ Set Budget**\n3. Choose Category & Amount\n4. Select Frequency (Weekly/Monthly/Yearly)\n5. Click **Save Budget**\n\n✅ Green = within limit\n⚠️ Red = over budget!",
//   ],
//   goal: [
//     "🎯 To **create a savings goal**:\n1. Go to **Goals** page\n2. Click **+ New Goal**\n3. Enter Goal Name & Target Amount\n4. Add Saved So Far\n5. Set a Deadline\n6. Click **Save Goal**\n\nProgress ring shows % complete!",
//   ],
//   dashboard: [
//     "🏠 **Dashboard** shows:\n• 💰 Total Income\n• 💸 Total Expenses\n• 💳 Remaining Balance\n• 📊 Income Spent %\n• 📋 Budget Status\n• 🎯 Savings Goals\n\nAll updates in real-time!",
//   ],
//   delete: [
//     "🗑️ To **delete** any record:\n1. Go to the page\n2. Find the entry\n3. Click red **Delete** button\n4. Confirm\n\n⚠️ Cannot be undone!\n\n• Income → **Income** page\n• Expense → **Expenses** page\n• Budget → **Budgets** page\n• Goal → **Goals** page",
//   ],
//   edit: [
//     "✏️ To **edit** any record:\n1. Go to the page\n2. Find the entry\n3. Click yellow **Edit** button\n4. Update details\n5. Click **Save**\n\nWorks for Income, Expenses, Budgets & Goals!",
//   ],
//   login: [
//     "🔐 To **login**:\n1. Enter your **Email**\n2. Enter your **Password**\n3. Click **Sign In**\n\nNew user? Click **Create an account**!\n\n❓ Issues? Check backend is running on port **8080**",
//   ],
//   register: [
//     "📝 To **register**:\n1. Click **Create an account**\n2. Enter **Name, Email, Password**\n3. Click **Register**\n\nThen login with your credentials!",
//   ],
//   category: [
//     "📂 **Expense Categories:**\n🍔 Food | 🚗 Transport | 🏠 Housing\n🏥 Healthcare | 📚 Education\n🎬 Entertainment | 🛍️ Shopping\n⚡ Utilities | 📦 Other",
//   ],
//   search: [
//     "🔍 **Search & Filter** on Expenses page:\n• Type in search box → find by description/category\n• Use dropdown → filter by category\n• Both work together!",
//   ],
//   frequency: [
//     "🗓️ **Budget Frequencies:**\n• **Weekly** - weekly spending limit\n• **Monthly** - monthly limit\n• **Yearly** - annual limit\n\nChoose based on your habits!",
//   ],
//   deadline: [
//     "📅 **Goal Deadlines:**\n• Shows days remaining on goal card\n• 🟢 Green = plenty of time\n• 🟡 Yellow = less than 7 days\n• 🔴 Red = past deadline\n\nUpdate via **Edit** anytime!",
//   ],
//   help: [
//     "🤖 **I can help with:**\n\n💰 Income | 💸 Expenses | 📊 Budgets\n🎯 Goals | 🏠 Dashboard\n🔐 Login/Register\n✏️ Edit | 🗑️ Delete | 🔍 Search\n💳 Balance | 📂 Categories\n\nJust ask anything!",
//   ],
//   default: [
//     "🤔 Try asking about:\n• **'What is my balance?'**\n• **'How to add income?'**\n• **'How to set a budget?'**\n• **'How to create a goal?'**\n• **'How to track expenses?'**",
//     "😊 I can help with Budget Tracker questions!\n\nAsk about Income, Expenses, Budgets, Goals, Dashboard, or your Balance!",
//   ],
// };

// function getRandom(arr) {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

// export default function Chatbot() {
//   const { user } = useAuth();
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       from: 'bot',
//       text: "👋 Hi! I'm BudgetBot!\n\nAsk me **'What is my balance?'** to see your real-time financial data!\n\nOr ask about:\n💰 Income | 💸 Expenses | 📊 Budgets | 🎯 Goals",
//       time: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [typing, setTyping] = useState(false);
//   const [unread, setUnread] = useState(1);
//   const bottomRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
//   }, [open]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, typing]);

//   // ✅ REAL DATA FETCH — fixed field names to match backend JSON response
//   const fetchBalanceReply = async () => {
//     try {
//       const [incRes, expRes] = await Promise.all([
//         getIncomes(user.userId),
//         getExpenses(user.userId)
//       ]);

//       // Income entity uses plain `amount` field (no @JsonProperty), so JSON key is "amount"
//       const totalIncome  = incRes.data.reduce((s, i) => s + (Number(i.amount) || 0), 0);

//       // Expense entity uses @JsonProperty("eAmount"), so JSON key is "eAmount"
//       const totalExpense = expRes.data.reduce((s, e) => s + (Number(e.eAmount) || 0), 0);

//       const balance  = totalIncome - totalExpense;
//       const spentPct = totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(2) : 0;
//       const fmt      = n => 'Rs ' + Number(n).toLocaleString('en-IN');

//       return (
//         `💳 **Your Financial Summary:**\n\n` +
//         `💰 Total Income: **${fmt(totalIncome)}**\n` +
//         `💸 Total Expenses: **${fmt(totalExpense)}**\n` +
//         `💳 Remaining Balance: **${fmt(balance)}**\n` +
//         `📊 Income Spent: **${spentPct}%**\n\n` +
//         `${balance > 0 ? '✅ Great! You have a surplus!' : '⚠️ You are spending more than income!'}`
//       );
//     } catch (err) {
//       console.error('BudgetBot fetch error:', err);
//       return "❌ Couldn't fetch your balance. Make sure you're logged in and backend is running!";
//     }
//   };

//   const getBotReply = async (msg) => {
//     const m = msg.toLowerCase();

//     // ✅ Real-time balance check
//     if (m.match(/\b(balance|remaining|my balance|how much|left|what is my|total|summary|financial|income spent|spent)\b/)) {
//       return await fetchBalanceReply();
//     }
//     if (m.match(/\b(hi|hello|hey|start|good morning|good evening)\b/)) return getRandom(BOT_RESPONSES.greeting);
//     if (m.match(/\b(income|salary|earning|earn|add income|source|revenue)\b/)) return getRandom(BOT_RESPONSES.income);
//     if (m.match(/\b(expense|spend|spending|spent|buy|purchase|cost|payment)\b/)) return getRandom(BOT_RESPONSES.expense);
//     if (m.match(/\b(budget|limit|overspent|over budget|spending limit|set budget)\b/)) return getRandom(BOT_RESPONSES.budget);
//     if (m.match(/\b(goal|saving|save money|target|milestone|new goal)\b/)) return getRandom(BOT_RESPONSES.goal);
//     if (m.match(/\b(dashboard|overview|home page|main page)\b/)) return getRandom(BOT_RESPONSES.dashboard);
//     if (m.match(/\b(delete|remove|erase|clear)\b/)) return getRandom(BOT_RESPONSES.delete);
//     if (m.match(/\b(edit|update|change|modify)\b/)) return getRandom(BOT_RESPONSES.edit);
//     if (m.match(/\b(login|sign in|password|credentials|logout)\b/)) return getRandom(BOT_RESPONSES.login);
//     if (m.match(/\b(register|signup|create account|new user)\b/)) return getRandom(BOT_RESPONSES.register);
//     if (m.match(/\b(category|categories|food|transport|housing|shopping)\b/)) return getRandom(BOT_RESPONSES.category);
//     if (m.match(/\b(search|filter|find|look for)\b/)) return getRandom(BOT_RESPONSES.search);
//     if (m.match(/\b(frequency|weekly|monthly|yearly)\b/)) return getRandom(BOT_RESPONSES.frequency);
//     if (m.match(/\b(deadline|due date|days left|time left)\b/)) return getRandom(BOT_RESPONSES.deadline);
//     if (m.match(/\b(help|what can|features|how to|guide|options)\b/)) return getRandom(BOT_RESPONSES.help);
//     return getRandom(BOT_RESPONSES.default);
//   };

//   const sendMessage = async (text) => {
//     const msg = text || input.trim();
//     if (!msg) return;
//     setInput('');
//     setMessages(prev => [...prev, { from: 'user', text: msg, time: new Date() }]);
//     setTyping(true);
//     try {
//       const reply = await getBotReply(msg);
//       setMessages(prev => [...prev, { from: 'bot', text: reply, time: new Date() }]);
//     } catch {
//       setMessages(prev => [...prev, { from: 'bot', text: "Sorry, something went wrong. Please try again!", time: new Date() }]);
//     } finally {
//       setTyping(false);
//       if (!open) setUnread(n => n + 1);
//     }
//   };

//   const formatTime = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   const renderText = (text) => {
//     return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
//       if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
//       return part.split('\n').map((line, j, arr) => (
//         <span key={`${i}-${j}`}>{line}{j < arr.length - 1 ? <br /> : null}</span>
//       ));
//     });
//   };

//   return (
//     <>
//       {/* Float Button */}
//       <div onClick={() => setOpen(o => !o)} style={{
//         position: 'fixed', bottom: 28, right: 28, zIndex: 999,
//         width: 58, height: 58, borderRadius: '50%',
//         background: 'linear-gradient(135deg, #0EA5A0, #0B7E7A)',
//         boxShadow: '0 4px 20px rgba(14,165,160,0.5)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         cursor: 'pointer', transition: 'transform 0.2s',
//       }}
//         onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
//         onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
//       >
//         <span style={{ fontSize: 26 }}>{open ? '✕' : '💬'}</span>
//         {unread > 0 && !open && (
//           <div style={{
//             position: 'absolute', top: -2, right: -2, width: 20, height: 20,
//             borderRadius: '50%', background: '#EF4444', color: '#fff',
//             fontSize: 11, fontWeight: 700, border: '2px solid #fff',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}>{unread}</div>
//         )}
//       </div>

//       {/* Chat Window */}
//       {open && (
//         <div style={{
//           position: 'fixed', bottom: 100, right: 28, zIndex: 998,
//           width: 360, height: 520, background: '#fff', borderRadius: 20,
//           boxShadow: '0 20px 60px rgba(15,44,78,0.2)',
//           display: 'flex', flexDirection: 'column',
//           overflow: 'hidden', border: '1px solid #DDE5EE',
//         }}>
//           {/* Header */}
//           <div style={{ background: 'linear-gradient(135deg, #0F2C4E, #0EA5A0)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
//             <div>
//               <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>BudgetBot</div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                 <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6DD5D1' }} />
//                 <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Always online</span>
//               </div>
//             </div>
//             <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 20, cursor: 'pointer' }}>×</button>
//           </div>

//           {/* Messages */}
//           <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#F8FAFB' }}>
//             {messages.map((msg, i) => (
//               <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
//                 {msg.from === 'bot' && (
//                   <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginRight: 8, background: 'linear-gradient(135deg, #0EA5A0, #6DD5D1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, alignSelf: 'flex-end' }}>🤖</div>
//                 )}
//                 <div style={{ maxWidth: '78%' }}>
//                   <div style={{
//                     padding: '10px 14px',
//                     borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//                     background: msg.from === 'user' ? 'linear-gradient(135deg, #0EA5A0, #0B7E7A)' : '#fff',
//                     color: msg.from === 'user' ? '#fff' : '#0D1B2A',
//                     fontSize: 13, lineHeight: 1.55,
//                     boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
//                     border: msg.from === 'bot' ? '1px solid #DDE5EE' : 'none',
//                   }}>
//                     {renderText(msg.text)}
//                   </div>
//                   <div style={{ fontSize: 10, color: '#A8B6C8', marginTop: 3, textAlign: msg.from === 'user' ? 'right' : 'left' }}>
//                     {formatTime(msg.time)}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {typing && (
//               <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
//                 <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA5A0,#6DD5D1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
//                 <div style={{ background: '#fff', border: '1px solid #DDE5EE', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', display: 'flex', gap: 5 }}>
//                   {[0, 1, 2].map(j => (
//                     <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: '#0EA5A0', animation: `bounce 1s ease-in-out ${j * 0.15}s infinite` }} />
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div ref={bottomRef} />
//           </div>

//           {/* Suggestions */}
//           <div style={{ padding: '8px 12px', background: '#fff', borderTop: '1px solid #EEF2F7', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
//             {SUGGESTIONS.map(s => (
//               <button key={s} onClick={() => sendMessage(s)} style={{ padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 500, background: '#EBF8F8', color: '#0B7E7A', border: '1px solid #6DD5D1', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
//                 onMouseEnter={e => { e.target.style.background = '#0EA5A0'; e.target.style.color = '#fff'; }}
//                 onMouseLeave={e => { e.target.style.background = '#EBF8F8'; e.target.style.color = '#0B7E7A'; }}
//               >{s}</button>
//             ))}
//           </div>

//           {/* Input */}
//           <div style={{ display: 'flex', gap: 8, padding: '12px 14px', background: '#fff', borderTop: '1px solid #EEF2F7' }}>
//             <input
//               ref={inputRef}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !typing && sendMessage()}
//               placeholder="Ask me anything..."
//               disabled={typing}
//               style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #DDE5EE', borderRadius: 12, fontSize: 13, outline: 'none', background: '#F8FAFB', color: '#0D1B2A', opacity: typing ? 0.6 : 1 }}
//               onFocus={e => e.target.style.borderColor = '#0EA5A0'}
//               onBlur={e => e.target.style.borderColor = '#DDE5EE'}
//             />
//             <button onClick={() => !typing && sendMessage()} disabled={typing || !input.trim()} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: input.trim() && !typing ? 'linear-gradient(135deg, #0EA5A0, #0B7E7A)' : '#DDE5EE', color: input.trim() && !typing ? '#fff' : '#A8B6C8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', fontSize: 18, flexShrink: 0 }}>→</button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



import React, { useState, useRef, useEffect } from 'react';
import { getIncomes, getExpenses, getBudgets, getGoals } from '../services/api';
import { useAuth } from '../context/AuthContext';

// 🔑 Replace with your Gemini API key
const GEMINI_API_KEY = 'AIzaSyCdM9BYdfS9tlBSvriYkwsPvhdkiNStrkk';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SUGGESTIONS = [
  "What is my balance?",
  "Where am I overspending?",
  "How are my savings goals?",
  "Analyse my expenses",
  "Give me saving tips",
];

export default function Chatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "👋 Hi! I'm BudgetBot, your AI financial assistant!\n\nI have access to your **real financial data** and can answer any question about your:\n💰 Income | 💸 Expenses | 📊 Budgets | 🎯 Goals\n\nAsk me anything!",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const fetchFinancialContext = async () => {
    try {
      const [incRes, expRes, budRes, goalRes] = await Promise.all([
        getIncomes(user.userId),
        getExpenses(user.userId),
        getBudgets(user.userId),
        getGoals(user.userId),
      ]);

      const incomes  = incRes.data  || [];
      const expenses = expRes.data  || [];
      const budgets  = budRes.data  || [];
      const goals    = goalRes.data || [];

      const totalIncome  = incomes.reduce((s, i)  => s + (Number(i.amount)  || 0), 0);
      const totalExpense = expenses.reduce((s, e) => s + (Number(e.eAmount) || 0), 0);
      const balance      = totalIncome - totalExpense;
      const spentPct     = totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(2) : 0;

      const catMap = {};
      expenses.forEach(e => {
        catMap[e.category] = (catMap[e.category] || 0) + (Number(e.eAmount) || 0);
      });

      const budgetStatus = budgets.map(b => {
        const spent = expenses
          .filter(e => e.category === b.bCategory)
          .reduce((s, e) => s + (Number(e.eAmount) || 0), 0);
        return { category: b.bCategory, limit: b.bAmount, spent, over: spent > b.bAmount };
      });

      const goalsStatus = goals.map(g => ({
        name: g.goalName,
        saved: g.savedAmount,
        target: g.totalAmount,
        pct: Math.round((g.savedAmount / g.totalAmount) * 100),
        deadline: g.deadline,
      }));

      return `
=== USER FINANCIAL DATA ===
Name: ${user.name || 'User'}

SUMMARY:
- Total Income: Rs ${totalIncome.toLocaleString('en-IN')}
- Total Expenses: Rs ${totalExpense.toLocaleString('en-IN')}
- Remaining Balance: Rs ${balance.toLocaleString('en-IN')}
- Income Spent: ${spentPct}%

INCOME SOURCES (${incomes.length} entries):
${incomes.map(i => `- ${i.source || 'N/A'}: Rs ${Number(i.amount).toLocaleString('en-IN')} (${i.incomeType || ''}) on ${i.incomeDate || ''}`).join('\n') || 'No income records'}

EXPENSES BY CATEGORY:
${Object.entries(catMap).map(([cat, amt]) => `- ${cat}: Rs ${amt.toLocaleString('en-IN')}`).join('\n') || 'No expenses'}

RECENT EXPENSES (last 10):
${expenses.slice(-10).map(e => `- ${e.category}: Rs ${Number(e.eAmount).toLocaleString('en-IN')} on ${e.eDate || ''} — ${e.description || ''}`).join('\n') || 'No expenses'}

BUDGET STATUS (${budgets.length} budgets):
${budgetStatus.map(b => `- ${b.category}: Spent Rs ${b.spent.toLocaleString('en-IN')} of Rs ${Number(b.limit).toLocaleString('en-IN')} limit ${b.over ? '⚠️ OVER BUDGET' : '✅ within limit'}`).join('\n') || 'No budgets set'}

SAVINGS GOALS (${goals.length} goals):
${goalsStatus.map(g => `- ${g.name}: Rs ${Number(g.saved).toLocaleString('en-IN')} saved of Rs ${Number(g.target).toLocaleString('en-IN')} target (${g.pct}%) — Deadline: ${g.deadline || 'N/A'}`).join('\n') || 'No goals set'}
=== END OF DATA ===`;
    } catch (err) {
      console.error('Financial data fetch error:', err);
      return '(Could not load financial data)';
    }
  };

  const callGemini = async (userMessage, financialContext, conversationHistory) => {
    const systemInstruction = `You are BudgetBot, a smart and friendly AI financial assistant built into a Budget Tracker app. You have access to the user's real financial data shown below.

${financialContext}

INSTRUCTIONS:
- Answer questions about their finances using the data above
- Give specific, data-driven answers (mention actual amounts, categories, percentages)
- If asked for advice, be practical and actionable
- Be conversational, warm, and encouraging
- Use emojis naturally to make responses friendly
- Format numbers as "Rs X,XX,XXX" (Indian rupee format)
- Keep responses concise but helpful (3-6 sentences for most answers)
- If asked something unrelated to finance, you can still help as a general assistant
- Never make up financial data — only use what's provided above
- If data shows 0 or no records, acknowledge it kindly and suggest adding data`;

    const contents = [
      ...conversationHistory,
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error('Empty response from Gemini');
    return reply;
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: msg, time: new Date() }]);
    setTyping(true);
    try {
      const financialContext = await fetchFinancialContext();
      const reply = await callGemini(msg, financialContext, history);
      setHistory(prev => [
        ...prev,
        { role: 'user',  parts: [{ text: msg   }] },
        { role: 'model', parts: [{ text: reply  }] },
      ]);
      setMessages(prev => [...prev, { from: 'bot', text: reply, time: new Date() }]);
    } catch (err) {
      console.error('BudgetBot Gemini error:', err);
      setMessages(prev => [...prev, {
        from: 'bot',
        text: "❌ Sorry, I ran into an issue connecting to AI. Please check your API key and try again!",
        time: new Date()
      }]);
    } finally {
      setTyping(false);
      if (!open) setUnread(n => n + 1);
    }
  };

  const formatTime = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderText = (text) => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      return part.split('\n').map((line, j, arr) => (
        <span key={`${i}-${j}`}>{line}{j < arr.length - 1 ? <br /> : null}</span>
      ));
    });
  };

  return (
    <>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>

      {/* Float Button */}
      <div onClick={() => setOpen(o => !o)} style={{
        position:'fixed', bottom:28, right:28, zIndex:999,
        width:58, height:58, borderRadius:'50%',
        background:'linear-gradient(135deg, #0EA5A0, #0B7E7A)',
        boxShadow:'0 4px 20px rgba(14,165,160,0.5)',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', transition:'transform 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize:26 }}>{open ? '✕' : '💬'}</span>
        {unread > 0 && !open && (
          <div style={{
            position:'absolute', top:-2, right:-2, width:20, height:20,
            borderRadius:'50%', background:'#EF4444', color:'#fff',
            fontSize:11, fontWeight:700, border:'2px solid #fff',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{unread}</div>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div style={{
          position:'fixed', bottom:100, right:28, zIndex:998,
          width:380, height:540, background:'#fff', borderRadius:20,
          boxShadow:'0 20px 60px rgba(15,44,78,0.2)',
          display:'flex', flexDirection:'column',
          overflow:'hidden', border:'1px solid #DDE5EE',
        }}>
          {/* Header */}
          <div style={{ background:'linear-gradient(135deg, #0F2C4E, #0EA5A0)', padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🤖</div>
            <div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>BudgetBot</div>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#6DD5D1' }} />
                <span style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>Gemini AI • Always online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.7)', fontSize:20, cursor:'pointer' }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:12, background:'#F8FAFB' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.from === 'bot' && (
                  <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, marginRight:8, background:'linear-gradient(135deg, #0EA5A0, #6DD5D1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, alignSelf:'flex-end' }}>🤖</div>
                )}
                <div style={{ maxWidth:'80%' }}>
                  <div style={{
                    padding:'10px 14px',
                    borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.from === 'user' ? 'linear-gradient(135deg, #0EA5A0, #0B7E7A)' : '#fff',
                    color: msg.from === 'user' ? '#fff' : '#0D1B2A',
                    fontSize:13, lineHeight:1.6,
                    boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
                    border: msg.from === 'bot' ? '1px solid #DDE5EE' : 'none',
                  }}>
                    {renderText(msg.text)}
                  </div>
                  <div style={{ fontSize:10, color:'#A8B6C8', marginTop:3, textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5A0,#6DD5D1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🤖</div>
                <div style={{ background:'#fff', border:'1px solid #DDE5EE', borderRadius:'18px 18px 18px 4px', padding:'12px 16px', display:'flex', gap:5, alignItems:'center' }}>
                  {[0,1,2].map(j => (
                    <div key={j} style={{ width:7, height:7, borderRadius:'50%', background:'#0EA5A0', animation:`bounce 1s ease-in-out ${j*0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding:'8px 12px', background:'#fff', borderTop:'1px solid #EEF2F7', display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                style={{ padding:'5px 12px', borderRadius:99, fontSize:11, fontWeight:500, background:'#EBF8F8', color:'#0B7E7A', border:'1px solid #6DD5D1', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'all 0.15s' }}
                onMouseEnter={e => { e.target.style.background='#0EA5A0'; e.target.style.color='#fff'; }}
                onMouseLeave={e => { e.target.style.background='#EBF8F8'; e.target.style.color='#0B7E7A'; }}
              >{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ display:'flex', gap:8, padding:'12px 14px', background:'#fff', borderTop:'1px solid #EEF2F7' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !typing && sendMessage()}
              placeholder="Ask me anything about your finances..."
              disabled={typing}
              style={{ flex:1, padding:'10px 14px', border:'1.5px solid #DDE5EE', borderRadius:12, fontSize:13, outline:'none', background:'#F8FAFB', color:'#0D1B2A', opacity: typing ? 0.6 : 1, fontFamily:'Outfit, sans-serif' }}
              onFocus={e => e.target.style.borderColor='#0EA5A0'}
              onBlur={e => e.target.style.borderColor='#DDE5EE'}
            />
            <button onClick={() => !typing && sendMessage()} disabled={typing || !input.trim()}
              style={{ width:40, height:40, borderRadius:10, border:'none', background: input.trim() && !typing ? 'linear-gradient(135deg, #0EA5A0, #0B7E7A)' : '#DDE5EE', color: input.trim() && !typing ? '#fff' : '#A8B6C8', display:'flex', alignItems:'center', justifyContent:'center', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', fontSize:18, flexShrink:0 }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}