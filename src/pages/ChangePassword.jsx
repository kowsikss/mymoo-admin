import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";

function ChangePassword() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields are required");
      return;
    }
    if (form.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password changed successfully! Please log in again.");
      localStorage.clear();

      // Redirect to correct login
      if (role === "kosala-admin") navigate("/kosala-admin-login");
      else if (role === "doctor") navigate("/doctor-login");
      else navigate("/");

    } catch (err) {
      console.error("Error changing password:", err);
      const msg = err.response?.data?.message || "Failed to change password";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const getSidebar = () => {
    if (role === "kosala-admin") return <KosalaAdminSidebar />;
    return <Sidebar />;
  };

  return (
    <div className="layout">
      {getSidebar()}
      <div className="main">
        <Navbar />
        <h2>Change Password</h2>
        <form className="form-box" onSubmit={handleSubmit}>

          <label>Current Password <span style={{ color: "red" }}>*</span></label>
          <input
            type={showPasswords ? "text" : "password"}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            required
          />

          <label>New Password <span style={{ color: "red" }}>*</span></label>
          <input
            type={showPasswords ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password (min 6 chars)"
            required
          />

          <label>Confirm New Password <span style={{ color: "red" }}>*</span></label>
          <input
            type={showPasswords ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            required
          />

          <label style={{ flexDirection: "row", gap: "8px", display: "flex", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={() => setShowPasswords(!showPasswords)}
              style={{ width: "auto" }}
            />
            Show passwords
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ChangePassword;