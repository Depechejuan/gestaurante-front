import ListPlatosPublic from "../Components/ListPlatosPublic";
import usePlatos from "../Hooks/usePlatos";
import '../styles/Customer/platos.css'

export default function PlatosPublic() {
    const { platos, loading, error } = usePlatos();

    if (loading) return <progress>Cargando...</progress>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <h2>PLATOS</h2>
            <hr></hr>
            <p>Cat1, Cat2, Cat3</p>
            <hr></hr>
            <ListPlatosPublic platos={platos} />
        </>
    );
}
