import { Link } from "react-router-dom";

export default function DashboardNav() {
    return (
        <>
            <nav>
                <Link>Dashboard</Link>
                <Link>Empleados</Link>
                <Link>Carta</Link>
                <Link>Registrar</Link>
                <Link>Facturas</Link>
                <Link>Otros</Link>
            </nav>
        </>
    )
}