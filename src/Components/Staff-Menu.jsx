import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";
import { useAuth } from '../Auth/Auth-Context.jsx'
import deleteToken from "../services/delete-token.js";

export default function StaffMenu({isMenuOpen, closeMenu}) {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    useBodyClass("staff");
    const handleLinkClick = () => {
        closeMenu();
    }

    const handleLogOut = () => {
        deleteToken();
        logout();
        navigate("/", {replace: true})
    }
    
    // get user type

    return (
        <nav className={`staff-navbar ${isMenuOpen ? "open" : ""}`}>
                <ul className="nav-menu">
                    {userType == 'Cocinero' && (
                        <li>
                            <Link>Pedidos</Link>
                        </li>
                    )}
                    <li>
                        <Link to="/" onClick={handleLinkClick}>Mesas</Link>
                    </li>
                    <li>
                        <Link to="/carta" onClick={handleLinkClick}>Pedidos</Link>
                    </li>
                    <li>
                        <Link onClick={handleLogOut}>Logout</Link>
                    </li>
                </ul>
            </nav>
    )
}


