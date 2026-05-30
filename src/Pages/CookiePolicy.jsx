export default function CookiePolicy() {
    return (
        <section className="public-page cookie-policy-page">
            <section className="public-page__hero">
                <p className="public-eyebrow">Política de cookies</p>
                <h1>Cómo usamos cookies en Gestaurante</h1>
                <p>
                    Esta página resume el uso de cookies y almacenamiento local dentro de la web:
                    sesiones de usuario, pedidos online, mesas QR y preferencias básicas del navegador.
                </p>
            </section>

            <section className="cookie-policy-grid" aria-label="Uso de cookies">
                <article className="public-info-card">
                    <span>Imprescindibles</span>
                    <strong>Sesion y seguridad</strong>
                    <p>
                        Conservan el acceso de clientes y empleados, ayudan a proteger las rutas privadas y
                        mantienen la experiencia estable mientras se navega.
                    </p>
                </article>

                <article className="public-info-card">
                    <span>Pedidos</span>
                    <strong>Carrito y mesa</strong>
                    <p>
                        Guardan temporalmente platos, cantidades, mesa activa y preferencias del checkout para
                        que un pedido no se pierda al cambiar de pantalla.
                    </p>
                </article>

                <article className="public-info-card">
                    <span>Preferencias</span>
                    <strong>Aviso de cookies</strong>
                    <p>
                        Recuerdan si has cerrado el banner para no mostrarlo en cada visita. Aceptar y rechazar
                        solo ocultan el aviso en esta versión.
                    </p>
                </article>
            </section>

            <section className="cookie-policy-note">
                <h2>Sin publicidad ni analítica real</h2>
                <p>
                    No usamos cookies de publicidad, perfiles comerciales ni medición externa en esta versión.
                    Puedes borrar estos datos desde la configuración de tu navegador cuando quieras.
                </p>
            </section>
        </section>
    );
}
