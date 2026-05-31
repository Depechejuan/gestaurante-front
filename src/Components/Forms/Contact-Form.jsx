import { useState } from "react";
import { sendContactMessage } from "../../services/contact";

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        setIsSubmitting(true);
        setFeedback(null);

        try {
            await sendContactMessage({
                name: formData.get("name"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                subject: formData.get("subject"),
                message: formData.get("message")
            });

            form.reset();
            setFeedback({
                type: "success",
                message: "Hemos recibido tu mensaje. Te responderemos lo antes posible."
            });
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.message || "No se ha podido enviar el mensaje. Inténtalo de nuevo en unos minutos."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="customer-contact-form" onSubmit={handleSubmit}>
            <div className="customer-form-group">
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" name="name" placeholder="Tu nombre" required disabled={isSubmitting} />
            </div>

            <div className="customer-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="tucorreo@email.com" required disabled={isSubmitting} />
            </div>

            <div className="customer-form-group">
                <label htmlFor="phone">Teléfono</label>
                <input type="tel" id="phone" name="phone" placeholder="+34 600 000 000" disabled={isSubmitting} />
            </div>

            <div className="customer-form-group">
                <label htmlFor="subject">Asunto</label>
                <input type="text" id="subject" name="subject" placeholder="Reserva, evento o consulta" disabled={isSubmitting} />
            </div>

            <div className="customer-form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                    id="message"
                    name="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows="5"
                    required
                    minLength="10"
                    disabled={isSubmitting}
                ></textarea>
            </div>

            <button type="submit" className="customer-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </button>

            {feedback && (
                <p
                    className={feedback.type === "error" ? "customer-form-error" : "customer-form-feedback"}
                    aria-live="polite"
                >
                    {feedback.message}
                </p>
            )}
        </form>
    );
}
