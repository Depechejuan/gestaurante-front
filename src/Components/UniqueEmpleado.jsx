import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import getToken from "../services/get-token";
import getEmpleado from "../services/get-empleado";
import EditUser from "./Forms/Edit-User";

export default function UniqueEmpleado() {
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [token] = useState(()=> getToken())
    const [isShowed, setIsShowed] = useState(false)

    const { id } = useParams();
    let [filteredId] = id.split("/")

    
    useEffect(() => {
        if (!token){
            setUser([])
            setLoading(false)
            return;
        }

        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getEmpleado(filteredId, token);
                if (isMounted) {
                    setUser(data)
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

    const showForm = () => {
        setIsShowed(prev => !prev)
    }

    const rol = ["Administrador", "Camarero", "Cocinero"];

    return(
        <article className="user-detail">
            <h2>{user.nombre} {user.apellido1} {user.apellido2}</h2>
            <hr className="separador"></hr>
            <div className="user-detail-info">
                <p><span className="prop-bold">DNI</span>: {user.dni}</p>
                <p><span className="prop-bold">NUSS</span>: {user.nuss}</p>
                <p><span className="prop-bold">Email</span>: {user.email}</p>
                <p><span className="prop-bold">Rol</span>: {rol[user.tipo]}</p>
            </div>

            <button onClick={showForm}>Editar</button>
            {isShowed && (
                <EditUser />
            )}
        </article>
    )
}