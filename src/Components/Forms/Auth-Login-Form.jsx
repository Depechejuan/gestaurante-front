import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Customer/form.css";

export default function AuthLoginForm({
    eyebrow,
    title,
    description,
    submitLabel = "Entrar",
    loadingLabel = "Entrando...",
    errorMessage = "No se ha podido iniciar sesión.",
    secondaryLink,
    onSubmit
}) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setError("");
        setForm((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await onSubmit(form);
        } catch (err) {
            setError(err?.message || errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card login-card">
                <div className="customer-auth-card__copy login-card__copy">
                    <p className="public-eyebrow login-card__eyebrow">{eyebrow}</p>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>

                <form onSubmit={handleSubmit} className="customer-contact-form customer-contact-form--auth login-form">
                    <div className="customer-form-group">
                        <label htmlFor="auth-login-email">Email</label>
                        <input
                            id="auth-login-email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="customer-form-group">
                        <label htmlFor="auth-login-password">Contraseña</label>
                        <input
                            id="auth-login-password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Introduce tu contraseña"
                            required
                        />
                    </div>

                    {error && <p className="login-form__error">{error}</p>}

                    <button type="submit" className="customer-btn-primary" disabled={loading}>
                        {loading ? loadingLabel : submitLabel}
                    </button>

                    {secondaryLink ? (
                        <Link to={secondaryLink.to} className="customer-btn-secondary customer-btn-secondary--full">
                            {secondaryLink.label}
                        </Link>
                    ) : null}
                </form>
            </div>
        </section>
    );
}
