import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import apiClient from "../api/client";

import GaushalaMap from "../components/GaushalaMap";
import axios from "axios";

import "./AdminDashboard.css";
import "../components/GaushalaMap.css";

function AdminDashboard() {
  const [gaushalas, setGaushalas] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchPendingRequests();
    fetchAllData();
  }, [location.key]);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchGaushalas(), fetchDoctorCount(), fetchKosalaAdmins()]);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/gaushala-requests?status=pending");
      setPendingRequests(res.data);
      setPendingCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this Gaushala application?")) return;
    try {
      await axios.put(`http://localhost:5000/api/gaushala-requests/${id}/approve`);
      alert("Approved! Gaushala and admin created.");
      fetchPendingRequests();
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    try {
      await axios.put(`http://localhost:5000/api/gaushala-requests/${id}/reject`, { reason });
      alert("Request rejected.");
      fetchPendingRequests();
    } catch (err) {
      alert("Rejection failed");
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

        {/* ── TOP BAR: Title + Notification Bell ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 className="title" style={{ margin: 0 }}>Admin Panel</h2>
          <button
            onClick={() => setShowRequests(!showRequests)}
            style={{
              position: "relative",
              background: pendingCount > 0 ? "#7b4f2e" : "var(--bg-card)",
              border: "none", borderRadius: "12px", padding: "10px 18px",
              color: pendingCount > 0 ? "white" : "var(--text-primary)",
              cursor: "pointer", fontWeight: "600", fontSize: "14px",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            🔔 Gaushala Requests
            {pendingCount > 0 && (
              <span style={{
                background: "#dc2626", color: "white", borderRadius: "999px",
                fontSize: "11px", fontWeight: "700", padding: "2px 7px",
              }}>
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {/* ── PENDING REQUESTS PANEL ── */}
        {showRequests && (
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "16px", padding: "20px", marginBottom: "24px",
          }}>
            <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>
              🏛️ Pending Gaushala Applications ({pendingRequests.length})
            </h3>
            {pendingRequests.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>No pending applications.</p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Gaushala Name</th>
                      <th>Location</th>
                      <th>Pincode</th>
                      <th>Email</th>
                      <th>Admin Name</th>
                      <th>Applied On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((r, i) => (
                      <tr key={r._id}>
                        <td>{i + 1}</td>
                        <td><strong>{r.kosalaName}</strong></td>
                        <td>{r.location}</td>
                        <td>{r.pincode}</td>
                        <td>{r.email}</td>
                        <td>{r.adminName}</td>
                        <td>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                        <td>
                          <button
                            style={{ background: "#166534", color: "white", border: "none", borderRadius: "8px", padding: "6px 14px", marginRight: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                            onClick={() => handleApprove(r._id)}
                          >✅ Approve</button>
                          <button
                            style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                            onClick={() => handleReject(r._id)}
                          >❌ Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ACTION BUTTONS ── */}
        <div className="actions">
          <button className="btn green" onClick={() => navigate("/add-gaushala")}>+ Add Gaushala</button>
          <button className="btn orange" onClick={() => navigate("/add-doctor")}>+ Add Doctor</button>
          <button className="btn red" onClick={fetchAllData}>Refresh</button>
        </div>

        {/* ── STATS CARDS ── */}
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

        {/* ── 🗺️ INDIA MAP ── */}
        <GaushalaMap gaushalas={gaushalas} />

        {/* ── REGISTERED GAUSHALAS TABLE ── */}
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
                  (a) => String(a.kosalaId?._id || a.kosalaId) === String(g._id)
                );
                return (
                  <tr key={g._id}>
                    <td>{i + 1}</td>
                    <td>{g.name}</td>
                    <td>{g.admin?.name || admin?.name || "Not Assigned"}</td>
                    <td>{g.doctor?.name || "Not Assigned"}</td>
                    <td>{g.totalCows || 0}</td>
                    <td>
                      <button className="info-btn" onClick={() => navigate(`/gaushala-info/${g._id}`)}>Info</button>
                      <button className="open-btn" onClick={() => navigate(`/admin/kosala/${g._id}`)}>Open</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button className="logout" onClick={logout}>Logout</button>

      </div>{/* end .main */}
    </div>/* end .layout */
  );
}

export default AdminDashboard;
