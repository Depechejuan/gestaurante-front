import { Link } from "react-router-dom";

export default function CustomerMenu({isMenuOpen, closeMenu}) {
    const handleLinkClick = () => {
        closeMenu();
    }

    return (
        <>
            {/* Menú desktop - siempre visible en desktop */}
            <nav className="desktop-navbar">
                <ul className="nav-menu">
                    <li>
                        <Link to="/" onClick={handleLinkClick}>Home</Link>
                    </li>
                    <li>
                        <Link to="/carta" onClick={handleLinkClick}>Carta</Link>
                    </li>
                    <li>
                        <Link to="/about" onClick={handleLinkClick}>Quienes Somos</Link>
                    </li>
                    <li>
                        <Link to="/contacto" onClick={handleLinkClick}>Contactar</Link>
                    </li>
                </ul>
            </nav>
            
            {/* Menú móvil - solo se abre cuando se clickea */}
            <nav className={`mobile-navbar ${isMenuOpen ? "open" : ""}`}>
                <ul className="nav-menu">
                    <li>
                        <Link to="/" onClick={handleLinkClick}>Home</Link>
                    </li>
                    <li>
                        <Link to="/carta" onClick={handleLinkClick}>Carta</Link>
                    </li>
                    <li>
                        <Link to="/about" onClick={handleLinkClick}>Quienes Somos</Link>
                    </li>
                    <li>
                        <Link to="/contacto" onClick={handleLinkClick}>Contactar</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}
