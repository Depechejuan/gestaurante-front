import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getToken from "../services/get-token";
import { getPedidos } from "../services/pedidos";
import { formatDateTime, formatMoney, resolveCanalPedido, resolvePedidoStatus, resolveTipoEntrega, translatePedidoStatus } from "../utils/operations";

export default function Reparto() {
    const token = getToken();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const load = async () => {
            const response = await getPedidos(token);
            const nextOrders = (response?.data ?? []).filter((order) =>
                resolveCanalPedido(order.canalPedido) === "ONLINE"
                && resolveTipoEntrega(order.tipoEntrega) === "DOMICILIO"
                && ["PENDIENTE_ENTREGA", "EN_CAMINO"].includes(resolvePedidoStatus(order.estado))
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
                    <p className="staff-ops-eyebrow">Reparto</p>
                    <h1>Pedidos de domicilio</h1>
                </div>
            </div>
            {!orders.length ? <div className="staff-ops-empty"><p>No hay pedidos de reparto pendientes.</p></div> : (
                <div className="comandas-list">
                    {orders.map((order) => (
                        <article key={order.idPedido} className="comanda-card">
                            <div className="comanda-card__top">
                                <div>
                                    <h3>{order.clienteNombre || "Cliente online"}</h3>
                                    <p>{translatePedidoStatus(order.estado)}</p>
                                </div>
                                <strong>{formatMoney(order.total)}</strong>
                            </div>
                            <p>{order.clienteDireccionSnapshot || "Sin dirección"} · {formatDateTime(order.fechaPedido)}</p>
                            <Link to={`/staff/pedidos/${order.idPedido}`}>Abrir pedido</Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
