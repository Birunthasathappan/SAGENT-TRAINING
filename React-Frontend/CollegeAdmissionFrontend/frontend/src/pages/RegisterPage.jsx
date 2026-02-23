// ================================================================
// RegisterPage.jsx
// Allows new Students and Officers to create accounts.
//
// Student fields: name, dob, phnNo, email, password, gender, address
// Officer fields: name, phnNo, mail, password
//
// These match the entity fields in the Spring Boot backend.
// ================================================================

import { useState } from "react";
import { registerStudent, registerOfficer } from "../api";

export default function RegisterPage({ setPage }) {
  const [role, setRole] = useState("student"); // "student" or "officer"

  // --- Student form fields ---
  const [studentForm, setStudentForm] = useState({
    name: "",
    dob: "",
    phnNo: "",
    email: "",
    password: "",
    gender: "",
    address: "",
  });

  // --- Officer form fields ---
  const [officerForm, setOfficerForm] = useState({
    name: "",
    phnNo: "",
    mail: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update a field in the student form
  function handleStudentChange(e) {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  }

  // Update a field in the officer form
  function handleOfficerChange(e) {
    setOfficerForm({ ...officerForm, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (role === "student") {
        await registerStudent(studentForm);
        setSuccess("✅ Student account created! You can now login.");
        setStudentForm({ name: "", dob: "", phnNo: "", email: "", password: "", gender: "", address: "" });
      } else {
        await registerOfficer(officerForm);
        setSuccess("✅ Officer account created! You can now login.");
        setOfficerForm({ name: "", phnNo: "", mail: "", password: "" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {/* Role Tabs */}
        <div style={styles.tabs}>
          <button
            style={role === "student" ? styles.tabActive : styles.tab}
            onClick={() => { setRole("student"); setError(""); setSuccess(""); }}
          >
            Student
          </button>
          <button
            style={role === "officer" ? styles.tabActive : styles.tab}
            onClick={() => { setRole("officer"); setError(""); setSuccess(""); }}
          >
            Officer
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ======= STUDENT FORM ======= */}
          {role === "student" && (
            <>
              <FormField label="Full Name" name="name" value={studentForm.name} onChange={handleStudentChange} placeholder="John Doe" required />
              <FormField label="Date of Birth" name="dob" type="date" value={studentForm.dob} onChange={handleStudentChange} required />
              <FormField label="Phone Number" name="phnNo" value={studentForm.phnNo} onChange={handleStudentChange} placeholder="9876543210" required />
              <FormField label="Email" name="email" type="email" value={studentForm.email} onChange={handleStudentChange} placeholder="john@gmail.com" required />
              <FormField label="Password" name="password" type="password" value={studentForm.password} onChange={handleStudentChange} placeholder="Create a password" required />

              {/* Gender Dropdown */}
              <div style={styles.field}>
                <label style={styles.label}>Gender</label>
                <select
                  style={styles.input}
                  name="gender"
                  value={studentForm.gender}
                  onChange={handleStudentChange}
                  required
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Address Textarea */}
              <div style={styles.field}>
                <label style={styles.label}>Address</label>
                <textarea
                  style={{ ...styles.input, height: "80px", resize: "vertical" }}
                  name="address"
                  value={studentForm.address}
                  onChange={handleStudentChange}
                  placeholder="Enter your full address"
                  required
                />
              </div>
            </>
          )}

          {/* ======= OFFICER FORM ======= */}
          {role === "officer" && (
            <>
              <FormField label="Full Name" name="name" value={officerForm.name} onChange={handleOfficerChange} placeholder="Officer Name" required />
              <FormField label="Phone Number" name="phnNo" value={officerForm.phnNo} onChange={handleOfficerChange} placeholder="9876543210" required />
              {/* Note: officer uses 'mail' not 'email' in backend entity */}
              <FormField label="Email" name="mail" type="email" value={officerForm.mail} onChange={handleOfficerChange} placeholder="officer@college.edu" required />
              <FormField label="Password" name="password" type="password" value={officerForm.password} onChange={handleOfficerChange} placeholder="Create a password" required />
            </>
          )}

          {/* Error & Success Messages */}
          {error && <p style={styles.error}>❌ {error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={styles.loginLink}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => setPage("login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

// ---- Reusable input field component ----
function FormField({ label, name, type = "text", value, onChange, placeholder, required }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    background: "#f5f5f5",
    padding: "30px 20px",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "480px",
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
  field: { marginBottom: "16px" },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "0.88rem",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "7px",
    border: "1px solid #ccc",
    fontSize: "0.92rem",
    boxSizing: "border-box",
    outline: "none",
  },
  error: {
    color: "#c62828",
    fontSize: "0.9rem",
    background: "#ffebee",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "12px",
  },
  success: {
    color: "#1b5e20",
    fontSize: "0.9rem",
    background: "#e8f5e9",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "12px",
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
    marginTop: "4px",
  },
  loginLink: {
    textAlign: "center",
    marginTop: "18px",
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
