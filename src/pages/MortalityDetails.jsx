import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from "recharts";

const COLORS = ["#e86b5a","#e8a84c","#a8d55a","#5bbfaa","#5a9de8","#b87fe8"];

function MortalityDetails() {
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");

  const [dead,    setDead]    = useState([]);
  const [breeds,  setBreeds]  = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cowsRes, cattleRes, breedsRes] = await Promise.all([
        apiClient.get(`/api/cows/kosala/${kosalaId}`),
        apiClient.get(`/api/cattle/kosala/${kosalaId}`), // ✅ cattle info
        apiClient.get("/api/breeds"),
      ]);

      const breedMap = {};
      breedsRes.data.forEach((b) => { breedMap[b._id] = b.name; });
      setBreeds(breedMap);

      // ✅ 1. Deceased cows (marked in ManageCow)
      const deceasedCows = cowsRes.data
        .filter((c) => c.healthStatus === "Deceased")
        .map((c) => ({
          _id:          c._id,
          tagNumber:    c.tagNumber   || "—",
          cowId:        c.cowId       || "—",
          type:         c.type        || "—",
          breed:        c.breed,
          dateOfDeath:  c.dateOfDeath || null,
          causeOfDeath: c.causeOfDeath|| "—",
          source:       "Cow Record",
        }));

      // ✅ 2. Dead calves from AddCattleInfo (calfStatus === "Dead")
      const cowMap = {};
      cowsRes.data.forEach((c) => { cowMap[c.cowId] = c; });

      const deadCalves = cattleRes.data
        .filter((c) => c.calfStatus === "Dead")
        .map((c) => {
          const parentCow = cowMap[c.cowId] || {};
          return {
            _id:          c._id,
            tagNumber:    c.tagNumber || parentCow.tagNumber || "—",
            cowId:        c.cowId     || "—",
            type:         "Calf",
            breed:        parentCow.breed || null,
            dateOfDeath:  c.parturitionDate || null,
            causeOfDeath: "Dead at birth",
            source:       "Cattle Info",
          };
        });

      // ✅ Combine both
      setDead([...deceasedCows, ...deadCalves]);

    } catch (err) {
      console.error("Error fetching mortality data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Year-wise deaths ──────────────────────────────────────────
  const yearWise = dead.reduce((acc, c) => {
    const year = c.dateOfDeath
      ? new Date(c.dateOfDeath).getFullYear()
      : "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});
  const yearData = Object.entries(yearWise).map(([year, count]) => ({ year: String(year), count }));

  // ── Breed-wise deaths ─────────────────────────────────────────
  const breedWise = dead.reduce((acc, c) => {
    const breed = breeds[c.breed] || breeds[String(c.breed)] || "Unknown";
    acc[breed] = (acc[breed] || 0) + 1;
    return acc;
  }, {});
  const breedData = Object.entries(breedWise).map(([breed, count]) => ({ breed, count }));

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button className="cancel-btn" onClick={() => navigate("/doctor-dashboard")}>← Back</button>
          <h2 style={{ margin: 0 }}>💀 Mortality Details</h2>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            {/* SUMMARY CARDS */}
            <div className="card-container" style={{ marginBottom: "32px" }}>
              <div className="card red">
                <h3>Total Deaths</h3>
                <p>{dead.length}</p>
              </div>
              <div className="card orange">
                <h3>Deceased Cows</h3>
                <p>{dead.filter((c) => c.type === "cow").length}</p>
              </div>
              <div className="card blue">
                <h3>Deceased Bulls</h3>
                <p>{dead.filter((c) => c.type === "bull").length}</p>
              </div>
              <div className="card dark">
                <h3>Dead Calves</h3>
                <p>{dead.filter((c) => c.source === "Cattle Info").length}</p>
              </div>
            </div>

            {/* CHARTS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>

              {/* Year-wise */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                <p style={{ fontWeight: 600, marginBottom: "14px" }}>📅 Year-wise Deaths</p>
                {yearData.length === 0
                  ? <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>
                  : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={yearData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                        <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#e86b5a" radius={[4,4,0,0]} name="Deaths" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
              </div>

              {/* Breed-wise */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
                <p style={{ fontWeight: 600, marginBottom: "14px" }}>🐄 Breed-wise Deaths</p>
                {breedData.length === 0
                  ? <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>
                  : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={breedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                        <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[4,4,0,0]} name="Deaths">
                          {breedData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
              </div>

            </div>

            {/* DETAIL TABLE */}
            <h3 style={{ marginBottom: "16px" }}>All Deceased Animals</h3>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>RFID Tag No</th>
                    <th>Cow ID</th>
                    <th>Type</th>
                    <th>Breed</th>
                    <th>Date of Death</th>
                    <th>Cause of Death</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {dead.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>No deceased animals</td>
                    </tr>
                  ) : (
                    dead.map((c, i) => (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td>{c.tagNumber}</td>
                        <td>{c.cowId}</td>
                        <td style={{ textTransform: "capitalize" }}>{c.type}</td>
                        <td>{breeds[c.breed] || breeds[String(c.breed)] || "Unknown"}</td>
                        <td>
                          {c.dateOfDeath
                            ? new Date(c.dateOfDeath).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                        <td>{c.causeOfDeath || "—"}</td>
                        <td>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: "999px",
                            background: c.source === "Cattle Info"
                              ? "rgba(91,191,170,0.15)"
                              : "rgba(232,107,90,0.15)",
                            color: c.source === "Cattle Info"
                              ? "var(--accent-teal)"
                              : "var(--accent-red)",
                          }}>
                            {c.source}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MortalityDetails;
