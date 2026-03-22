import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function DoctorInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);
      setDoctor(res.data);
    } catch (err) {
      console.error("Error fetching doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Navbar />
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Navbar />
          <p style={{ color: "var(--accent-red)" }}>Doctor not found</p>
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <button
            className="cancel-btn"
            onClick={() => navigate("/doctors-list")}
          >
            Back
          </button>
          <h2 style={{ margin: 0 }}>DOCTOR DETAILS</h2>
        </div>

        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>

          {/* PHOTO CARD */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-accent)",
              borderRadius: "var(--radius-xl)",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              minWidth: "220px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {doctor.photo ? (
              <img
                src={`http://localhost:5000/uploads/${doctor.photo}`}
                alt="doctor"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid var(--accent-green)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: "var(--bg-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}
              >
                DR
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                }}
              >
                {doctor.name}
              </p>
              <p style={{ fontSize: "13px", color: "var(--accent-green)" }}>
                {doctor.specialization}
              </p>
            </div>
          </div>

          {/* INFO TABLE */}
          <div
            style={{
              flex: 1,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              minWidth: "300px",
            }}
          >
            <table className="table" style={{ margin: 0 }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      fontWeight: "600",
                      color: "var(--text-secondary)",
                      width: "200px",
                    }}
                  >
                    Full Name
                  </td>
                  <td>{doctor.name || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>
                    Email
                  </td>
                  <td>{doctor.email || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>
                    Mobile
                  </td>
                  <td>{doctor.mobile || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>
                    Specialization
                  </td>
                  <td>{doctor.specialization || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>
                    Nearby Hospital
                  </td>
                  <td>{doctor.nearbyHospital || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>
                    Hospital Pincode
                  </td>
                  <td>{doctor.hospitalPincode || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>
                    Gaushala Assigned
                  </td>
                  <td style={{ color: "var(--accent-green)", fontWeight: "600" }}>
                    {doctor.kosalaId || "Not Assigned"}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>
                    Joined On
                  </td>
                  <td>
                    {doctor.createdAt
                      ? new Date(doctor.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorInfo;