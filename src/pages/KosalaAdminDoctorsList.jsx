import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function KosalaAdminDoctorsList() {
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  if (localStorage.getItem("role") !== "kosala-admin") {
    return <Navigate to="/kosala-admin-login" />;
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await apiClient.get("/api/doctors");
      // Filter only doctors belonging to this kosala
      const filtered = res.data.filter(
        (d) => d.kosalaId?.toString() === kosalaId?.toString()
      );
      setDoctors(filtered);
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
      <KosalaAdminSidebar />
      <div className="main">
        <Navbar />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0 }}>MANAGE DOCTORS</h2>
          <button
            onClick={() => navigate("/kosala-admin/add-doctor")}
            style={{ background: "var(--accent-green)", color: "#0f1410" }}
          >
            + Add Doctor
          </button>
        </div>

        {/* SUMMARY CARD */}
        <div className="card-container" style={{ marginBottom: "28px" }}>
          <div className="card blue">
            <h3>Total Doctors</h3>
            <p>{doctors.length}</p>
          </div>
        </div>

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
                  <th>Joined On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      No doctors added yet
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
                      <td>
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
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

export default KosalaAdminDoctorsList;