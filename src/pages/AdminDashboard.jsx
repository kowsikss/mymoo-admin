import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [gaushalas, setGaushalas] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAllData();
  }, [location.key]);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchGaushalas(),
        fetchDoctorCount(),
        fetchKosalaAdmins(),
      ]);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchGaushalas = async () => {
    const res = await apiClient.get("/api/kosala/full");
    setGaushalas(res.data);
  };

  const fetchDoctorCount = async () => {
    const res = await apiClient.get("/api/doctors");
    setDoctorCount(res.data.length);
  };

  const fetchKosalaAdmins = async () => {
    try {
      const res = await apiClient.get("/api/kosala-admins");

      let adminsData = [];
      if (Array.isArray(res.data)) adminsData = res.data;
      else if (res.data.admins) adminsData = res.data.admins;
      else if (res.data.data) adminsData = res.data.data;

      setAdmins(adminsData);
    } catch {
      setAdmins([]);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading && gaushalas.length === 0) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Navbar />
          <h3 className="loading">Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2 className="title">Admin Panel</h2>

        {error && <p className="error">{error}</p>}

        {/* ACTION BUTTONS */}
        <div className="actions">
          <button className="btn green" onClick={() => navigate("/add-gaushala")}>
            + Add Gaushala
          </button>
          <button className="btn orange" onClick={() => navigate("/add-doctor")}>
            + Add Doctor
          </button>
          <button className="btn red" onClick={fetchAllData}>
            Refresh
          </button>
        </div>

        {/* CLICKABLE STATS */}
        <div className="stats">
          <div className="mini-card" onClick={() => navigate("/gaushalas-list")}>
            <h4>Gaushalas</h4>
            <p>{gaushalas.length}</p>
          </div>

          <div className="mini-card" onClick={() => navigate("/doctors-list")}>
            <h4>Doctors</h4>
            <p>{doctorCount}</p>
          </div>
        </div>

        {/* TABLE */}
        <h3 className="section-title">Registered Gaushalas</h3>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Admin</th>
                <th>Doctor</th>
                <th>Cows</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {gaushalas.map((g, i) => {
                const admin = admins.find(
                  (a) =>
                    String(a.kosalaId?._id || a.kosalaId) === String(g._id)
                );

                return (
                  <tr key={g._id}>
                    <td>{i + 1}</td>
                    <td>{g.name}</td>

                    <td>
                      {g.admin?.name || admin?.name || "Not Assigned"}
                    </td>

                    <td>{g.doctor?.name || "Not Assigned"}</td>
                    <td>{g.totalCows || 0}</td>

                    <td>
                      <button
                        className="info-btn"
                        onClick={() => navigate(`/gaushala-info/${g._id}`)}
                      >
                        Info
                      </button>

                      <button
                        className="open-btn"
                        onClick={() => navigate(`/admin/kosala/${g._id}`)}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;