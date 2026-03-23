import ContactForm from "../Components/Forms/Contact-Form"
import "../styles/Customer/form.css"
export default function Contact() {
    return (
        <section className="public-page public-page--contact">
            <section className="public-page__hero">
                <p className="public-eyebrow">Contacto</p>
                <h1>Estamos al otro lado</h1>
                <p>
                    Escríbenos si quieres reservar en el futuro, comentar una experiencia o
                    simplemente resolver una duda antes de venir.
                </p>
            </section>

            <section className="contact-layout">
                <div className="contact-copy">
                    <article className="public-info-card">
                        <span>Email</span>
                        <strong><a className="email-link" href="mailto:admin@gestaurante.com">admin@gestaurante.com</a></strong>
                    </article>
                    <article className="public-info-card">
                        <span>Telefono</span>
                        <strong>+34 666 123 456</strong>
                    </article>
                    <article className="public-info-card">
                        <span>Horario</span>
                        <strong>Mar-Dom · 13:00-16:00 / 20:00-23:30</strong>
                    </article>
                </div>

                <div className="contact-form-wrapper">
                    <h2>Mandanos un mensaje</h2>
                    <p>Si todavia no podemos resolverlo por automatismos, al menos podemos dejarte un canal claro y cuidado.</p>
                    <ContactForm />
                </div>
            </section>
        </section>
    )
}
