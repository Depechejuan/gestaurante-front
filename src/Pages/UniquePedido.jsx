import { Link, useLocation, useParams } from "react-router-dom";
import { getComandaMockById } from "../data/staffMockData";
import "../styles/Staff/operations.css";

export default function UniquePedido() {
    const { id } = useParams();
    const location = useLocation();
    const comanda = location.state?.comanda ?? getComandaMockById(id);
    const mesa = location.state?.mesa;

    if (!comanda) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>No se ha encontrado la comanda solicitada.</p>
                </div>
            </section>
        );
    }

    return(
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Detalle de pedido</p>
                    <h1>{comanda.titulo}</h1>
                    <p>
                        {mesa?.nombre ? `${mesa.nombre} · ` : ""}
                        {comanda.estado} · {comanda.actualizada}
                    </p>
                </div>

                <div className="staff-ops-actions">
                    <button type="button" className="staff-ops-secondary">Anadir linea</button>
                    <button type="button" className="staff-ops-primary">Cerrar comanda</button>
                </div>
            </div>

            <article className="comanda-card comanda-card--detail">
                <div className="comanda-card__top">
                    <div>
                        <span className="mesa-detail-card__label">Total estimado</span>
                        <h2>{comanda.total}</h2>
                    </div>
                </div>

                <ul>
                    {comanda.items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </article>

            <Link
                to={mesa?.id ? `/staff/mesas/${mesa.id}` : "/staff/pedidos"}
                state={mesa ? { mesa } : undefined}
                className="staff-ops-secondary staff-ops-secondary--link"
            >
                {mesa?.id ? "Volver a la mesa" : "Volver a pedidos"}
            </Link>
        </section>
    )
}
