import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import { API_BASE_URL } from "../api/client";

function DoctorManageCow() {
  const [cows,       setCows]       = useState([]);
  const [editingCow, setEditingCow] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");

  const API = "/api/cows";

  const role = localStorage.getItem("role");
  if (role !== "doctor") return <Navigate to="/" />;

  const fetchCows = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");
      const res = await apiClient.get(`${API}/kosala/${kosalaId}`);
      setCows(res.data);
    } catch (err) {
      console.error("Error fetching cows:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCows(); }, []);

  const handleEditClick = (cow) => setEditingCow({ ...cow });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCow((prev) => {
      const updated = { ...prev, [name]: value };
      // Clear death fields if switching away from Deceased
      if (name === "healthStatus" && value !== "Deceased") {
        updated.dateOfDeath  = "";
        updated.causeOfDeath = "";
      }
      return updated;
    });
  };

  const handleUpdate = async () => {
    if (editingCow.healthStatus === "Deceased" && !editingCow.dateOfDeath) {
      alert("Please enter the Date of Death for a deceased animal.");
      return;
    }
    try {
      // ✅ Only send fields doctors are allowed to update
      await apiClient.put(`${API}/${editingCow._id}`, {
        healthStatus:       editingCow.healthStatus,
        dateOfDeath:        editingCow.dateOfDeath,
        causeOfDeath:       editingCow.causeOfDeath,
        hasDisease:         editingCow.hasDisease,
        diseaseName:        editingCow.diseaseName,
        diseaseDate:        editingCow.diseaseDate,
        treatmentDate:      editingCow.treatmentDate,
        vaccinationDate:    editingCow.vaccinationDate,
        dewormingDate:      editingCow.dewormingDate,
        monthlyAmountSpent: editingCow.monthlyAmountSpent,
      });
      alert("Cow record updated successfully!");
      setEditingCow(null);
      fetchCows();
    } catch (err) {
      console.error("Error updating cow:", err);
      alert("Failed to update. Please try again.");
    }
  };

  // Filter by search
  const filtered = cows.filter((c) =>
    (c.cowId     || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.tagNumber || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.healthStatus || "").toLowerCase().includes(search.toLowerCase())
  );

  const healthColor = (status) => {
    if (status === "Healthy")         return "var(--accent-green)";
    if (status === "Deceased")        return "var(--accent-red)";
    if (status === "Under Treatment") return "var(--accent-amber)";
    if (status === "Calved")          return "var(--accent-teal)";
    return "var(--text-secondary)";
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>MANAGE COWS</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "-14px", marginBottom: "20px" }}>
          You can update health status, treatment, disease, and death records only.
        </p>

        {/* SUMMARY CARDS */}
        <div className="card-container" style={{ marginBottom: "24px" }}>
          <div className="card red">
            <h3>Total Cows 🐄</h3>
            <p>{cows.filter((c) => c.type === "cow").length}</p>
          </div>
          <div className="card orange">
            <h3>Total Bulls 🐂</h3>
            <p>{cows.filter((c) => c.type === "bull").length}</p>
          </div>
          <div className="card green">
            <h3>Healthy ✅</h3>
            <p>{cows.filter((c) => c.healthStatus === "Healthy").length}</p>
          </div>
          <div className="card yellow">
            <h3>Under Treatment 💊</h3>
            <p>{cows.filter((c) => c.healthStatus === "Under Treatment").length}</p>
          </div>
          <div className="card dark">
            <h3>Deceased 💀</h3>
            <p>{cows.filter((c) => c.healthStatus === "Deceased").length}</p>
          </div>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: "16px" }}>
          <input
            placeholder="🔍 Search by Cow ID, Tag Number or Health Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", maxWidth: "420px" }}
          />
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
                  <th>Image</th>
                  <th>Cow ID</th>
                  <th>RFID Tag</th>
                  <th>Type</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Weight</th>
                  <th>Health Status</th>
                  <th>Disease</th>
                  <th>Last Vaccination</th>
                  <th>Last Deworming</th>
                  <th>Date of Death</th>
                  <th>Cause of Death</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="15" style={{ textAlign: "center" }}>
                      {search ? "No cows match your search" : "No cows found"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((cow, index) => (
                    <tr key={cow._id}>
                      <td>{index + 1}</td>
                      <td>
                        {cow.frontImage || cow.image ? (
                          <img
                            src={`${API_BASE_URL}/uploads/${cow.frontImage || cow.image}`}
                            alt="cow"
                            className="cow-thumb"
                            onClick={() =>
                              window.open(
                                `${API_BASE_URL}/uploads/${cow.frontImage || cow.image}`,
                                "_blank"
                              )
                            }
                          />
                        ) : (
                          <span className="no-img">No Image</span>
                        )}
                      </td>
                      <td>{cow.cowId || "—"}</td>
                      <td>{cow.tagNumber || "—"}</td>
                      <td style={{ textTransform: "capitalize" }}>{cow.type || "—"}</td>
                      <td>{cow.breed || "—"}</td>
                      <td>{cow.age ? `${cow.age} ${cow.ageUnit || "yrs"}` : "—"}</td>
                      <td>{cow.weight ? `${cow.weight} kg` : "—"}</td>
                      <td>
                        <span style={{ fontWeight: 600, fontSize: "13px", color: healthColor(cow.healthStatus) }}>
                          {cow.healthStatus || "—"}
                        </span>
                      </td>
                      <td>{cow.hasDisease === "Yes" ? (cow.diseaseName || "Yes") : "No"}</td>
                      <td>{cow.vaccinationDate || "—"}</td>
                      <td>{cow.dewormingDate   || "—"}</td>
                      <td>
                        {cow.healthStatus === "Deceased" && cow.dateOfDeath
                          ? new Date(cow.dateOfDeath).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td>
                        {cow.healthStatus === "Deceased" ? (cow.causeOfDeath || "—") : "—"}
                      </td>
                      <td>
                        <button onClick={() => handleEditClick(cow)}>✏️ Update</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── EDIT PANEL (doctor restricted fields only) ── */}
        {editingCow && (
          <div className="edit-panel">

            {/* READ-ONLY INFO */}
            <h3>Update Health Record</h3>
            <div style={{
              background: "var(--bg-hover)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                🐄 <strong style={{ color: "var(--text-primary)" }}>Cow ID:</strong> {editingCow.cowId}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                📡 <strong style={{ color: "var(--text-primary)" }}>RFID Tag:</strong> {editingCow.tagNumber || "—"}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                🏷️ <strong style={{ color: "var(--text-primary)" }}>Type:</strong> {editingCow.type}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                ⚖️ <strong style={{ color: "var(--text-primary)" }}>Weight:</strong> {editingCow.weight} kg
              </p>
            </div>

            {/* ── HEALTH STATUS ── */}
            <label>Health Status <span style={{ color: "red" }}>*</span></label>
            <select name="healthStatus" value={editingCow.healthStatus || ""} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Healthy">Healthy</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Calved">Calved</option>
              <option value="Deceased">Deceased</option>
            </select>

            {/* ── DEATH FIELDS (only when Deceased) ── */}
            {editingCow.healthStatus === "Deceased" && (
              <div style={{
                background: "rgba(232,107,90,0.08)",
                border: "1px solid rgba(232,107,90,0.3)",
                borderRadius: "10px",
                padding: "16px",
                margin: "4px 0",
              }}>
                <p style={{ color: "var(--accent-red)", fontWeight: 600, fontSize: "13px", marginBottom: "12px" }}>
                  💀 Death Record
                </p>

                <label>Date of Death <span style={{ color: "red" }}>*</span></label>
                <input
                  type="date"
                  name="dateOfDeath"
                  value={editingCow.dateOfDeath || ""}
                  onChange={handleChange}
                  required
                />

                <label>Cause of Death</label>
                <select name="causeOfDeath" value={editingCow.causeOfDeath || ""} onChange={handleChange}>
                  <option value="">-- Select Cause --</option>
                  <option value="Disease">Disease</option>
                  <option value="Accident">Accident</option>
                  <option value="Old Age">Old Age</option>
                  <option value="Injury">Injury</option>
                  <option value="Poisoning">Poisoning</option>
                  <option value="Complications during calving">Complications during calving</option>
                  <option value="Unknown">Unknown</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* ── DISEASE ── */}
            <label>Has Disease?</label>
            <select name="hasDisease" value={editingCow.hasDisease || ""} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            {editingCow.hasDisease === "Yes" && (
              <>
                <label>Disease Name</label>
                <input
                  name="diseaseName"
                  value={editingCow.diseaseName || ""}
                  onChange={handleChange}
                  placeholder="Enter disease name"
                />

                <label>Date of Disease</label>
                <input
                  type="date"
                  name="diseaseDate"
                  value={editingCow.diseaseDate || ""}
                  onChange={handleChange}
                />
              </>
            )}

            {/* ── TREATMENT ── */}
            <label>Treatment Date</label>
            <input
              type="date"
              name="treatmentDate"
              value={editingCow.treatmentDate || ""}
              onChange={handleChange}
            />

            <label>Last Vaccination Date</label>
            <input
              type="date"
              name="vaccinationDate"
              value={editingCow.vaccinationDate || ""}
              onChange={handleChange}
            />

            <label>Last Deworming Date</label>
            <input
              type="date"
              name="dewormingDate"
              value={editingCow.dewormingDate || ""}
              onChange={handleChange}
            />

            <label>Monthly Amount Spent (Rs.)</label>
            <input
              type="number"
              name="monthlyAmountSpent"
              value={editingCow.monthlyAmountSpent || ""}
              onChange={handleChange}
              placeholder="Enter monthly amount"
              min="0"
            />

            <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
              <button className="update-btn" onClick={handleUpdate}>Update</button>
              <button className="cancel-btn" onClick={() => setEditingCow(null)}>Cancel</button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default DoctorManageCow;