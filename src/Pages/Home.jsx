import { Link } from "react-router-dom";
import logo from "../assets/logo/gestaurante-logo.png";

function Home() {

    return (
        <>
            <h1>Restaurante {`Lorem Ipsum`}</h1>
            <div className="show-left">
                <figure className="rest-container">
                    <img src={logo} alt="Gestaurante" />
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

            <div className="show-right">
                <figure className="rest-container">
                    <img src={logo} alt="Ambiente del restaurante" />
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
