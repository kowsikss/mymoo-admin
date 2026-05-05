// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function AdminLogin() {
//   const [form, setForm] = useState({});
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (form.username === "admin" && form.password === "admin123") {
//       localStorage.setItem("role", "admin");
//       navigate("/admin-dashboard");
//     } else {
//       alert("Invalid Admin Credentials");
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="login-box">
//         <h2>Admin Login</h2>

//         <input
//           placeholder="Username"
//           onChange={(e) =>
//             setForm({ ...form, username: e.target.value })
//           }
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) =>
//             setForm({ ...form, password: e.target.value })
//           }
//         />

//         <button type="submit">Login</button>
//       </form>
      
// <p
//   style={{ marginTop: "10px", cursor: "pointer", color: "#3498db", fontSize: "13px", textAlign: "center" }}
//   onClick={() => navigate("/kosala-admin-login")}
// >
//   Login as Kosala Admin
// </p>
//     </div>
    
//   );
// }

// export default AdminLogin;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// In your component file
import './styles/login.css';

function AdminLogin() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.username === "admin" && form.password === "admin123") {
      localStorage.setItem("role", "admin");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">
        <h2>Admin Login</h2>

        <input
          placeholder="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit">Login</button>
        
        <div className="kosala-link">
          <a onClick={() => navigate("/kosala-admin-login")}>
            Login as Gaushala Admin
          </a>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;