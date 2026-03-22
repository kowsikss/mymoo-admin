import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function GaushalaInfo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gaushala, setGaushala] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [totalCows, setTotalCows] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchData = async () => {
    try {
      const [gaushalaRes, cowsRes, doctorsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/kosala/${id}`),
        axios.get(`http://localhost:5000/api/cows/kosala/${id}`),
        axios.get("http://localhost:5000/api/doctors"),
      ]);

      setGaushala(gaushalaRes.data);
      setTotalCows(cowsRes.data.length);

      const assignedDoctor = doctorsRes.data.find(
        (d) => d.kosalaId?.toString() === id.toString()
      );
      setDoctor(assignedDoctor || null);
    } catch (err) {
      console.error("Error fetching gaushala info:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCertificate = () => {
    window.open(
      `http://localhost:5000/uploads/${gaushala.certificateFile}`,
      "_blank"
    );
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

  if (!gaushala) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Navbar />
          <p style={{ color: "var(--accent-red)" }}>Gaushala not found</p>
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
            onClick={() => navigate("/gaushalas-list")}
          >
            Back
          </button>
          <h2 style={{ margin: 0 }}>GAUSHALA DETAILS</h2>
        </div>

        {/* SUMMARY CARDS */}
        <div className="card-container" style={{ marginBottom: "32px" }}>
          <div className="card red">
            <h3>Total Animals</h3>
            <p>{totalCows}</p>
          </div>
          <div className="card green">
            <h3>Doctor Assigned</h3>
            <p style={{ fontSize: "20px" }}>
              {doctor ? doctor.name : "None"}
            </p>
          </div>
        </div>

        {/* GAUSHALA INFO */}
        <h3 className="section-title">Gaushala Information</h3>
        <div className="table-wrapper" style={{ marginBottom: "28px" }}>
          <table className="table">
            <tbody>
              <tr>
                <td
                  style={{
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    width: "220px",
                  }}
                >
                  Gaushala Name
                </td>
                <td>{gaushala.name}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                  }}
                >
                  Address
                </td>
                <td>{gaushala.address}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                  }}
                >
                  Pincode
                </td>
                <td>{gaushala.pincode}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                  }}
                >
                  Registration Number
                </td>
                <td>{gaushala.registrationNumber}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                  }}
                >
                  Contact Number
                </td>
                <td>{gaushala.contactNumber}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                  }}
                >
                  Email
                </td>
                <td>{gaushala.email}</td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                  }}
                >
                  Certificate
                </td>
                <td>
                  {gaushala.certificateFile ? (
                    <button
                      onClick={openCertificate}
                      style={{
                        background: "transparent",
                        color: "var(--accent-green)",
                        border: "1px solid var(--accent-green)",
                        padding: "4px 12px",
                        fontSize: "13px",
                      }}
                    >
                      View Certificate
                    </button>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                  }}
                >
                  Registered On
                </td>
                <td>
                  {gaushala.createdAt
                    ? new Date(gaushala.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DOCTOR INFO */}
        {doctor && (
          <>
            <h3 className="section-title">Assigned Doctor</h3>
            <div className="table-wrapper" style={{ marginBottom: "28px" }}>
              <table className="table">
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                        width: "220px",
                      }}
                    >
                      Name
                    </td>
                    <td>{doctor.name}</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Email
                    </td>
                    <td>{doctor.email}</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Mobile
                    </td>
                    <td>{doctor.mobile}</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Specialization
                    </td>
                    <td>{doctor.specialization}</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Nearby Hospital
                    </td>
                    <td>{doctor.nearbyHospital}</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Hospital Pincode
                    </td>
                    <td>{doctor.hospitalPincode}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => navigate(`/doctor-info/${doctor._id}`)}
              style={{ marginBottom: "16px" }}
            >
              View Full Doctor Profile
            </button>
          </>
        )}

        {/* OPEN COW DASHBOARD */}
        <div>
          <button
            onClick={() => navigate(`/admin/kosala/${id}`)}
            style={{ background: "var(--accent-amber)", color: "#0f1410" }}
          >
            Open Cow Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default GaushalaInfo;