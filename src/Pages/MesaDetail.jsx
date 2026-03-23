import { Link, useLocation, useParams } from "react-router-dom";
import { getMesaMockById } from "../data/staffMockData";
import "../styles/Staff/operations.css";

export default function MesaDetail() {
    const { id } = useParams();
    const location = useLocation();
    const mesa = location.state?.mesa ?? getMesaMockById(id);

    if (!mesa) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-warning">
                    <strong>INCOMPLETO</strong>
                    <p>No se encontro la mesa solicitada en este mock provisional.</p>
                </div>
                <Link to="/staff/mesas" className="staff-ops-secondary">Volver a mesas</Link>
            </section>
        );
    }

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Mesa activa</p>
                    <h1>{mesa.nombre}</h1>
                    <p>{mesa.zona} · {mesa.capacidad} personas · {mesa.estado}</p>
                </div>

                <div className="staff-ops-actions">
                    <button type="button" className="staff-ops-secondary">Anadir comanda</button>
                    <button type="button" className="staff-ops-primary">Nueva ronda</button>
                </div>
            </div>

            <div className="mesa-detail-grid">
                <article className="mesa-detail-card">
                    <span className="mesa-detail-card__label">Notas de servicio</span>
                    <p>{mesa.nota}</p>
                </article>
                <article className="mesa-detail-card">
                    <span className="mesa-detail-card__label">Comandas</span>
                    <strong>{mesa.comandas.length}</strong>
                </article>
            </div>

            <section className="comandas-section">
                <div className="comandas-section__header">
                    <h2>Lista de pedidos</h2>
                    <button type="button" className="staff-ops-secondary">Anadir pedido rapido</button>
                </div>

                {mesa.comandas.length === 0 ? (
                    <div className="staff-ops-empty">
                        <p>Aun no hay comandas abiertas para esta mesa.</p>
                    </div>
                ) : (
                    <div className="comandas-list">
                        {mesa.comandas.map((comanda) => (
                            <article key={comanda.id} className="comanda-card">
                                <div className="comanda-card__top">
                                    <div>
                                        <span className="mesa-detail-card__label">{comanda.estado}</span>
                                        <h3>{comanda.titulo}</h3>
                                    </div>
                                    <strong>{comanda.total}</strong>
                                </div>

                                <ul>
                                    {comanda.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>

                                <div className="comanda-card__footer">
                                    <span>{comanda.actualizada}</span>
                                    <Link to={`/staff/pedidos/${comanda.id}`} state={{ comanda, mesa }}>
                                        Ver comanda
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}
