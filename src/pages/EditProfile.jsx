import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import Sidebar from "../components/Sidebar";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";

function EditProfile() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // ✅ Get the correct ID from localStorage based on role
  const id = role === "doctor"
    ? localStorage.getItem("doctorId")
    : localStorage.getItem("kosalaAdminId");

  const [form, setForm]     = useState({ name: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get("/api/profile", {
        params: { role, id }, // ✅ pass role + id as query params
      });
      setForm({
        name:   res.data.name   || "",
        email:  res.data.email  || "",
        mobile: res.data.mobile || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert("Name and Email are required");
      return;
    }

    try {
      setLoading(true);
      await apiClient.put("/api/profile", {
        role,
        id,
        ...form, // name, email, mobile
      });

      // ✅ Update localStorage so Navbar reflects new name instantly
      if (role === "doctor")       localStorage.setItem("doctorName", form.name);
      if (role === "kosala-admin") localStorage.setItem("kosalaAdminName", form.name);

      alert("Profile updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="layout">
      {role === "kosala-admin" ? <KosalaAdminSidebar /> : <Sidebar />}
      <div className="main"><Navbar /><p>Loading...</p></div>
    </div>
  );

  return (
    <div className="layout">
      {role === "kosala-admin" ? <KosalaAdminSidebar /> : <Sidebar />}
      <div className="main">
        <Navbar />
        <h2>My Profile</h2>
        <form className="form-box" onSubmit={handleSubmit}>

          <label>Full Name <span style={{ color: "red" }}>*</span></label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Email <span style={{ color: "red" }}>*</span></label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Mobile Number</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
            maxLength={10}
          />

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProfile;