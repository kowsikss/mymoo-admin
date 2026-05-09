import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function EditGaushala() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [gaushalaForm, setGaushalaForm] = useState({
    name: "",
    address: "",
    pincode: "",
    registrationNumber: "",
    contactNumber: "",
    email: "",
  });

  const [certificate, setCertificate] = useState(null);
  const [existingCertificate, setExistingCertificate] = useState(null);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  // Fetch gaushala data
  useEffect(() => {
    const fetchGaushala = async () => {
      try {
        const res = await apiClient.get(`/api/kosala/${id}`);
        setGaushalaForm({
          name: res.data.name || "",
          address: res.data.address || "",
          pincode: res.data.pincode || "",
          registrationNumber: res.data.registrationNumber || "",
          contactNumber: res.data.contactNumber || "",
          email: res.data.email || "",
        });
        setExistingCertificate(res.data.certificate || null);
      } catch (err) {
        console.error("Error fetching gaushala:", err);
        setError("Error loading gaushala data");
      }
    };
    fetchGaushala();
  }, [id]);

  const handleGaushalaChange = (e) => {
    setGaushalaForm({ ...gaushalaForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(gaushalaForm).forEach((key) =>
        formData.append(key, gaushalaForm[key])
      );
      if (certificate) formData.append("certificate", certificate);

      await apiClient.put(`/api/kosala/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Gaushala updated successfully!");
      navigate("/gaushalas-list");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error updating gaushala");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2>Edit Gaushala</h2>

        <form className="form-box" onSubmit={handleSubmit}>
          {/* GAUSHALA DETAILS */}
          <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
            Gaushala Details
          </h3>

          <label>Gaushala Name <span style={{ color: "red" }}>*</span></label>
          <input
            name="name"
            value={gaushalaForm.name}
            onChange={handleGaushalaChange}
            placeholder="Enter gaushala name"
            required
          />

          <label>Address <span style={{ color: "red" }}>*</span></label>
          <textarea
            name="address"
            value={gaushalaForm.address}
            onChange={handleGaushalaChange}
            placeholder="Enter address"
            required
          />

          <label>Pincode <span style={{ color: "red" }}>*</span></label>
          <input
            type="number"
            name="pincode"
            value={gaushalaForm.pincode}
            onChange={handleGaushalaChange}
            placeholder="Enter pincode"
            required
          />

          <label>Registration Number <span style={{ color: "red" }}>*</span></label>
          <input
            name="registrationNumber"
            value={gaushalaForm.registrationNumber}
            onChange={handleGaushalaChange}
            placeholder="Enter registration number"
            required
          />

          <label>Contact Number <span style={{ color: "red" }}>*</span></label>
          <input
            name="contactNumber"
            value={gaushalaForm.contactNumber}
            onChange={handleGaushalaChange}
            placeholder="Enter contact number"
            required
          />

          <label>Email <span style={{ color: "red" }}>*</span></label>
          <input
            type="email"
            name="email"
            value={gaushalaForm.email}
            onChange={handleGaushalaChange}
            placeholder="Enter email"
            required
          />

          <label>Certificate (optional)</label>
          {existingCertificate && (
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "-8px" }}>
              Current certificate: <a href={existingCertificate} target="_blank" rel="noopener noreferrer">View</a>
            </p>
          )}
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setCertificate(e.target.files[0])}
          />
          {certificate && (
            <p style={{ fontSize : "12px", color: "var(--accent-green)", marginTop: "4px" }}>
              ✓ New certificate selected: {certificate.name}
            </p>
          )}

          {error && (
            <p style={{ color: "var(--accent-red)", fontSize: "13px" }}>{error}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Gaushala"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditGaushala;