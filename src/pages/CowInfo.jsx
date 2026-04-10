import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function CowInfo() {
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");
  const [cows, setCows] = useState([]);
  const [selectedCow, setSelectedCow] = useState(null);
  const [records, setRecords] = useState({
    deworming: [], vaccination: [], immunization: [],
    reproduction: [], cattle: [],
  });
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("role") !== "kosala-admin") {
    return <Navigate to="/kosala-admin-login" />;
  }

  useEffect(() => {
    fetchCows();
  }, []);

  const fetchCows = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/cows/kosala/${kosalaId}`
      );
      setCows(res.data);
    } catch (err) {
      console.error("Error fetching cows:", err);
    }
  };

  const handleCowClick = async (cow) => {
    setSelectedCow(cow);
    setLoading(true);
    try {
      const [dew, vac, imm, repro, cattle] = await Promise.all([
        axios.get("http://localhost:5000/api/deworming"),
        axios.get("http://localhost:5000/api/vaccination"),
        axios.get("http://localhost:5000/api/immunization"),
        axios.get("http://localhost:5000/api/reproduction"),
        axios.get("http://localhost:5000/api/cattle"),
      ]);

      setRecords({
        deworming:    dew.data.filter((r) => r.cowId === cow.cowId),
        vaccination:  vac.data.filter((r) => r.cowId === cow.cowId),
        immunization: imm.data.filter((r) => r.cowId === cow.cowId),
        reproduction: repro.data.filter((r) => r.cowId === cow.cowId),
        cattle:       cattle.data.filter((r) => r.cowId === cow.cowId),
      });
    } catch (err) {
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  };

  const tableStyle = { marginBottom: "24px" };
  const thStyle = { background: "var(--bg-surface)", padding: "10px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" };
  const tdStyle = { padding: "10px", borderBottom: "1px solid var(--border)", fontSize: "13px", color: "var(--text-primary)" };

  return (
    <div className="layout">
      <KosalaAdminSidebar />
      <div className="main">
        <Navbar />
        <h2>COW INFORMATION</h2>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

          {/* COW LIST */}
          <div style={{ minWidth: "280px" }}>
            <h3 className="section-title">Select a Cow</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {cows.map((cow) => (
                <div
                  key={cow._id}
                  onClick={() => handleCowClick(cow)}
                  style={{
                    background: selectedCow?._id === cow._id
                      ? "rgba(168,213,90,0.12)" : "var(--bg-card)",
                    border: selectedCow?._id === cow._id
                      ? "1px solid var(--accent-green)" : "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 18px",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600, color: "var(--text-primary)" }}>
                    {cow.cowId}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                    {cow.type} — {cow.age} yrs
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* COW RECORDS */}
          {selectedCow && (
            <div style={{ flex: 1 }}>
              <h3 className="section-title">
                Records for {selectedCow.cowId}
              </h3>

              {loading ? (
                <p style={{ color: "var(--text-secondary)" }}>Loading records...</p>
              ) : (
                <>
                  {/* DEWORMING */}
                  <h4 style={{ color: "var(--accent-amber)", marginBottom: "8px" }}>Deworming</h4>
                  {records.deworming.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>No records</p>
                  ) : (
                    <div className="table-wrapper" style={tableStyle}>
                      <table className="table">
                        <thead><tr>
                          <th>Date</th><th>Drug</th><th>Dosage</th><th>Description</th>
                        </tr></thead>
                        <tbody>
                          {records.deworming.map((r) => (
                            <tr key={r._id}>
                              <td>{r.date}</td><td>{r.drug}</td>
                              <td>{r.dosage}</td><td>{r.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* VACCINATION */}
                  <h4 style={{ color: "var(--accent-green)", marginBottom: "8px" }}>Vaccination</h4>
                  {records.vaccination.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>No records</p>
                  ) : (
                    <div className="table-wrapper" style={tableStyle}>
                      <table className="table">
                        <thead><tr>
                          <th>Date</th><th>Vaccine</th><th>Dosage</th><th>Description</th>
                        </tr></thead>
                        <tbody>
                          {records.vaccination.map((r) => (
                            <tr key={r._id}>
                              <td>{r.date}</td><td>{r.vaccine}</td>
                              <td>{r.dosage}</td><td>{r.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* IMMUNIZATION */}
                  <h4 style={{ color: "var(--accent-blue)", marginBottom: "8px" }}>Immunization</h4>
                  {records.immunization.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>No records</p>
                  ) : (
                    <div className="table-wrapper" style={tableStyle}>
                      <table className="table">
                        <thead><tr>
                          <th>Date</th><th>Drug</th><th>Dosage</th><th>Description</th>
                        </tr></thead>
                        <tbody>
                          {records.immunization.map((r) => (
                            <tr key={r._id}>
                              <td>{r.date}</td><td>{r.drug}</td>
                              <td>{r.dosage}</td><td>{r.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* REPRODUCTION */}
                  <h4 style={{ color: "var(--accent-purple)", marginBottom: "8px" }}>Reproduction</h4>
                  {records.reproduction.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>No records</p>
                  ) : (
                    <div className="table-wrapper" style={tableStyle}>
                      <table className="table">
                        <thead><tr>
                          <th>Insemination Date</th><th>Pregnancy Status</th>
                          <th>Calf Status</th><th>Milk Yield</th>
                        </tr></thead>
                        <tbody>
                          {records.reproduction.map((r) => (
                            <tr key={r._id}>
                              <td>{r.inseminationDate || "-"}</td>
                              <td>{r.pregnancyStatus || "-"}</td>
                              <td>{r.calfStatus || "-"}</td>
                              <td>{r.milkYield || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* CATTLE INFO */}
                  <h4 style={{ color: "var(--accent-teal)", marginBottom: "8px" }}>Cattle Info</h4>
                  {records.cattle.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>No records</p>
                  ) : (
                    <div className="table-wrapper" style={tableStyle}>
                      <table className="table">
                        <thead><tr>
                          <th>Insemination Date</th><th>Pregnancy Status</th>
                          <th>Health Status</th><th>Milk Yield</th>
                        </tr></thead>
                        <tbody>
                          {records.cattle.map((r) => (
                            <tr key={r._id}>
                              <td>{r.inseminationDate || "-"}</td>
                              <td>{r.pregnancyStatus || "-"}</td>
                              <td>{r.healthStatus || "-"}</td>
                              <td>{r.milkYield || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CowInfo;