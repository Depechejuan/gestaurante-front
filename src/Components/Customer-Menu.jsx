import { NavLink } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";

export default function CustomerMenu({isMenuOpen, closeMenu}) {
    const { hasCustomerSession, logout } = useCustomerAuth();
    const handleLinkClick = () => {
        closeMenu();
    }

    const customerLinks = [
        { to: "/", label: "Inicio", end: true },
        { to: "/carta", label: "Carta" },
        { to: "/pedido-online", label: "Pedido online" },
        { to: "/about", label: "Nosotros" },
        { to: "/contacto", label: "Contacto" },
        ...(hasCustomerSession
            ? [
                { to: "/cuenta", label: "Mi cuenta" },
                { to: "/cuenta/pedidos", label: "Mis pedidos" }
            ]
            : [
                { to: "/login", label: "Acceso" }
            ])
    ];

    const renderLogout = hasCustomerSession ? (
        <li>
            <button
                type="button"
                className="customer-menu__logout"
                onClick={() => { logout(); handleLinkClick(); }}
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
