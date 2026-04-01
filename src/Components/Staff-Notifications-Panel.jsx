import { useStaffNotifications } from "../Auth/Staff-Notifications-Context";

export default function StaffNotificationsPanel() {
    const { notifications, dismissNotification } = useStaffNotifications();

    if (!notifications.length)
        return null;

    return (
        <section className="staff-notifications" aria-live="polite" aria-label="Notificaciones de staff">
            {notifications.map((notification) => (
                <article key={notification.id} className={`staff-notification-card staff-notification-card--${notification.type}`}>
                    <div>
                        <p className="staff-notification-card__title">{notification.title}</p>
                        <p className="staff-notification-card__message">{notification.message}</p>
                    </div>
                    <button
                        type="button"
                        className="staff-notification-card__close"
                        onClick={() => dismissNotification(notification.id)}
                        aria-label="Cerrar notificación"
                    >
                        ×
                    </button>
                </article>
            ))}
        </section>
    );
}
