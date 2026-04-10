import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function BullCalfDetails() {
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");
  const [bulls,   setBulls]   = useState([]);
  const [breeds,  setBreeds]  = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [cowsRes, breedsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
        axios.get("http://localhost:5000/api/breeds"),
      ]);
      const breedMap = {};
      breedsRes.data.forEach((b) => { breedMap[b._id] = b.name; });
      setBreeds(breedMap);
      setBulls(cowsRes.data.filter((c) => c.calfStatus === "Bull Calf"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button className="cancel-btn" onClick={() => navigate("/doctor-dashboard")}>← Back</button>
          <h2 style={{ margin: 0 }}>🐂 Bull Calf Details</h2>
        </div>

        <div className="card-container" style={{ marginBottom: "32px" }}>
          <div className="card orange">
            <h3>Total Bull Calves</h3>
            <p>{bulls.length}</p>
          </div>
          <div className="card green">
            <h3>Healthy</h3>
            <p>{bulls.filter((c) => c.healthStatus === "Healthy").length}</p>
          </div>
          <div className="card red">
            <h3>Under Treatment</h3>
            <p>{bulls.filter((c) => c.healthStatus === "Under Treatment").length}</p>
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>RFID Tag No</th>
                  <th>Cow ID</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Weight (kg)</th>
                  <th>Health Status</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {bulls.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: "center" }}>No bull calves found</td></tr>
                ) : (
                  bulls.map((c, i) => (
                    <tr key={c._id}>
                      <td>{i + 1}</td>
                      <td>{c.tagNumber || "—"}</td>
                      <td>{c.cowId}</td>
                      <td>{breeds[c.breed] || breeds[String(c.breed)] || "Unknown"}</td>
                      <td>{c.age} {c.ageUnit}</td>
                      <td>{c.weight}</td>
                      <td>
                        <span style={{
                          color: c.healthStatus === "Healthy" ? "var(--accent-green)"
                               : c.healthStatus === "Deceased" ? "var(--accent-red)"
                               : "var(--accent-amber)",
                          fontWeight: 600, fontSize: "13px",
                        }}>
                          {c.healthStatus || "—"}
                        </span>
                      </td>
                      <td>{c.registrationDate ? new Date(c.registrationDate).toLocaleDateString("en-IN") : "—"}</td>
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

export default BullCalfDetails;