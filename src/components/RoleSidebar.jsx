// src/components/RoleSidebar.jsx
import Sidebar from "./Sidebar";
import KosalaAdminSidebar from "./KosalaAdminSidebar";

function RoleSidebar() {
  const role = localStorage.getItem("role");
  if (role === "kosala-admin") return <KosalaAdminSidebar />;
  return <Sidebar />;
}

export default RoleSidebar;
