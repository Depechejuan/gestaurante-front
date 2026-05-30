import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { resetPassword } from "../services/account-recovery";

export default function ResetPassword() {
    const location = useLocation();
    const token = useMemo(() => new URLSearchParams(location.search).get("token") ?? "", [location.search]);
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setError("");
        setFeedback("");
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFeedback("");
        setError("");

        if (!token) {
            setError("El enlace de recuperación no es válido.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ token, ...form });
            setFeedback("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
            setForm({ password: "", confirmPassword: "" });
        } catch (err) {
            setError(err?.message || "No se ha podido cambiar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card login-card">
                <div className="login-card__copy">
                    <p className="public-eyebrow login-card__eyebrow">Nueva contraseña</p>
                    <h1>Elige una contraseña</h1>
                    <p>Introduce la nueva contraseña dos veces para completar la recuperación de acceso.</p>
                </div>

                <form onSubmit={handleSubmit} className="customer-contact-form customer-contact-form--auth login-form">
                    <div className="customer-form-group">
                        <label htmlFor="reset-password">Contraseña</label>
                        <input
                            id="reset-password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>
                    <div className="customer-form-group">
                        <label htmlFor="reset-confirm-password">Repite la contraseña</label>
                        <input
                            id="reset-confirm-password"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>
                    {error && <p className="login-form__error">{error}</p>}
                    {feedback && <p className="menu-public__feedback">{feedback}</p>}
                    <button type="submit" className="customer-btn-primary" disabled={loading}>
                        {loading ? "Guardando..." : "Cambiar contraseña"}
                    </button>
                    <Link to="/login" className="customer-btn-secondary customer-btn-secondary--full">Ir al login</Link>
                </form>
            </div>
        </section>
    );
}
