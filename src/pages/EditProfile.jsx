import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";

function EditProfile() {
  const [form, setForm] = useState({
    username: "",
    address: "",
    city: "",
    gender: "",
    email: ""
  });

  // ✅ Load profile from DB
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get("http://localhost:5000/api/profile");
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put("http://localhost:5000/api/profile", form);

    alert("✅ Profile Updated Successfully");

    // update navbar name
    localStorage.setItem("username", form.username);
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <h2>Edit Profile</h2>

        <form className="form-box" onSubmit={handleSubmit}>

          <label>User Name</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <label>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label>User Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <button type="submit" className="update-btn">
            Update
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditProfile;