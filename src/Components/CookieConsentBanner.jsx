import { useState } from "react";
import { Link } from "react-router-dom";

export const COOKIE_CONSENT_STORAGE_KEY = "gestaurante.cookie-consent";

function hasStoredCookieChoice() {
    try {
        return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) !== null;
    } catch {
        return false;
    }
}

function storeCookieChoice(choice) {
    try {
        window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
    } catch {
        // The visual state still closes even if private browsing blocks storage.
    }
}

export default function CookieConsentBanner() {
    const [isHidden, setIsHidden] = useState(hasStoredCookieChoice);

    function dismiss(choice) {
        storeCookieChoice(choice);
        setIsHidden(true);
    }

    if (isHidden) {
        return null;
    }

    return (
        <aside className="cookie-banner" aria-label="Aviso sobre cookies">
            <div className="cookie-banner__content">
                <p className="cookie-banner__eyebrow">Privacidad y cookies</p>
                <h2>Usamos cookies para que el pedido fluya</h2>
                <p>
                    Guardamos datos técnicos de sesión, cuenta, mesa y carrito para mantener el login,
                    recordar tu pedido online y evitar que pierdas el contexto mientras navegas.
                </p>
            </div>

            <div className="cookie-banner__actions">
                <button
                    type="button"
                    className="cookie-banner__button cookie-banner__button--primary"
                    onClick={() => dismiss("accepted")}
                >
                    Aceptar
                </button>
                <button
                    type="button"
                    className="cookie-banner__button cookie-banner__button--secondary"
                    onClick={() => dismiss("rejected")}
                >
                    Rechazar
                </button>
                <Link className="cookie-banner__link" to="/politica-cookies">
                    Más información
                </Link>
            </div>
        </aside>
    );
}
