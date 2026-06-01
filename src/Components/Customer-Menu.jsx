import { NavLink } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { STAFF_ROLES } from "../constants/roles";

export default function CustomerMenu({ isMenuOpen, closeMenu }) {
    const { hasToken, roleName, logout: logoutEmployee } = useAuth();
    const { hasCustomerSession, logout: logoutCustomer } = useCustomerAuth();
    const hasEmployeeSession = hasToken && STAFF_ROLES.includes(roleName);
    const dashboardPath = roleName === "Administrador" ? "/dashboard" : "/staff";

    const handleLinkClick = () => {
        closeMenu();
    };

    const handleLogout = () => {
        if (hasEmployeeSession)
            logoutEmployee();

        if (hasCustomerSession)
            logoutCustomer();

        handleLinkClick();
    };

    const sessionLinks = hasEmployeeSession
        ? [{ to: dashboardPath, label: "Dashboard" }]
        : hasCustomerSession
            ? [
                { to: "/cuenta", label: "Mi cuenta" },
                { to: "/cuenta/pedidos", label: "Mis pedidos" }
            ]
            : [{ to: "/login", label: "Acceso" }];

    const customerLinks = [
        { to: "/", label: "Inicio", end: true },
        { to: "/carta", label: "Carta" },
        { to: "/pedido-online", label: "Pedido online" },
        { to: "/about", label: "Nosotros" },
        { to: "/contacto", label: "Contacto" },
        ...sessionLinks
    ];

    const renderLogout = hasEmployeeSession || hasCustomerSession ? (
        <li>
            <button
                type="button"
                className="customer-menu__logout"
                onClick={handleLogout}
            >
                Cerrar sesión
            </button>
        </li>
    ) : null;

    return (
        <>
            {/* Menú desktop - siempre visible en desktop */}
            <nav className="desktop-navbar">
                <ul className="nav-menu">
                    {customerLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink to={link.to} end={link.end} onClick={handleLinkClick}>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                    {renderLogout}
                </ul>
            </nav>

            {/* Menú móvil - solo se abre cuando se clickea */}
            <nav className={`mobile-navbar ${isMenuOpen ? "open" : ""}`}>
                <ul className="nav-menu">
                    {customerLinks.map((link) => (
                        <li key={link.to}>
                            <NavLink to={link.to} end={link.end} onClick={handleLinkClick}>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                    {renderLogout}
                </ul>
            </nav>
        </>
    );
}
