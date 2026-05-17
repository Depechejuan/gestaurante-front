import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { resendCustomerConfirmationEmail } from "../services/customer-account";

export default function CustomerVerifyEmail() {
    const location = useLocation();
    const defaultEmail = useMemo(() => new URLSearchParams(location.search).get("email") ?? "", [location.search]);
    const redirect = useMemo(() => new URLSearchParams(location.search).get("redirect") ?? "/pedido-online", [location.search]);
    const [email, setEmail] = useState(defaultEmail);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("Te hemos enviado un enlace de activación. Revisa tu correo para continuar.");
    const [loading, setLoading] = useState(false);

    const handleResend = async (event) => {
        event.preventDefault();
        setError("");
        setFeedback("");
        setLoading(true);

        try {
            await resendCustomerConfirmationEmail({ email });
            setFeedback("Si la cuenta sigue pendiente, recibirás un nuevo enlace de activación.");
        } catch (err) {
            setError(err?.message || "No se ha podido reenviar el enlace.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card login-card">
                <div className="login-card__copy">
                    <p className="public-eyebrow login-card__eyebrow">Validación email</p>
                    <h1>Revisa tu correo</h1>
                    <p>Activa tu cuenta desde el enlace que te hemos enviado. Caduca en una hora.</p>
                </div>
                <form onSubmit={handleResend} className="customer-contact-form customer-contact-form--auth login-form">
                    <div className="customer-form-group">
                        <label htmlFor="customer-verify-email">Email</label>
                        <input
                            id="customer-verify-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="login-form__error">{error}</p>}
                    {feedback && <p className="menu-public__feedback">{feedback}</p>}
                    <button type="submit" className="customer-btn-primary" disabled={loading}>
                        {loading ? "Enviando..." : "Reenviar enlace"}
                    </button>
                    <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="customer-btn-secondary customer-btn-secondary--full">
                        Volver al login
                    </Link>
                </form>
            </div>
        </section>
    );
}
