import { Link,useNavigate } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";
import { useState } from "react";
import { useAuth } from '../Auth/Auth-Context.jsx'
import deleteToken from "../services/delete-token.js";

export default function StaffMenu() {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    useBodyClass("staff");

    const handleLogOut = () => {
        deleteToken();
        logout();
        navigate("/", {replace: true})
    }
    
    // get user type

    return (
        <nav>
            {/* Depende del tip de user, mostrar un menú u otro */}
            {userType == 'Cocinero' && (
                <Link>Pedidos</Link>
            )}
            <Link>Mesas</Link>
            <Link>Pedidos</Link>
            <Link onClick={handleLogOut}>Logout</Link>
        </nav>
    )
}