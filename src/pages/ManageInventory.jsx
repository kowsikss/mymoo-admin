import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import RoleSidebar from "../components/RoleSidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import "../styles/data-export.css";
import { downloadExcel, downloadPdf } from "../utils/dataExport";

const inventoryColumns = {
  feed: [
    { key: "date", label: "Date" },
    { key: "feedType", label: "Feed Type" },
    { key: "feedTime", label: "Feed Time" },
    { key: "gunnyBags", label: "Gunny Bags" },
    { key: "weightPerBag", label: "Weight per Bag (kg)" },
    { key: "supplier", label: "Supplier" },
    { key: "notes", label: "Notes" },
  ],
  medicine: [
    { key: "date", label: "Date" },
    { key: "medicineName", label: "Medicine" },
    { key: "drugName", label: "Drug" },
    { key: "quantity", label: "Quantity" },
    { key: "unit", label: "Unit" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "notes", label: "Notes" },
  ],
  semen: [
    { key: "date", label: "Date" },
    { key: "breedName", label: "Breed" },
    { key: "strawCount", label: "Straw Count" },
    { key: "batchNumber", label: "Batch Number" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "notes", label: "Notes" },
  ],
};

function ManageInventory() {
  const [records,   setRecords]   = useState([]);
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    fetchRecords();
  }, []);

  const role = localStorage.getItem("role");
  if (role !== "doctor" && role !== "kosala-admin") {
    return <Navigate to="/" />;
  }

  const fetchRecords = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");
      const res = await apiClient.get(
        `/api/inventory/kosala/${kosalaId}`
      );
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await apiClient.delete(`/api/inventory/${id}`);
        fetchRecords();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const filtered = records.filter((r) => r.type === activeTab);
  const exportName = `${activeTab}-inventory`;
  const exportTitle = `${activeTab[0].toUpperCase()}${activeTab.slice(1)} Inventory`;

  const tabBtn = (tab, label) => (
    <button
      key={tab}
      type="button"
      onClick={() => setActiveTab(tab)}
      style={{
        background:    activeTab === tab ? "var(--accent-green)" : "transparent",
        color:         activeTab === tab ? "#0f1410" : "var(--text-secondary)",
        border:        "1px solid var(--border)",
        borderColor:   activeTab === tab ? "var(--accent-green)" : "var(--border)",
        textTransform: "capitalize",
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="layout">
      <RoleSidebar />
      <div className="main">
        <Navbar />
        <h2>MANAGE INVENTORY</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          {tabBtn("feed",     "🌾 Feed")}
          {tabBtn("medicine", "💊 Medicines")}
          {tabBtn("semen",    "🧪 Semen Straw")}
        </div>

        <div className="data-export-actions" aria-label="Export inventory records">
          <button
            type="button"
            className="data-export-actions__button data-export-actions__button--excel"
            disabled={filtered.length === 0}
            onClick={() => downloadExcel(filtered, inventoryColumns[activeTab], exportName, activeTab)}
          >
            Download Excel
          </button>
          <button
            type="button"
            className="data-export-actions__button data-export-actions__button--pdf"
            disabled={filtered.length === 0}
            onClick={() => downloadPdf(filtered, inventoryColumns[activeTab], exportName, exportTitle)}
          >
            Download PDF
          </button>
        </div>

        {/* FEED TABLE */}
        {activeTab === "feed" && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Date</th><th>Feed Types</th><th>Feed Time</th><th>Gunny Bags</th>
                  <th>Weight/Bag (kg)</th><th>Supplier</th><th>Notes</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: "center" }}>No feed records found</td></tr>
                ) : (
                  filtered.map((rec, i) => (
                    <tr key={rec._id}>
                      <td>{i + 1}</td>
                      <td>{rec.date}</td>
                      <td>{rec.feedType}</td>
                      <td>{rec.feedTime || "-"}</td>
                      <td>{rec.gunnyBags}</td>
                      <td>{rec.weightPerBag || "-"}</td>
                      <td>{rec.supplier || "-"}</td>
                      <td>{rec.notes || "-"}</td>
                      <td><button onClick={() => handleDelete(rec._id)}>❌</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MEDICINE TABLE */}
        {activeTab === "medicine" && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Date</th><th>Medicine</th><th>Drug</th>
                  <th>Quantity</th><th>Unit</th><th>Expiry</th><th>Notes</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: "center" }}>No medicine records found</td></tr>
                ) : (
                  filtered.map((rec, i) => (
                    <tr key={rec._id}>
                      <td>{i + 1}</td>
                      <td>{rec.date}</td>
                      <td>{rec.medicineName}</td>
                      <td>{rec.drugName}</td>
                      <td>{rec.quantity}</td>
                      <td>{rec.unit || "-"}</td>
                      <td>{rec.expiryDate || "-"}</td>
                      <td>{rec.notes || "-"}</td>
                      <td><button onClick={() => handleDelete(rec._id)}>❌</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SEMEN TABLE */}
        {activeTab === "semen" && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Date</th><th>Breed</th><th>Straw Count</th>
                  <th>Batch No</th><th>Expiry</th><th>Notes</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: "center" }}>No semen straw records found</td></tr>
                ) : (
                  filtered.map((rec, i) => (
                    <tr key={rec._id}>
                      <td>{i + 1}</td>
                      <td>{rec.date}</td>
                      <td>{rec.breedName}</td>
                      <td>{rec.strawCount}</td>
                      <td>{rec.batchNumber || "-"}</td>
                      <td>{rec.expiryDate || "-"}</td>
                      <td>{rec.notes || "-"}</td>
                      <td><button onClick={() => handleDelete(rec._id)}>❌</button></td>
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

export default ManageInventory;
