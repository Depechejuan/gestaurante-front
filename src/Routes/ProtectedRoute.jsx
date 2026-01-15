import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";

export default function ProtectedRoute({ role }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/" replace />;
    console.log(role);

    const roleMap = {
        0: "Administrador",
        1: "Camarero",
        2: "Cocinero"
    };
    console.log(role);
    const userRole = roleMap[user.tipo];

    let canAccess = false;
    for (let i = 0; i < role.length; i++) {
        if (role[i] == userRole) {
            canAccess = true;
            console.log("Access: True");
            return <Outlet />;
        }
    }

    if (!canAccess) {
        console.log("Can't Access");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
