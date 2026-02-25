# Budget Tracker Pro 💰 — Frontend

A beautifully redesigned React frontend for the Budget Tracker app with a built-in AI Chatbot assistant.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Spring Boot backend running at `http://localhost:8080`

### Run the App

```bash
npm install
npm start
```

Opens at **http://localhost:3000**

## 📁 Structure

```
src/
├── context/AuthContext.js     # Auth state (login/logout/persist)
├── services/api.js            # All Axios API calls
├── components/
│   ├── Navbar.js              # Top navigation bar
│   ├── Modal.js               # Reusable modal dialog
│   ├── FormField.js           # Styled input/select
│   └── Chatbot.js             # 💬 AI Chatbot assistant
├── pages/
│   ├── Login.js               # Login page
│   ├── Register.js            # Registration page
│   ├── Dashboard.js           # Overview with charts
│   ├── Income.js              # Income CRUD
│   ├── Expenses.js            # Expense CRUD
│   ├── Budgets.js             # Budget cards with progress
│   └── Goals.js               # Goal tracker with rings
└── App.js                     # Routes + auth guards
```

## 💬 Chatbot

The **BudgetBot** chatbot is available on every page after login. It answers questions like:
- "How do I add income?"
- "How to set a budget?"
- "What is remaining balance?"
- "How to track expenses?"
- "How to create a goal?"

Click the 💬 button (bottom right) to open it.

## 🔗 API Endpoints

| Feature   | Base URL           |
|-----------|--------------------|
| Auth      | `/api/auth`        |
| Income    | `/api/incomes`     |
| Expenses  | `/api/expenses`    |
| Budgets   | `/api/budgets`     |
| Goals     | `/api/goals`       |

## 🎨 Design

- **Color Palette**: Navy + Teal gradient with semantic accents (green=income, red=expense, amber=budget, blue=goals)
- **Font**: Outfit (modern geometric sans-serif)
- **Features**: Sticky navbar, animated page transitions, chart visualizations, SVG circular progress rings, responsive grid layouts
