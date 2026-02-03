import usePlatos from "../Hooks/usePlatos";

export default function PlatosAdmin() {
    const { platos, loading, error } = usePlatos();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            <h1>Carta</h1>
            <p>Lista de platos</p>
            {platos.map(plato => (
                <PlatoAdminCard // Definir el Componente PlatoAdminCard
                    key={plato.id}
                    plato={plato}
                />
            ))}
        </section>
    );
}
