// ================================================================
// MyApplicationsPage.jsx
// Shows the logged-in student's applications.
// Student can also:
//  - Pay fee (only if status is APPROVED)
//  - Cancel application
//
// API calls:
//   GET    /applications              - all apps (filtered by student)
//   POST   /applications/{id}/payment - pay fee
//   DELETE /applications/{id}         - cancel
// ================================================================

import { useState, useEffect } from "react";
import { getAllApplications, createPayment, cancelApplication } from "../api";
import { useAuth } from "../context/AuthContext";

export default function MyApplicationsPage() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // success/info message

  // Payment mode state (per application)
  const [payMode, setPayMode] = useState({}); // { appId: "UPI" }

  // Load applications on mount
  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    setError("");
    try {
      const all = await getAllApplications();
      // Filter to only show THIS student's applications
      const mine = all.filter(
        (app) => app.student?.studentId === user.id
      );
      setApplications(mine);
    } catch (err) {
      setError("Failed to load applications. Is your backend running?");
    } finally {
      setLoading(false);
    }
  }

  // Pay fee for an application
  async function handlePayment(appId) {
    const mode = payMode[appId] || "UPI"; // default to UPI
    try {
      await createPayment(appId, mode);
      setMessage(`✅ Payment successful for Application #${appId} via ${mode}`);
      loadApplications(); // refresh list
    } catch (err) {
      setMessage(`❌ Payment failed: ${err.message}`);
    }
  }

  // Cancel an application
  async function handleCancel(appId) {
    const confirmed = window.confirm("Are you sure you want to cancel this application?");
    if (!confirmed) return;

    try {
      await cancelApplication(appId);
      setMessage(`✅ Application #${appId} has been cancelled.`);
      loadApplications(); // refresh list
    } catch (err) {
      setMessage(`❌ Cancel failed: ${err.message}`);
    }
  }

  // Return a colored badge based on status
  function StatusBadge({ status }) {
    const colors = {
      PENDING:     { bg: "#fff9c4", color: "#f57f17" },
      APPROVED:    { bg: "#e8f5e9", color: "#2e7d32" },
      REJECTED:    { bg: "#ffebee", color: "#c62828" },
      "UNDER REVIEW": { bg: "#e3f2fd", color: "#1565c0" },
      ACCEPTED:    { bg: "#e8f5e9", color: "#2e7d32" },
    };
    const style = colors[status?.toUpperCase()] || { bg: "#f5f5f5", color: "#333" };
    return (
      <span style={{ ...styles.badge, background: style.bg, color: style.color }}>
        {status}
      </span>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>📋 My Applications</h2>

      {/* Message bar */}
      {message && (
        <div style={message.startsWith("✅") ? styles.successMsg : styles.errorMsg}>
          {message}
        </div>
      )}

      {/* Loading state */}
      {loading && <p style={styles.center}>Loading your applications...</p>}

      {/* Error state */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Empty state */}
      {!loading && applications.length === 0 && !error && (
        <div style={styles.emptyBox}>
          <p>You haven't applied for any course yet.</p>
        </div>
      )}

      {/* Applications List */}
      {!loading && applications.map((app) => (
        <div key={app.applicationId} style={styles.appCard}>

          {/* Header row */}
          <div style={styles.appHeader}>
            <h3 style={styles.appId}>Application #{app.applicationId}</h3>
            <StatusBadge status={app.status} />
          </div>

          {/* Details */}
          <div style={styles.appBody}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Course</span>
              <span>{app.course?.name || "N/A"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Duration</span>
              <span>{app.course?.duration || "N/A"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Fee</span>
              <span>₹{app.course?.fee?.toLocaleString() || "N/A"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Applied On</span>
              <span>{app.appliedDate}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={styles.appActions}>

            {/* Pay Fee - only available if APPROVED */}
            {app.status?.toUpperCase() === "APPROVED" && (
              <div style={styles.payRow}>
                <select
                  style={styles.select}
                  value={payMode[app.applicationId] || "UPI"}
                  onChange={(e) => setPayMode({ ...payMode, [app.applicationId]: e.target.value })}
                >
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="NET_BANKING">Net Banking</option>
                  <option value="CASH">Cash</option>
                </select>
                <button
                  style={styles.payBtn}
                  onClick={() => handlePayment(app.applicationId)}
                >
                  💳 Pay Fee
                </button>
              </div>
            )}

            {/* Cancel button */}
            <button
              style={styles.cancelBtn}
              onClick={() => handleCancel(app.applicationId)}
            >
              ❌ Cancel Application
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  title: { color: "#1a237e", marginBottom: "20px" },
  center: { textAlign: "center", color: "#666", padding: "30px" },
  error: {
    color: "#c62828",
    background: "#ffebee",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  successMsg: {
    background: "#e8f5e9",
    color: "#1b5e20",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontWeight: "500",
  },
  errorMsg: {
    background: "#ffebee",
    color: "#c62828",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  emptyBox: {
    textAlign: "center",
    color: "#888",
    padding: "50px",
    background: "#fafafa",
    borderRadius: "12px",
    border: "2px dashed #ddd",
  },
  appCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "22px 24px",
    marginBottom: "18px",
    boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
    border: "1px solid #e8eaf6",
  },
  appHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  appId: { margin: 0, color: "#1a237e", fontSize: "1.1rem" },
  badge: {
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "0.82rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  appBody: { marginBottom: "16px" },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "0.92rem",
    borderBottom: "1px solid #f0f0f0",
    color: "#444",
  },
  detailLabel: { fontWeight: "600", color: "#666" },
  appActions: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
  payRow: { display: "flex", gap: "8px", alignItems: "center" },
  select: {
    padding: "7px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.88rem",
  },
  payBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.88rem",
  },
  cancelBtn: {
    background: "#ffebee",
    color: "#c62828",
    border: "1px solid #ef9a9a",
    padding: "7px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "0.88rem",
  },
};
