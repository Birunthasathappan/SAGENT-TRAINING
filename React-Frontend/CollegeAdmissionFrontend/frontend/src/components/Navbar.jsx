// ================================================================
// Navbar.jsx
// The top navigation bar shown on every page.
// Shows different links depending on who is logged in.
// ================================================================

import { useAuth } from "../context/AuthContext";

export default function Navbar({ currentPage, setPage }) {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();       // clears user from context
    setPage("home"); // redirect to home page
  }

  return (
    <nav style={styles.nav}>
      {/* Brand / Logo - clicking takes you home */}
      <div style={styles.brand} onClick={() => setPage("home")}>
        🎓 College Admission Portal
      </div>

      {/* Navigation Links */}
      <div style={styles.links}>

        {/* --- Not logged in: show Login and Register --- */}
        {!user && (
          <>
            <button style={styles.link} onClick={() => setPage("login")}>Login</button>
            <button style={styles.linkOutline} onClick={() => setPage("register")}>Register</button>
          </>
        )}

        {/* --- Logged in as STUDENT --- */}
        {user?.role === "student" && (
          <>
            <button style={styles.link} onClick={() => setPage("applyPage")}>Apply for Course</button>
            <button style={styles.link} onClick={() => setPage("myApplications")}>My Applications</button>
            <button style={styles.link} onClick={() => setPage("uploadDoc")}>Upload Documents</button>
            <span style={styles.userName}>👋 {user.name}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </>
        )}

        {/* --- Logged in as OFFICER --- */}
        {user?.role === "officer" && (
          <>
            <button style={styles.link} onClick={() => setPage("officerDashboard")}>All Applications</button>
            <span style={styles.userName}>👮 {user.name}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </>
        )}

      </div>
    </nav>
  );
}

// ---- Inline Styles ----
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    height: "60px",
    background: "#1a237e",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 999,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  brand: {
    fontWeight: "700",
    fontSize: "1.2rem",
    cursor: "pointer",
    letterSpacing: "0.3px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  link: {
    background: "#283593",
    color: "#fff",
    border: "none",
    padding: "7px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.88rem",
    transition: "background 0.2s",
  },
  linkOutline: {
    background: "transparent",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.7)",
    padding: "5px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.88rem",
  },
  logoutBtn: {
    background: "#b71c1c",
    color: "#fff",
    border: "none",
    padding: "7px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.88rem",
  },
  userName: {
    fontSize: "0.9rem",
    color: "#c5cae9",
    marginLeft: "6px",
    marginRight: "4px",
  },
};
