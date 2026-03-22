import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function AdminDashboard() {
  const [gaushalas, setGaushalas] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [loginForm, setLoginForm] = useState({
    name: "",
    email: "",
    password: "",
    kosalaId: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchGaushalas();
    fetchDoctorCount();
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchGaushalas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/kosala/full");
      setGaushalas(res.data);
    } catch (err) {
      console.error("Error fetching gaushalas:", err);
    }
  };

  const fetchDoctorCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctorCount(res.data.length);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDoctorLogin = async (e) => {
    e.preventDefault();

    console.log("Sending login:", loginForm);

    if (!loginForm.kosalaId) {
      alert("Please select a Gaushala");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/doctor-auth/login",
        loginForm
      );

      localStorage.setItem("role", "doctor");
      localStorage.setItem("doctorId", res.data._id);
      localStorage.setItem("kosalaId", res.data.kosalaId.toString());
      localStorage.setItem("doctorName", res.data.name);

      navigate("/doctor-dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      alert(err.response?.data?.message || "Invalid Doctor Credentials");
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Admin Panel</h2>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
          <button
            onClick={() => navigate("/add-gaushala")}
            style={{ background: "var(--accent-green)", color: "#0f1410" }}
          >
            + Add Gaushala
          </button>
          <button
            onClick={() => navigate("/add-doctor")}
            style={{ background: "var(--accent-amber)", color: "#0f1410" }}
          >
            + Add Doctor
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="card-container" style={{ marginBottom: "32px" }}>
          <div
            className="card blue clickable"
            onClick={() => navigate("/gaushalas-list")}
          >
            <h3>Total Gaushalas</h3>
            <p>{gaushalas.length}</p>
          </div>
          <div
            className="card green clickable"
            onClick={() => navigate("/doctors-list")}
          >
            <h3>Total Doctors</h3>
            <p>{doctorCount}</p>
          </div>
        </div>

        {/* GAUSHALA TABLE */}
        <h3 className="section-title">Registered Gaushalas</h3>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Gaushala Name</th>
                <th>Doctor Assigned</th>
                <th>Total Cows</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gaushalas.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No gaushalas found
                  </td>
                </tr>
              ) : (
                gaushalas.map((g, i) => (
                  <tr key={g._id}>
                    <td>{i + 1}</td>
                    <td>{g.name}</td>
                    <td>{g.doctor?.name || "Not Assigned"}</td>
                    <td>{g.totalCows || 0}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/gaushala-info/${g._id}`)}
                        style={{ marginRight: "6px" }}
                      >
                        Info
                      </button>
                      <button
                        onClick={() => navigate(`/admin/kosala/${g._id}`)}
                      >
                        Open Dashboard
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DOCTOR LOGIN SECTION */}
        <hr style={{ margin: "40px 0", borderColor: "var(--border)" }} />

        <h3>Doctor Login</h3>

        <form onSubmit={handleDoctorLogin} className="form-box">

          <label>Doctor Name</label>
          <input
            placeholder="Enter doctor name"
            value={loginForm.name}
            onChange={(e) =>
              setLoginForm({ ...loginForm, name: e.target.value })
            }
            required
          />

          <label>Email ID</label>
          <input
            type="email"
            placeholder="Enter email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            required
          />

          <label>Select Gaushala</label>
          <select
            value={loginForm.kosalaId}
            onChange={(e) =>
              setLoginForm({ ...loginForm, kosalaId: e.target.value })
            }
            required
          >
            <option value="">-- Select Gaushala --</option>
            {gaushalas.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>

          <button type="submit">Login as Doctor</button>

        </form>

        <br />
        <button className="cancel-btn" onClick={logout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default AdminDashboard;