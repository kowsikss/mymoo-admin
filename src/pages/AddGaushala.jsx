import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState } from "react";

function AddGaushala() {
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach(key =>
      formData.append(key, form[key])
    );

    formData.append("certificate", file);

    await axios.post(
      "http://localhost:5000/api/kosala",
      formData
    );

    alert("Gaushala Registered Successfully");
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2>Register Gaushala</h2>

        <form className="form-box" onSubmit={handleSubmit}>

          <input placeholder="Gaushala Name"
            onChange={(e)=>setForm({...form,name:e.target.value})} />

          <input placeholder="Address"
            onChange={(e)=>setForm({...form,address:e.target.value})} />

          <input type="number" placeholder="Pincode"
            onChange={(e)=>setForm({...form,pincode:e.target.value})} />

          <input placeholder="Registration Number"
            onChange={(e)=>setForm({...form,registrationNumber:e.target.value})} />

          <input placeholder="Contact Number"
            onChange={(e)=>setForm({...form,contactNumber:e.target.value})} />

          <input placeholder="Email"
            onChange={(e)=>setForm({...form,email:e.target.value})} />

          <label>Upload Incorporation Certificate (PDF)</label>
          <input type="file"
            accept=".pdf"
            onChange={(e)=>setFile(e.target.files[0])} />

          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddGaushala;