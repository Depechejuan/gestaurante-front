import { Link } from "react-router-dom";

const aboutTeamImage = "https://res.cloudinary.com/dfhtelvmc/image/upload/f_auto,q_auto,w_1400/v1780170072/gestaurante/site/about-team.jpg";

export default function About() {
    return(
        <section className="public-page public-page--about">
            <section className="about-hero">
                <div className="about-hero__copy">
                    <p className="public-eyebrow">Quienes somos</p>
                    <h1>Una casa de comidas actual, cercana y con oficio</h1>
                    <p className="about-hero__lead">
                        Gestaurante nace con una idea sencilla: servir platos reconocibles,
                        bien trabajados y en un espacio donde el trato importa tanto como la cocina.
                    </p>
                    <div className="hero-customer__actions">
                        <Link to="/carta" className="customer-link-button customer-link-button--primary">Ver carta</Link>
                        <Link to="/contacto" className="customer-link-button customer-link-button--secondary">Contactar</Link>
                    </div>
                </div>

                <figure className="about-hero__media">
                    <img src={aboutTeamImage} alt="Equipo de restaurante atendiendo en una sala calida" />
                    <figcaption>
                        <span>Equipo</span>
                        <strong>Sala y cocina trabajando como una sola mesa</strong>
                    </figcaption>
                </figure>
            </section>

            <section className="about-highlights" aria-label="Puntos clave de Gestaurante">
                <article>
                    <strong>3</strong>
                    <span>zonas conectadas: cocina, sala y barra</span>
                </article>
                <article>
                    <strong>100%</strong>
                    <span>carta pensada para elegir sin complicarse</span>
                </article>
                <article>
                    <strong>1</strong>
                    <span>forma de trabajar: calma, criterio y cercania</span>
                </article>
            </section>

            <section className="about-story">
                <div className="about-story__intro">
                    <p className="public-eyebrow">Nuestra manera</p>
                    <h2>Buen producto, servicio atento y una sala donde apetece quedarse</h2>
                </div>

                <div className="about-story__grid">
                    <article className="public-info-card">
                        <span>Filosofia</span>
                        <strong>Menos ruido, mas criterio</strong>
                        <p>Nos interesa una carta clara, producto tratado con respeto y un servicio que haga facil disfrutar.</p>
                    </article>
                    <article className="public-info-card">
                        <span>Equipo</span>
                        <strong>Sala y cocina conectadas</strong>
                        <p>La experiencia no se entiende como piezas separadas: cocina, barra y sala forman una misma conversacion.</p>
                    </article>
                    <article className="public-info-card">
                        <span>Espacio</span>
                        <strong>Calido y funcional</strong>
                        <p>Queremos un sitio al que apetezca venir entre semana, repetir el fin de semana y recomendar sin pensarlo.</p>
                    </article>
                </div>
            </section>

            <section className="about-service">
                <div>
                    <p className="public-eyebrow">Lo que cuidamos</p>
                    <h2>Una experiencia sencilla, pero bien medida</h2>
                    <p>
                        Desde una comida rapida entre semana hasta una mesa larga de fin de semana,
                        buscamos que cada visita tenga ritmo, claridad y una atencion cercana.
                    </p>
                </div>

                <ol className="about-service__list">
                    <li>
                        <span>01</span>
                        <strong>Elegir facil</strong>
                        <p>Platos reconocibles, categorias claras y una carta preparada para decidir sin vueltas.</p>
                    </li>
                    <li>
                        <span>02</span>
                        <strong>Comer a gusto</strong>
                        <p>Ambiente calido, sala cuidada y un equipo pendiente sin invadir la conversacion.</p>
                    </li>
                    <li>
                        <span>03</span>
                        <strong>Volver con ganas</strong>
                        <p>Una experiencia consistente, cercana y pensada para recomendar sin pensarlo.</p>
                    </li>
                </ol>
            </section>

            <section className="public-cta-band about-cta">
                <div>
                    <p className="public-eyebrow">Te esperamos</p>
                    <h2>Empieza por la carta y dejate llevar</h2>
                    <p>Si quieres saber como sabe Gestaurante, la mejor entrada es mirar lo que estamos sirviendo hoy.</p>
                </div>
                <div className="hero-customer__actions">
                    <Link to="/carta" className="customer-link-button customer-link-button--primary">Explorar carta</Link>
                    <Link to="/contacto" className="customer-link-button customer-link-button--secondary">Hablar con nosotros</Link>
                </div>
            </section>
        </section>
    )
}
