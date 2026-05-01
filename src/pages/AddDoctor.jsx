import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function AddDoctor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",       // ✅ FIXED: was "phone", backend expects "mobile"
    password: "",
    specialization: "",
    nearbyHospital: "",
    hospitalPincode: "",
    kosalaId: "",
  });

  const [gaushalas, setGaushalas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGaushalas();
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

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

    if (!form.kosalaId) {
      alert("Please select a Gaushala");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/api/doctors", form);
      alert("Doctor Added Successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Add Doctor</h2>

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
            name="email"
            type="email"
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
            name="password"
            type="password"
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
            name="hospitalPincode"
            type="number"
            value={form.hospitalPincode}
            onChange={handleChange}
            placeholder="Enter hospital pincode"
            required
          />

          <label>Assign Gaushala <span style={{ color: "red" }}>*</span></label>
          <select
            name="kosalaId"
            value={form.kosalaId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Gaushala --</option>
            {gaushalas.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddDoctor;