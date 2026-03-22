import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function AddCattleInfo() {
  const [cows, setCows] = useState([]);
  const [form, setForm] = useState({
    cowId: "",
    inseminationDate: "",
    strawDetails: "",
    pregnancyDate: "",
    pregnancyStatus: "",
    lastCalvingDate: "",
    gestationDate: "",
    trialDate: "",        // ✅ NEW: trial technique date
    trialCount: "",       // ✅ dropdown 1-10
    calvingTime: "",      // ✅ dropdown 1-10
    parturitionDate: "",
    calfStatus: "",
    calfSex: "",          // ✅ Cow Heifer / Bull Calf
    milkYield: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");

  useEffect(() => {
    fetchCows();
  }, []);

  if (localStorage.getItem("role") !== "doctor") {
    return <Navigate to="/" />;
  }

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.cowId) {
      alert("Please select a cow");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/cattle", {
        ...form,
        kosalaId,
      });
      alert("Cattle Info Saved Successfully!");
      navigate("/doctor-dashboard");
    } catch (err) {
      console.error("Error saving cattle info:", err);
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Cattle Information</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "-16px", marginBottom: "24px", fontSize: "13px" }}>
          Fill in the cattle details — all mandatory fields are marked with *
        </p>

        <form className="form-box" onSubmit={handleSubmit}>

          {/* COW SELECTION */}
          <label>Select Cow <span style={{ color: "red" }}>*</span></label>
          <select name="cowId" value={form.cowId} onChange={handleChange} required>
            <option value="">-- Select Cow --</option>
            {cows.map((c) => (
              <option key={c._id} value={c.cowId}>
                {c.cowId}
              </option>
            ))}
          </select>

          {/* DATE OF INSEMINATION */}
          <label>Date of Insemination <span style={{ color: "red" }}>*</span></label>
          <input
            type="date"
            name="inseminationDate"
            value={form.inseminationDate}
            onChange={handleChange}
            required
          />

          {/* STRAW DETAILS */}
          <label>Straw Details <span style={{ color: "red" }}>*</span></label>
          <input
            name="strawDetails"
            value={form.strawDetails}
            onChange={handleChange}
            placeholder="Enter straw details (alphanumeric)"
            required
          />

          {/* DATE OF PREGNANCY */}
          <label>Date of Pregnancy <span style={{ color: "red" }}>*</span></label>
          <input
            type="date"
            name="pregnancyDate"
            value={form.pregnancyDate}
            onChange={handleChange}
            required
          />

          {/* PREGNANCY STATUS */}
          <label>Pregnancy Status of Cow <span style={{ color: "red" }}>*</span></label>
          <select
            name="pregnancyStatus"
            value={form.pregnancyStatus}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Aborted">Aborted</option>
          </select>

          {/* DATE OF LAST CALVING */}
          <label>Date of Last Calving <span style={{ color: "red" }}>*</span></label>
          <input
            type="date"
            name="lastCalvingDate"
            value={form.lastCalvingDate}
            onChange={handleChange}
            required
          />

          {/* GESTATION PERIOD */}
          <label>Gestation Period Date <span style={{ color: "red" }}>*</span></label>
          <input
            type="date"
            name="gestationDate"
            value={form.gestationDate}
            onChange={handleChange}
            required
          />

          {/* TRIAL TECHNIQUES — date + count dropdown */}
          <label>Trial Techniques — Date <span style={{ color: "red" }}>*</span></label>
          <input
            type="date"
            name="trialDate"
            value={form.trialDate}
            onChange={handleChange}
            required
          />

          <label>Trial Techniques — Number of Trials <span style={{ color: "red" }}>*</span></label>
          <select
            name="trialCount"
            value={form.trialCount}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Trial Count --</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* CALVING TIME — dropdown 1-10 */}
          <label>Calving Time (Number of Calvings) <span style={{ color: "red" }}>*</span></label>
          <select
            name="calvingTime"
            value={form.calvingTime}
            onChange={handleChange}
            required
          >
            <option value="">-- Select --</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* DATE OF PARTURITION */}
          <label>Date of Parturition <span style={{ color: "red" }}>*</span></label>
          <input
            type="date"
            name="parturitionDate"
            value={form.parturitionDate}
            onChange={handleChange}
            required
          />

          {/* CALF BIRTH STATUS */}
          <label>Calf Birth Status <span style={{ color: "red" }}>*</span></label>
          <select
            name="calfStatus"
            value={form.calfStatus}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
          </select>

          {/* SEX OF THE CALF — only show if Alive */}
          {form.calfStatus === "Alive" && (
            <>
              <label>Sex of the Calf <span style={{ color: "red" }}>*</span></label>
              <select
                name="calfSex"
                value={form.calfSex}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Sex --</option>
                <option value="Cow Heifer">Cow Heifer</option>
                <option value="Bull Calf">Bull Calf</option>
              </select>
            </>
          )}

          {/* MILK YIELD PER LACTATION */}
          <label>
            Milk Yield Per Lactation (Litres / 300 days){" "}
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            name="milkYield"
            value={form.milkYield}
            onChange={handleChange}
            placeholder="Enter average litres per 300-day lactation"
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

export default AddCattleInfo;