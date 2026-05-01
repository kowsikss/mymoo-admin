import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/api/doctor-auth/forgot-password", { email });
      setSent(true); // show success message regardless
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🐄 Forgot Password</h2>

        {sent ? (
          <div style={styles.successBox}>
            <p style={styles.successText}>
              ✅ If this email is registered, a reset link has been sent to <strong>{email}</strong>.
              Check your inbox (and spam folder).
            </p>
            <button style={styles.backBtn} onClick={() => navigate("/doctor-login")}>
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={styles.desc}>
              Enter your registered email address and we'll send you a password reset link.
            </p>

            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p style={styles.back} onClick={() => navigate("/doctor-login")}>
              ← Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:        { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f0" },
  card:        { background: "white", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
  title:       { fontFamily: "serif", fontSize: "1.6rem", color: "#166534", marginBottom: "8px" },
  desc:        { color: "#6b7280", fontSize: "14px", marginBottom: "24px", lineHeight: "1.6" },
  label:       { display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" },
  input:       { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" },
  btn:         { width: "100%", padding: "12px", background: "#166534", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
  back:        { textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#166534", cursor: "pointer" },
  error:       { color: "#dc2626", fontSize: "13px", marginBottom: "12px" },
  successBox:  { textAlign: "center" },
  successText: { color: "#374151", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" },
  backBtn:     { padding: "10px 24px", background: "#166534", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" },
};

export default ForgotPassword;