import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./KosalaAdminSidebar.css";

function SidebarGroup({ title, children }) {
  const [open, setOpen] = useState(false);
  const groupId = `kosala-menu-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <li className="kosala-admin-sidebar__group">
      <button
        type="button"
        className="kosala-admin-sidebar__group-toggle"
        aria-expanded={open}
        aria-controls={groupId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{title}</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <ul id={groupId}>{children}</ul>}
    </li>
  );
}

function KosalaAdminSidebar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("kosalaAdminName") || "Admin";

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
      <ul className="kosala-admin-sidebar__menu">
          <li><Link to="/kosala-admin-dashboard">📊 Dashboard</Link></li>
          <SidebarGroup title="Cow">
            <li><Link to="/kosala-admin/add-cow">➕ Add Cow</Link></li>
            <li><Link to="/kosala-admin/manage-cow">🐄 Manage Cows</Link></li>
            <li><Link to="/kosala-admin/cow-info">📋 Cow Info</Link></li>
          </SidebarGroup>
          <SidebarGroup title="Milk">
            <li><Link to="/kosala-admin/add-money">💰 Add Milk</Link></li>
            <li><Link to="/kosala-admin/manage-money">📈 Manage Milk Money</Link></li>
          </SidebarGroup>
          <SidebarGroup title="Doctor">
            <li><Link to="/kosala-admin/add-doctor">👨‍⚕️ Add Doctor</Link></li>
            <li><Link to="/kosala-admin/doctors-list">👨‍⚕️ Manage Doctors</Link></li>
          </SidebarGroup>
          <SidebarGroup title="Rescued Animals">
            <li><Link to="/kosala-admin/add-rescued-animal">➕ Add Rescued Animal</Link></li>
            <li><Link to="/kosala-admin/rescued-animals">🏥 View Rescued Animals</Link></li>
          </SidebarGroup>
          <SidebarGroup title="Inventory">
            <li><Link to="/kosala-admin/add-inventory">📦 Add Inventory</Link></li>
            <li><Link to="/kosala-admin/manage-inventory">📋 Manage Inventory</Link></li>
          </SidebarGroup>
          <SidebarGroup title="Cattle Info">
            <li><Link to="/kosala-admin/add-cattle-info">🐮 Add Cattle Info</Link></li>
            <li><Link to="/kosala-admin/manage-cattle-info">📋 Manage Cattle Info</Link></li>
          </SidebarGroup>
      </ul>
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