import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { createCustomerPaymentMethod, deleteCustomerPaymentMethod, getCustomerPaymentMethods } from "../services/customer-account";
import "../styles/Customer/form.css";

const emptyForm = { cardNumber: "", holderName: "", expMonth: "", expYear: "", isDefault: false };

export default function CustomerPaymentMethods() {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useCustomerAuth();
    const [methods, setMethods] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const redirect = useMemo(() => new URLSearchParams(location.search).get("redirect") ?? "", [location.search]);

    const load = async () => {
        try {
            const response = await getCustomerPaymentMethods(token.token);
            setMethods(response?.data ?? []);
        } catch (err) {
            setError(err.message || "No se han podido cargar los métodos de pago.");
        }
    };

    useEffect(() => {
        load();
    }, [token?.token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setFeedback("");
        try {
            const response = await createCustomerPaymentMethod({
                cardNumber: form.cardNumber,
                holderName: form.holderName,
                expMonth: Number(form.expMonth),
                expYear: Number(form.expYear),
                isDefault: form.isDefault
            }, token.token);
            setForm(emptyForm);
            if (redirect) {
                navigate(redirect, {
                    state: {
                        checkoutMessage: "Tarjeta guardada correctamente.",
                        preferredPaymentMethodId: response?.data?.idClienteMetodoPago ?? "",
                        useSavedPaymentMethod: true
                    }
                });
                return;
            }
            await load();
            setFeedback("Tarjeta guardada correctamente.");
        } catch (err) {
            setError(err.message || "No se ha podido guardar la tarjeta.");
        }
    };

    const handleDelete = async (paymentMethodId) => {
        setError("");
        setFeedback("");
        try {
            await deleteCustomerPaymentMethod(paymentMethodId, token.token);
            await load();
            setFeedback("Tarjeta eliminada correctamente.");
        } catch (err) {
            setError(err.message || "No se ha podido eliminar la tarjeta.");
        }
    };

    return (
        <section className="staff-ops-shell customer-settings-shell">
            <div className="staff-ops-header customer-settings-header">
                <div>
                    <p className="public-eyebrow">Cuenta cliente</p>
                    <h1>Tarjetas guardadas</h1>
                    <p>Guarda una o varias tarjetas para agilizar el pago online del pedido.</p>
                </div>
                {redirect ? <Link to={redirect} className="customer-btn-secondary customer-btn-secondary--inline">Volver al checkout</Link> : null}
            </div>
            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            {feedback && <div className="staff-ops-warning staff-ops-warning--success"><p>{feedback}</p></div>}
            <div className="customer-settings-grid">
                <form onSubmit={handleSubmit} className="customer-contact-form customer-settings-card">
                    <div className="customer-form-group">
                        <label>Número de tarjeta</label>
                        <input placeholder="4242 4242 4242 4242" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} required />
                    </div>
                    <div className="customer-form-group">
                        <label>Titular</label>
                        <input placeholder="Nombre del titular" value={form.holderName} onChange={(e) => setForm({ ...form, holderName: e.target.value })} required />
                    </div>
                    <div className="customer-settings-grid customer-settings-grid--compact">
                        <div className="customer-form-group">
                            <label>Mes</label>
                            <input placeholder="MM" value={form.expMonth} onChange={(e) => setForm({ ...form, expMonth: e.target.value })} required />
                        </div>
                        <div className="customer-form-group">
                            <label>Año</label>
                            <input placeholder="AAAA" value={form.expYear} onChange={(e) => setForm({ ...form, expYear: e.target.value })} required />
                        </div>
                    </div>
                    <label className="customer-check-option">
                        <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
                        <span>Usar como tarjeta predeterminada</span>
                    </label>
                    <button type="submit" className="customer-btn-primary">Guardar tarjeta</button>
                </form>

                <div className="comandas-list customer-settings-list">
                    {methods.map((method) => (
                        <article key={method.idClienteMetodoPago} className="comanda-card customer-settings-card">
                            <h3>{method.brand} · **** {method.last4}</h3>
                            <p>{method.holderName} · {method.expMonth}/{method.expYear}</p>
                            <p>{method.isDefault ? "Predeterminada" : "Guardada"}</p>
                            <button type="button" className="staff-ops-secondary" onClick={() => handleDelete(method.idClienteMetodoPago)}>
                                Borrar
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
