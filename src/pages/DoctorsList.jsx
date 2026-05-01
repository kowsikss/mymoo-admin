import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchDoctors = async () => {
    try {
      const res = await apiClient.get("/api/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this doctor?")) {
      try {
        await apiClient.delete(`/api/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor:", err);
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="cancel-btn"
              onClick={() => navigate("/admin-dashboard")}
            >
              Back
            </button>
            <h2 style={{ margin: 0 }}>ALL DOCTORS</h2>
          </div>
          <button
            onClick={() => navigate("/add-doctor")}
            style={{ background: "var(--accent-green)", color: "#0f1410" }}
          >
            + Add Doctor
          </button>
        </div>

        {/* SUMMARY CARD */}
        <div className="card-container" style={{ marginBottom: "32px" }}>
          <div className="card blue">
            <h3>Total Doctors</h3>
            <p>{doctors.length}</p>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Specialization</th>
                  <th>Nearby Hospital</th>
                  <th>Hospital Pincode</th>
                  <th>Gaushala ID</th>
                  <th>Joined On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc, index) => (
                    <tr key={doc._id}>
                      <td>{index + 1}</td>
                      <td>{doc.name}</td>
                      <td>{doc.email}</td>
                      <td>{doc.mobile}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.nearbyHospital || "-"}</td>
                      <td>{doc.hospitalPincode || "-"}</td>
                      <td>{doc.kosalaId || "Not Assigned"}</td>
                      <td>
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/doctor-info/${doc._id}`)}
                          style={{ marginRight: "6px" }}
                        >
                          Info
                        </button>
                        <button onClick={() => handleDelete(doc._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorsList;