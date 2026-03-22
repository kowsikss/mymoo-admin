import { Link } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");

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
          </>
        )}

        {/* ================= DOCTOR ================= */}
        {role === "doctor" && (
          <>
            <li><Link to="/doctor-dashboard">Dashboard</Link></li>

            <li><Link to="/add-deworming">Add Deworming</Link></li>
            <li><Link to="/manage-deworming">Manage Deworming</Link></li>

            <li><Link to="/add-vaccination">Add Vaccination</Link></li>
            <li><Link to="/manage-vaccination">Manage Vaccination</Link></li>

            <li><Link to="/add-immunization">Add Immunization</Link></li>
            <li><Link to="/manage-immunization">Manage Immunization</Link></li>

            {/* ✅ NEW MODULE */}
            <li><Link to="/add-reproduction">Reproduction</Link></li>
            <li><Link to="/add-cattle-info">Cattle Info</Link></li>

           <li>
  <Link to="/add-rescued-animal">🐄 Add Rescued Animal</Link>
</li>
<li>
  <Link to="/manage-rescued-animal">📋 Manage Rescued Animals</Link>
</li>
<li><Link to="/add-inventory">📦 Add Inventory</Link></li>
<li><Link to="/manage-inventory">📋 Manage Inventory</Link></li>
<li><Link to="/add-cattle-info">🐄 Add Cattle Info</Link></li>
<li><Link to="/manage-cattle-info">📋 Manage Cattle Info</Link></li>          </>
        )}

      </ul>
    </div>
  );
}

export default Sidebar;