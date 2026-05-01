import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddReproduction() {

  const [form, setForm] = useState({});
  const [cows, setCows] = useState([]);
  const navigate = useNavigate();

  const kosalaId = localStorage.getItem("kosalaId");

  useEffect(() => {
    fetchCows();
  }, []);

  const fetchCows = async () => {
    const res = await apiClient.get(
      `/api/cows/kosala/${kosalaId}`
    );
    setCows(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiClient.post(
      "/api/reproduction",
      { ...form, kosalaId }
    );

    alert("Reproduction Data Saved");
    navigate("/doctor-dashboard");
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>Reproduction Details</h2>

        <form className="form-box" onSubmit={handleSubmit}>

          <select onChange={(e)=>setForm({...form,cowId:e.target.value})}>
            <option>Select Cow</option>
            {cows.map(c=>(
              <option key={c._id} value={c.cowId || c._id}>
                {c.cowId}
              </option>
            ))}
          </select>

          <label>Date of Insemination</label>
          <input type="date" onChange={(e)=>setForm({...form,inseminationDate:e.target.value})}/>

          <input placeholder="Straw Details"
            onChange={(e)=>setForm({...form,strawDetails:e.target.value})}/>

          <label>Pregnancy Date</label>
          <input type="date"
            onChange={(e)=>setForm({...form,pregnancyDate:e.target.value})}/>

          <select onChange={(e)=>setForm({...form,pregnancyStatus:e.target.value})}>
            <option>Pregnancy Status</option>
            <option>Yes</option>
            <option>No</option>
            <option>Aborted</option>
          </select>

          <label>Last Calving Date</label>
          <input type="date"
            onChange={(e)=>setForm({...form,lastCalvingDate:e.target.value})}/>

          <label>Gestation Date</label>
          <input type="date"
            onChange={(e)=>setForm({...form,gestationDate:e.target.value})}/>

          <input placeholder="Trial Count"
            onChange={(e)=>setForm({...form,trialCount:e.target.value})}/>

          <input placeholder="Calving Time"
            onChange={(e)=>setForm({...form,calvingTime:e.target.value})}/>

          <label>Parturition Date</label>
          <input type="date"
            onChange={(e)=>setForm({...form,parturitionDate:e.target.value})}/>

          <select onChange={(e)=>setForm({...form,calfStatus:e.target.value})}>
            <option>Calf Status</option>
            <option>Alive</option>
            <option>Dead</option>
          </select>

          <select onChange={(e)=>setForm({...form,calfSex:e.target.value})}>
            <option>Calf Sex</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input placeholder="Milk Yield (Litres)"
            onChange={(e)=>setForm({...form,milkYield:e.target.value})}/>

          <button>Submit</button>

        </form>
      </div>
    </div>
  );
}

export default AddReproduction;