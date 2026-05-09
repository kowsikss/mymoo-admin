// import { useEffect, useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import RoleSidebar from "../components/RoleSidebar";
// import Navbar from "../components/Navbar";
// import axios from "axios";

// function AddCattleInfo() {
//   const navigate  = useNavigate();
//   const kosalaId  = localStorage.getItem("kosalaId");

//   const [cows,    setCows]    = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form,    setForm]    = useState({
//     cowId: "", inseminationDate: "", strawDetails: "",
//     pregnancyDate: "", pregnancyStatus: "", lastCalvingDate: "",
//     gestationDate: "", trialDate: "", trialCount: "",
//     calvingTime: "", parturitionDate: "", calfStatus: "",
//     calfSex: "", milkYield: "",
//   });

//   const fetchCows = async () => {
//     try {
//       const res = await apiClient.get(
//         `/api/cows/kosala/${kosalaId}`
//       );
//       setCows(res.data);
//     } catch (err) {
//       console.error("Error fetching cows:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCows();
//   }, []);

//   const role = localStorage.getItem("role");
//   if (role !== "doctor" && role !== "kosala-admin") {
//     return <Navigate to="/" />;
//   }

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.cowId) { alert("Please select a cow"); return; }

//     try {
//       setLoading(true);
//       await apiClient.post("/api/cattle", { ...form, kosalaId });
//       alert("Cattle Info Saved Successfully!");
//       if (role === "kosala-admin") navigate("/kosala-admin-dashboard");
//       else navigate("/doctor-dashboard");
//     } catch (err) {
//       console.error("Error saving cattle info:", err);
//       alert("Error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="layout">
//       <RoleSidebar />
//       <div className="main">
//         <Navbar />

//         <h2>Cattle Information</h2>
//         <p style={{ color: "var(--text-secondary)", marginTop: "-16px", marginBottom: "24px", fontSize: "13px" }}>
//           All mandatory fields marked with *
//         </p>

//         <form className="form-box" onSubmit={handleSubmit}>

//           <label>Select Cow <span style={{ color: "red" }}>*</span></label>
//           <select name="cowId" value={form.cowId} onChange={handleChange} required>
//             <option value="">-- Select Cow --</option>
//             {cows.map((c) => (
//               <option key={c._id} value={c.cowId}>{c.cowId}</option>
//             ))}
//           </select>

//           <label>Date of Insemination <span style={{ color: "red" }}>*</span></label>
//           <input type="date" name="inseminationDate" value={form.inseminationDate} onChange={handleChange} required />

//           <label>Straw Details <span style={{ color: "red" }}>*</span></label>
//           <input name="strawDetails" value={form.strawDetails} onChange={handleChange} placeholder="Enter straw details" required />

//           <label>Date of Pregnancy <span style={{ color: "red" }}>*</span></label>
//           <input type="date" name="pregnancyDate" value={form.pregnancyDate} onChange={handleChange} required />

//           <label>Pregnancy Status <span style={{ color: "red" }}>*</span></label>
//           <select name="pregnancyStatus" value={form.pregnancyStatus} onChange={handleChange} required>
//             <option value="">-- Select Status --</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//             <option value="Aborted">Aborted</option>
//           </select>

//           <label>Date of Last Calving <span style={{ color: "red" }}>*</span></label>
//           <input type="date" name="lastCalvingDate" value={form.lastCalvingDate} onChange={handleChange} required />

//           <label>Gestation Period Date <span style={{ color: "red" }}>*</span></label>
//           <input type="date" name="gestationDate" value={form.gestationDate} onChange={handleChange} required />

//           <label>Trial Techniques — Date <span style={{ color: "red" }}>*</span></label>
//           <input type="date" name="trialDate" value={form.trialDate} onChange={handleChange} required />

//           <label>Trial Techniques — Number of Trials <span style={{ color: "red" }}>*</span></label>
//           <select name="trialCount" value={form.trialCount} onChange={handleChange} required>
//             <option value="">-- Select Trial Count --</option>
//             {[1,2,3,4,5,6,7,8,9,10].map((n) => (
//               <option key={n} value={n}>{n}</option>
//             ))}
//           </select>

//           <label>Calving Time (Number of Calvings) <span style={{ color: "red" }}>*</span></label>
//           <select name="calvingTime" value={form.calvingTime} onChange={handleChange} required>
//             <option value="">-- Select --</option>
//             {[1,2,3,4,5,6,7,8,9,10].map((n) => (
//               <option key={n} value={n}>{n}</option>
//             ))}
//           </select>

//           <label>Date of Parturition <span style={{ color: "red" }}>*</span></label>
//           <input type="date" name="parturitionDate" value={form.parturitionDate} onChange={handleChange} required />

//           <label>Calf Birth Status <span style={{ color: "red" }}>*</span></label>
//           <select name="calfStatus" value={form.calfStatus} onChange={handleChange} required>
//             <option value="">-- Select Status --</option>
//             <option value="Alive">Alive</option>
//             <option value="Dead">Dead</option>
//           </select>

//           {form.calfStatus === "Alive" && (
//             <>
//               <label>Sex of the Calf <span style={{ color: "red" }}>*</span></label>
//               <select name="calfSex" value={form.calfSex} onChange={handleChange} required>
//                 <option value="">-- Select Sex --</option>
//                 <option value="Cow Heifer">Cow Heifer</option>
//                 <option value="Bull Calf">Bull Calf</option>
//               </select>
//             </>
//           )}

//           <label>Milk Yield Per Lactation (Litres / 300 days) <span style={{ color: "red" }}>*</span></label>
//           <input type="number" name="milkYield" value={form.milkYield}
//             onChange={handleChange} placeholder="Enter average litres per 300-day lactation" min="0" required />

//           <button type="submit" disabled={loading}>
//             {loading ? "Saving..." : "Submit"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddCattleInfo;
// export default AddCattleInfo;
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import RoleSidebar from "../components/RoleSidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function AddCattleInfo() {
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");

  const [cows,    setCows]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({
    cowId: "", tagNumber: "", inseminationDate: "", strawDetails: "",
    pregnancyDate: "", pregnancyStatus: "", lastCalvingDate: "",
    gestationDate: "", trialDate: "", trialCount: "",
    calvingTime: "", parturitionDate: "", calfStatus: "",
    calfSex: "", birthDate: "", milkYield: "",
  });

  const fetchCows = async () => {
    try {
      const res = await apiClient.get(`/api/cows/kosala/${kosalaId}`);
      setCows(res.data);
    } catch (err) {
      console.error("Error fetching cows:", err);
    }
  };

  useEffect(() => { fetchCows(); }, []);

  const role = localStorage.getItem("role");
  if (role !== "doctor" && role !== "kosala-admin") return <Navigate to="/" />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ When RFID tag is selected, auto-fill cowId too
  const handleTagSelect = (e) => {
    const selectedTag = e.target.value;
    const selectedCow = cows.find((c) => c.tagNumber === selectedTag);
    setForm({
      ...form,
      tagNumber: selectedTag,
      cowId: selectedCow ? selectedCow.cowId : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tagNumber) { alert("Please select an RFID Tag Number"); return; }

    try {
      setLoading(true);
      await apiClient.post("/api/cattle", { ...form, kosalaId });
      alert("Cattle Info Saved Successfully!");
      if (role === "kosala-admin") navigate("/kosala-admin-dashboard");
      else navigate("/doctor-dashboard");
    } catch (err) {
      console.error("Error saving cattle info:", err);
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <RoleSidebar />
      <div className="main">
        <Navbar />
        <h2>Cattle Information</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "-16px", marginBottom: "24px", fontSize: "13px" }}>
          All mandatory fields marked with *
        </p>

        <form className="form-box" onSubmit={handleSubmit}>

          {/* ✅ RFID TAG DROPDOWN */}
          <label>RFID Tag Number <span style={{ color: "red" }}>*</span></label>
          <select name="tagNumber" value={form.tagNumber} onChange={handleTagSelect} required>
            <option value="">-- Select RFID Tag Number --</option>
            {cows.length === 0 ? (
              <option disabled>No cows found</option>
            ) : (
              cows.map((c) => (
                <option key={c._id} value={c.tagNumber}>
                  {c.tagNumber} — {c.cowId} ({c.type === "cow" ? "🐄 Cow" : "🐂 Bull"})
                </option>
              ))
            )}
          </select>

          {/* Show selected cow info */}
          {form.cowId && (
            <p style={{ fontSize: "12px", color: "var(--accent-green)", marginTop: "-8px", marginBottom: "8px" }}>
              ✓ Linked to {form.cowId}
            </p>
          )}

          <label>Date of Insemination <span style={{ color: "red" }}>*</span></label>
          <input type="date" name="inseminationDate" value={form.inseminationDate} onChange={handleChange} required />

          <label>Straw Details <span style={{ color: "red" }}>*</span></label>
          <input name="strawDetails" value={form.strawDetails} onChange={handleChange} placeholder="Enter straw details" required />

          <label>Date of Pregnancy <span style={{ color: "red" }}>*</span></label>
          <input type="date" name="pregnancyDate" value={form.pregnancyDate} onChange={handleChange} required />

          <label>Pregnancy Status <span style={{ color: "red" }}>*</span></label>
          <select name="pregnancyStatus" value={form.pregnancyStatus} onChange={handleChange} required>
            <option value="">-- Select Status --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Aborted">Aborted</option>
          </select>

          <label>Date of Last Calving <span style={{ color: "red" }}>*</span></label>
          <input type="date" name="lastCalvingDate" value={form.lastCalvingDate} onChange={handleChange} required />

          <label>Gestation Period Date <span style={{ color: "red" }}>*</span></label>
          <input type="date" name="gestationDate" value={form.gestationDate} onChange={handleChange} required />

          <label>Trial Techniques — Date <span style={{ color: "red" }}>*</span></label>
          <input type="date" name="trialDate" value={form.trialDate} onChange={handleChange} required />

          <label>Trial Techniques — Number of Trials <span style={{ color: "red" }}>*</span></label>
          <select name="trialCount" value={form.trialCount} onChange={handleChange} required>
            <option value="">-- Select Trial Count --</option>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          <label>Calving Time (Number of Calvings) <span style={{ color: "red" }}>*</span></label>
          <select name="calvingTime" value={form.calvingTime} onChange={handleChange} required>
            <option value="">-- Select --</option>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          <label>Date of Parturition <span style={{ color: "red" }}>*</span></label>
          <input type="date" name="parturitionDate" value={form.parturitionDate} onChange={handleChange} required />

          <label>Calf Birth Status <span style={{ color: "red" }}>*</span></label>
          <select name="calfStatus" value={form.calfStatus} onChange={handleChange} required>
            <option value="">-- Select Status --</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
          </select>

          {form.calfStatus === "Alive" && (
            <>
              <label>Sex of the Calf <span style={{ color: "red" }}>*</span></label>
              <select name="calfSex" value={form.calfSex} onChange={handleChange} required>
                <option value="">-- Select Sex --</option>
                <option value="Cow Heifer">Cow Heifer</option>
                <option value="Bull Calf">Bull Calf</option>
              </select>

              <label>Birth Date <span style={{ color: "red" }}>*</span></label>
              <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
            </>
          )}

          <label>Milk Yield Per Lactation (Litres / 300 days) <span style={{ color: "red" }}>*</span></label>
          <input type="number" name="milkYield" value={form.milkYield}
            onChange={handleChange} placeholder="Enter average litres per 300-day lactation" min="0" required />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddCattleInfo;