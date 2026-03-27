import ListPlatosPublic from "../Components/ListPlatosPublic";
import usePlatos from "../Hooks/usePlatos";
import '../styles/Customer/platos.css'

function resolvePlatoType(plato, index) {
    return (
        plato?.categoria ||
        plato?.tipo ||
        plato?.categoriaDescripcion ||
        (plato?.idCategoria ? `Categoria ${String(plato.idCategoria).slice(0, 4)}` : null) ||
        ["Entrantes", "Pastas", "Paellas", "Carnes", "Postres"][index % 5]
    );
}

export default function PlatosPublic() {
    const { platos, loading, error } = usePlatos();
    const platosConTipo = (platos ?? []).map((plato, index) => ({
        ...plato,
        tipoVisible: resolvePlatoType(plato, index)
    }));
    const tipos = [...new Set(platosConTipo.map((plato) => plato.tipoVisible))];

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
                    La carta publica ya se agrupa por tipo para que puedas saltar directo a cada
                    bloque. Si el backend no responde, el front conserva un fallback temporal para
                    no romper la experiencia.
                </p>
            </section>

            <nav className="menu-public__type-nav" aria-label="Tipos de platos">
                {tipos.map((tipo) => (
                    <a key={tipo} href={`#tipo-${tipo.toLowerCase().replace(/\s+/g, "-")}`}>
                        {tipo}
                    </a>
                ))}
            </nav>

            <ListPlatosPublic platos={platosConTipo} />
        </section>
    );
}
