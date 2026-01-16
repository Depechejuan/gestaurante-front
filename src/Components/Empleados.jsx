import { useEffect, useState } from "react"
import getToken from "../services/get-token"
import getEmpleados from "../services/get-empleados";

export default function Empleados() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [token] = useState(() => getToken());


    useEffect(() => {
        if (!token) {
            setUsers([]);
            setLoading(false);
            return;
        }

        let isMounted = true;
        
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getEmpleados(token);
                console.log(data);
                if (isMounted) {
                    setUsers(data)
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError("Something went wrong")
                    setLoading(false)
                }
                console.error(err)
            }
        }
        fetchData()
        return () => {
            isMounted = false;
        }
    }, [token])

    if (loading) return <progress></progress>
    if (error) return <p>{error}</p> // Llevar a un componente

    return (
        <main>
            <h2>Listado de Usuarios</h2>
            {
                users.map(user => (
                <article key={user.id} className="user-basic">
                    <p className="user-name">{user.nombre}</p>
                </article>
                ))
            }
        </main>
    )
}