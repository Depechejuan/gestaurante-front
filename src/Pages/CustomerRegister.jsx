import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../services/customer-account";

export default function CustomerRegister() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            await registerCustomer(form);
            navigate(`/cuenta/verificar-email?email=${encodeURIComponent(form.email)}`);
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
                    <p>Regístrate para pedir online, guardar direcciones y reutilizar métodos de pago mock.</p>
                </div>

                <form onSubmit={handleSubmit} className="customer-contact-form customer-contact-form--auth login-form">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    <label>Contraseña</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    <label>Nombre</label>
                    <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                    <label>Apellidos</label>
                    <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                    <label>Teléfono</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    {error && <p className="login-form__error">{error}</p>}
                    <button type="submit" className="customer-contact-form__submit" disabled={loading}>
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                    <Link to="/login" className="email-link">Ya tengo cuenta</Link>
                </form>
            </div>
        </section>
    );
}
