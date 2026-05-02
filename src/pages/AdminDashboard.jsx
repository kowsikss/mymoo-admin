import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import GaushalaMap from "../components/GaushalaMap";

import "./AdminDashboard.css";
import "../components/GaushalaMap.css";
import "./AdminDashboard-Modal.css";

function AdminDashboard() {
  const [gaushalas, setGaushalas] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedGaushala, setSelectedGaushala] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

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

    setSelectedGaushala({
      ...gaushala,
      adminName: gaushala.admin?.name || admin?.name || "Not Assigned"
    });
    setShowInfoModal(true);
  };

  const handleOpen = (gaushalaId) => {
    // Option 1: Navigate to gaushala-admin page if that route exists
    navigate(`/gaushala-admin/${gaushalaId}`);
    
    // Option 2: If you want to open in a new tab or show details, uncomment below:
    // const gaushala = gaushalas.find(g => g._id === gaushalaId);
    // handleInfo(gaushala);
  };

  const closeModal = () => {
    setShowInfoModal(false);
    setSelectedGaushala(null);
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
                      >
                        Info
                      </button>
                      <button 
                        className="btn-open"
                        onClick={() => handleOpen(g._id)}
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

        {/* =======================
            INFO MODAL
        ======================= */}
        {showInfoModal && selectedGaushala && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Gaushala Information</h3>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="info-row">
                  <strong>Name:</strong>
                  <span>{selectedGaushala.name}</span>
                </div>
                
                <div className="info-row">
                  <strong>Admin:</strong>
                  <span>{selectedGaushala.adminName}</span>
                </div>
                
                <div className="info-row">
                  <strong>Doctor:</strong>
                  <span>{selectedGaushala.doctor?.name || "Not Assigned"}</span>
                </div>
                
                <div className="info-row">
                  <strong>Total Cows:</strong>
                  <span>{selectedGaushala.totalCows || 0}</span>
                </div>
                
                <div className="info-row">
                  <strong>Location:</strong>
                  <span>{selectedGaushala.location || "N/A"}</span>
                </div>
                
                <div className="info-row">
                  <strong>Contact:</strong>
                  <span>{selectedGaushala.contact || selectedGaushala.admin?.contact || "N/A"}</span>
                </div>
                
                <div className="info-row">
                  <strong>Address:</strong>
                  <span>{selectedGaushala.address || "N/A"}</span>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn-close" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;