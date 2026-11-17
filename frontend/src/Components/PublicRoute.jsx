import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/roles";

// Guest, customer aur admin ke liye khula hai, par blockRoles wale roles ko
// unke apne home (vendor -> dashboard) par bhej deta hai.
//
// Use 1 (wrapper):   <PublicRoute><Home /></PublicRoute>
// Use 2 (layout):    <Route element={<PublicRoute />}> ...bahut saare routes... </Route>
export default function PublicRoute({ children, blockRoles = ["vendor"] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-gray-500 text-center">Loading...</div>;
  }

  if (user && blockRoles.includes(user.role)) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return children ?? <Outlet />;
}