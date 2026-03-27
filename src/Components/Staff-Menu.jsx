import { NavLink, useNavigate } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";
import { useAuth } from '../Auth/Auth-Context.jsx'
import deleteToken from "../services/delete-token.js";

export default function StaffMenu({isMenuOpen, closeMenu}) {
    const navigate = useNavigate();
    const { logout, roleName } = useAuth();
    useBodyClass("staff");
    const handleLinkClick = () => {
        closeMenu();
    }

    const handleLogOut = () => {
        deleteToken();
        logout();
        navigate("/", {replace: true})
    }
    const staffLinks = [
        { to: "/staff", label: "Resumen", end: true, roles: ["Administrador", "Camarero", "Cocinero", "Repartidor"] },
        { to: "/staff/mesas", label: "Mesas", roles: ["Administrador", "Camarero"] },
        { to: "/staff/pedidos", label: "Pedidos", roles: ["Administrador", "Camarero", "Cocinero", "Repartidor"] },
        { to: "/staff/entregas", label: "Recogidas", roles: ["Administrador", "Camarero"] },
        { to: "/staff/reparto", label: "Reparto", roles: ["Administrador", "Repartidor"] }
    ];

    return (
        <nav className={`staff-navbar ${isMenuOpen ? "open" : ""}`}>
            <div className="staff-navbar__card">
                <p className="staff-navbar__title">Accesos staff</p>
                <span className="staff-navbar__role">{roleName}</span>
                <ul className="nav-menu">
                    {staffLinks
                        .filter((link) => link.roles.includes(roleName))
                        .map((link) => (
                            <li key={link.to}>
                                <NavLink to={link.to} end={link.end} onClick={handleLinkClick}>
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    <li>
                        <button type="button" onClick={handleLogOut}>Cerrar sesion</button>
                    </li>
                </ul>
            </div>
            </nav>
    )
}
