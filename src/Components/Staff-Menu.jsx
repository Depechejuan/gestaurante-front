import { NavLink, useNavigate } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";
import { useAuth } from '../Auth/Auth-Context.jsx'
import { useStaffNotifications } from "../Auth/Staff-Notifications-Context.jsx";

export default function StaffMenu({isMenuOpen, closeMenu}) {
    const navigate = useNavigate();
    const { logout, roleName, displayName } = useAuth();
    const { counts } = useStaffNotifications();
    useBodyClass("staff");
    const handleLinkClick = () => {
        closeMenu();
    }

    const handleLogOut = () => {
        logout();
        navigate("/", {replace: true})
    }
    const staffLinks = [
        { to: "/staff", label: "Panel", end: true, roles: ["Administrador", "Camarero", "Cocinero", "Repartidor"] },
        { to: "/staff/mesas", label: "Mesas", roles: ["Administrador", "Camarero"], badge: counts.mesas },
        { to: "/staff/pedidos", label: "Pedidos", roles: ["Administrador", "Camarero", "Cocinero"], badge: roleName === "Cocinero" ? counts.cocinaSala : counts.listosSala },
        { to: "/staff/online", label: "Pedidos online", roles: ["Administrador", "Camarero", "Cocinero", "Repartidor"], badge: roleName === "Repartidor" ? counts.onlineReparto : roleName === "Cocinero" ? counts.cocinaOnline : counts.onlineRecogida + counts.onlineReparto },
        { to: "/staff/facturas", label: "Facturas", roles: ["Administrador", "Camarero"] },
        { to: "/staff/clientes", label: "Clientes", roles: ["Administrador", "Camarero"] }
    ];

    return (
        <nav className={`staff-navbar ${isMenuOpen ? "open" : ""}`}>
            <div className="staff-navbar__card">
                <p className="staff-navbar__title">Panel</p>
                <span className="staff-navbar__role">{displayName || "Sin sesion"}</span>
                <span className="staff-navbar__role">{roleName}</span>
                <ul className="nav-menu">
                    {staffLinks
                        .filter((link) => link.roles.includes(roleName))
                        .map((link) => (
                            <li key={link.to}>
                                <NavLink to={link.to} end={link.end} onClick={handleLinkClick}>
                                    <span>{link.label}</span>
                                    {Boolean(link.badge) && <strong className="staff-nav__badge">{link.badge}</strong>}
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
