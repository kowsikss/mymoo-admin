import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import { API_BASE_URL } from "../api/client";
import { downloadExcel, downloadPdf } from "../utils/dataExport";
import "../styles/dashboard.css";
import "../styles/data-export.css";
import "./DoctorManageCow.css";

const PAGE_SIZE = 20;
const doctorCowExportColumns = [
  { key: "serialNumber", label: "S.No" },
  { key: "cowId", label: "Cow ID" },
  { key: "tagNumber", label: "RFID Tag" },
  { key: "type", label: "Type" },
  { key: "breed", label: "Breed" },
  { key: "age", label: "Age" },
  { key: "weight", label: "Weight" },
  { key: "healthStatus", label: "Health Status" },
  { key: "disease", label: "Disease" },
  { key: "vaccinationDate", label: "Last Vaccination" },
  { key: "dewormingDate", label: "Last Deworming" },
  { key: "dateOfDeath", label: "Date of Death" },
  { key: "causeOfDeath", label: "Cause of Death" },
];

function DoctorManageCow() {
  const [cows,       setCows]       = useState([]);
  const [editingCow, setEditingCow] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  const API = "/api/cows";

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

  useEffect(() => {
    if (!previewImage) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [previewImage]);

  const role = localStorage.getItem("role");
  if (role !== "doctor") return <Navigate to="/" />;

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
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const displayPage = Math.min(currentPage, pageCount);
  const pageStart = (displayPage - 1) * PAGE_SIZE;
  const visibleCows = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const exportRows = filtered.map((cow, index) => ({
    serialNumber: index + 1,
    cowId: cow.cowId || "-",
    tagNumber: cow.tagNumber || "-",
    type: cow.type || "-",
    breed: cow.breed?.name || cow.breed || "-",
    age: cow.age ? `${cow.age} ${cow.ageUnit || "yrs"}` : "-",
    weight: cow.weight ? `${cow.weight} kg` : "-",
    healthStatus: cow.healthStatus || "-",
    disease: cow.hasDisease === "Yes" ? (cow.diseaseName || "Yes") : "No",
    vaccinationDate: cow.vaccinationDate || "-",
    dewormingDate: cow.dewormingDate || "-",
    dateOfDeath: cow.dateOfDeath ? new Date(cow.dateOfDeath).toLocaleDateString("en-IN") : "-",
    causeOfDeath: cow.causeOfDeath || "-",
  }));

  const getCowImageUrl = (image) => (
    image?.startsWith("http") ? image : `${API_BASE_URL}/uploads/${image}`
  );

  const healthColor = (status) => {
    if (status === "Healthy")         return "var(--accent-green)";
    if (status === "Deceased")        return "var(--accent-red)";
    if (status === "Under Treatment") return "var(--accent-amber)";
    if (status === "Calved")          return "var(--accent-teal)";
    return "var(--text-secondary)";
  };

  return (
    <div className="layout doctor-manage-cows-page">
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: "100%", maxWidth: "420px" }}
          />
        </div>

        <div className="data-export-actions" aria-label="Export cow records">
          <button
            type="button"
            className="data-export-actions__button data-export-actions__button--excel"
            disabled={exportRows.length === 0}
            onClick={() => downloadExcel(exportRows, doctorCowExportColumns, "doctor-manage-cows", "Cows")}
          >
            Download Excel
          </button>
          <button
            type="button"
            className="data-export-actions__button data-export-actions__button--pdf"
            disabled={exportRows.length === 0}
            onClick={() => downloadPdf(exportRows, doctorCowExportColumns, "doctor-manage-cows", "Manage Cows")}
          >
            Download PDF
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        ) : (
          <div className="table-wrapper doctor-cow-table">
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
                  visibleCows.map((cow, index) => (
                    <tr key={cow._id}>
                      <td>{pageStart + index + 1}</td>
                      <td>
                        {cow.frontImage || cow.image ? (
                          <button
                            type="button"
                            className="doctor-cow-image-trigger"
                            aria-label={`View image of ${cow.cowId || "cow"}`}
                            onClick={() => setPreviewImage({
                              src: getCowImageUrl(cow.frontImage || cow.image),
                              alt: cow.cowId ? `Cow ${cow.cowId}` : "Cow",
                            })}
                          >
                            <img
                              src={getCowImageUrl(cow.frontImage || cow.image)}
                              alt=""
                              className="cow-thumb"
                            />
                          </button>
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

        <nav className="doctor-cow-pagination" aria-label="Cow list pages">
          <span>
            Showing {filtered.length === 0 ? 0 : pageStart + 1}
            –{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="doctor-cow-pagination__controls">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, displayPage - 1))}
              disabled={displayPage === 1}
            >Previous</button>
            <span aria-live="polite">Page {displayPage} of {pageCount}</span>
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(pageCount, displayPage + 1))}
              disabled={displayPage === pageCount}
            >Next</button>
          </div>
        </nav>

        {previewImage && (
          <div className="doctor-cow-image-modal" role="presentation" onClick={() => setPreviewImage(null)}>
            <div
              className="doctor-cow-image-modal__content"
              role="dialog"
              aria-modal="true"
              aria-label={previewImage.alt}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="doctor-cow-image-modal__close"
                aria-label="Close image preview"
                onClick={() => setPreviewImage(null)}
              >×</button>
              <img src={previewImage.src} alt={previewImage.alt} />
            </div>
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