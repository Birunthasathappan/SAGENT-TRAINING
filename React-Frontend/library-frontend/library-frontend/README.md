# 📚 LibraVault — Library Management System Frontend

A beautiful React frontend for your Spring Boot Library Management System.

---

## 🗂️ Project Structure

```
library-frontend/
├── public/index.html
├── src/
│   ├── App.js                  ← All routes defined here
│   ├── index.js / index.css    ← Entry point + global styles
│   ├── api/index.js            ← All backend API calls (axios)
│   ├── context/AuthContext.js  ← Login state & role management
│   ├── components/
│   │   ├── Navbar.js/.css      ← Role-based navbar
│   │   ├── Layout.js           ← Protected route wrapper
│   │   └── Toast.js            ← Notification toasts
│   └── pages/
│       ├── AuthPage.js/.css    ← Login + Register
│       ├── NotificationsPage.js
│       ├── student/            ← Student dashboard + pages
│       ├── staff/              ← Staff dashboard + pages
│       └── librarian/          ← Librarian dashboard + pages
├── CorsConfig.java             ← Add this to your Spring Boot project!
└── package.json
```

---

## 🚀 Setup Instructions

### STEP 1 — Backend (IntelliJ)

1. Open your Spring Boot project in IntelliJ
2. Copy `CorsConfig.java` to:
   ```
   src/main/java/com/example/library/config/CorsConfig.java
   ```
3. Make sure your `application.properties` has:
   ```properties
   server.port=8080
   ```
4. Run the Spring Boot application ▶️

---

### STEP 2 — Frontend (VS Code)

1. Open the `library-frontend` folder in VS Code
2. Open terminal (`Ctrl + \``)
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npm start
   ```
5. Browser opens at **http://localhost:3000**

---

## 🔐 Role-Based Flow

| Action | Route |
|--------|-------|
| Register as **STUDENT** | → `/student/dashboard` |
| Register as **STAFF**   | → `/staff/dashboard` |
| Register as **LIBRARIAN** | → `/librarian/dashboard` |

---

## 👤 Role Capabilities

### 🎓 Student
- Browse & search books
- Borrow books
- Return books
- View fines & pay them
- View notifications

### 🏢 Staff
- View book catalog
- View all members
- View all borrow records
- View notifications

### 🏛️ Librarian (Full Admin)
- Add & delete books
- Register & remove members
- Issue books to members & process returns
- Manage fines
- Send notifications to members

---

## 🔌 API Connection

The frontend connects to `http://localhost:8080` automatically.
All API calls are in `src/api/index.js`.

If your backend runs on a different port, update `src/api/index.js`:
```js
const api = axios.create({
  baseURL: 'http://localhost:YOUR_PORT',  // change here
  ...
});
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| HTTP Client | Axios |
| Styling | Custom CSS (no UI library needed) |
| Backend | Spring Boot (your existing project) |
| State | React Context API |

---

> Built with ❤️ for your Library Management System project
