import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Use:
//   <ProtectedRoute>...</ProtectedRoute>                      -> bas login chahiye
//   <ProtectedRoute roles={["admin"]}>...</ProtectedRoute>    -> sirf admin
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-gray-500 text-center">Loading...</div>;
  }

  // Login nahi hai to /login bhejo (login ke baad wapas yahin aayega)
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Login hai par role allowed nahi hai
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}