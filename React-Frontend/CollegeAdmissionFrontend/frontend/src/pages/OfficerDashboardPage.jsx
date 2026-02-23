// ================================================================
// OfficerDashboardPage.jsx
// Only accessible to logged-in Officers.
// Shows ALL student applications and lets the officer update status.
//
// API calls:
//   GET /applications              - load all applications
//   PUT /applications/{id}/status  - update status
// ================================================================

import { useState, useEffect } from "react";
import { getAllApplications, updateApplicationStatus } from "../api";
import { useAuth } from "../context/AuthContext";

export default function OfficerDashboardPage() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Status being edited per application: { appId: "ACCEPTED" }
  const [statusInputs, setStatusInputs] = useState({});

  // Filter state - to filter by status
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (err) {
      setError("Failed to load applications. Is your backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(appId) {
    const newStatus = statusInputs[appId];
    if (!newStatus) {
      setMessage("❌ Please select a status first.");
      return;
    }

    try {
      // PUT /applications/{id}/status?status=ACCEPTED
      await updateApplicationStatus(appId, newStatus);
      setMessage(`✅ Application #${appId} status updated to "${newStatus}"`);
      loadApplications(); // refresh
    } catch (err) {
      setMessage(`❌ Update failed: ${err.message}`);
    }
  }

  // Helper: show colored badge for status
  function StatusBadge({ status }) {
    const map = {
      PENDING:        { bg: "#fff9c4", color: "#f57f17" },
      APPROVED:       { bg: "#e8f5e9", color: "#2e7d32" },
      ACCEPTED:       { bg: "#e8f5e9", color: "#2e7d32" },
      REJECTED:       { bg: "#ffebee", color: "#c62828" },
      "UNDER REVIEW": { bg: "#e3f2fd", color: "#1565c0" },
    };
    const style = map[status?.toUpperCase()] || { bg: "#f5f5f5", color: "#333" };
    return (
      <span style={{ ...styles.badge, background: style.bg, color: style.color }}>
        {status}
      </span>
    );
  }

  // Filter applications based on selected filter
  const filtered = filterStatus === "ALL"
    ? applications
    : applications.filter(
        (app) => app.status?.toUpperCase() === filterStatus
      );

  // Count by status for summary cards
  const counts = {
    total:    applications.length,
    pending:  applications.filter((a) => a.status?.toUpperCase() === "PENDING").length,
    approved: applications.filter((a) => ["APPROVED","ACCEPTED"].includes(a.status?.toUpperCase())).length,
    rejected: applications.filter((a) => a.status?.toUpperCase() === "REJECTED").length,
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>👮 Officer Dashboard</h2>
      <p style={styles.subtitle}>Welcome, {user?.name}. Review and update student applications below.</p>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Applications", count: counts.total, color: "#1a237e", bg: "#e8eaf6" },
          { label: "Pending",  count: counts.pending,  color: "#f57f17", bg: "#fff9c4" },
          { label: "Approved", count: counts.approved, color: "#2e7d32", bg: "#e8f5e9" },
          { label: "Rejected", count: counts.rejected, color: "#c62828", bg: "#ffebee" },
        ].map((s) => (
          <div key={s.label} style={{ ...styles.summaryCard, background: s.bg }}>
            <div style={{ ...styles.summaryCount, color: s.color }}>{s.count}</div>
            <div style={{ ...styles.summaryLabel, color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <span style={styles.filterLabel}>Filter by Status:</span>
        {["ALL", "PENDING", "UNDER REVIEW", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            style={filterStatus === s ? styles.filterBtnActive : styles.filterBtn}
            onClick={() => setFilterStatus(s)}
          >
            {s}
          </button>
        ))}
        <button style={styles.refreshBtn} onClick={loadApplications}>
          🔄 Refresh
        </button>
      </div>

      {/* Message bar */}
      {message && (
        <div style={message.startsWith("✅") ? styles.successMsg : styles.errorMsg}>
          {message}
        </div>
      )}

      {loading && <p style={styles.center}>Loading applications...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && filtered.length === 0 && (
        <p style={styles.center}>No applications found.</p>
      )}

      {/* Applications Table */}
      {!loading && filtered.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>App ID</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Applied Date</th>
                <th style={styles.th}>Current Status</th>
                <th style={styles.th}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.applicationId} style={styles.tr}>
                  <td style={styles.td}>#{app.applicationId}</td>
                  <td style={styles.td}>{app.student?.name || "N/A"}</td>
                  <td style={styles.td}>{app.student?.email || "N/A"}</td>
                  <td style={styles.td}>{app.course?.name || "N/A"}</td>
                  <td style={styles.td}>{app.appliedDate}</td>
                  <td style={styles.td}>
                    <StatusBadge status={app.status} />
                  </td>
                  <td style={styles.td}>
                    <div style={styles.updateRow}>
                      <select
                        style={styles.select}
                        value={statusInputs[app.applicationId] || ""}
                        onChange={(e) =>
                          setStatusInputs({
                            ...statusInputs,
                            [app.applicationId]: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Select --</option>
                        <option value="UNDER REVIEW">Under Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      <button
                        style={styles.updateBtn}
                        onClick={() => handleUpdateStatus(app.applicationId)}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 24px",
  },
  title: { color: "#1a237e", margin: "0 0 4px" },
  subtitle: { color: "#666", margin: "0 0 28px", fontSize: "0.95rem" },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "26px",
  },
  summaryCard: {
    borderRadius: "12px",
    padding: "18px 20px",
    textAlign: "center",
  },
  summaryCount: { fontSize: "2rem", fontWeight: "800" },
  summaryLabel: { fontSize: "0.85rem", fontWeight: "600", marginTop: "4px" },
  filterBar: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  filterLabel: { fontWeight: "600", fontSize: "0.9rem", color: "#444" },
  filterBtn: {
    padding: "6px 14px",
    background: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.82rem",
    color: "#555",
  },
  filterBtnActive: {
    padding: "6px 14px",
    background: "#1a237e",
    border: "1px solid #1a237e",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.82rem",
    color: "#fff",
    fontWeight: "600",
  },
  refreshBtn: {
    marginLeft: "auto",
    padding: "6px 14px",
    background: "#e3f2fd",
    border: "1px solid #90caf9",
    borderRadius: "7px",
    cursor: "pointer",
    color: "#1565c0",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  successMsg: {
    background: "#e8f5e9",
    color: "#1b5e20",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontWeight: "500",
  },
  errorMsg: {
    background: "#ffebee",
    color: "#c62828",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "14px",
  },
  center: { textAlign: "center", color: "#666", padding: "30px" },
  error: {
    color: "#c62828",
    background: "#ffebee",
    padding: "10px",
    borderRadius: "6px",
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 3px 14px rgba(0,0,0,0.08)",
  },
  thead: { background: "#1a237e" },
  th: {
    padding: "13px 16px",
    textAlign: "left",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#fff",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: {
    padding: "12px 16px",
    fontSize: "0.88rem",
    color: "#333",
    verticalAlign: "middle",
  },
  badge: {
    padding: "3px 12px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  updateRow: { display: "flex", gap: "6px", alignItems: "center" },
  select: {
    padding: "5px 8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.82rem",
  },
  updateBtn: {
    background: "#1a237e",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.82rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
};
