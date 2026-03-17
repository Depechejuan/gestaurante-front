import { Link, useLocation, useParams } from "react-router-dom";
import PlatoAdminForm from "../Components/Forms/Plato-Admin-Form";
import "../styles/Admin/platos.css";

export default function UniquePlatoAdmin() {
    const { id } = useParams();
    const location = useLocation();
    const plato = location.state?.plato ?? {
        nombre: "",
        descripcion: "",
        imagen: "",
        precio: "",
        disponible: false,
        categoria: "",
        ingredientes: "",
        menuNotes: "",
        tags: ""
    };

    return(
        <section className="platos-admin-shell">
            <div className="platos-admin-header">
                <div>
                    <p className="plato-eyebrow">Ficha de plato</p>
                    <h1>Edicion provisional</h1>
                    <p>
                        Registro {id}. Esta pantalla sigue siendo exploratoria y no representa
                        aun el modelo final de carta.
                    </p>
                </div>

                <Link to="/dashboard/carta" className="platos-admin-back">
                    Volver a carta
                </Link>
            </div>

            <PlatoAdminForm mode="edit" initialValues={plato} />
        </section>
    )
}
