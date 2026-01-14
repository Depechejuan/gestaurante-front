import "../styles/Customer/form.css"
export default function Contact() {


    return (
        <>
            <h2>Contacta con nosotros</h2>
            <p>Si tienes alguna sugerencia, queja, o por cualquier otro motivo, ¡No dudes en contactarnos por mediación de este formulario!</p>
            <p>También puedes mandarnos un email a <a href="mailto:admin@gestaurante.com">admin@gestaurante.com</a></p>
            <p>O llámanos al 666123456</p>

            <form class="customer-contact-form">

                <div class="customer-form-group">
                    <label for="name">Nombre</label>
                    <input type="text" id="name" name="name" placeholder="Tu nombre" required />
                </div>

                <div class="customer-form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="tucorreo@email.com" required />
                </div>

                <div class="customer-form-group">
                    <label for="phone">Teléfono</label>
                    <input type="tel" id="phone" name="phone" placeholder="+34 600 000 000" />
                </div>

                <div class="customer-form-group">
                    <label for="message">Mensaje</label>
                    <textarea
                    id="message"
                    name="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows="5"
                    required
                    ></textarea>
                </div>

                <button type="submit" class="customer-btn-primary">
                    Enviar mensaje
                </button>
            </form>
        </>
    )
}