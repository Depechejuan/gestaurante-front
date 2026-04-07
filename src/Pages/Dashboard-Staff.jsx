import { Link } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";
import { useStaffNotifications } from "../Auth/Staff-Notifications-Context";

export default function DashboardStaff() {
    const { roleName, hasToken, displayName } = useAuth();
    const { counts } = useStaffNotifications();

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
            roles: ["Administrador", "Camarero", "Cocinero"]
        },
        {
            title: "Pedidos online",
            description: "Vista unificada para recogidas y reparto, destacada segun el rol.",
            to: "/staff/online",
            roles: ["Administrador", "Camarero", "Cocinero", "Repartidor"]
        },
        {
            title: "Facturas",
            description: "Cobro, consulta y envio de facturas desde el panel de sala.",
            to: "/staff/facturas",
            roles: ["Administrador", "Camarero"]
        },
        {
            title: "Clientes",
            description: "Acceso a clientes para vincular facturas y consultar datos fiscales.",
            to: "/staff/clientes",
            roles: ["Administrador", "Camarero"]
        }
    ];

    const summaryItems = [
        {
            label: "Mesas con pedidos",
            value: counts.mesas,
            roles: ["Administrador", "Camarero"]
        },
        {
            label: "Pedidos en cocina",
            value: counts.cocinaSala + counts.cocinaOnline,
            roles: ["Administrador", "Cocinero"]
        },
        {
            label: "Listos para sala",
            value: counts.listosSala,
            roles: ["Administrador", "Camarero"]
        },
        {
            label: "Online recogida",
            value: counts.onlineRecogida,
            roles: ["Administrador", "Camarero"]
        },
        {
            label: "Online reparto",
            value: counts.onlineReparto,
            roles: ["Administrador", "Repartidor"]
        }
    ];

    return (
        <section className="staff-dashboard">
            <article className="staff-dashboard__hero">
                <div>
                    <p className="staff-dashboard__eyebrow">Turno activo</p>
                    <h2>{displayName ? `Bienvenido, ${displayName}` : "Bienvenido al panel interno de staff"}</h2>
                    <p>{roleCopy[roleName]}</p>
                </div>

                <div className="staff-dashboard__token">
                    <span>Estado de acceso</span>
                    <strong>{hasToken ? "Sesion validada" : "Sin token"}</strong>
                </div>
            </article>

            <article className="staff-dashboard__grid staff-dashboard__grid--compact">
                {summaryItems
                    .filter((item) => item.roles.includes(roleName))
                    .map((item) => (
                        <div key={item.label} className="staff-dashboard__card staff-dashboard__card--summary">
                            <p>{item.label}</p>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
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
                    El panel de staff ya combina operativa de sala, cocina, pedidos online,
                    facturacion y clientes segun el rol activo. Los pedidos online llegan
                    cerrados desde cliente y se distinguen por recogida o domicilio.
                </p>
            </article>
        </section>
    )
}
