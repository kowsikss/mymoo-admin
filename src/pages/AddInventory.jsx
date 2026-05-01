import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import RoleSidebar from "../components/RoleSidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function AddInventory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("feed");
  const [loading,   setLoading]   = useState(false);

  const [feedForm, setFeedForm] = useState({
    date: "", feedType: "", gunnyBags: "", weightPerBag: "", supplier: "", notes: "",
  });

  const [medicineForm, setMedicineForm] = useState({
    date: "", medicineName: "", drugName: "", quantity: "", unit: "", expiryDate: "", notes: "",
  });

  const [semenForm, setSemenForm] = useState({
    date: "", breedName: "", strawCount: "", batchNumber: "", expiryDate: "", notes: "",
  });

  const role = localStorage.getItem("role");
  if (role !== "doctor" && role !== "kosala-admin") {
    return <Navigate to="/" />;
  }

  const handleFeedChange     = (e) => setFeedForm({ ...feedForm, [e.target.name]: e.target.value });
  const handleMedicineChange = (e) => setMedicineForm({ ...medicineForm, [e.target.name]: e.target.value });
  const handleSemenChange    = (e) => setSemenForm({ ...semenForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const kosalaId = localStorage.getItem("kosalaId");

    try {
      const payload =
        activeTab === "feed"
          ? { kosalaId, type: "feed",     ...feedForm }
          : activeTab === "medicine"
          ? { kosalaId, type: "medicine", ...medicineForm }
          : { kosalaId, type: "semen",    ...semenForm };

      await apiClient.post("/api/inventory", payload);
      alert("Inventory record saved successfully!");

      if (activeTab === "feed")
        setFeedForm({ date: "", feedType: "", gunnyBags: "", weightPerBag: "", supplier: "", notes: "" });
      else if (activeTab === "medicine")
        setMedicineForm({ date: "", medicineName: "", drugName: "", quantity: "", unit: "", expiryDate: "", notes: "" });
      else
        setSemenForm({ date: "", breedName: "", strawCount: "", batchNumber: "", expiryDate: "", notes: "" });

    } catch (err) {
      console.error("Error saving inventory:", err);
      alert("Error saving record");
    } finally {
      setLoading(false);
    }
  };

  const tabBtn = (tab, label) => (
    <button
      key={tab}
      type="button"
      onClick={() => setActiveTab(tab)}
      style={{
        background:   activeTab === tab ? "var(--accent-green)" : "transparent",
        color:        activeTab === tab ? "#0f1410" : "var(--text-secondary)",
        border:       "1px solid var(--border)",
        borderColor:  activeTab === tab ? "var(--accent-green)" : "var(--border)",
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
        <h2>INVENTORY MODULE</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "-16px", marginBottom: "24px", fontSize: "13px" }}>
          Enter daily inventory data
        </p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          {tabBtn("feed",     "🌾 Feed Purchase")}
          {tabBtn("medicine", "💊 Medicines")}
          {tabBtn("semen",    "🧪 Semen Straw")}
        </div>

        <form className="form-box" onSubmit={handleSubmit}>

          {/* FEED */}
          {activeTab === "feed" && (
            <>
              <label>Date <span style={{ color: "red" }}>*</span></label>
              <input type="date" name="date" value={feedForm.date} onChange={handleFeedChange} required />

              <label>Feed Type <span style={{ color: "red" }}>*</span></label>
              <select name="feedType" value={feedForm.feedType} onChange={handleFeedChange} required>
                <option value="">Select Feed Type</option>
                <option value="Hay">Hay</option>
                <option value="Silage">Silage</option>
                <option value="Concentrate">Concentrate</option>
                <option value="Green Fodder">Green Fodder</option>
                <option value="Dry Fodder">Dry Fodder</option>
                <option value="Other">Other</option>
              </select>

              <label>Number of Gunny Bags <span style={{ color: "red" }}>*</span></label>
              <input type="number" name="gunnyBags" value={feedForm.gunnyBags}
                onChange={handleFeedChange} placeholder="Enter number of gunny bags" min="0" required />

              <label>Weight Per Bag (kg)</label>
              <input type="number" name="weightPerBag" value={feedForm.weightPerBag}
                onChange={handleFeedChange} placeholder="Enter weight per bag in kg" min="0" />

              <label>Supplier</label>
              <input name="supplier" value={feedForm.supplier}
                onChange={handleFeedChange} placeholder="Enter supplier name" />

              <label>Notes</label>
              <textarea name="notes" value={feedForm.notes}
                onChange={handleFeedChange} placeholder="Additional notes..." />
            </>
          )}

          {/* MEDICINE */}
          {activeTab === "medicine" && (
            <>
              <label>Date <span style={{ color: "red" }}>*</span></label>
              <input type="date" name="date" value={medicineForm.date} onChange={handleMedicineChange} required />

              <label>Medicine Name <span style={{ color: "red" }}>*</span></label>
              <input name="medicineName" value={medicineForm.medicineName}
                onChange={handleMedicineChange} placeholder="Enter medicine name" required />

              <label>Drug Name <span style={{ color: "red" }}>*</span></label>
              <input name="drugName" value={medicineForm.drugName}
                onChange={handleMedicineChange} placeholder="Enter drug name" required />

              <label>Quantity <span style={{ color: "red" }}>*</span></label>
              <input type="number" name="quantity" value={medicineForm.quantity}
                onChange={handleMedicineChange} placeholder="Enter available quantity" min="0" required />

              <label>Unit</label>
              <select name="unit" value={medicineForm.unit} onChange={handleMedicineChange}>
                <option value="">Select Unit</option>
                <option value="tablets">Tablets</option>
                <option value="vials">Vials</option>
                <option value="bottles">Bottles</option>
                <option value="strips">Strips</option>
                <option value="sachets">Sachets</option>
                <option value="kg">Kg</option>
                <option value="litre">Litre</option>
              </select>

              <label>Expiry Date</label>
              <input type="date" name="expiryDate" value={medicineForm.expiryDate} onChange={handleMedicineChange} />

              <label>Notes</label>
              <textarea name="notes" value={medicineForm.notes}
                onChange={handleMedicineChange} placeholder="Additional notes..." />
            </>
          )}

          {/* SEMEN */}
          {activeTab === "semen" && (
            <>
              <label>Date <span style={{ color: "red" }}>*</span></label>
              <input type="date" name="date" value={semenForm.date} onChange={handleSemenChange} required />

              <label>Breed Name <span style={{ color: "red" }}>*</span></label>
              <input name="breedName" value={semenForm.breedName}
                onChange={handleSemenChange} placeholder="Enter breed name" required />

              <label>Number of Straws <span style={{ color: "red" }}>*</span></label>
              <input type="number" name="strawCount" value={semenForm.strawCount}
                onChange={handleSemenChange} placeholder="Enter number of straws available" min="0" required />

              <label>Batch Number</label>
              <input name="batchNumber" value={semenForm.batchNumber}
                onChange={handleSemenChange} placeholder="Enter batch number" />

              <label>Expiry Date</label>
              <input type="date" name="expiryDate" value={semenForm.expiryDate} onChange={handleSemenChange} />

              <label>Notes</label>
              <textarea name="notes" value={semenForm.notes}
                onChange={handleSemenChange} placeholder="Additional notes..." />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddInventory;
