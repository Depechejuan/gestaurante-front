import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { getCustomerOrders, updateCustomerProfile } from "../services/customer-account";
import { formatDateTime, formatMoney, translatePedidoStatus } from "../utils/operations";
import "../styles/Customer/form.css";

export default function CustomerAccount() {
    const { customer, token, logout, setCustomer } = useCustomerAuth();
    const [form, setForm] = useState({
        firstName: customer?.firstName ?? "",
        lastName: customer?.lastName ?? "",
        phone: customer?.phone ?? "",
        fiscalName: customer?.fiscalName ?? "",
        dni: customer?.dni ?? "",
        cif: customer?.cif ?? "",
        billingStreet: customer?.billingStreet ?? "",
        billingCity: customer?.billingCity ?? "",
        billingProvince: customer?.billingProvince ?? "",
        billingPostalCode: customer?.billingPostalCode ?? ""
    });
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        setForm({
            firstName: customer?.firstName ?? "",
            lastName: customer?.lastName ?? "",
            phone: customer?.phone ?? "",
            fiscalName: customer?.fiscalName ?? "",
            dni: customer?.dni ?? "",
            cif: customer?.cif ?? "",
            billingStreet: customer?.billingStreet ?? "",
            billingCity: customer?.billingCity ?? "",
            billingProvince: customer?.billingProvince ?? "",
            billingPostalCode: customer?.billingPostalCode ?? ""
        });
    }, [customer?.firstName, customer?.lastName, customer?.phone, customer?.fiscalName, customer?.dni, customer?.cif, customer?.billingStreet, customer?.billingCity, customer?.billingProvince, customer?.billingPostalCode]);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const response = await getCustomerOrders(token.token);
                setRecentOrders((response?.data ?? []).slice(0, 3));
            } catch {
                setRecentOrders([]);
            }
        };

        if (token?.token)
            loadOrders();
    }, [token?.token]);

    const links = [
        { to: "/pedido-online", label: "Pedir online", description: "Haz un pedido de recogida o delivery." },
        { to: "/cuenta/pedidos", label: "Mis pedidos", description: "Consulta tu histórico y el estado actual." },
        { to: "/cuenta/direcciones", label: "Direcciones", description: "Gestiona tus direcciones guardadas." },
        { to: "/cuenta/metodos-pago", label: "Métodos de pago", description: "Guarda y reutiliza tus métodos de pago." }
    ];
    const latestOrder = useMemo(() => recentOrders[0] ?? null, [recentOrders]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setFeedback("");
        try {
            const response = await updateCustomerProfile(form, token.token);
            setCustomer(response?.data ?? null);
            setFeedback("Perfil actualizado.");
        } catch (err) {
            setError(err.message || "No se ha podido actualizar tu perfil.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="public-page public-page--menu">
            <section className="menu-public__hero">
                <div>
                    <p className="public-eyebrow">Área cliente</p>
                    <h1>{customer?.firstName} {customer?.lastName}</h1>
                    <p>{customer?.email}</p>
                </div>
                <button type="button" className="staff-ops-secondary" onClick={logout}>Cerrar sesión</button>
            </section>

            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {feedback && <div className="staff-ops-warning staff-ops-warning--success"><p>{feedback}</p></div>}

            <section className="customer-settings-shell">
                <form onSubmit={handleSubmit} className="customer-contact-form customer-settings-card customer-profile-form">
                    <div className="customer-settings-grid customer-settings-grid--compact">
                        <div className="customer-form-group">
                            <label>Nombre</label>
                            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Nombre" required />
                        </div>
                        <div className="customer-form-group">
                            <label>Apellidos</label>
                            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Apellidos" required />
                        </div>
                    </div>

                    <div className="customer-settings-grid customer-settings-grid--compact">
                        <div className="customer-form-group">
                            <label>Teléfono</label>
                            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Teléfono" required />
                        </div>
                        <div className="customer-form-group">
                            <label>Nombre fiscal o razón social</label>
                            <input value={form.fiscalName} onChange={(e) => setForm({ ...form, fiscalName: e.target.value })} placeholder="Opcional" />
                        </div>
                    </div>

                    <div className="customer-settings-grid customer-settings-grid--compact">
                        <div className="customer-form-group">
                            <label>DNI</label>
                            <input value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value, cif: "" })} placeholder="DNI" />
                        </div>
                        <div className="customer-form-group">
                            <label>CIF</label>
                            <input value={form.cif} onChange={(e) => setForm({ ...form, cif: e.target.value, dni: "" })} placeholder="CIF" />
                        </div>
                    </div>

                    <div className="customer-form-group">
                        <label>Dirección fiscal</label>
                        <input value={form.billingStreet} onChange={(e) => setForm({ ...form, billingStreet: e.target.value })} placeholder="Dirección fiscal" />
                    </div>

                    <div className="customer-settings-grid customer-settings-grid--compact customer-settings-grid--triple">
                        <div className="customer-form-group">
                            <label>Código postal</label>
                            <input value={form.billingPostalCode} onChange={(e) => setForm({ ...form, billingPostalCode: e.target.value })} placeholder="Código postal" />
                        </div>
                        <div className="customer-form-group">
                            <label>Ciudad</label>
                            <input value={form.billingCity} onChange={(e) => setForm({ ...form, billingCity: e.target.value })} placeholder="Ciudad" />
                        </div>
                        <div className="customer-form-group">
                            <label>Provincia</label>
                            <input value={form.billingProvince} onChange={(e) => setForm({ ...form, billingProvince: e.target.value })} placeholder="Provincia" />
                        </div>
                    </div>

                    <div className="menu-public__cta-row">
                        <button type="submit" className="customer-btn-primary" disabled={saving}>
                            {saving ? "Guardando..." : "Actualizar perfil"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="customer-dashboard-grid">
                {links.map((link) => (
                    <Link key={link.to} to={link.to} className="customer-dashboard-card">
                        <h3>{link.label}</h3>
                        <p>{link.description}</p>
                    </Link>
                ))}
            </section>

            <section className="checkout-section">
                <div className="checkout-section__header">
                    <span className="checkout-section__step">1</span>
                    <div>
                        <h2>Actividad reciente</h2>
                        <p>Ten a mano tu perfil, tus direcciones y tus últimos pedidos para repetir más rápido.</p>
                    </div>
                </div>
                <div className="customer-dashboard-grid">
                    <article className="customer-dashboard-card customer-dashboard-card--summary">
                        <h3>Pedidos recientes</h3>
                        <p>{recentOrders.length ? `${recentOrders.length} pedidos visibles en tu panel.` : "Todavía no has hecho pedidos online."}</p>
                    </article>
                    <article className="customer-dashboard-card customer-dashboard-card--summary">
                        <h3>Último pedido</h3>
                        <p>{latestOrder ? `${translatePedidoStatus(latestOrder.estado)} · ${formatMoney(latestOrder.total)}` : "Cuando hagas tu primer pedido aparecerá aquí."}</p>
                    </article>
                </div>
                {recentOrders.length ? (
                    <div className="customer-dashboard-recent-list">
                        {recentOrders.map((order) => (
                            <article key={order.idPedido} className="customer-dashboard-recent-card">
                                <div className="customer-dashboard-recent-card__top">
                                    <div>
                                        <h3>Pedido {String(order.idPedido).slice(0, 8)}</h3>
                                        <p>{translatePedidoStatus(order.estado)} · {formatDateTime(order.fechaPedido)}</p>
                                    </div>
                                    <strong>{formatMoney(order.total)}</strong>
                                </div>
                                <Link to="/cuenta/pedidos" className="plato-detail-link">Ver histórico completo</Link>
                            </article>
                        ))}
                    </div>
                ) : null}
            </section>
        </section>
    );
}
