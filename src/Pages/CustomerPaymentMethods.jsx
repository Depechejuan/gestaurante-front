import { useEffect, useState } from "react";
import { useCustomerAuth } from "../Auth/Customer-Auth-Context";
import { createCustomerPaymentMethod, deleteCustomerPaymentMethod, getCustomerPaymentMethods } from "../services/customer-account";

const emptyForm = { cardNumber: "", holderName: "", expMonth: "", expYear: "", isDefault: false };

export default function CustomerPaymentMethods() {
    const { token } = useCustomerAuth();
    const [methods, setMethods] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");

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
        try {
            await createCustomerPaymentMethod({
                cardNumber: form.cardNumber,
                holderName: form.holderName,
                expMonth: Number(form.expMonth),
                expYear: Number(form.expYear),
                isDefault: form.isDefault
            }, token.token);
            setForm(emptyForm);
            await load();
        } catch (err) {
            setError(err.message || "No se ha podido guardar la tarjeta.");
        }
    };

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header"><h1>Métodos de pago</h1></div>
            {error && <div className="staff-ops-warning"><p>{error}</p></div>}
            <form onSubmit={handleSubmit} className="customer-contact-form">
                <input placeholder="Número de tarjeta" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} required />
                <input placeholder="Titular" value={form.holderName} onChange={(e) => setForm({ ...form, holderName: e.target.value })} required />
                <input placeholder="Mes" value={form.expMonth} onChange={(e) => setForm({ ...form, expMonth: e.target.value })} required />
                <input placeholder="Año" value={form.expYear} onChange={(e) => setForm({ ...form, expYear: e.target.value })} required />
                <label><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Predeterminada</label>
                <button type="submit" className="customer-contact-form__submit">Guardar tarjeta</button>
            </form>
            <div className="comandas-list">
                {methods.map((method) => (
                    <article key={method.idClienteMetodoPago} className="comanda-card">
                        <h3>{method.brand} · **** {method.last4}</h3>
                        <p>{method.holderName} · {method.expMonth}/{method.expYear}</p>
                        <p>{method.isDefault ? "Predeterminada" : "Guardada"}</p>
                        <button type="button" className="staff-ops-secondary" onClick={async () => { await deleteCustomerPaymentMethod(method.idClienteMetodoPago, token.token); await load(); }}>
                            Borrar
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}
