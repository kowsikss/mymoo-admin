import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function DoctorSidebarGroup({ title, children }) {
  const [open, setOpen] = useState(false);
  const groupId = `doctor-menu-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <li className="doctor-sidebar__group">
      <button
        type="button"
        className="doctor-sidebar__group-toggle"
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

function Sidebar() {
  const role = localStorage.getItem("role");

  if (role === "doctor") {
    return (
      <div className="sidebar doctor-sidebar">
        <h2>🐄 E-Gaushala</h2>
        <ul className="doctor-sidebar__menu">
          <li><Link to="/doctor-dashboard">📊 Dashboard</Link></li>
          <DoctorSidebarGroup title="Cow">
            <li><Link to="/doctor-manage-cow">🐄 Manage Cows</Link></li>
          </DoctorSidebarGroup>
          <DoctorSidebarGroup title="Health Records">
            <li><Link to="/add-deworming">➕ Add Deworming</Link></li>
            <li><Link to="/manage-deworming">📋 Manage Deworming</Link></li>
            <li><Link to="/add-vaccination">➕ Add Vaccination</Link></li>
            <li><Link to="/manage-vaccination">📋 Manage Vaccination</Link></li>
            <li><Link to="/add-immunization">➕ Add Immunization</Link></li>
            <li><Link to="/manage-immunization">📋 Manage Immunization</Link></li>
            <li><Link to="/add-reproduction">➕ Add Reproduction</Link></li>
            <li><Link to="/manage-reproduction">📋 Manage Reproduction</Link></li>
          </DoctorSidebarGroup>
          <DoctorSidebarGroup title="Rescued Animals">
            <li><Link to="/add-rescued-animal">➕ Add Rescued Animal</Link></li>
            <li><Link to="/manage-rescued-animal">📋 View Rescued Animals</Link></li>
          </DoctorSidebarGroup>
          <DoctorSidebarGroup title="Inventory">
            <li><Link to="/add-inventory">➕ Add Inventory</Link></li>
            <li><Link to="/manage-inventory">📦 Manage Inventory</Link></li>
          </DoctorSidebarGroup>
          <DoctorSidebarGroup title="Cattle Info">
            <li><Link to="/add-cattle-info">➕ Add Cattle Info</Link></li>
            <li><Link to="/manage-cattle-info">📋 Manage Cattle Info</Link></li>
          </DoctorSidebarGroup>
        </ul>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <h2>MYMOO</h2>

      <ul>

        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <li><Link to="/admin-dashboard">Dashboard</Link></li>
            <li><Link to="/add-gaushala">Add Gaushala</Link></li>
            <li><Link to="/add-doctor">Add Doctor</Link></li>
            <li><Link to="/add-breed">Add Breed</Link></li>
          </>
        )}

      </ul>
    </div>
  );
}

export default Sidebar;