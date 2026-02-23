// ================================================================
// UploadDocPage.jsx
// Student selects an application and uploads a document.
//
// Note: The backend Document entity only stores:
//   - application (linked by ID)
//   - docType (string like "MARKSHEET" or "ID_PROOF")
//   - uploadedDate
//
// The backend does NOT store actual file binary data,
// so we send docType + applicationId as JSON to POST /documents
//
// API calls:
//   GET  /applications  - to show student's applications
//   POST /documents     - to save document record
// ================================================================

import { useState, useEffect } from "react";
import { getAllApplications, saveDocument } from "../api";
import { useAuth } from "../context/AuthContext";

export default function UploadDocPage() {
  const { user } = useAuth();

  const [myApplications, setMyApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [docType, setDocType] = useState("MARKSHEET");
  const [fileName, setFileName] = useState(""); // just for display

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load student's applications on mount
  useEffect(() => {
    async function loadApps() {
      try {
        const all = await getAllApplications();
        // Filter to only this student's applications
        const mine = all.filter(
          (app) => app.student?.studentId === user.id
        );
        setMyApplications(mine);
        if (mine.length > 0) {
          setSelectedAppId(mine[0].applicationId); // auto-select first
        }
      } catch (err) {
        setError("Failed to load applications.");
      } finally {
        setFetchLoading(false);
      }
    }
    loadApps();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();

    if (!selectedAppId) {
      setError("Please select an application first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Build the document object to send to backend
      // The Application is linked by an object with applicationId
      const documentData = {
        application: { applicationId: Number(selectedAppId) },
        docType: docType,
        uploadedDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      };

      await saveDocument(documentData);
      setSuccess(`✅ Document "${docType}" uploaded successfully for Application #${selectedAppId}`);
      setFileName(""); // clear file input display
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>📄 Upload Documents</h2>
        <p style={styles.subtitle}>
          Upload your marksheet or ID proof for a submitted application.
        </p>

        {fetchLoading && <p style={styles.info}>Loading your applications...</p>}

        {!fetchLoading && myApplications.length === 0 && (
          <p style={styles.info}>
            You have no applications yet. Apply for a course first!
          </p>
        )}

        {error && <p style={styles.error}>❌ {error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {!fetchLoading && myApplications.length > 0 && (
          <form onSubmit={handleUpload}>

            {/* Select Application */}
            <div style={styles.field}>
              <label style={styles.label}>Select Your Application</label>
              <select
                style={styles.select}
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                required
              >
                {myApplications.map((app) => (
                  <option key={app.applicationId} value={app.applicationId}>
                    #{app.applicationId} — {app.course?.name} ({app.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Document Type */}
            <div style={styles.field}>
              <label style={styles.label}>Document Type</label>
              <select
                style={styles.select}
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                required
              >
                <option value="MARKSHEET">Marksheet</option>
                <option value="ID_PROOF">ID Proof (Aadhar / PAN)</option>
                <option value="PHOTO">Passport Photo</option>
                <option value="CERTIFICATE">Other Certificate</option>
              </select>
            </div>

            {/* File Input (for display only - backend doesn't store file bytes) */}
            <div style={styles.field}>
              <label style={styles.label}>Choose File (scanned copy)</label>
              <div style={styles.fileInputWrapper}>
                <input
                  type="file"
                  id="fileInput"
                  style={styles.fileInput}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setFileName(file.name);
                  }}
                />
                <label htmlFor="fileInput" style={styles.fileLabel}>
                  📎 {fileName || "Click to choose a file"}
                </label>
              </div>
              <small style={styles.hint}>
                Note: The backend stores document type only. Actual file storage
                requires a file upload endpoint (not yet in backend).
              </small>
            </div>

            <button style={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </form>
        )}
      </div>

      {/* Info box */}
      <div style={styles.infoBox}>
        <h4 style={styles.infoTitle}>📌 Documents Required</h4>
        <ul style={styles.infoList}>
          <li>✅ Latest Marksheet (10th / 12th / Degree)</li>
          <li>✅ Government ID Proof (Aadhar Card / PAN Card)</li>
          <li>✅ Passport-size photograph</li>
        </ul>
        <p style={styles.infoNote}>Upload each document separately by selecting the type.</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "36px 40px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  title: { color: "#1a237e", margin: "0 0 6px", fontSize: "1.6rem" },
  subtitle: { color: "#666", margin: "0 0 28px", fontSize: "0.93rem" },
  field: { marginBottom: "20px" },
  label: {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600",
    fontSize: "0.9rem",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "7px",
    border: "1px solid #ccc",
    fontSize: "0.93rem",
    boxSizing: "border-box",
  },
  fileInputWrapper: { position: "relative" },
  fileInput: { display: "none" }, // hide the default ugly file input
  fileLabel: {
    display: "block",
    padding: "10px 16px",
    border: "2px dashed #9fa8da",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#3949ab",
    fontSize: "0.92rem",
    textAlign: "center",
    background: "#f5f7ff",
  },
  hint: { display: "block", marginTop: "6px", color: "#999", fontSize: "0.78rem" },
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
  info: { textAlign: "center", color: "#888", padding: "20px 0" },
  error: {
    color: "#c62828",
    background: "#ffebee",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "14px",
  },
  success: {
    color: "#1b5e20",
    background: "#e8f5e9",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "14px",
    fontWeight: "500",
  },
  infoBox: {
    background: "#e8eaf6",
    borderRadius: "12px",
    padding: "22px 24px",
    border: "1px solid #c5cae9",
  },
  infoTitle: { color: "#1a237e", margin: "0 0 12px" },
  infoList: { paddingLeft: "4px", listStyle: "none", margin: "0 0 10px" },
  infoNote: { fontSize: "0.85rem", color: "#555", margin: 0 },
};
