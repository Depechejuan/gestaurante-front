import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import ListPlatosPublic from "../Components/ListPlatosPublic";
import { getCustomerAddresses, getCustomerPaymentMethods } from "../services/customer-account";
import { getPublicCatalog } from "../services/public-catalog";
import { addOnlineCartItem, clearOnlineCart, getOnlineCart, removeOnlineCartItem, updateOnlineCartItem } from "../services/online-order-storage";
import { createOnlineOrder } from "../services/online-order";
import { formatMoney } from "../utils/operations";
import { decorateCatalogItems } from "../utils/catalog";
import cartIcon from "../assets/Icons/cart.svg";

function resolveShippingCost(subtotal, tipoEntrega) {
    if (tipoEntrega !== "DOMICILIO")
        return 0;

    if (subtotal < 20)
        return 5;

    if (subtotal < 30)
        return 2;

    return 0;
}

export default function OnlineOrder() {
    const navigate = useNavigate();
    const { customer, token, hasCustomerSession } = useCustomerAuth();
    const [platos, setPlatos] = useState([]);
    const [cart, setCart] = useState(() => getOnlineCart());
    const [addresses, setAddresses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [tipoEntrega, setTipoEntrega] = useState("RECOGIDA");
    const [pagarOnline, setPagarOnline] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [useSavedPaymentMethod, setUseSavedPaymentMethod] = useState(true);
    const [newCard, setNewCard] = useState({
        cardNumber: "",
        holderName: "",
        expMonth: "",
        expYear: "",
        saveForFuture: true
    });
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [catalogResponse, addressesResponse, methodsResponse] = await Promise.all([
                    getPublicCatalog(),
                    hasCustomerSession ? getCustomerAddresses(token.token) : Promise.resolve({ data: [] }),
                    hasCustomerSession ? getCustomerPaymentMethods(token.token) : Promise.resolve({ data: [] })
                ]);
                setPlatos(decorateCatalogItems(catalogResponse?.data ?? []));
                const nextAddresses = addressesResponse?.data ?? [];
                const nextMethods = methodsResponse?.data ?? [];
                setAddresses(nextAddresses);
                setPaymentMethods(nextMethods);
                setSelectedAddress(nextAddresses.find((address) => address.isDefault)?.idClienteDireccion ?? "");
                setSelectedPaymentMethod(nextMethods.find((method) => method.isDefault)?.idClienteMetodoPago ?? "");
                setUseSavedPaymentMethod(nextMethods.length > 0);
            } catch (err) {
                setError(err.message || "No se ha podido cargar el catálogo online.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [hasCustomerSession, token?.token]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [cart]);
    const shippingCost = useMemo(() => resolveShippingCost(subtotal, tipoEntrega), [subtotal, tipoEntrega]);
    const total = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);
    const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    const handleAddToCart = (plato, quantity) => {
        const next = addOnlineCartItem({
            id: plato.idPlato ?? plato.id,
            backendId: plato.idPlato ?? plato.id,
            nombre: plato.nombre,
            quantity,
            unitPrice: Number(plato.precio ?? 0),
            tipoVisible: plato.tipoVisible
        });
        setCart(next);
    };

    const handleAdjustCartItem = (itemId, nextQuantity) => {
        const next = updateOnlineCartItem(itemId, nextQuantity);
        setCart(next);
    };

    const handleRemoveCartItem = (itemId) => {
        const next = removeOnlineCartItem(itemId);
        setCart(next);
    };

    const handleRequireRegister = () => {
        navigate(`/cuenta/register?redirect=${encodeURIComponent("/pedido-online")}`);
    };

    const handleSubmit = async () => {
        if (!hasCustomerSession) {
            navigate(`/cuenta/register?redirect=${encodeURIComponent("/pedido-online")}`);
            return;
        }

        if (!cart.length) {
            setError("Añade al menos un plato al carrito antes de confirmar.");
            return;
        }

        if (tipoEntrega === "DOMICILIO" && !selectedAddress) {
            setError("Debes seleccionar una dirección para los pedidos a domicilio.");
            return;
        }

        if (pagarOnline && useSavedPaymentMethod && paymentMethods.length > 0 && !selectedPaymentMethod) {
            setError("Selecciona un método de pago guardado o introduce una tarjeta nueva.");
            return;
        }

        setSending(true);
        setError("");
        setFeedback("");
        try {
            const response = await createOnlineOrder({
                tipoEntrega,
                pagarOnline,
                idClienteDireccion: tipoEntrega === "DOMICILIO" ? selectedAddress || null : null,
                detalles: cart.map((item) => ({
                    idPlato: item.backendId,
                    cantidad: item.quantity
                })),
                paymentMethod: pagarOnline
                    ? (
                        useSavedPaymentMethod
                            ? { idClienteMetodoPago: selectedPaymentMethod || null }
                            : {
                                cardNumber: newCard.cardNumber,
                                holderName: newCard.holderName,
                                expMonth: newCard.expMonth ? Number(newCard.expMonth) : null,
                                expYear: newCard.expYear ? Number(newCard.expYear) : null,
                                saveForFuture: newCard.saveForFuture
                            }
                    )
                    : null
            }, token.token);

            clearOnlineCart();
            setCart([]);
            setCartOpen(false);
            setNewCard({
                cardNumber: "",
                holderName: "",
                expMonth: "",
                expYear: "",
                saveForFuture: true
            });
            setFeedback(`Pedido ${String(response?.data?.idPedido ?? "").slice(0, 8)} creado correctamente.`);
        } catch (err) {
            setError(err.message || "No se ha podido crear el pedido online.");
        } finally {
            setSending(false);
        }
    };

    const renderCheckoutCard = (variant = "desktop") => (
        <section className={`mesa-order-card mesa-order-card--cart ${variant === "mobile" ? "mesa-order-card--drawer" : ""}`}>
            <div className="mesa-order-card__header">
                <div>
                    <p className="public-eyebrow">Checkout</p>
                    <h2>Tu pedido online</h2>
                </div>
                <strong>{formatMoney(total)}</strong>
            </div>

            <div className="online-order-summary">
                <div>
                    <span>Productos</span>
                    <strong>{formatMoney(subtotal)}</strong>
                </div>
                <div>
                    <span>Envío</span>
                    <strong>{tipoEntrega === "DOMICILIO" ? formatMoney(shippingCost) : "Gratis"}</strong>
                </div>
                <div>
                    <span>Total</span>
                    <strong>{formatMoney(total)}</strong>
                </div>
            </div>

            <div className="checkout-choice-group">
                <div className="checkout-choice-group__header">
                    <span className="public-eyebrow">Entrega</span>
                    <p>Elige cómo quieres recibir tu pedido.</p>
                </div>
                <div className="checkout-choice-grid">
                    <button
                        type="button"
                        className={`checkout-choice ${tipoEntrega === "RECOGIDA" ? "checkout-choice--active" : ""}`}
                        onClick={() => setTipoEntrega("RECOGIDA")}
                    >
                        <strong>Recogida</strong>
                        <span>Recoge tu pedido en el restaurante.</span>
                    </button>
                    <button
                        type="button"
                        className={`checkout-choice ${tipoEntrega === "DOMICILIO" ? "checkout-choice--active" : ""}`}
                        onClick={() => {
                            setTipoEntrega("DOMICILIO");
                            setPagarOnline(true);
                        }}
                    >
                        <strong>Domicilio</strong>
                        <span>Entrega con gasto variable según el importe.</span>
                    </button>
                </div>
            </div>

            <div className="checkout-rules">
                <p><strong>Gastos de envío</strong></p>
                <ul>
                    <li>Menos de 20 €: 5 €</li>
                    <li>De 20 € a 29,99 €: 2 €</li>
                    <li>Desde 30 €: gratis</li>
                </ul>
            </div>

            {tipoEntrega === "DOMICILIO" && (
                <>
                    <label>Dirección de entrega</label>
                    <select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                        <option value="">Selecciona una dirección</option>
                        {addresses.map((address) => (
                            <option key={address.idClienteDireccion} value={address.idClienteDireccion}>
                                {address.alias} · {address.street}
                            </option>
                        ))}
                    </select>
                    {!addresses.length && hasCustomerSession ? (
                        <p className="customer-form-feedback">Necesitas guardar al menos una dirección en tu cuenta para los envíos a domicilio.</p>
                    ) : null}
                </>
            )}

            <div className="checkout-choice-group">
                <div className="checkout-choice-group__header">
                    <span className="public-eyebrow">Pago</span>
                    <p>{tipoEntrega === "DOMICILIO" ? "El domicilio requiere pago online." : "Elige si prefieres pagar ahora o al recoger."}</p>
                </div>
                <div className="checkout-choice-grid">
                    <button
                        type="button"
                        className={`checkout-choice ${pagarOnline ? "checkout-choice--active" : ""}`}
                        onClick={() => setPagarOnline(true)}
                    >
                        <strong>Pagar ahora</strong>
                        <span>Guarda el pedido como abonado y genera la factura al momento.</span>
                    </button>
                    <button
                        type="button"
                        className={`checkout-choice ${!pagarOnline ? "checkout-choice--active" : ""}`}
                        disabled={tipoEntrega === "DOMICILIO"}
                        onClick={() => setPagarOnline(false)}
                    >
                        <strong>Pagar al recoger</strong>
                        <span>Disponible solo en recogida. El staff cobrará al entregar.</span>
                    </button>
                </div>
            </div>

            {pagarOnline && (
                <>
                    <label className="checkout-inline-check">
                        <input
                            type="checkbox"
                            checked={useSavedPaymentMethod}
                            onChange={(e) => setUseSavedPaymentMethod(e.target.checked)}
                        />
                        Usar una tarjeta guardada
                    </label>

                    {useSavedPaymentMethod && paymentMethods.length > 0 ? (
                        <select value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                            <option value="">Selecciona una tarjeta guardada</option>
                            {paymentMethods.map((method) => (
                                <option key={method.idClienteMetodoPago} value={method.idClienteMetodoPago}>
                                    {method.brand} · **** {method.last4}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Número de tarjeta"
                                value={newCard.cardNumber}
                                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Titular"
                                value={newCard.holderName}
                                onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                            />
                            <div className="mesa-order-item__actions">
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    placeholder="Mes"
                                    value={newCard.expMonth}
                                    onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                                />
                                <input
                                    type="number"
                                    min="2026"
                                    placeholder="Año"
                                    value={newCard.expYear}
                                    onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                                />
                            </div>
                            <label className="checkout-inline-check">
                                <input
                                    type="checkbox"
                                    checked={newCard.saveForFuture}
                                    onChange={(e) => setNewCard({ ...newCard, saveForFuture: e.target.checked })}
                                />
                                Guardar para futuros pedidos
                            </label>
                        </>
                    )}
                </>
            )}

            {!cart.length ? (
                <p className="mesa-order-empty">Tu carrito online está vacío.</p>
            ) : (
                <div className="mesa-order-items">
                    {cart.map((item) => (
                        <article key={item.id} className="mesa-order-item">
                            <div>
                                <strong>{item.nombre}</strong>
                                <p>{formatMoney(item.unitPrice)} · {item.quantity} uds.</p>
                            </div>
                            <div className="online-cart-item__actions">
                                <div className="online-cart-stepper">
                                    <button type="button" onClick={() => handleAdjustCartItem(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button type="button" onClick={() => handleAdjustCartItem(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <button type="button" className="staff-ops-secondary" onClick={() => handleRemoveCartItem(item.id)}>Quitar</button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {!hasCustomerSession ? (
                <div className="checkout-guest-cta">
                    <p>Para confirmar el pedido necesitas una cuenta de cliente validada.</p>
                    <div className="menu-public__cta-row">
                        <button type="button" className="staff-ops-primary mesa-order-submit" disabled={!cart.length} onClick={handleRequireRegister}>
                            Regístrate para continuar
                        </button>
                        <Link to={`/login?redirect=${encodeURIComponent("/pedido-online")}`} className="customer-btn-secondary customer-btn-secondary--inline">
                            Ya tengo cuenta
                        </Link>
                    </div>
                </div>
            ) : (
                <button type="button" className="staff-ops-primary mesa-order-submit" disabled={sending || !cart.length} onClick={handleSubmit}>
                    {sending ? "Enviando..." : "Confirmar pedido online"}
                </button>
            )}
        </section>
    );

    if (loading) {
        return <section className="public-page public-page--menu"><p>Cargando catálogo online...</p></section>;
    }

    return (
        <section className="public-page public-page--menu">
            <section className="menu-public__hero">
                <div>
                    <p className="public-eyebrow">Pedido online</p>
                    <h1>Recogida o entrega a domicilio</h1>
                    <p>{hasCustomerSession ? `Sesión activa de ${customer?.firstName || customer?.email || "cliente"}.` : "Prepara tu carrito y confirma el pedido cuando quieras. Si aún no tienes cuenta, podrás crearla al final."}</p>
                </div>
                {!hasCustomerSession && (
                    <div className="menu-public__cta-row">
                        <Link to={`/cuenta/register?redirect=${encodeURIComponent("/pedido-online")}`} className="menu-public__cta menu-public__cta--primary">Crear cuenta</Link>
                        <Link to={`/login?redirect=${encodeURIComponent("/pedido-online")}`} className="menu-public__cta">Ya tengo cuenta</Link>
                    </div>
                )}
            </section>

            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {feedback && <div className="staff-ops-warning staff-ops-warning--success"><p>{feedback}</p></div>}

            <section className="mesa-order-shell">
                <div className="mesa-order-main">
                    <ListPlatosPublic platos={platos} onAddToCart={handleAddToCart} />
                </div>
                <aside className="mesa-order-sidebar mesa-order-sidebar--desktop">
                    {renderCheckoutCard("desktop")}
                </aside>
            </section>

            <button type="button" className="online-cart-fab" onClick={() => setCartOpen(true)}>
                <span className="online-cart-fab__icon-wrap">
                    <img className="online-cart-fab__icon" src={cartIcon} alt="" />
                </span>
                <span className="online-cart-fab__copy">
                    <span>{itemCount} {itemCount === 1 ? "artículo" : "artículos"}</span>
                    <strong>{formatMoney(total)}</strong>
                </span>
            </button>

            {cartOpen ? (
                <>
                    <button type="button" className="online-cart-backdrop" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} />
                    <aside className="online-cart-drawer">
                        <div className="online-cart-drawer__top">
                            <div>
                                <p className="public-eyebrow">Resumen</p>
                                <h2>Tu pedido</h2>
                            </div>
                            <button type="button" className="staff-ops-secondary" onClick={() => setCartOpen(false)}>Cerrar</button>
                        </div>
                        {renderCheckoutCard("mobile")}
                    </aside>
                </>
            ) : null}
        </section>
    );
}
