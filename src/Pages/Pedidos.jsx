import { Link } from "react-router-dom";
import { comandasMock } from "../data/staffMockData";
import "../styles/Staff/operations.css";

export default function Pedidos() {
    return(
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Operacion</p>
                    <h1>Pedidos</h1>
                    <p>Vista global provisional de comandas abiertas para sala y cocina.</p>
                </div>
            </div>

            <div className="comandas-list">
                {comandasMock.map((comanda) => (
                    <article key={comanda.id} className="comanda-card">
                        <div className="comanda-card__top">
                            <div>
                                <span className="mesa-detail-card__label">{comanda.mesaNombre} · {comanda.zona}</span>
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
                            <span>{comanda.estado} · {comanda.actualizada}</span>
                            <Link to={`/staff/pedidos/${comanda.id}`} state={{ comanda }}>
                                Abrir pedido
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
