import { Link } from "react-router-dom";
import imgMain from '../assets/restaurant/pexels-restaurant-1837150.jpg'
import imgShare from '../assets/restaurant/karriezhu-food-1050813.jpg'

function Home() {

    return (
        <>
            <h1>Restaurante {`Lorem Ipsum`}</h1>
            <div class="show-left">
                <figure class="rest-container">
                    <img src={imgMain}></img>
                </figure>
                <div>
                    <p className="rest-text">Desde el momento en que cruzas la puerta, queremos que te sientas cómodo y bienvenido. Nuestro espacio está pensado para que disfrutes sin prisas, en un ambiente cálido donde cada detalle invita a relajarse y a quedarse un rato más.
                    </p>
                    <p className="rest-text">
                    Un interior cuidado, cercano y sin artificios, donde la sencillez y la calidez crean el escenario perfecto para disfrutar de buena comida y mejor compañía.
                    </p>
                </div>
            </div>


            <hr></hr>

            <div class="show-right">
                <figure class="rest-container">
                    <img src={imgShare}></img>
                </figure>
                <div>
                    <p className="rest-text">Aquí no solo vienes a comer, vienes a compartir momentos, conversaciones y buenos recuerdos.
                    </p>
                    <p className="rest-text">
                    Nuestro restaurante es un lugar para sentarse, desconectar del ritmo de fuera y dejarse llevar por una experiencia pensada para disfrutar con todos los sentidos.
                    </p>
                </div>
            </div>


            <hr></hr>


            <p>Revisa nuestra Carta</p>
            <Link to="/carta">VER CARTA</Link>

            <p>También puedes reservarnos mesa aquí</p>
            <p className="secondary-color">Función no implementada</p>
        </>
    )
}

export default Home;