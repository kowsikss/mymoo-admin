import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function GaushalasList() {
  const [gaushalas, setGaushalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGaushalas();
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchGaushalas = async () => {
    try {
      const res = await apiClient.get("/api/kosala/full");
      setGaushalas(res.data);
    } catch (err) {
      console.error("Error fetching gaushalas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2>ALL GAUSHALAS</h2>
          <button
            onClick={() => navigate("/add-gaushala")}
            style={{ background: "var(--accent-green)", color: "#0f1410" }}
          >
            + Add Gaushala
          </button>
        </div>

        <div className="card-container" style={{ marginBottom: "32px" }}>
          <div className="card blue">
            <h3>Total Gaushalas 🏛️</h3>
            <p>{gaushalas.length}</p>
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
                  <th>Address</th>
                  <th>Pincode</th>
                  <th>Reg. Number</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Doctor Assigned</th>
                  <th>Total Cows</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gaushalas.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No gaushalas found
                    </td>
                  </tr>
                ) : (
                  gaushalas.map((g, i) => (
                    <tr key={g._id}>
                      <td>{i + 1}</td>
                      <td>{g.name}</td>
                      <td>{g.address}</td>
                      <td>{g.pincode}</td>
                      <td>{g.registrationNumber}</td>
                      <td>{g.contactNumber}</td>
                      <td>{g.email}</td>
                      <td>{g.doctor?.name || "Not Assigned"}</td>
                      <td>{g.totalCows || 0}</td>
                      <td>
                        <button onClick={() => navigate(`/gaushala-info/${g._id}`)}>
                          👁️
                        </button>
                        <button onClick={() => navigate(`/admin/kosala/${g._id}`)}>
                          🐄
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

export default GaushalasList;