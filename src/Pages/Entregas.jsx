import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getToken from "../services/get-token";
import { getPedidos } from "../services/pedidos";
import { formatDateTime, formatMoney, resolveCanalPedido, resolvePedidoStatus, resolveTipoEntrega, translateEstadoPago } from "../utils/operations";

export default function Entregas() {
    const token = getToken();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const load = async () => {
            const response = await getPedidos(token);
            const nextOrders = (response?.data ?? []).filter((order) =>
                resolvePedidoStatus(order.estado) === "EN_ESPERA"
                && resolveCanalPedido(order.canalPedido) === "ONLINE"
                && resolveTipoEntrega(order.tipoEntrega) === "RECOGIDA"
            );
            setOrders(nextOrders);
        };
        load();
        const interval = window.setInterval(load, 30000);
        return () => window.clearInterval(interval);
    }, []);

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Recogidas</p>
                    <h1>Pedidos listos para entregar</h1>
                </div>
            </div>
            {!orders.length ? <div className="staff-ops-empty"><p>No hay recogidas listas ahora mismo.</p></div> : (
                <div className="comandas-list">
                    {orders.map((order) => (
                        <article key={order.idPedido} className="comanda-card">
                            <div className="comanda-card__top">
                                <div><h3>{order.clienteNombre || "Cliente online"}</h3></div>
                                <strong>{formatMoney(order.total)}</strong>
                            </div>
                            <p>{order.clienteTelefono} · {translateEstadoPago(order.estadoPago)} · {formatDateTime(order.fechaPedido)}</p>
                            <Link to={`/staff/pedidos/${order.idPedido}`}>Abrir pedido</Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
