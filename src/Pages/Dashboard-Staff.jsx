import { Link } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";

export default function DashboardStaff() {
    const { roleName, hasToken } = useAuth();

    const roleCopy = {
        Administrador: "Tienes visibilidad transversal sobre la operativa diaria.",
        Camarero: "Accede rapido a mesas y pedidos para mantener el servicio fluido.",
        Cocinero: "Prioriza pedidos y preparacion sin ruido de secciones no necesarias.",
        Repartidor: "Centra tu jornada en entregas de domicilio y pedidos listos para salir."
    };

    const shortcuts = [
        {
            title: "Resumen",
            description: "Vista inicial del turno y acceso condicionado por token.",
            to: "/staff",
            roles: ["Administrador", "Camarero", "Cocinero", "Repartidor"]
        },
        {
            title: "Mesas",
            description: "Pensado para administracion de sala y seguimiento del servicio.",
            to: "/staff/mesas",
            roles: ["Administrador", "Camarero"]
        },
        {
            title: "Pedidos",
            description: "Seguimiento en tiempo real para sala y cocina con estados reales.",
            to: "/staff/pedidos",
            roles: ["Administrador", "Camarero", "Cocinero", "Repartidor"]
        },
        {
            title: "Recogidas",
            description: "Cola de pedidos online listos para entregar en local.",
            to: "/staff/entregas",
            roles: ["Administrador", "Camarero"]
        },
        {
            title: "Reparto",
            description: "Pedidos online a domicilio listos para salir o en camino.",
            to: "/staff/reparto",
            roles: ["Administrador", "Repartidor"]
        }
    ];

    return (
        <section className="staff-dashboard">
            <article className="staff-dashboard__hero">
                <div>
                    <p className="staff-dashboard__eyebrow">Turno activo</p>
                    <h2>Bienvenido al panel interno de staff</h2>
                    <p>{roleCopy[roleName]}</p>
                </div>

                <div className="staff-dashboard__token">
                    <span>Estado de acceso</span>
                    <strong>{hasToken ? "Sesion validada" : "Sin token"}</strong>
                </div>
            </article>

            <article className="staff-dashboard__grid">
                {shortcuts
                    .filter((shortcut) => shortcut.roles.includes(roleName))
                    .map((shortcut) => (
                        <Link key={shortcut.title} to={shortcut.to} className="staff-dashboard__card">
                            <h3>{shortcut.title}</h3>
                            <p>{shortcut.description}</p>
                        </Link>
                    ))}
            </article>

            <article className="staff-dashboard__note">
                <h3>Estado del producto</h3>
                <p>
                    El panel de staff ya combina operativa de sala, cocina, recogidas y reparto.
                    Los pedidos online llegan cerrados desde cliente y se enrutan segun sea
                    recogida o domicilio.
                </p>
            </article>
        </section>
    )
}
