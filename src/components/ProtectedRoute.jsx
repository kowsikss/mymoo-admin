import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

  if (userRole !== role) {
    // Redirect to appropriate login
    if (role === "kosala-admin") return <Navigate to="/kosala-admin-login" />;
    if (role === "doctor")       return <Navigate to="/" />;
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;