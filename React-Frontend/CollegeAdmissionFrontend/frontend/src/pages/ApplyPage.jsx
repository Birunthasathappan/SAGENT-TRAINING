// ================================================================
// ApplyPage.jsx
// Student selects a course and submits an application.
//
// API calls used:
//   GET  /courses              - to load available courses
//   POST /applications/{studentId}/{courseId}  - to apply
// ================================================================

import { useState, useEffect } from "react";
import { getAllCourses, applyForCourse } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ApplyPage({ setPage }) {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);     // list of available courses
  const [selectedCourse, setSelectedCourse] = useState(""); // selected course ID
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [appliedApp, setAppliedApp] = useState(null); // the returned application object

  // Load courses when the page opens
  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses. Is your backend running?");
      } finally {
        setFetchLoading(false);
      }
    }
    loadCourses();
  }, []); // empty array = run once on mount

  async function handleApply(e) {
    e.preventDefault();
    if (!selectedCourse) {
      setError("Please select a course.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Call POST /applications/{studentId}/{courseId}
      const application = await applyForCourse(user.id, selectedCourse);
      setAppliedApp(application);
      setSuccess(`✅ Application submitted! Your Application ID is: ${application.applicationId}`);
      setSelectedCourse("");
    } catch (err) {
      setError(err.message || "Failed to apply. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Apply for a Course</h2>
        <p style={styles.subtitle}>Hello {user?.name}, select a course to apply.</p>

        {/* Show loading while fetching courses */}
        {fetchLoading && <p style={styles.info}>Loading courses...</p>}

        {/* Show error if fetching failed */}
        {error && !fetchLoading && <p style={styles.error}>❌ {error}</p>}

        {/* Success message with application details */}
        {success && (
          <div style={styles.successBox}>
            <p style={styles.successText}>{success}</p>
            {appliedApp && (
              <div style={styles.appDetails}>
                <p><strong>Application ID:</strong> {appliedApp.applicationId}</p>
                <p><strong>Course:</strong> {appliedApp.course?.name}</p>
                <p><strong>Status:</strong> <span style={styles.statusPending}>{appliedApp.status}</span></p>
                <p><strong>Applied Date:</strong> {appliedApp.appliedDate}</p>
              </div>
            )}
            <button style={styles.viewBtn} onClick={() => setPage("myApplications")}>
              View My Applications →
            </button>
          </div>
        )}

        {/* Application Form */}
        {!success && !fetchLoading && courses.length > 0 && (
          <form onSubmit={handleApply}>
            <div style={styles.field}>
              <label style={styles.label}>Available Courses</label>
              {/* Show each course as a selectable card */}
              <div style={styles.courseList}>
                {courses.map((course) => (
                  <div
                    key={course.courseId}
                    style={{
                      ...styles.courseCard,
                      ...(selectedCourse === course.courseId ? styles.courseCardSelected : {}),
                    }}
                    onClick={() => setSelectedCourse(course.courseId)}
                  >
                    <div style={styles.courseName}>{course.name}</div>
                    <div style={styles.courseDetails}>
                      <span>⏱ {course.duration}</span>
                      <span>💰 ₹{course.fee?.toLocaleString()}</span>
                    </div>
                    {course.structure && (
                      <div style={styles.courseStructure}>{course.structure}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedCourse && (
              <p style={styles.selectedInfo}>
                ✅ Selected Course ID: {selectedCourse}
              </p>
            )}

            <button style={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}

        {/* No courses available */}
        {!fetchLoading && courses.length === 0 && !error && (
          <p style={styles.info}>No courses available at the moment.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "calc(100vh - 60px)",
    background: "#f5f5f5",
    padding: "30px 20px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "580px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    height: "fit-content",
  },
  title: { color: "#1a237e", margin: "0 0 6px", fontSize: "1.6rem" },
  subtitle: { color: "#666", margin: "0 0 28px", fontSize: "0.95rem" },
  field: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "10px", fontWeight: "600", color: "#333" },
  courseList: { display: "flex", flexDirection: "column", gap: "10px" },
  courseCard: {
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    padding: "14px 18px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  courseCardSelected: {
    border: "2px solid #1a237e",
    background: "#e8eaf6",
  },
  courseName: { fontWeight: "600", color: "#1a237e", fontSize: "1rem", marginBottom: "6px" },
  courseDetails: { display: "flex", gap: "16px", fontSize: "0.85rem", color: "#555" },
  courseStructure: { marginTop: "6px", fontSize: "0.8rem", color: "#888" },
  selectedInfo: { color: "#1a237e", fontSize: "0.9rem", marginBottom: "14px" },
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
  info: { color: "#666", textAlign: "center", padding: "20px 0" },
  error: {
    color: "#c62828",
    background: "#ffebee",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  successBox: {
    background: "#e8f5e9",
    border: "1px solid #a5d6a7",
    borderRadius: "10px",
    padding: "20px",
  },
  successText: { color: "#1b5e20", fontWeight: "600", margin: "0 0 12px" },
  appDetails: { fontSize: "0.9rem", color: "#333", lineHeight: "1.8", marginBottom: "14px" },
  statusPending: {
    background: "#fff9c4",
    color: "#f57f17",
    padding: "2px 10px",
    borderRadius: "12px",
    fontWeight: "600",
  },
  viewBtn: {
    background: "#1a237e",
    color: "#fff",
    border: "none",
    padding: "9px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
