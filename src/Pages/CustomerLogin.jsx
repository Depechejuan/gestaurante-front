import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCustomer } from "../services/customer-account";
import { saveCustomerToken } from "../services/customer-token-storage";

export default function CustomerLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await loginCustomer(form);
            saveCustomerToken(response.data);
            navigate("/pedido-online");
        } catch (err) {
            setError(err.message || "No se ha podido iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card login-card">
                <div className="login-card__copy">
                    <p className="public-eyebrow login-card__eyebrow">Acceso cliente</p>
                    <h1>Entra en tu cuenta</h1>
                    <p>Gestiona direcciones, pagos y pedidos online desde tu área cliente.</p>
                </div>
                <form onSubmit={handleSubmit} className="customer-contact-form customer-contact-form--auth login-form">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    <label>Contraseña</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    {error && <p className="login-form__error">{error}</p>}
                    <button type="submit" className="customer-contact-form__submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                    <Link to="/cuenta/register" className="email-link">Crear cuenta</Link>
                </form>
            </div>
        </section>
    );
}
