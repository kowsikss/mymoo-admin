import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ApplyGaushala() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    kosalaName:         "",
    address:            "",
    pincode:            "",
    registrationNumber: "",
    contactNumber:      "",
    email:              "",
    adminName:          "",
    password:           "",
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (file && !allowed.includes(file.type)) {
      setError("Certificate must be a PDF, JPG, or PNG file.");
      setCertificateFile(null);
      return;
    }
    setError("");
    setCertificateFile(file);
  };

  // Auto-geocode pincode → lat/lon via free Nominatim API
  const geocodePincode = async (pincode) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
    } catch {
      // silently fail — lat/lon will just be null
    }
    return { lat: null, lon: null };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Validations ──────────────────────────────────────────
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Pincode must be exactly 6 digits.");
      return;
    }
    if (!/^\d{10}$/.test(form.contactNumber)) {
      setError("Contact number must be a 10-digit mobile number.");
      return;
    }
    if (!certificateFile) {
      setError("Please upload the Gaushala registration certificate.");
      return;
    }

    try {
      setLoading(true);

      // Geocode pincode → coordinates
      const { lat, lon } = await geocodePincode(form.pincode);

      // Use FormData so the file is sent as multipart
      const fd = new FormData();
      fd.append("kosalaName",         form.kosalaName);
      fd.append("address",            form.address);
      fd.append("pincode",            form.pincode);
      fd.append("registrationNumber", form.registrationNumber);
      fd.append("contactNumber",      form.contactNumber);
      fd.append("email",              form.email);
      fd.append("adminName",          form.adminName);
      fd.append("password",           form.password);
      fd.append("certificateFile",    certificateFile);
      if (lat !== null) fd.append("lat", lat);
      if (lon !== null) fd.append("lon", lon);

      await axios.post("http://localhost:5000/api/gaushala-requests", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────
  if (success) {
    return (
      <div style={S.page}>
        <div style={S.card}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
            <h2 style={S.title}>Application Submitted!</h2>
            <p style={{ color: "#57534e", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
              Your Gaushala registration request has been submitted successfully.
              Our Super Admin will review and approve it shortly.
              You'll be able to log in once approved.
            </p>
            <button style={S.btn} onClick={() => navigate("/")}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={S.card}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span style={{ fontSize: "40px" }}>🏛️</span>
          <h2 style={S.title}>Register Your Gaushala</h2>
          <p style={{ color: "#78716c", fontSize: "13px" }}>
            Fill in the details below. After super admin approval,
            your Gaushala will be live on the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Section: Gaushala Details ── */}
          <p style={S.section}>🐄 Gaushala Details</p>

          <label style={S.label}>Gaushala Name <Req /></label>
          <input
            style={S.input} name="kosalaName" value={form.kosalaName}
            onChange={handleChange} placeholder="e.g. Sri Ram Gaushala" required
          />

          <label style={S.label}>Registration Number <Req /></label>
          <input
            style={S.input} name="registrationNumber" value={form.registrationNumber}
            onChange={handleChange} placeholder="e.g. GS/MH/2023/0042" required
          />

          <label style={S.label}>Registration Certificate (PDF / JPG / PNG) <Req /></label>
          <input
            style={{ ...S.input, padding: "8px 14px", cursor: "pointer" }}
            type="file" accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange} required
          />
          {certificateFile && (
            <p style={{ fontSize: "12px", color: "#166534", marginTop: "-10px", marginBottom: "14px" }}>
              📎 {certificateFile.name}
            </p>
          )}

          {/* ── Section: Location ── */}
          <p style={S.section}>📍 Location</p>

          <label style={S.label}>Full Address <Req /></label>
          <textarea
            style={{ ...S.input, height: "72px", resize: "vertical" }}
            name="address" value={form.address}
            onChange={handleChange} placeholder="Full address of the Gaushala" required
          />

          <label style={S.label}>Pincode <Req /></label>
          <input
            style={S.input} name="pincode" value={form.pincode}
            onChange={handleChange} placeholder="6-digit pincode"
            maxLength={6} required
          />
          <p style={{ fontSize: "11px", color: "#78716c", marginTop: "-10px", marginBottom: "14px" }}>
            📡 Coordinates will be auto-detected from your pincode for the map.
          </p>

          {/* ── Section: Contact & Admin ── */}
          <p style={S.section}>👤 Contact & Admin</p>

          <label style={S.label}>Contact Number <Req /></label>
          <input
            style={S.input} name="contactNumber" value={form.contactNumber}
            onChange={handleChange} placeholder="10-digit mobile number"
            maxLength={10} required
          />

          <label style={S.label}>Email ID <Req /></label>
          <input
            style={S.input} type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="admin@yourgaushala.com" required
          />

          <label style={S.label}>Admin Name <Req /></label>
          <input
            style={S.input} name="adminName" value={form.adminName}
            onChange={handleChange} placeholder="Full name of the Gaushala admin" required
          />

          {/* ── Section: Account ── */}
          <p style={S.section}>🔐 Login Credentials</p>

          <label style={S.label}>Create Password <Req /></label>
          <input
            style={S.input}
            type={showPass ? "text" : "password"}
            name="password" value={form.password}
            onChange={handleChange} placeholder="Min 6 characters" required
          />
          <label style={{ ...S.label, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "16px" }}>
            <input type="checkbox" checked={showPass} onChange={() => setShowPass(!showPass)} style={{ width: "auto" }} />
            Show password
          </label>

          {/* Error */}
          {error && (
            <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "12px", background: "#fef2f2", padding: "10px 14px", borderRadius: "8px", border: "1px solid #fecaca" }}>
              ⚠️ {error}
            </p>
          )}

          <button type="submit" style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          <p
            style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#78716c", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </p>
        </form>
      </div>
    </div>
  );
}

// Small required star component
const Req = () => <span style={{ color: "red" }}>*</span>;

const S = {
  page:    { minHeight: "100vh", background: "linear-gradient(135deg, #f0fdf4, #fafaf9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "DM Sans, sans-serif" },
  card:    { background: "white", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 60px rgba(0,0,0,0.10)" },
  title:   { fontSize: "1.5rem", fontWeight: "700", color: "#1a4731", fontFamily: "Playfair Display, serif", margin: "8px 0 4px" },
  section: { fontSize: "12px", fontWeight: "700", color: "#1a4731", textTransform: "uppercase", letterSpacing: "0.08em", background: "#f0fdf4", padding: "6px 12px", borderRadius: "8px", marginBottom: "14px", borderLeft: "3px solid #16a34a" },
  label:   { display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" },
  input:   { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "13px", marginBottom: "14px", boxSizing: "border-box", fontFamily: "inherit" },
  btn:     { width: "100%", padding: "12px", background: "#1a4731", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" },
};

export default ApplyGaushala;

/*
 ─────────────────────────────────────────────────────────────────────
  BACKEND CHANGES NEEDED in your gaushala-requests route:
 ─────────────────────────────────────────────────────────────────────

  1. Install multer:  npm install multer

  2. In your route file (e.g. routes/gaushalaRequests.js):

     const multer  = require("multer");
     const upload  = multer({ dest: "uploads/certificates/" });

     router.post("/", upload.single("certificateFile"), async (req, res) => {
       try {
         const { kosalaName, address, pincode, registrationNumber,
                 contactNumber, email, adminName, password, lat, lon } = req.body;

         const newRequest = new GaushalaRequest({
           kosalaName, location: address, pincode,
           registrationNumber, contactNumber, email,
           adminName, password,
           certificateFile: req.file?.path || null,
           lat: lat ? parseFloat(lat) : null,
           lon: lon ? parseFloat(lon) : null,
         });

         await newRequest.save();
         res.status(201).json({ message: "Application submitted." });
       } catch (err) {
         res.status(500).json({ message: err.message });
       }
     });

  3. Add these fields to GaushalaRequest schema:
     registrationNumber: { type: String, default: null },
     contactNumber:      { type: String, default: null },
     certificateFile:    { type: String, default: null },
 ─────────────────────────────────────────────────────────────────────
*/
