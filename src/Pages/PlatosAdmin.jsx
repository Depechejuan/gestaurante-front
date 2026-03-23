import { Link } from "react-router-dom";
import usePlatos from "../Hooks/usePlatos";
import PlatoAdminForm from "../Components/Forms/Plato-Admin-Form";
import "../styles/Admin/platos.css";

export default function PlatosAdmin() {
    const { platos, loading, error } = usePlatos();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="platos-admin-shell">
            <div className="platos-admin-header">
                <div>
                    <p className="plato-eyebrow">Backoffice carta</p>
                    <h1>Platos</h1>
                    <p>
                        Vista provisional para ir aterrizando la gestion de carta antes de
                        cerrar del todo platos, menus y su relacion con ingredientes.
                    </p>
                </div>

                <div className="platos-admin-summary">
                    <span>Registros visibles</span>
                    <strong>{platos?.length ?? 0}</strong>
                </div>
            </div>

            <PlatoAdminForm mode="create" />

            <section className="platos-admin-list">
                <div className="platos-admin-list__header">
                    <h2>Borradores o platos existentes</h2>
                    <p>Acceso a una ficha de edicion provisional por cada registro disponible.</p>
                </div>

                {!platos?.length ? (
                    <div className="platos-admin-empty">
                        <p>No hay platos visibles todavia.</p>
                    </div>
                ) : (
                    <div className="platos-admin-grid">
                        {platos.map((plato) => (
                            <article key={plato.id} className="plato-admin-card">
                                <div>
                                    <span className="plato-admin-card__state">
                                        {plato.disponible ? "Disponible" : "Oculto"}
                                    </span>
                                    <h3>{plato.nombre}</h3>
                                    <p>{plato.descripcion}</p>
                                </div>

                                <div className="plato-admin-card__meta">
                                    <span>{plato.precio ?? "Precio pendiente"}</span>
                                    <Link to={`/dashboard/plato/${plato.id}`} state={{ plato }}>
                                        Editar borrador
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}
