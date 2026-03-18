import { Link } from "react-router-dom";
import logo from "../assets/logo/gestaurante-logo.png";

function Home() {
    return (
        <section className="public-page public-page--home">
            <section className="hero-customer">
                <div className="hero-customer__content">
                    <p className="public-eyebrow">Restaurante de barrio, cocina con calma</p>
                    <h1>Gestaurante Lorem Ipsum</h1>
                    <p className="hero-customer__lead">
                        Un espacio pensado para comer bien, alargar la sobremesa y volver porque
                        te sientes como en casa desde el primer minuto.
                    </p>
                    <div className="hero-customer__actions">
                        <Link to="/carta" className="customer-link-button customer-link-button--primary">Ver carta</Link>
                        <Link to="/contacto" className="customer-link-button customer-link-button--secondary">Contactar</Link>
                    </div>
                </div>

                <figure className="rest-container">
                    <img src={logo} alt="Logotipo de Gestaurante" />
                </figure>
            </section>

            <section className="public-info-grid">
                <article className="public-info-card">
                    <span>Producto</span>
                    <strong>Carta viva</strong>
                    <p>La carta publica sigue apoyada en mocks, pero ya refleja una estructura navegable por tipos.</p>
                </article>
                <article className="public-info-card">
                    <span>Experiencia</span>
                    <strong>Sin prisas</strong>
                    <p>Diseñamos la parte publica para transmitir calma, claridad y acceso directo a lo importante.</p>
                </article>
                <article className="public-info-card">
                    <span>Reserva</span>
                    <strong>Proximamente</strong>
                    <p>La reserva de mesa todavia no esta implementada, pero el hueco de producto ya queda anticipado.</p>
                </article>
            </section>

            <section className="story-block show-left">
                <figure className="rest-container">
                    <img src={logo} alt="Identidad visual de Gestaurante" />
                </figure>
                <div className="story-copy">
                    <p className="public-eyebrow">Ambiente</p>
                    <h2>Comer bien tambien es sentirse a gusto</h2>
                    <p className="rest-text">Desde el momento en que cruzas la puerta, queremos que te sientas cómodo y bienvenido. Nuestro espacio está pensado para que disfrutes sin prisas, en un ambiente cálido donde cada detalle invita a relajarse y a quedarse un rato más.
                    </p>
                    <p className="rest-text">
                    Un interior cuidado, cercano y sin artificios, donde la sencillez y la calidez crean el escenario perfecto para disfrutar de buena comida y mejor compañía.
                    </p>
                </div>
            </section>

            <section className="story-block show-right">
                <figure className="rest-container">
                    <img src={logo} alt="Marca Gestaurante" />
                </figure>
                <div className="story-copy">
                    <p className="public-eyebrow">Momentos</p>
                    <h2>Una mesa para conversar, compartir y volver</h2>
                    <p className="rest-text">Aquí no solo vienes a comer, vienes a compartir momentos, conversaciones y buenos recuerdos.
                    </p>
                    <p className="rest-text">
                    Nuestro restaurante es un lugar para sentarse, desconectar del ritmo de fuera y dejarse llevar por una experiencia pensada para disfrutar con todos los sentidos.
                    </p>
                </div>
            </section>

            <section className="public-cta-band">
                <div>
                    <p className="public-eyebrow">Proximo paso</p>
                    <h2>Explora la carta o escribenos</h2>
                    <p>Si aun no sabes por donde empezar, la carta publica ya te deja ir directamente a cada tipo de plato.</p>
                </div>
                <div className="hero-customer__actions">
                    <Link to="/carta" className="customer-link-button customer-link-button--primary">Ir a carta</Link>
                    <Link to="/contacto" className="customer-link-button customer-link-button--secondary">Hablar con nosotros</Link>
                </div>
            </section>
        </section>
    )
}

export default Home;
