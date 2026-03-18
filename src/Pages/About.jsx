export default function About() {
    return(
        <section className="public-page public-page--about">
            <section className="public-page__hero">
                <p className="public-eyebrow">Quienes somos</p>
                <h1>Una casa de comidas actual, cercana y sin artificios</h1>
                <p>
                    Gestaurante nace con una idea sencilla: servir platos reconocibles, bien
                    trabajados y en un espacio donde el trato importa tanto como la cocina.
                </p>
            </section>

            <section className="public-info-grid">
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
            </section>
        </section>
    )
}
