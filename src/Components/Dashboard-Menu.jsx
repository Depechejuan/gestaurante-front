import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../Auth/Auth-Context.jsx'
import deleteToken from "../services/delete-token.js";

export default function DashboardMenu({ className = "", onNavigateLink }) {
    const navigate = useNavigate();
    const { logout, roleName, sessionUserId } = useAuth();

    const handleNavigateLink = () => {
        onNavigateLink?.();
    };

    const handleLogOut = () => {
        deleteToken();
        logout();
        onNavigateLink?.();
        navigate("/", {replace: true})
    }

    return (
        <nav className={`dashboard-nav ${className}`.trim()}>
            <div className="dashboard-nav__eyebrow">Panel interno</div>
            <div className="dashboard-nav__identity">
                <p>{roleName}</p>
                <span>ID {sessionUserId ? String(sessionUserId).slice(0, 8) : "sin sesion"}</span>
            </div>

            <div className="dashboard-nav__group">
                <NavLink to="/dashboard" end className="dashboard-nav__link" onClick={handleNavigateLink}>Resumen</NavLink>
                <NavLink to="/dashboard/empleados" className="dashboard-nav__link" onClick={handleNavigateLink}>Empleados</NavLink>
                <NavLink to="/dashboard/clientes" className="dashboard-nav__link" onClick={handleNavigateLink}>Clientes</NavLink>
                <NavLink to="/dashboard/mesas" className="dashboard-nav__link" onClick={handleNavigateLink}>Mesas</NavLink>
                <NavLink to="/dashboard/carta" className="dashboard-nav__link" onClick={handleNavigateLink}>Carta</NavLink>
                <NavLink to="/dashboard/register" className="dashboard-nav__link" onClick={handleNavigateLink}>Registrar</NavLink>
                <NavLink to="/dashboard/facturas" className="dashboard-nav__link" onClick={handleNavigateLink}>Facturas</NavLink>
            </div>

            <button type="button" className="dashboard-nav__logout" onClick={handleLogOut}>
                Cerrar sesion
            </button>
        </nav>
    )
}
