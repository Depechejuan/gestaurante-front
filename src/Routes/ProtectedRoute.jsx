import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";

export default function ProtectedRoute({ role }) {
    const { user, loading, roleName } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/" replace />

    if (!role.includes(roleName)) return <Navigate to="/" replace />;

    return <Outlet />;
}
