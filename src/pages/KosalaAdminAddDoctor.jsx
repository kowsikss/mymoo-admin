import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function KosalaAdminAddDoctor() {
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    specialization: "",
    nearbyHospital: "",
    hospitalPincode: "",
  });
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("role") !== "kosala-admin") {
    return <Navigate to="/kosala-admin-login" />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await apiClient.post("/api/doctors", {
        ...form,
        kosalaId, // ✅ automatically assign to this kosala
      });
      alert("Doctor Added Successfully!");
      navigate("/kosala-admin/doctors-list");
    } catch (err) {
      console.error("Error adding doctor:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <KosalaAdminSidebar />
      <div className="main">
        <Navbar />

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button className="cancel-btn" onClick={() => navigate("/kosala-admin/doctors-list")}>
            Back
          </button>
          <h2 style={{ margin: 0 }}>ADD DOCTOR</h2>
        </div>

        <form className="form-box" onSubmit={handleSubmit}>

          <label>Doctor Name <span style={{ color: "red" }}>*</span></label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter doctor name"
            required
          />

          <label>Email ID <span style={{ color: "red" }}>*</span></label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />

          <label>Mobile Number <span style={{ color: "red" }}>*</span></label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
            maxLength={10}
            required
          />

          <label>Password <span style={{ color: "red" }}>*</span></label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          <label>Area of Specialization <span style={{ color: "red" }}>*</span></label>
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="Enter specialization"
            required
          />

          <label>Nearby Veterinary Hospital <span style={{ color: "red" }}>*</span></label>
          <input
            name="nearbyHospital"
            value={form.nearbyHospital}
            onChange={handleChange}
            placeholder="Enter nearby hospital name"
            required
          />

          <label>Hospital Pincode <span style={{ color: "red" }}>*</span></label>
          <input
            type="number"
            name="hospitalPincode"
            value={form.hospitalPincode}
            onChange={handleChange}
            placeholder="Enter hospital pincode"
            required
          />

          {/* Show which kosala this doctor is being added to */}
          <div style={{
            background: "rgba(168,213,90,0.08)",
            border: "1px solid rgba(168,213,90,0.2)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            fontSize: "13px",
            color: "var(--accent-green)",
          }}>
            This doctor will be assigned to your Gaushala (ID: {kosalaId})
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Doctor"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default KosalaAdminAddDoctor;