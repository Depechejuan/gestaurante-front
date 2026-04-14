import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";

export default function ProtectedRoute({ role }) {
    const location = useLocation();
    const { user, loading, roleName, hasToken } = useAuth();

    if (loading && hasToken && !roleName) return null;

    if (!hasToken)
        return <Navigate to="/login" replace state={{ redirectTo: `${location.pathname}${location.search}` }} />;

    if (!role.includes(roleName))
        return <Navigate to="/" replace />;

    return <Outlet />;
}
