import { useState } from "react";

export default function ContactForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
    };

    return(
        <form className="customer-contact-form" onSubmit={handleSubmit}>
                <div className="customer-form-group">
                    <label htmlFor="name">Nombre</label>
                    <input type="text" id="name" name="name" placeholder="Tu nombre" required />
                </div>

                <div className="customer-form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="tucorreo@email.com" required />
                </div>

                <div className="customer-form-group">
                    <label htmlFor="phone">Teléfono</label>
                    <input type="tel" id="phone" name="phone" placeholder="+34 600 000 000" />
                </div>

                <div className="customer-form-group">
                    <label htmlFor="message">Mensaje</label>
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

                {isSubmitted && (
                    <p className="customer-form-feedback">
                        Hemos recibido tu mensaje. Te responderemos lo antes posible.
                    </p>
                )}
            </form>
    )
}
