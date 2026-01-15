import { Link } from "react-router-dom";
import Logo from "../Components/Logo";

function Home() {

    return (
        <>
            <h1>Restaurante {`Lorem Ipsum`}</h1>
            <p>En {`Lorem Ipsum`} hacemos comida casera y de calidad</p>
            <p>Revisa nuestra Carta</p>
            <Link to="/carta">VER CARTA </Link>

            <p>También puedes reservarnos mesa aquí</p>
            <p className="secondary-color">Función no implementada</p>
        </>
    )
}

export default Home;