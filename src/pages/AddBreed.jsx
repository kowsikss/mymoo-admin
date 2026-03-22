import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState } from "react";

function AddBreed() {
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/breeds", form);
    alert("Breed Added");
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2>Add Breed</h2>

        <form className="form-box" onSubmit={handleSubmit}>
          <input name="name" placeholder="Breed Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
          <select onChange={(e)=>setForm({...form,type:e.target.value})}>
            <option value="">Select Type</option>
            <option value="cow">Cow</option>
            <option value="bull">Bull</option>
          </select>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddBreed;