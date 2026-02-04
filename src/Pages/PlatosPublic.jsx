import usePlatos from "../Hooks/usePlatos";

export default function PlatosPublic() {
    const { platos, loading, error } = usePlatos();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            {platos.map(plato => (
                <PlatoCard key={plato.id} plato={plato} /> // Definir el Componente PlatoCard
            ))}
        </section>
    );
}
