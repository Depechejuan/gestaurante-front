import { Link } from "react-router-dom";
import { mesasMock } from "../data/staffMockData";
import "../styles/Staff/operations.css";

export default function Mesas() {
    return(
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Sala</p>
                    <h1>Mesas</h1>
                    <p>
                        Base provisional para que el personal de sala pueda abrir una mesa,
                        ver sus pedidos y preparar futuras comandas.
                    </p>
                </div>

                <button type="button" className="staff-ops-primary">
                    Anadir mesa
                </button>
            </div>

            <div className="staff-ops-warning">
                <strong>INCOMPLETO</strong>
                <p>
                    Mesas y pedidos aun no estan definidos a nivel de producto ni backend.
                    Esta vista usa datos mock para trabajar el flujo del staff.
                </p>
            </div>

            <section className="mesas-grid">
                {mesasMock.map((mesa) => (
                    <Link
                        key={mesa.id}
                        to={`/staff/mesas/${mesa.id}`}
                        state={{ mesa }}
                        className="mesa-card"
                    >
                        <div className="mesa-card__top">
                            <span className={`mesa-state mesa-state--${mesa.estado.toLowerCase()}`}>
                                {mesa.estado}
                            </span>
                            <span className="mesa-zone">{mesa.zona}</span>
                        </div>

                        <h2>{mesa.nombre}</h2>
                        <p>{mesa.nota}</p>

                        <div className="mesa-card__meta">
                            <span>{mesa.capacidad} personas</span>
                            <strong>{mesa.comandas.length} comandas</strong>
                        </div>
                    </Link>
                ))}
            </section>
        </section>
    )
}
