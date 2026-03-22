import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddVaccination() {
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
    const res = await axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`);
    setCows(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const kosalaId = localStorage.getItem("kosalaId");
    await axios.post("http://localhost:5000/api/vaccination", { ...form, kosalaId });
    alert("Vaccination Added");
    navigate("/doctor-dashboard");
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Add Vaccination</h2>

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

          <label>Date Vaccinate</label>
          <input type="date" name="date" onChange={handleChange} />

          <label>Name of Vaccine</label>
          <input name="vaccine" onChange={handleChange} />

          <label>Dosage</label>
          <input name="dosage" onChange={handleChange} />

          <label>Vaccination Description</label>
          <textarea name="description" onChange={handleChange} />

          <button className="update-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddVaccination;