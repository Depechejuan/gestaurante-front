import cart from '../assets/Icons/cart.svg'

export default function ListPlatosPublic({platos}) {

    const handleChange = (e) => {
        
    }

    const addToBasket = (e) => {

    }

    return(
        <section className="platos-list">
            <article className="plato-unique" >
                <figure>
                    <img className="plato-pic" />
                    <p>imagen</p>
                </figure>
                {/* linea divisora*/}
                <section className="plato-info">
                    <h3>nombre del Plato</h3>
                    <p className="plato-desc">descripcion del plato Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta ea nostrum voluptates est, quasi saepe in quas. Labore dignissimos deleniti voluptates alias dolorem quod rerum. Velit placeat ratione explicabo molestiae.</p>
                    <p>ingredientes</p> {/** Map */}
                </section>

                <section className="plato-cart">
                    <input className="plato-amount" type="number" min="1" max="10" value={0} onChange={handleChange} />
                    <img className="cart" src={cart} alt="Añadir al carrito" onClick={addToBasket}/>
                </section>
            </article>
            {platos && platos.map(plato => (
                <article className="plato-unique" key={plato.id}>
                    <figure>
                        <img src={plato.imagen} alt={plato.descripcion} className="plato-pic" />
                    </figure>
                    {/* linea divisora*/}
                    <section className="plato-info">
                        <h3>{plato.nombre}</h3>
                        <p className="plato-desc">{plato.descripcion}</p>
                        <p>{plato.ingredientes}</p> {/** Map */}
                    </section>

                    <section className="plato-cart">
                        <input
                            className="plato-amount" type="number"
                            min="1"
                            max="10"
                            value={0}
                            onChange={handleChange} />
                        <img className="cart" src={cart} alt="Añadir al carrito" onClick={addToBasket}/>
                    </section>
                </article>
            ))}
        </section>
    ) 
}