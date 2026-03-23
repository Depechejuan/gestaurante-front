import { NavLink } from "react-router-dom";

const customerLinks = [
    { to: "/", label: "Inicio", end: true },
    { to: "/carta", label: "Carta" },
    { to: "/about", label: "Nosotros" },
    { to: "/contacto", label: "Contacto" },
    { to: "/login", label: "Acceso interno" }
];

export default function CustomerMenu({isMenuOpen, closeMenu}) {
    const handleLinkClick = () => {
        closeMenu();
    }

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
                </ul>
            </nav>
        </>
    );
}
