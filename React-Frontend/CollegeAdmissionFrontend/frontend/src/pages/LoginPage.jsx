import { useState } from "react";
import { getAllStudents, getAllOfficers } from "../api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ setPage }) {
  const { login } = useAuth();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // This function only runs when Login button is clicked
  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return; // prevent double clicks

    setError("");
    setLoading(true);

    try {
      if (role === "student") {
        const students = await getAllStudents();

        const found = students.find(
          (s) => s.email === email && s.password === password
        );

        if (!found) {
          setError("Invalid email or password.");
          return;
        }

        login({
          id: found.studentId,
          name: found.name,
          email: found.email,
          role: "student",
        });

        setPage("applyPage");

      } else {
        const officers = await getAllOfficers();

        const found = officers.find(
          (o) => o.mail === email && o.password === password
        );

        if (!found) {
          setError("Invalid email or password.");
          return;
        }

        login({
          id: found.officerId,
          name: found.name,
          email: found.mail,
          role: "officer",
        });

        setPage("officerDashboard");
      }

    } catch (err) {
      setError("Failed to connect to server. Is backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <div style={styles.tabs}>
          <button
            style={role === "student" ? styles.tabActive : styles.tab}
            onClick={() => { setRole("student"); setError(""); }}
          >
            Student
          </button>
          <button
            style={role === "officer" ? styles.tabActive : styles.tab}
            onClick={() => { setRole("officer"); setError(""); }}
          >
            Officer
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={styles.error}>❌ {error}</p>}

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {role === "student" && (
          <p style={styles.registerLink}>
            New student?{" "}
            <span style={styles.link} onClick={() => setPage("register")}>
              Create an account
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#1a237e",
    margin: "0 0 24px",
    fontSize: "1.7rem",
  },
  tabs: {
    display: "flex",
    marginBottom: "24px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #c5cae9",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "#f5f5f5",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#555",
  },
  tabActive: {
    flex: 1,
    padding: "10px",
    background: "#1a237e",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#fff",
    fontWeight: "600",
  },
  field: { marginBottom: "18px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.9rem",
    color: "#333",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "7px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  },
  error: {
    color: "#c62828",
    fontSize: "0.9rem",
    background: "#ffebee",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "14px",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "#1a237e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  registerLink: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#555",
  },
  link: {
    color: "#1a237e",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "underline",
  },
};