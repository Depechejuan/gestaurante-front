import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";

export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/" replace />;
    console.log(role);

    const roleMap = {
        0: "Administrador",
        1: "Camarero",
        2: "Cocinero"
    };

    const userRole = roleMap[user.tipo];

    if (!role.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
