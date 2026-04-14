import { Link } from "react-router-dom";
import ListPlatosPublic from "../Components/ListPlatosPublic";
import usePlatos from "../Hooks/usePlatos";
import { decorateCatalogItems } from "../utils/catalog";
import '../styles/Customer/platos.css'

export default function PlatosPublic() {
    const { platos, loading, error } = usePlatos();
    const platosConTipo = decorateCatalogItems(platos ?? []);

    if (loading) {
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Carta</p>
                    <h1>Nuestra carta</h1>
                    <p>Cargando platos...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Carta</p>
                    <h1>Nuestra carta</h1>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="public-page public-page--menu">
            <section className="menu-public__hero">
                <p className="public-eyebrow">Carta</p>
                <h1>Explora la carta por tipo</h1>
                <p>
                    Esta vista es solo informativa: sirve para descubrir platos, precios y tipos.
                    Si quieres comprar, usa el pedido online o escanea el QR de tu mesa cuando
                    estés en el restaurante.
                </p>
                <div className="menu-public__cta-row">
                    <Link to="/pedido-online" className="menu-public__cta menu-public__cta--primary">
                        Ir a pedido online
                    </Link>
                    <span className="menu-public__cta-note">En sala, el pedido se hace desde el QR de la mesa.</span>
                </div>
            </section>

            <ListPlatosPublic platos={platosConTipo} />
        </section>
    );
}
