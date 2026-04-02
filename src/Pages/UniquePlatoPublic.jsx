import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicDish } from "../services/public-catalog";
import "../styles/Customer/platos.css";

function formatPrice(price) {
    const numericPrice = Number.parseFloat(String(price ?? 0).replace(",", "."));
    if (Number.isNaN(numericPrice))
        return "Precio pendiente";

    return `${numericPrice.toFixed(2)} EUR`;
}

export default function UniquePlatoPublic() {
    const { id } = useParams();
    const [plato, setPlato] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadDish = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await getPublicDish(id);
                if (!cancelled)
                    setPlato(response?.data ?? null);
            } catch (err) {
                if (!cancelled)
                    setError(err.message || "No se ha podido cargar el detalle del plato.");
            } finally {
                if (!cancelled)
                    setLoading(false);
            }
        };

        if (id)
            loadDish();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const ingredientes = useMemo(
        () => (plato?.ingredientes ?? []).map((ingrediente) => ingrediente.nombre ?? ingrediente).filter(Boolean),
        [plato]
    );

    if (loading) {
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Carta</p>
                    <h1>Cargando detalle del plato...</h1>
                </div>
            </section>
        );
    }

    if (error || !plato) {
        return (
            <section className="public-page public-page--menu">
                <div className="menu-public__hero">
                    <p className="public-eyebrow">Carta</p>
                    <h1>No hemos encontrado ese plato</h1>
                    <p>{error || "El plato solicitado ya no está disponible."}</p>
                    <div className="menu-public__cta-row">
                        <Link to="/carta" className="menu-public__cta menu-public__cta--primary">
                            Volver a la carta
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="public-page public-page--menu">
            <section className="plato-detail-card">
                <div className="plato-detail-card__media">
                    {plato.imagen ? (
                        <img src={plato.imagen} alt={plato.nombre} className="plato-detail-card__image" />
                    ) : (
                        <div className="plato-detail-card__placeholder">Sin imagen</div>
                    )}
                </div>

                <div className="plato-detail-card__content">
                    <div className="plato-detail-card__header">
                        <div>
                            <p className="public-eyebrow">Carta · {plato.categoriaDescripcion || "Plato"}</p>
                            <h1>{plato.nombre}</h1>
                        </div>
                        <strong className="plato-detail-card__price">{formatPrice(plato.precio)}</strong>
                    </div>

                    <p className="plato-detail-card__description">{plato.descripcion}</p>

                    <section className="plato-detail-card__section">
                        <h2>Ingredientes</h2>
                        {ingredientes.length ? (
                            <ul className="plato-detail-card__list">
                                {ingredientes.map((ingrediente) => (
                                    <li key={ingrediente}>{ingrediente}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay ingredientes detallados todavía.</p>
                        )}
                    </section>

                    <section className="plato-detail-card__section">
                        <h2>Alérgenos</h2>
                        {plato.alergenos?.length ? (
                            <div className="plato-detail-card__allergens">
                                {plato.alergenos.map((alergeno) => (
                                    <span key={alergeno} className="plato-allergen-badge plato-allergen-badge--detail">
                                        {alergeno}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p>No se han detectado alérgenos comunes a partir de los ingredientes cargados.</p>
                        )}
                    </section>

                    <div className="menu-public__cta-row">
                        <Link to="/carta" className="menu-public__cta">
                            Volver a la carta
                        </Link>
                        <Link to="/pedido-online" className="menu-public__cta menu-public__cta--primary">
                            Pedir online
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    );
}
