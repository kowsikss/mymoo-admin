import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function AddGaushala() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [gaushalaForm, setGaushalaForm] = useState({
    name: "",
    address: "",
    pincode: "",
    registrationNumber: "",
    contactNumber: "",
    email: "",
  });

  const [adminForm, setAdminForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const handleGaushalaChange = (e) => {
    setGaushalaForm({ ...gaushalaForm, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (adminForm.password !== adminForm.confirmPassword) {
      setError("Admin passwords do not match");
      return;
    }
    if (adminForm.password.length < 6) {
      setError("Admin password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Gaushala
      const formData = new FormData();
      Object.keys(gaushalaForm).forEach((key) =>
        formData.append(key, gaushalaForm[key])
      );
      if (certificate) formData.append("certificate", certificate);

      const gaushalaRes = await apiClient.post(
        "/api/kosala",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const kosalaId = gaushalaRes.data._id;

      // Step 2: Create Kosala Admin
      await apiClient.post("/api/kosala-admin", {
        name:     adminForm.name,
        password: adminForm.password,
        kosalaId: kosalaId.toString(),
      });

      alert("Gaushala and Admin created successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error creating gaushala");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2>Add Gaushala</h2>

        <form className="form-box" onSubmit={handleSubmit}>

          {/* GAUSHALA DETAILS */}
          <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
            Gaushala Details
          </h3>

          <label>Gaushala Name <span style={{ color: "red" }}>*</span></label>
          <input name="name" value={gaushalaForm.name}
            onChange={handleGaushalaChange} placeholder="Enter gaushala name" required />

          <label>Address <span style={{ color: "red" }}>*</span></label>
          <textarea name="address" value={gaushalaForm.address}
            onChange={handleGaushalaChange} placeholder="Enter address" required />

          <label>Pincode <span style={{ color: "red" }}>*</span></label>
          <input type="number" name="pincode" value={gaushalaForm.pincode}
            onChange={handleGaushalaChange} placeholder="Enter pincode" required />

          <label>Registration Number <span style={{ color: "red" }}>*</span></label>
          <input name="registrationNumber" value={gaushalaForm.registrationNumber}
            onChange={handleGaushalaChange} placeholder="Enter registration number" required />

          <label>Contact Number <span style={{ color: "red" }}>*</span></label>
          <input name="contactNumber" value={gaushalaForm.contactNumber}
            onChange={handleGaushalaChange} placeholder="Enter contact number" required />

          <label>Email <span style={{ color: "red" }}>*</span></label>
          <input type="email" name="email" value={gaushalaForm.email}
            onChange={handleGaushalaChange} placeholder="Enter email" required />

          <label>Certificate (optional)</label>
          <input type="file" accept="image/*,.pdf"
            onChange={(e) => setCertificate(e.target.files[0])} />

          {/* KOSALA ADMIN DETAILS */}
          <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
            Kosala Admin Details
          </h3>

          <label>Admin Name <span style={{ color: "red" }}>*</span></label>
          <input name="name" value={adminForm.name}
            onChange={handleAdminChange} placeholder="Enter admin name" required />

          <label>Admin Password <span style={{ color: "red" }}>*</span></label>
          <input type="password" name="password" value={adminForm.password}
            onChange={handleAdminChange} placeholder="Enter password (min 6 chars)" required />

          <label>Confirm Password <span style={{ color: "red" }}>*</span></label>
          <input type="password" name="confirmPassword" value={adminForm.confirmPassword}
            onChange={handleAdminChange} placeholder="Confirm password" required />

          {adminForm.confirmPassword && (
            <p style={{
              fontSize: "12px",
              color: adminForm.password === adminForm.confirmPassword
                ? "var(--accent-green)" : "var(--accent-red)",
            }}>
              {adminForm.password === adminForm.confirmPassword
                ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          {error && (
            <p style={{ color: "var(--accent-red)", fontSize: "13px" }}>{error}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Gaushala + Admin"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddGaushala;