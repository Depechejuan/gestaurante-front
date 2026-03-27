import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendCustomerCode, verifyCustomerEmail } from "../services/customer-account";

export default function CustomerVerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const defaultEmail = useMemo(() => new URLSearchParams(location.search).get("email") ?? "", [location.search]);
    const [email, setEmail] = useState(defaultEmail);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setFeedback("");
        try {
            await verifyCustomerEmail({ email, code });
            setFeedback("Email validado correctamente.");
            navigate("/login");
        } catch (err) {
            setError(err.message || "No se ha podido validar el código.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setFeedback("");
        try {
            await resendCustomerCode({ email });
            setFeedback("Te hemos reenviado el código.");
        } catch (err) {
            setError(err.message || "No se ha podido reenviar el código.");
        }
    };

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card login-card">
                <div className="login-card__copy">
                    <p className="public-eyebrow login-card__eyebrow">Validación email</p>
                    <h1>Confirma tu cuenta</h1>
                    <p>Introduce el código que te hemos enviado por email para activar el pedido online.</p>
                </div>
                <form onSubmit={handleVerify} className="customer-contact-form customer-contact-form--auth login-form">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Código</label>
                    <input value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} required />
                    {error && <p className="login-form__error">{error}</p>}
                    {feedback && <p className="menu-public__feedback">{feedback}</p>}
                    <button type="submit" className="customer-contact-form__submit" disabled={loading}>
                        {loading ? "Validando..." : "Validar email"}
                    </button>
                    <button type="button" className="staff-ops-secondary" onClick={handleResend}>Reenviar código</button>
                </form>
            </div>
        </section>
    );
}
