import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("User");

  const navigate = useNavigate();
  const dropdownRef = useRef();

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      setUsername("Admin");
    } else if (role === "doctor") {
      const doctorName = localStorage.getItem("doctorName");
      setUsername(doctorName || "Doctor");
    } else if (role === "kosala-admin") {                          // ✅ added
      const kosalaAdminName = localStorage.getItem("kosalaAdminName");
      setUsername(kosalaAdminName || "Kosala Admin");
    }
  }, []);

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    const role = localStorage.getItem("role");                     // ✅ read before clearing

    localStorage.clear();

    // ✅ redirect each role to their own login page
    if (role === "kosala-admin") {
      navigate("/kosala-admin-login");
    } else if (role === "doctor") {
      navigate("/doctor-login");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="navbar">
      <h3>🐄 Live Stock Monitoring System</h3>

      <div className="profile" ref={dropdownRef}>
        <span onClick={() => setOpen(!open)}>
          {username} ▼
        </span>

        {open && (
          <div className="dropdown">
            <p onClick={() => navigate("/edit-profile")}>My Profile</p>
            <p onClick={() => navigate("/change-password")}>Change Password</p>
            <p onClick={handleLogout}>Log Out</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;