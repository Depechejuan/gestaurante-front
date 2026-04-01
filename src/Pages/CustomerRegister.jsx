import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerCustomer } from "../services/customer-account";

export default function CustomerRegister() {
    const location = useLocation();
    const navigate = useNavigate();
    const redirect = useMemo(
        () => new URLSearchParams(location.search).get("redirect") ?? "/pedido-online",
        [location.search]
    );
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            await registerCustomer(form);
            navigate(`/cuenta/verificar-email?email=${encodeURIComponent(form.email)}&redirect=${encodeURIComponent(redirect)}`);
        } catch (err) {
            setError(err.message || "No se ha podido crear la cuenta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card login-card">
                <div className="login-card__copy">
                    <p className="public-eyebrow login-card__eyebrow">Cuenta cliente</p>
                    <h1>Crea tu cuenta</h1>
                    <p>Empieza solo con email y contraseña. Podrás completar dirección, datos fiscales y pago más adelante.</p>
                </div>

                <form onSubmit={handleSubmit} className="customer-contact-form customer-contact-form--auth login-form">
                    <div className="customer-form-group">
                        <label htmlFor="customer-register-email">Email</label>
                        <input id="customer-register-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="customer-form-group">
                        <label htmlFor="customer-register-password">Contraseña</label>
                        <input id="customer-register-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    {error && <p className="login-form__error">{error}</p>}
                    <button type="submit" className="customer-btn-primary" disabled={loading}>
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                    <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="customer-btn-secondary customer-btn-secondary--full">Ya tengo cuenta</Link>
                </form>
            </div>
        </section>
    );
}
