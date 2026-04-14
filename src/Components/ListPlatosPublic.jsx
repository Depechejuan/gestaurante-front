import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import cart from '../assets/Icons/cart.svg'

function formatPrice(price) {
    if (price == null || price === "")
        return "Precio pendiente";

    const numericPrice = Number.parseFloat(String(price).replace(",", "."));
    if (Number.isNaN(numericPrice))
        return `${price} EUR`;

    return `${numericPrice.toFixed(2)} EUR`;
}

function slugifyType(type) {
    return String(type).toLowerCase().replace(/\s+/g, "-");
}

export default function ListPlatosPublic({platos, onAddToCart, showTypeNav = true, typeNavSticky = true}) {
    const interactive = Boolean(onAddToCart);
    const [amounts, setAmounts] = useState({});
    const [basketFeedback, setBasketFeedback] = useState("");

    const groupedPlatos = useMemo(() => {
        const groups = new Map();
        (platos ?? []).forEach((plato) => {
            const publicId = String(plato.idPlato ?? plato.id ?? "");
            if (!publicId)
                return;

            const type = plato.tipoVisible ?? "Otros";
            const existing = groups.get(type) ?? [];
            existing.push({
                ...plato,
                _publicId: publicId
            });
            groups.set(type, existing);
        });
        return Array.from(groups.entries());
    }, [platos]);

    const handleChange = (id, value) => {
        setAmounts((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const addToBasket = (plato) => {
        if (!interactive)
            return;

        const amount = Number(amounts[plato._publicId] ?? 1);
        onAddToCart(plato, amount);
        setBasketFeedback(`${amount} x ${plato.nombre} añadido.`);
    };

    if (!groupedPlatos.length)
        return (
            <div className="menu-public__empty">
                <p>{interactive ? "No hay platos disponibles para pedir online en este momento." : "No hay platos visibles en la carta en este momento."}</p>
            </div>
        );

    const resolveIngredientes = (plato) => {
        if (Array.isArray(plato.ingredientes) && plato.ingredientes.length)
            return plato.ingredientes
                .map((ingrediente) => ingrediente.nombre ?? ingrediente)
                .filter(Boolean)
                .join(", ");

        return plato.ingredientes || "Ingredientes aun no definidos en detalle.";
    };

    return(
        <section className="menu-public">
            {interactive && basketFeedback && <p className="menu-public__feedback">{basketFeedback}</p>}

            {showTypeNav && groupedPlatos.length > 1 && (
                <nav
                    className={`menu-public__type-nav ${typeNavSticky ? "menu-public__type-nav--sticky" : ""}`.trim()}
                    aria-label="Tipos de platos"
                >
                    {groupedPlatos.map(([type]) => (
                        <a key={type} href={`#tipo-${slugifyType(type)}`}>
                            {type}
                        </a>
                    ))}
                </nav>
            )}

            {groupedPlatos.map(([type, items]) => (
                <section
                    key={type}
                    id={`tipo-${slugifyType(type)}`}
                    className="menu-public__group"
                >
                    <div className="menu-public__group-header">
                        <p className="public-eyebrow">Tipo</p>
                        <h2>{type}</h2>
                    </div>

                    <div className="platos-list">
                        {items.map((plato) => (
                            <article className="plato-unique" key={plato._publicId}>
                                <Link className="plato-media-link" to={`/carta/${plato._publicId}`}>
                                    <figure className="plato-media">
                                        {plato.imagen ? (
                                            <img src={plato.imagen} alt={plato.nombre} className="plato-pic" />
                                        ) : (
                                            <div className="plato-pic plato-pic--placeholder">Sin imagen</div>
                                        )}
                                    </figure>
                                </Link>

                                <section className="plato-info">
                                    <div className="plato-info__top">
                                        <h3>
                                            <Link className="plato-title-link" to={`/carta/${plato._publicId}`}>
                                                {plato.nombre}
                                            </Link>
                                        </h3>
                                    </div>
                                    <p className="plato-desc">{plato.descripcion}</p>
                                    <p className="plato-meta">
                                        {resolveIngredientes(plato)}
                                    </p>
                                    {!!plato.alergenos?.length && (
                                        <div className="plato-allergen-list">
                                            {plato.alergenos.map((alergeno) => (
                                                <span key={`${plato._publicId}-${alergeno}`} className="plato-allergen-badge">
                                                    {alergeno}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="plato-info__actions">
                                        <Link className="plato-detail-link" to={`/carta/${plato._publicId}`}>
                                            Ver detalle
                                        </Link>
                                    </div>
                                </section>

                                <section className={`plato-purchase ${interactive ? "" : "plato-purchase--browse"}`.trim()}>
                                    <strong className="plato-price">{formatPrice(plato.precio)}</strong>

                                    {interactive && (
                                        <section className="plato-cart">
                                            <label htmlFor={`amount-${plato._publicId}`} className="sr-only">Cantidad</label>
                                            <input
                                                id={`amount-${plato._publicId}`}
                                                className="plato-amount"
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={amounts[plato._publicId] ?? 1}
                                                onChange={(event) => handleChange(plato._publicId, event.target.value)}
                                            />
                                            <button type="button" className="cart-button cart-button--inline" onClick={() => addToBasket(plato)}>
                                                <img className="cart" src={cart} alt="" />
                                                <span>Anadir</span>
                                            </button>
                                        </section>
                                    )}
                                </section>
                            </article>
                        ))}
                    </div>
                </section>
            ))}
        </section>
    ) 
}
