import ContactForm from "../Components/Forms/Contact-Form"
import "../styles/Customer/form.css"
export default function Contact() {


    return (
        <>
            <h2>Contacta con nosotros</h2>
            <p>Si tienes alguna sugerencia, queja, o por cualquier otro motivo, ¡No dudes en contactarnos por mediación de este formulario!</p>
            <p>También puedes mandarnos un email a <a className="email-link" href="mailto:admin@gestaurante.com">admin@gestaurante.com</a></p>
            <p>O llámanos al 666123456</p>

            <ContactForm />
        </>
    )
}