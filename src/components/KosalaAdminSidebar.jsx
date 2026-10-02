import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./KosalaAdminSidebar.css";

function KosalaAdminSidebar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("kosalaAdminName") || "Admin";
  const [menuOpen, setMenuOpen] = useState(true);

  const logout = () => {
    localStorage.clear();
    navigate("/kosala-admin-login");
  };

  return (
    <div className="sidebar kosala-admin-sidebar">
      <h2>🐄 Gaushala Admin</h2>
      <p style={{ color: "var(--accent-green)", fontSize: "13px", marginBottom: "20px" }}>
        {name}
      </p>
      <button
        type="button"
        className="kosala-admin-sidebar__menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="kosala-admin-sidebar-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>Menu</span>
        <span className="kosala-admin-sidebar__chevron" aria-hidden="true">
          {menuOpen ? "−" : "+"}
        </span>
      </button>
      {menuOpen && (
        <ul id="kosala-admin-sidebar-menu" className="kosala-admin-sidebar__menu">
          <li><Link to="/kosala-admin-dashboard">📊 Dashboard</Link></li>
          <li><Link to="/kosala-admin/add-cow">➕ Add Cow</Link></li>
          <li><Link to="/kosala-admin/manage-cow">🐄 Manage Cows</Link></li>
          <li><Link to="/kosala-admin/cow-info">📋 Cow Info</Link></li>
          <li><Link to="/kosala-admin/add-money">💰 Add Milk</Link></li>
          <li><Link to="/kosala-admin/manage-money">📈 Manage Milk Money</Link></li>
          <li><Link to="/kosala-admin/add-doctor">👨‍⚕️ Add Doctor</Link></li>
          <li><Link to="/kosala-admin/doctors-list">👨‍⚕️ Manage Doctors</Link></li>
          <li><Link to="/kosala-admin/add-rescued-animal">➕ Add Rescued Animal</Link></li>
          <li><Link to="/kosala-admin/rescued-animals">🏥 Rescued Animals</Link></li>
          <li><Link to="/kosala-admin/add-inventory">📦 Add Inventory</Link></li>
          <li><Link to="/kosala-admin/manage-inventory">📋 Manage Inventory</Link></li>
          <li><Link to="/kosala-admin/add-cattle-info">🐮 Add Cattle Info</Link></li>
          <li><Link to="/kosala-admin/manage-cattle-info">📋 Manage Cattle Info</Link></li>
        </ul>
      )}
      <button
        className="kosala-admin-sidebar__logout"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default KosalaAdminSidebar;