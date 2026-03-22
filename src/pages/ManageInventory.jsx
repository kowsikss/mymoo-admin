import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function ManageInventory() {
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    fetchRecords();
  }, []);

  if (localStorage.getItem("role") !== "doctor") {
    return <Navigate to="/" />;
  }

  const fetchRecords = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");
      const res = await axios.get(
        `http://localhost:5000/api/inventory/kosala/${kosalaId}`
      );
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/inventory/${id}`);
        fetchRecords();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const filtered = records.filter((r) => r.type === activeTab);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2>MANAGE INVENTORY</h2>

        {/* TABS */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          {["feed", "medicine", "semen"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "var(--accent-green)" : "transparent",
                color: activeTab === tab ? "#0f1410" : "var(--text-secondary)",
                border: "1px solid var(--border)",
                borderColor: activeTab === tab ? "var(--accent-green)" : "var(--border)",
                textTransform: "capitalize",
              }}
            >
              {tab === "feed" ? "🌾 Feed"
               : tab === "medicine" ? "💊 Medicines"
               : "🧪 Semen Straw"}
            </button>
          ))}
        </div>

        {/* FEED TABLE */}
        {activeTab === "feed" && (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Feed Type</th>
                <th>Gunny Bags</th>
                <th>Weight/Bag (kg)</th>
                <th>Supplier</th>
                <th>Notes</th>
                <th>Action</th>
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
                    <td>{rec.gunnyBags}</td>
                    <td>{rec.weightPerBag || "-"}</td>
                    <td>{rec.supplier || "-"}</td>
                    <td>{rec.notes || "-"}</td>
                    <td>
                      <button onClick={() => handleDelete(rec._id)}>❌</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* MEDICINE TABLE */}
        {activeTab === "medicine" && (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Medicine</th>
                <th>Drug</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Expiry</th>
                <th>Notes</th>
                <th>Action</th>
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
                    <td>
                      <button onClick={() => handleDelete(rec._id)}>❌</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* SEMEN TABLE */}
        {activeTab === "semen" && (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Breed</th>
                <th>Straw Count</th>
                <th>Batch No</th>
                <th>Expiry</th>
                <th>Notes</th>
                <th>Action</th>
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
                    <td>
                      <button onClick={() => handleDelete(rec._id)}>❌</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

export default ManageInventory;