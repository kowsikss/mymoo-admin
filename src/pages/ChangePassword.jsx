import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import { useState } from "react";

function ChangePassword() {
  const [password, setPassword] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  const handleChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.newPass !== password.confirm) {
      alert("Passwords do not match!");
      return;
    }

    alert("Password Changed Successfully");
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <h2>Change Password</h2>

        <form className="form-box" onSubmit={handleSubmit}>

          <label>Current Password</label>
          <input
            type="password"
            name="current"
            placeholder="Enter Current Password"
            onChange={handleChange}
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPass"
            placeholder="New Password"
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <button type="submit" className="update-btn">
            Submit
          </button>

        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
