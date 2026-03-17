import { Link } from "react-router-dom";
import { useAuth } from "../Auth/Auth-Context";

function Dashboard() {
    const { roleName, sessionUserId, hasToken } = useAuth();

    const summaryCards = [
        {
            title: "Empleados",
            description: "Alta, consulta y seguimiento del equipo ya implementados.",
            to: "/dashboard/empleados",
            status: "Disponible"
        },
        {
            title: "Registro",
            description: "Crear usuarios y asignar rol desde el panel seguro.",
            to: "/dashboard/register",
            status: "Disponible"
        },
        {
            title: "Facturas",
            description: "Base preparada para trabajar el circuito administrativo.",
            to: "/dashboard/facturas",
            status: "Operativo"
        },
        {
            title: "Carta",
            description: "Visible en la rama, pero todavia en evolucion funcional.",
            to: "/dashboard/carta",
            status: "En progreso"
        }
    ];

    return (
        <section className="dashboard-home">
            <article className="dashboard-hero">
                <div>
                    <p className="dashboard-section__eyebrow">Resumen seguro</p>
                    <h2>Una entrada mas clara para el trabajo diario</h2>
                    <p>
                        Mientras platos e ingredientes terminan de aterrizar, el dashboard
                        prioriza lo que ya existe: control de usuarios, acceso a secciones
                        protegidas y una lectura rapida del estado de la sesion.
                    </p>
                </div>

                <div className="dashboard-hero__session">
                    <div>
                        <span>Rol activo</span>
                        <strong>{roleName}</strong>
                    </div>
                    <div>
                        <span>Token</span>
                        <strong>{hasToken ? "Valido" : "Faltante"}</strong>
                    </div>
                    <div>
                        <span>Identificador</span>
                        <strong>{sessionUserId ? String(sessionUserId).slice(0, 13) : "No disponible"}</strong>
                    </div>
                </div>
            </article>

            <article className="dashboard-grid">
                {summaryCards.map((card) => (
                    <Link key={card.title} to={card.to} className="dashboard-card">
                        <span className="dashboard-card__status">{card.status}</span>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </Link>
                ))}
            </article>

            <article className="dashboard-panel">
                <div>
                    <p className="dashboard-section__eyebrow">Acceso y permisos</p>
                    <h3>El panel deja visible que no todo es publico</h3>
                    <p>
                        Las rutas administrativas y de staff permanecen protegidas por token y
                        por rol. El objetivo del dashboard es que el usuario entienda rapido
                        que puede usar ahora y que modulos siguen en construccion.
                    </p>
                </div>

                <ul className="dashboard-checklist">
                    <li>Acceso administrativo solo para Administrador.</li>
                    <li>Acceso staff para Administrador, Camarero y Cocinero.</li>
                    <li>Los modulos inmaduros aparecen como zonas en progreso, no como huecos vacios.</li>
                </ul>
            </article>
        </section>
    )
}

export default Dashboard
