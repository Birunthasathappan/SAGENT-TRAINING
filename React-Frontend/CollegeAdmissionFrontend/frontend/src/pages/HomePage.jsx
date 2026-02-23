export default function HomePage({ setPage }) {
  return (
    <div style={styles.container}>

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🎓 Welcome to the College Admission Portal</h1>
        <p style={styles.heroSubtitle}>
          Apply for courses online, upload your documents, pay fees, and track your
          application status — all from one place.
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.btnBlue} onClick={() => setPage("login")}>
            Login to Your Account
          </button>
          <button style={styles.btnOutline} onClick={() => setPage("register")}>
            Create New Account
          </button>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px 60px",
  },
  hero: {
    background: "linear-gradient(135deg, #e8eaf6, #c5cae9)",
    borderRadius: "16px",
    padding: "60px 40px",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "2.2rem",
    color: "#1a237e",
    margin: "0 0 16px",
  },
  heroSubtitle: {
    fontSize: "1.05rem",
    color: "#3949ab",
    maxWidth: "580px",
    margin: "0 auto 30px",
    lineHeight: "1.6",
  },
  heroBtns: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  btnBlue: {
    background: "#1a237e",
    color: "#fff",
    border: "none",
    padding: "13px 30px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  btnOutline: {
    background: "transparent",
    color: "#1a237e",
    border: "2px solid #1a237e",
    padding: "11px 28px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};