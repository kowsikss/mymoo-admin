import { useState } from "react";
import apiClient from "../api/client";
import { useNavigate } from "react-router-dom";

function RegisterDoctor() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiClient.post("/api/auth/register", form);

    alert("Doctor Registered Successfully");
    navigate("/");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">
        <h2>Doctor Registration</h2>

        <input name="name" placeholder="Doctor Name" onChange={handleChange} />
        <input name="qualification" placeholder="Qualification" onChange={handleChange} />
        <input name="registrationNumber" placeholder="Registration No" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterDoctor;