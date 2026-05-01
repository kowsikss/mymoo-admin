import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddImmunization() {
  if (localStorage.getItem("role") !== "doctor") {
  return <Navigate to="/" />;
}
  const [cows, setCows] = useState([]);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCows();
  }, []);

  const fetchCows = async () => {
    const kosalaId = localStorage.getItem("kosalaId");
    const res = await apiClient.get(`/api/cows/kosala/${kosalaId}`);
    setCows(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const kosalaId = localStorage.getItem("kosalaId");
    await apiClient.post("/api/immunization", { ...form, kosalaId });
    alert("Immunization Added");
    navigate("/doctor-dashboard");
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Add Immunization</h2>

        <form className="form-box" onSubmit={handleSubmit}>

          <label>Cow ID</label>
          <select name="cowId" onChange={handleChange}>
            <option>Select Cow</option>
            {cows.map(cow => (
              <option key={cow._id} value={cow.cowId || cow._id}>
                {cow.cowId || cow._id}
              </option>
            ))}
          </select>

          <label>Date of Immune</label>
          <input type="date" name="date" onChange={handleChange} />

          <label>Name of Drug</label>
          <input name="drug" onChange={handleChange} />

          <label>Dosage</label>
          <input name="dosage" onChange={handleChange} />

          <label>Description</label>
          <textarea name="description" onChange={handleChange} />

          <button className="update-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddImmunization;