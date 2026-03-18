import { useMemo, useState } from "react";
import cart from '../assets/Icons/cart.svg'

export default function ListPlatosPublic({platos}) {
    const [amounts, setAmounts] = useState({});
    const [basketFeedback, setBasketFeedback] = useState("");

    const groupedPlatos = useMemo(() => {
        const groups = new Map();
        (platos ?? []).forEach((plato, index) => {
            const type = plato.tipoVisible ?? "Otros";
            const existing = groups.get(type) ?? [];
            existing.push({
                ...plato,
                _fallbackId: plato.id ?? plato.idPlato ?? `${type}-${index}`
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
        const amount = Number(amounts[plato._fallbackId] ?? 1);
        setBasketFeedback(`${amount} x ${plato.nombre} añadido al carrito mock.`);
    };

    if (!groupedPlatos.length) {
        return (
            <div className="menu-public__empty">
                <p>Aun no hay platos visibles en la carta publica.</p>
            </div>
        );
    }

    return(
        <section className="menu-public">
            {basketFeedback && <p className="menu-public__feedback">{basketFeedback}</p>}

            {groupedPlatos.map(([type, items]) => (
                <section
                    key={type}
                    id={`tipo-${type.toLowerCase().replace(/\s+/g, "-")}`}
                    className="menu-public__group"
                >
                    <div className="menu-public__group-header">
                        <p className="public-eyebrow">Tipo</p>
                        <h2>{type}</h2>
                    </div>

                    <div className="platos-list">
                        {items.map((plato) => (
                            <article className="plato-unique" key={plato._fallbackId}>
                                <figure className="plato-media">
                                    {plato.imagen ? (
                                        <img src={plato.imagen} alt={plato.nombre} className="plato-pic" />
                                    ) : (
                                        <div className="plato-pic plato-pic--placeholder">Sin imagen</div>
                                    )}
                                </figure>

                                <section className="plato-info">
                                    <div className="plato-info__top">
                                        <h3>{plato.nombre}</h3>
                                        <strong>{plato.precio != null && plato.precio !== "" ? `${plato.precio} EUR` : "Precio pendiente"}</strong>
                                    </div>
                                    <p className="plato-desc">{plato.descripcion}</p>
                                    <p className="plato-meta">
                                        {plato.ingredientes || "Ingredientes aun no definidos en detalle."}
                                    </p>
                                </section>

                                <section className="plato-cart">
                                    <label htmlFor={`amount-${plato._fallbackId}`} className="sr-only">Cantidad</label>
                                    <input
                                        id={`amount-${plato._fallbackId}`}
                                        className="plato-amount"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={amounts[plato._fallbackId] ?? 1}
                                        onChange={(event) => handleChange(plato._fallbackId, event.target.value)}
                                    />
                                    <button type="button" className="cart-button" onClick={() => addToBasket(plato)}>
                                        <img className="cart" src={cart} alt="" />
                                        <span>Anadir</span>
                                    </button>
                                </section>
                            </article>
                        ))}
                    </div>
                </section>
            ))}
        </section>
    ) 
}
