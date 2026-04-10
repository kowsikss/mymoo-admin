import { Link, useNavigate } from "react-router-dom";

function KosalaAdminSidebar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("kosalaAdminName") || "Admin";

  const logout = () => {
    localStorage.clear();
    navigate("/kosala-admin-login");
  };

  return (
    <div className="sidebar">
      <h2>🐄 Kosala Admin</h2>
      <p style={{ color: "var(--accent-green)", fontSize: "13px", marginBottom: "20px" }}>
        {name}
      </p>
      <ul>
        <li><Link to="/kosala-admin-dashboard">📊 Dashboard</Link></li>
        <li><Link to="/kosala-admin/add-cow">➕ Add Cow</Link></li>
        <li><Link to="/kosala-admin/manage-cow">🐄 Manage Cows</Link></li>
        <li><Link to="/kosala-admin/cow-info">📋 Cow Info</Link></li>
        <li><Link to="/kosala-admin/rescued-animals">🏥 Rescued Animals</Link></li>
        <li><Link to="/kosala-admin/add-inventory">📦 Add Inventory</Link></li>
        <li><Link to="/kosala-admin/manage-inventory">📋 Manage Inventory</Link></li>
        <li><Link to="/kosala-admin/add-cattle-info">🐮 Add Cattle Info</Link></li>
        <li><Link to="/kosala-admin/manage-cattle-info">📋 Manage Cattle Info</Link></li>
      </ul>
      <button
        className="cancel-btn"
        onClick={logout}
        style={{ marginTop: "auto", width: "100%" }}
      >
        Logout
      </button>
    </div>
  );
}

export default KosalaAdminSidebar;