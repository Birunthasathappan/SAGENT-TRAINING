// ================================================================
// App.jsx
// This is the main component. It controls WHICH PAGE is shown.
//
// Instead of React Router, we use a simple "page" state.
// setPage("login") → shows LoginPage
// setPage("register") → shows RegisterPage
// etc.
//
// This makes the code easier to understand for beginners.
// ================================================================

import { useState } from "react";
import { useAuth } from "./context/AuthContext";

// Import all pages
import HomePage        from "./pages/HomePage";
import LoginPage       from "./pages/LoginPage";
import RegisterPage    from "./pages/RegisterPage";
import ApplyPage       from "./pages/ApplyPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import UploadDocPage   from "./pages/UploadDocPage";
import OfficerDashboardPage from "./pages/OfficerDashboardPage";

// Import shared Navbar
import Navbar from "./components/Navbar";

export default function App() {
  const { user } = useAuth();

  // "page" controls what is displayed
  const [page, setPage] = useState("home");

  // Decide which page component to render
  function renderPage() {
    // ---- Public pages (no login needed) ----
    if (page === "home")     return <HomePage setPage={setPage} />;
    if (page === "login")    return <LoginPage setPage={setPage} />;
    if (page === "register") return <RegisterPage setPage={setPage} />;

    // ---- Student-only pages ----
    // If not logged in as student, redirect to login
    if (page === "applyPage") {
      if (!user || user.role !== "student") return <LoginPage setPage={setPage} />;
      return <ApplyPage setPage={setPage} />;
    }

    if (page === "myApplications") {
      if (!user || user.role !== "student") return <LoginPage setPage={setPage} />;
      return <MyApplicationsPage setPage={setPage} />;
    }

    if (page === "uploadDoc") {
      if (!user || user.role !== "student") return <LoginPage setPage={setPage} />;
      return <UploadDocPage setPage={setPage} />;
    }

    // ---- Officer-only pages ----
    if (page === "officerDashboard") {
      if (!user || user.role !== "officer") return <LoginPage setPage={setPage} />;
      return <OfficerDashboardPage setPage={setPage} />;
    }

    // Default: show home
    return <HomePage setPage={setPage} />;
  }

  return (
    <div style={styles.app}>
      {/* Navbar is always visible at the top */}
      <Navbar currentPage={page} setPage={setPage} />

      {/* Main content area */}
      <main style={styles.main}>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2024 College Admission Portal | Built with React + Spring Boot</p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f5f5f5",
  },
  main: {
    flex: 1,
  },
  footer: {
    background: "#1a237e",
    color: "#c5cae9",
    textAlign: "center",
    padding: "14px 20px",
    fontSize: "0.85rem",
  },
};
