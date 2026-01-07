import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../Auth/Auth-Context.jsx'
import deleteToken from "../services/delete-token.js";

export default function DashboardMenu() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogOut = () => {
        deleteToken();
        logout();
        navigate("/", {replace: true})
    }

    return (
            <nav>
                <Link to="/dashboard">Dashboard</Link>
                <Link>Empleados</Link>
                <Link>Carta</Link>
                <Link to="/dashboard/register">Registrar</Link>
                <Link>Facturas</Link>
                <Link>Otros</Link>
                <Link onClick={handleLogOut}>Logout</Link>
            </nav>
    )
}