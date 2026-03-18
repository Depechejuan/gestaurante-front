import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ListPlatosPublic from "../Components/ListPlatosPublic";
import usePlatos from "../Hooks/usePlatos";
import {
    addItemToTableCart,
    removeItemFromTableCart,
    startTableSession,
    submitCurrentTableOrder,
    updateTableCartItemQuantity
} from "../services/table-order-storage";
import "../styles/Customer/platos.css";

function resolvePlatoType(plato, index) {
    return (
        plato?.categoria ||
        plato?.tipo ||
        plato?.categoriaDescripcion ||
        (plato?.idCategoria ? `Categoria ${String(plato.idCategoria).slice(0, 4)}` : null) ||
        ["Entrantes", "Pastas", "Paellas", "Carnes", "Postres"][index % 5]
    );
}

function formatMoney(amount) {
    return `${amount.toFixed(2)} EUR`;
}

function formatDate(value) {
    return new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit"
    }).format(new Date(value));
}

export default function MesaQrMenu() {
    const { id } = useParams();
    const { platos, loading, error } = usePlatos();
    const [tableState, setTableState] = useState(() => startTableSession(id));
    const [cartFeedback, setCartFeedback] = useState("");

    useEffect(() => {
        setTableState(startTableSession(id));
        setCartFeedback("");
    }, [id]);

    const platosConTipo = useMemo(
        () =>
            (platos ?? []).map((plato, index) => ({
                ...plato,
                tipoVisible: resolvePlatoType(plato, index)
            })),
        [platos]
    );

    const cartTotal = useMemo(
        () => tableState.cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
        [tableState.cart]
    );

    const handleAddToCart = (plato, amount) => {
        const numericPrice = Number.parseFloat(String(plato.precio).replace(",", "."));
        const unitPrice = Number.isNaN(numericPrice) ? 0 : numericPrice;
        const nextState = addItemToTableCart(id, {
            id: String(plato.id ?? plato.idPlato ?? plato._fallbackId),
            nombre: plato.nombre,
            quantity: amount,
            unitPrice,
            tipoVisible: plato.tipoVisible
        });
        setTableState(nextState);
        setCartFeedback(`${amount} x ${plato.nombre} añadido a la mesa ${id}.`);
    };

    const handleQuantityChange = (itemId, quantity) => {
        setTableState(updateTableCartItemQuantity(id, itemId, quantity));
    };

    const handleRemove = (itemId) => {
        setTableState(removeItemFromTableCart(id, itemId));
    };

    const handleSubmitOrder = () => {
        const nextState = submitCurrentTableOrder(id);
        setTableState(nextState);
        setCartFeedback("Pedido guardado en local para esta mesa. Puedes seguir anadiendo mas pedidos.");
    };

    if (loading) {
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Mesa {id}</p>
                    <h1>Cargando carta</h1>
                    <p>Estamos preparando la carta para esta mesa.</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Mesa {id}</p>
                    <h1>No hemos podido cargar la carta</h1>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="public-page public-page--menu">
            <section className="menu-public__hero menu-public__hero--mesa">
                <div>
                    <p className="public-eyebrow">Pedido desde QR</p>
                    <h1>Mesa {id}</h1>
                    <p>
                        Todo lo que anadas desde aqui quedara vinculado a esta mesa durante 4 horas.
                        El carrito vive en local para no saturar la base de datos.
                    </p>
                </div>
                <div className="mesa-session-card">
                    <span>Mesa activa</span>
                    <strong>{tableState.mesaId}</strong>
                    <small>Caducidad renovada durante la sesion de pedido</small>
                </div>
            </section>

            <section className="mesa-order-shell">
                <div className="mesa-order-main">
                    {cartFeedback && <p className="menu-public__feedback">{cartFeedback}</p>}
                    <ListPlatosPublic platos={platosConTipo} onAddToCart={handleAddToCart} />
                </div>

                <aside className="mesa-order-sidebar">
                    <section className="mesa-order-card mesa-order-card--cart">
                        <div className="mesa-order-card__header">
                            <div>
                                <p className="public-eyebrow">Carrito</p>
                                <h2>Pedido actual</h2>
                            </div>
                            <strong>{formatMoney(cartTotal)}</strong>
                        </div>

                        {!tableState.cart.length ? (
                            <p className="mesa-order-empty">
                                Tu carrito esta vacio. Selecciona platos para preparar el pedido de esta mesa.
                            </p>
                        ) : (
                            <div className="mesa-order-items">
                                {tableState.cart.map((item) => (
                                    <article key={item.id} className="mesa-order-item">
                                        <div>
                                            <h3>{item.nombre}</h3>
                                            <p>{formatMoney(item.unitPrice)} por unidad</p>
                                        </div>
                                        <div className="mesa-order-item__controls">
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={item.quantity}
                                                onChange={(event) => handleQuantityChange(item.id, Number(event.target.value))}
                                            />
                                            <button type="button" onClick={() => handleRemove(item.id)}>
                                                Quitar
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            className="customer-btn-primary mesa-order-submit"
                            onClick={handleSubmitOrder}
                            disabled={!tableState.cart.length}
                        >
                            Enviar pedido
                        </button>
                    </section>

                    <section className="mesa-order-card">
                        <div className="mesa-order-card__header">
                            <div>
                                <p className="public-eyebrow">Historico local</p>
                                <h2>Pedidos previos</h2>
                            </div>
                            <strong>{tableState.previousOrders.length}</strong>
                        </div>

                        {!tableState.previousOrders.length ? (
                            <p className="mesa-order-empty">
                                Todavia no hay pedidos previos guardados para esta mesa.
                            </p>
                        ) : (
                            <div className="mesa-order-history">
                                {tableState.previousOrders.map((order) => (
                                    <article key={order.id} className="mesa-order-history__item">
                                        <div className="mesa-order-history__top">
                                            <strong>{formatMoney(order.total)}</strong>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <ul>
                                            {order.items.map((item) => (
                                                <li key={`${order.id}-${item.id}`}>
                                                    {item.quantity} x {item.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </aside>
            </section>
        </section>
    );
}
