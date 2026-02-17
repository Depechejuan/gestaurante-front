import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

import getToken from "../services/get-token"
import getEmpleados from "../services/get-empleados";
import PhotoContainer from "./PhotoContainer";

import "../styles/Admin/users.css"

import anon from '../assets/img/empty-user.png'

export default function Empleados() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [token] = useState(() => getToken());

    const navigate = useNavigate();

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


    const rol = ["Administrador", "Camarero", "Cocinero"];
    return (
        <>
            <h2>Listado de Usuarios</h2>
            <hr></hr>
            {users.map(user => (
                <article key={user.id} className="user-basic">
                    <Link to={`/dashboard/empleados/${user.id}`} className="user-container" state={{user}}>
                        <PhotoContainer photoURL={user.imageURL ? user.imageURL : anon} style="user-photo" alt={user.nombre} />
                        <div className="user-info">
                            <p className="user-rol">{rol[user.tipo]}</p>
                            <p className="user-name">{user.nombre} {user.apellido1} {user.apellido2}</p>
                            <p>{user.email}</p>
                        </div>
                    </Link>
                </article>
            ))
            }
        </>
    )
}