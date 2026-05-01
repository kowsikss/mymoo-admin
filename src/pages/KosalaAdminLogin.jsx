import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

function KosalaAdminLogin() {
  const [form, setForm] = useState({ name: "", password: "", kosalaId: "" });
  const [gaushalas, setGaushalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGaushalas();
  }, []);

  const fetchGaushalas = async () => {
    try {
      const res = await apiClient.get("/api/kosala");
      setGaushalas(res.data);
    } catch (err) {
      console.error("Error fetching gaushalas:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.kosalaId) { alert("Please select a Gaushala"); return; }

    try {
      setLoading(true);
      const res = await apiClient.post(
        "/api/kosala-admin/login",
        form
      );
      localStorage.setItem("role",          "kosala-admin");
      localStorage.setItem("kosalaAdminId", res.data._id);
      localStorage.setItem("kosalaAdminName", res.data.name);
      localStorage.setItem("kosalaId",      res.data.kosalaId);
      navigate("/kosala-admin-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Kosala Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Admin Name</label>
          <input name="name" value={form.name}
            onChange={handleChange} placeholder="Enter admin name" required />

          <label>Password</label>
          <input type="password" name="password" value={form.password}
            onChange={handleChange} placeholder="Enter password" required />

          <label>Select Gaushala</label>
          <select name="kosalaId" value={form.kosalaId} onChange={handleChange} required>
            <option value="">-- Select Gaushala --</option>
            {gaushalas.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "10px", cursor: "pointer", color: "#3498db", fontSize: "13px" }}
          onClick={() => navigate("/")}>
          Back to Super Admin Login
        </p>
      </div>
    </div>
  );
}

export default KosalaAdminLogin;