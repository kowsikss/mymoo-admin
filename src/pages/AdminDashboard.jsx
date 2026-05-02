import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import GaushalaMap from "../components/GaushalaMap";

import "./AdminDashboard.css";
import "../components/GaushalaMap.css";

function AdminDashboard() {
  const [gaushalas, setGaushalas] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAllData();
    fetchPendingRequests();
  }, [location.key]);

  // 🔒 Protect route
  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  /* ==============================
     FETCH PENDING REQUESTS
  ============================== */
  const fetchPendingRequests = async () => {
    try {
      const res = await apiClient.get("/api/gaushala-requests?status=pending");
      setPendingRequests(res.data);
      setPendingCount(res.data.length);
    } catch (err) {
      console.error("Pending request error:", err);
    }
  };

  /* ==============================
     APPROVE / REJECT
  ============================== */
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this Gaushala application?")) return;

    try {
      await apiClient.put(`/api/gaushala-requests/${id}/approve`);
      alert("Approved successfully!");
      fetchPendingRequests();
      fetchAllData();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection:");
    try {
      await apiClient.put(`/api/gaushala-requests/${id}/reject`, { reason });
      alert("Rejected");
      fetchPendingRequests();
    } catch {
      alert("Rejection failed");
    }
  };

  /* ==============================
     FETCH DASHBOARD DATA
  ============================== */
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [gaushalaRes, doctorRes, adminRes] = await Promise.all([
        apiClient.get("/api/kosala/full"),
        apiClient.get("/api/doctors"),
        apiClient.get("/api/kosala-admin"), // ✅ FIXED ROUTE
      ]);

      setGaushalas(gaushalaRes.data);
      setDoctorCount(doctorRes.data.length);

      const data = adminRes.data;
      setAdmins(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     LOGOUT
  ============================== */
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ==============================
     ACTION HANDLERS
  ============================== */
  const handleInfo = (gaushala) => {
    const admin = admins.find(
      (a) => String(a.kosalaId?._id || a.kosalaId) === String(gaushala._id)
    );

    alert(`
Gaushala Information:
━━━━━━━━━━━━━━━━━━━━
Name: ${gaushala.name}
Admin: ${gaushala.admin?.name || admin?.name || "Not Assigned"}
Doctor: ${gaushala.doctor?.name || "Not Assigned"}
Total Cows: ${gaushala.totalCows || 0}
Location: ${gaushala.location || "N/A"}
Contact: ${gaushala.contact || "N/A"}
    `);
  };

  const handleOpen = (gaushalaId) => {
    navigate(`/gaushala/${gaushalaId}`);
  };

  /* ==============================
     LOADING SCREEN
  ============================== */
  if (loading && gaushalas.length === 0) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Navbar />
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 className="title">Admin Panel</h2>

          <button onClick={() => setShowRequests(!showRequests)}>
            🔔 Requests ({pendingCount})
          </button>
        </div>

        {/* =======================
            PENDING REQUESTS
        ======================= */}
        {showRequests && (
          <div className="table-wrapper">
            <h3>Pending Requests</h3>

            {pendingRequests.length === 0 ? (
              <p>No pending requests</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((r) => (
                    <tr key={r._id}>
                      <td>{r.kosalaName}</td>
                      <td>{r.location}</td>
                      <td>
                        <button onClick={() => handleApprove(r._id)}>Approve</button>
                        <button onClick={() => handleReject(r._id)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* =======================
            ACTION BUTTONS
        ======================= */}
        <div className="actions">
          <button onClick={() => navigate("/add-gaushala")}>+ Add Gaushala</button>
          <button onClick={() => navigate("/add-doctor")}>+ Add Doctor</button>
          <button onClick={fetchAllData}>Refresh</button>
        </div>

        {/* =======================
            STATS
        ======================= */}
        <div className="stats">
          <div className="mini-card">
            <h4>Gaushalas</h4>
            <p>{gaushalas.length}</p>
          </div>

          <div className="mini-card">
            <h4>Doctors</h4>
            <p>{doctorCount}</p>
          </div>
        </div>

        {/* =======================
            MAP
        ======================= */}
        <GaushalaMap gaushalas={gaushalas} />

        {/* =======================
            TABLE
        ======================= */}
        <h3>Registered Gaushalas</h3>

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
              {gaushalas.map((g, index) => {
                const admin = admins.find(
                  (a) => String(a.kosalaId?._id || a.kosalaId) === String(g._id)
                );

                return (
                  <tr key={g._id}>
                    <td>{index + 1}</td>
                    <td>{g.name}</td>
                    <td>{g.admin?.name || admin?.name || "Not Assigned"}</td>
                    <td>{g.doctor?.name || "Not Assigned"}</td>
                    <td>{g.totalCows || 0}</td>
                    <td>
                      <button 
                        className="btn-info"
                        onClick={() => handleInfo(g)}
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          padding: "5px 15px",
                          border: "none",
                          borderRadius: "4px",
                          marginRight: "5px",
                          cursor: "pointer"
                        }}
                      >
                        Info
                      </button>
                      <button 
                        className="btn-open"
                        onClick={() => handleOpen(g._id)}
                        style={{
                          backgroundColor: "#ff9800",
                          color: "white",
                          padding: "5px 15px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
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