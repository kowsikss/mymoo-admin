import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token }             = useParams();
  const navigate              = useNavigate();
  const [password, setPassword]           = useState("");
  const [confirm, setConfirm]             = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [error, setError]                 = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/doctor-auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Link is invalid or expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🐄 Reset Password</h2>

        {success ? (
          <div style={styles.successBox}>
            <p style={styles.successText}>✅ Password reset successfully!</p>
            <button style={styles.btn} onClick={() => navigate("/doctor-login")}>
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
            />

            <label style={styles.label}>Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              style={styles.input}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              required
            />

            <label style={{ ...styles.label, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show passwords
            </label>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:        { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f0" },
  card:        { background: "white", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
  title:       { fontFamily: "serif", fontSize: "1.6rem", color: "#166534", marginBottom: "24px" },
  label:       { display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" },
  input:       { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" },
  btn:         { width: "100%", padding: "12px", background: "#166534", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "8px" },
  error:       { color: "#dc2626", fontSize: "13px", marginBottom: "12px" },
  successBox:  { textAlign: "center" },
  successText: { color: "#374151", fontSize: "15px", marginBottom: "24px" },
};

export default ResetPassword;