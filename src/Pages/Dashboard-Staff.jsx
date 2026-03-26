import { Link } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";

export default function DashboardStaff() {
    const { roleName, hasToken } = useAuth();

    const roleCopy = {
        Administrador: "Tienes visibilidad transversal sobre la operativa diaria.",
        Camarero: "Accede rapido a mesas y pedidos para mantener el servicio fluido.",
        Cocinero: "Prioriza pedidos y preparacion sin ruido de secciones no necesarias."
    };

    const shortcuts = [
        {
            title: "Resumen",
            description: "Vista inicial del turno y acceso condicionado por token.",
            to: "/staff",
            roles: ["Administrador", "Camarero", "Cocinero"]
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
                    El panel de staff ya trabaja con mesas, pedidos y cierres reales de forma
                    segura. La carta del cliente sigue guardando su borrador en local hasta que
                    el backend publico del QR quede definitivamente cerrado.
                </p>
            </article>
        </section>
    )
}
