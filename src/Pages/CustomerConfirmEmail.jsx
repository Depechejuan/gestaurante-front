import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { confirmCustomerEmail } from "../services/customer-account";

export default function CustomerConfirmEmail() {
    const location = useLocation();
    const token = useMemo(() => new URLSearchParams(location.search).get("token") ?? "", [location.search]);
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("Estamos activando tu cuenta.");

    useEffect(() => {
        let active = true;

        async function confirmEmail() {
            if (!token) {
                setStatus("error");
                setMessage("El enlace de activación no es válido.");
                return;
            }

            try {
                await confirmCustomerEmail({ token });
                if (!active)
                    return;

                setStatus("success");
                setMessage("Cuenta activada correctamente. Ya puedes iniciar sesión.");
            } catch (err) {
                if (!active)
                    return;

                setStatus("error");
                setMessage(err?.message || "No se ha podido activar la cuenta.");
            }
        }

        confirmEmail();

        return () => {
            active = false;
        };
    }, [token]);

    return (
        <section className="public-page public-page--login">
            <div className="customer-auth-card login-card">
                <div className="login-card__copy">
                    <p className="public-eyebrow login-card__eyebrow">Activación email</p>
                    <h1>Confirma tu cuenta</h1>
                    <p>Comprobamos el enlace de activación que has recibido por correo.</p>
                </div>

                <div className="customer-contact-form customer-contact-form--auth login-form">
                    {status === "loading" && <p className="customer-form-feedback">Validando enlace...</p>}
                    {status === "success" && <p className="menu-public__feedback">{message}</p>}
                    {status === "error" && <p className="login-form__error">{message}</p>}
                    <Link to="/login" className="customer-btn-primary">Entrar</Link>
                </div>
            </div>
        </section>
    );
}
