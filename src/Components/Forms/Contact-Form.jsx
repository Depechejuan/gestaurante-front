export default function ContactForm() {

    return(
        <>
            <form className="customer-contact-form">
                <div className="customer-form-group">
                    <label for="name">Nombre</label>
                    <input type="text" id="name" name="name" placeholder="Tu nombre" required />
                </div>

                <div className="customer-form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="tucorreo@email.com" required />
                </div>

                <div className="customer-form-group">
                    <label for="phone">Teléfono</label>
                    <input type="tel" id="phone" name="phone" placeholder="+34 600 000 000" />
                </div>

                <div className="customer-form-group">
                    <label for="message">Mensaje</label>
                    <textarea
                    id="message"
                    name="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows="5"
                    required
                    ></textarea>
                </div>

                <button type="submit" className="customer-btn-primary">
                    Enviar mensaje
                </button>
            </form>
        </>
    )
}