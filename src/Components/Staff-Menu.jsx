import { Link } from "react-router-dom";
import useBodyClass from "../Hooks/useBodyClass";
import { useState } from "react";

export default function StaffMenu() {
    const [userType, setUserType] = useState(null)
    useBodyClass("staff");
    
    // get user type

    return (
        <nav>
            {userType == 'Cocinero' && (
                <Link>Pedidos</Link>
            )}
            <Link>Mesas</Link>
            <Link>Pedidos</Link>
            <Link>Logout</Link>
        </nav>
    )
}