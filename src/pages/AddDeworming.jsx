import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddDeworming() {
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
    await axios.post("http://localhost:5000/api/deworming", { ...form, kosalaId });
    alert("Deworming Added");
    navigate("/doctor-dashboard");
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Add Deworming</h2>

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

          <label>Date of Deworming</label>
          <input type="date" name="date" onChange={handleChange} />

          <label>Name of Drug</label>
          <input name="drug" placeholder="Enter Name of Drug" onChange={handleChange} />

          <label>Dosage</label>
          <input name="dosage" placeholder="Enter Dosage" onChange={handleChange} />

          <label>Description</label>
          <textarea name="description" onChange={handleChange} />

          <button className="update-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddDeworming;
