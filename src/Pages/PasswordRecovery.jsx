import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/account-recovery";

export default function PasswordRecovery() {
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setFeedback("");
        setError("");

        try {
            await requestPasswordReset({ email });
            setFeedback("Si el email pertenece a una cuenta activa, recibirás un enlace para cambiar la contraseña.");
        } catch (err) {
            setError(err?.message || "No se ha podido solicitar el enlace.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card login-card">
                <div className="login-card__copy">
                    <p className="public-eyebrow login-card__eyebrow">Recuperación</p>
                    <h1>Restablece tu contraseña</h1>
                    <p>Introduce el email de tu cuenta y te enviaremos un enlace válido durante una hora.</p>
                </div>

                <form onSubmit={handleSubmit} className="customer-contact-form customer-contact-form--auth login-form">
                    <div className="customer-form-group">
                        <label htmlFor="password-recovery-email">Email</label>
                        <input
                            id="password-recovery-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                    {error && <p className="login-form__error">{error}</p>}
                    {feedback && <p className="menu-public__feedback">{feedback}</p>}
                    <button type="submit" className="customer-btn-primary" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar enlace"}
                    </button>
                    <Link to="/login" className="customer-btn-secondary customer-btn-secondary--full">Volver al login</Link>
                </form>
            </div>
        </section>
    );
}
