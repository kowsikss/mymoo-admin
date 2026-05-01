// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function DoctorLogin() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     kosalaId: "",
//   });
//   const [gaushalas, setGaushalas] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchGaushalas();
//   }, []);

//   const fetchGaushalas = async () => {
//     try {
//       const res = await apiClient.get("/api/kosala");
//       setGaushalas(res.data);
//     } catch (err) {
//       console.error("Error fetching gaushalas:", err);
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.kosalaId) {
//       alert("Please select a Gaushala");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/api/doctor-auth/login",
//         form
//       );

//       localStorage.setItem("role", "doctor");
//       localStorage.setItem("doctorId", res.data._id);
//       localStorage.setItem("doctorName", res.data.name);
//       localStorage.setItem("kosalaId", res.data.kosalaId.toString());

//       navigate("/doctor-dashboard");
//     } catch (err) {
//       console.error("Login error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">

//         <h2>Doctor Login</h2>

//         <form onSubmit={handleSubmit}>

//           <label>Doctor Name</label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Enter your name"
//             required
//           />

//           <label>Email ID</label>
//           <input
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             required
//           />

//           <label>Password</label>
//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Enter password"
//             required
//           />

//           <label>Select Gaushala</label>
//           <select
//             name="kosalaId"
//             value={form.kosalaId}
//             onChange={handleChange}
//             required
//           >
//             <option value="">-- Select Gaushala --</option>
//             {gaushalas.map((g) => (
//               <option key={g._id} value={g._id}>
//                 {g.name}
//               </option>
//             ))}
//           </select>

//           <button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login as Doctor"}
//           </button>
//           <p
//   style={{ marginTop: "10px", cursor: "pointer", color: "#3498db" }}
//   onClick={() => navigate("/forgot-password")}
// >
//   Forgot Password?
// </p>

//         </form>

//         <p style={{ marginTop: "10px", cursor: "pointer", color: "#3498db" }}>
//           Forgot Password?
//         </p>

//       </div>
//     </div>
//   );
// }

// export default DoctorLogin;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
// In your component file
import './styles/login.css';

function DoctorLogin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    kosalaId: "",
  });
  const [gaushalas, setGaushalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGaushalas();
  }, []);

  const fetchGaushalas = async () => {
    try {
      const res = await apiClient.get("/api/kosala");
      setGaushalas(res.data);
    } catch (err) {
      console.error("Error fetching gaushalas:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kosalaId) {
      alert("Please select a Gaushala");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post(
        "/api/doctor-auth/login",
        form
      );

      localStorage.setItem("role", "doctor");
      localStorage.setItem("doctorId", res.data._id);
      localStorage.setItem("doctorName", res.data.name);
      localStorage.setItem("kosalaId", res.data.kosalaId.toString());

      navigate("/doctor-dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Doctor Login</h2>
        
        <form onSubmit={handleSubmit}>
          <label>Doctor Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Email ID</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          <label>Select Gaushala</label>
          <select
            name="kosalaId"
            value={form.kosalaId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Gaushala --</option>
            {gaushalas.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login as Doctor"}
          </button>
          
          <div className="forgot-password">
            <a onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorLogin;