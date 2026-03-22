import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function AdminAddCow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    breed: "",
    age: "",
    ageUnit: "years",        // years or months
    weight: "",
    registrationDate: "",
    calfStatus: "",          // Bull Calf / Heifer
    tagNumber: "",           // RFID tag
    vaccinationDate: "",
    dewormingDate: "",
    insuranceStatus: "",     // Yes / No
    healthStatus: "",        // Healthy / Under Treatment / Calved / Deceased
    monthlyAmountSpent: "",
    hasDisease: "",          // Yes / No
    diseaseName: "",
    diseaseDate: "",
    treatmentDate: "",
    feedType: "",
    feedAmountKg: "",
  });

  const [breeds, setBreeds] = useState([]);
  const [images, setImages] = useState({
    front: null,
    side: null,
    back: null,
  });
  const [insuranceCert, setInsuranceCert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBreeds();
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchBreeds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/breeds");
      setBreeds(res.data);
    } catch (err) {
      console.error("Error fetching breeds:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type || !form.breed) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      formData.append("kosalaId", id);

      if (images.front) formData.append("front", images.front);
      if (images.side)  formData.append("side",  images.side);
      if (images.back)  formData.append("back",  images.back);
      if (insuranceCert) formData.append("insuranceCert", insuranceCert);

      await axios.post("http://localhost:5000/api/cows", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Cow Added Successfully!");
      navigate(`/admin/kosala/${id}`);
    } catch (err) {
      console.error("Error adding cow:", err.response?.data || err.message);
      alert("Error adding cow");
    } finally {
      setLoading(false);
    }
  };

  // Calf status options depend on type
  const calfOptions =
    form.type === "bull"
      ? [{ val: "Bull Calf", label: "Bull Calf" }]
      : [
          { val: "Bull Calf", label: "Bull Calf" },
          { val: "Heifer",    label: "Heifer"    },
        ];

  // Health status — Calved only for Cow
  const healthOptions =
    form.type === "bull"
      ? ["Healthy", "Under Treatment", "Deceased"]
      : ["Healthy", "Under Treatment", "Calved", "Deceased"];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Add Cow</h2>

        <form className="form-box" onSubmit={handleSubmit}>

          {/* ── BASIC INFO ─────────────────────────────── */}
          <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
            Basic Information
          </h3>

          <label>Type <span style={{ color: "red" }}>*</span></label>
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="cow">Cow</option>
            <option value="bull">Bull</option>
          </select>

          <label>Breed <span style={{ color: "red" }}>*</span></label>
          <select name="breed" value={form.breed} onChange={handleChange} required>
            <option value="">Select Breed</option>
            {breeds.length === 0 ? (
              <option disabled>Loading breeds...</option>
            ) : (
              breeds.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))
            )}
          </select>

          <label>Cattle Age <span style={{ color: "red" }}>*</span></label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter age"
              min="0"
              style={{ flex: 2 }}
              required
            />
            <select
              name="ageUnit"
              value={form.ageUnit}
              onChange={handleChange}
              style={{ flex: 1 }}
            >
              <option value="years">Years</option>
              <option value="months">Months (Calf)</option>
            </select>
          </div>

          <label>Cattle Calf Status</label>
          <select name="calfStatus" value={form.calfStatus} onChange={handleChange}>
            <option value="">-- Select Calf Status --</option>
            {calfOptions.map((o) => (
              <option key={o.val} value={o.val}>{o.label}</option>
            ))}
          </select>

          <label>Cattle Weight (kg) <span style={{ color: "red" }}>*</span></label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Enter weight in kg"
            min="0"
            required
          />

          <label>RFID Tag Number <span style={{ color: "red" }}>*</span></label>
          <input
            name="tagNumber"
            value={form.tagNumber}
            onChange={handleChange}
            placeholder="Enter RFID tag number (alphanumeric)"
            required
          />

          <label>Date of Registration <span style={{ color: "red" }}>*</span></label>
          <input
            type="date"
            name="registrationDate"
            value={form.registrationDate}
            onChange={handleChange}
            required
          />

          {/* ── IMAGES ─────────────────────────────────── */}
          <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
            Cattle Images
          </h3>

          <label>Front View Image <span style={{ color: "red" }}>*</span></label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImages({ ...images, front: e.target.files[0] })}
          />

          <label>Side View Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImages({ ...images, side: e.target.files[0] })}
          />

          <label>Another Side View Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImages({ ...images, back: e.target.files[0] })}
          />

          {/* ── HEALTH & TREATMENT ─────────────────────── */}
          <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
            Health & Treatment
          </h3>

          <label>Cattle Health Status <span style={{ color: "red" }}>*</span></label>
          <select name="healthStatus" value={form.healthStatus} onChange={handleChange} required>
            <option value="">-- Select Health Status --</option>
            {healthOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          <label>Monthly Amount Spent for Cattle Health (Rs.) <span style={{ color: "red" }}>*</span></label>
          <input
            type="number"
            name="monthlyAmountSpent"
            value={form.monthlyAmountSpent}
            onChange={handleChange}
            placeholder="Rs. Enter monthly amount"
            min="0"
            required
          />

          <label>Date of Vaccination</label>
          <input
            type="date"
            name="vaccinationDate"
            value={form.vaccinationDate}
            onChange={handleChange}
          />

          <label>Date of Deworming</label>
          <input
            type="date"
            name="dewormingDate"
            value={form.dewormingDate}
            onChange={handleChange}
          />

          <label>Cattle Treatment Date</label>
          <input
            type="date"
            name="treatmentDate"
            value={form.treatmentDate}
            onChange={handleChange}
          />

          {/* ── DISEASE ─────────────────────────────────── */}
          <label>Has this Cattle undergone any Disease? <span style={{ color: "red" }}>*</span></label>
          <select name="hasDisease" value={form.hasDisease} onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          {form.hasDisease === "Yes" && (
            <>
              <label>Disease Name</label>
              <input
                name="diseaseName"
                value={form.diseaseName}
                onChange={handleChange}
                placeholder="Enter disease name"
              />

              <label>Date of Disease</label>
              <input
                type="date"
                name="diseaseDate"
                value={form.diseaseDate}
                onChange={handleChange}
              />
            </>
          )}

          {/* ── INSURANCE ──────────────────────────────── */}
          <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
            Insurance
          </h3>

          <label>Insurance Status <span style={{ color: "red" }}>*</span></label>
          <select name="insuranceStatus" value={form.insuranceStatus} onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          {form.insuranceStatus === "Yes" && (
            <>
              <label>Upload Insurance Certificate</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setInsuranceCert(e.target.files[0])}
              />
            </>
          )}

          {/* ── FEED ───────────────────────────────────── */}
          <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
            Cattle Feed Details
          </h3>

          <label>Feed Type (Monthly) <span style={{ color: "red" }}>*</span></label>
          <select name="feedType" value={form.feedType} onChange={handleChange} required>
            <option value="">-- Select Feed Type --</option>
            <option value="Green Fodder">Green Fodder</option>
            <option value="Dry Fodder">Dry Fodder</option>
            <option value="Silage">Silage</option>
            <option value="Concentrate">Concentrate</option>
            <option value="Hay">Hay</option>
            <option value="Other">Other</option>
          </select>

          <label>Monthly Feed Amount (Kg) <span style={{ color: "red" }}>*</span></label>
          <input
            type="number"
            name="feedAmountKg"
            value={form.feedAmountKg}
            onChange={handleChange}
            placeholder="Enter monthly feed in kg"
            min="0"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminAddCow;