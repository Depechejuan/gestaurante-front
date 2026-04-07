import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

import getToken from "../services/get-token"
import getEmpleados from "../services/get-empleados";
import PhotoContainer from "./PhotoContainer";
import { resolveEmployeeRoleClass, resolveEmployeeRoleName } from "../constants/roles";

import "../styles/Admin/users.css"

import anon from '../assets/img/empty-user.png'

export default function Empleados() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [token] = useState(() => getToken());

    useEffect(() => {
        if (!token?.token) {
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
                    setError(err?.message || "No se ha podido cargar la lista de empleados.")
                    setLoading(false)
                }
            }
        }
        fetchData()
        return () => {
            isMounted = false;
        }
    }, [token])

    if (loading) {
        return (
            <section className="users-shell">
                <div className="users-toolbar">
                    <div>
                        <p className="users-eyebrow">Equipo</p>
                        <h2>Listado de usuarios</h2>
                    </div>
                </div>
                <div className="users-empty">
                    <progress></progress>
                    <p>Cargando usuarios...</p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="users-shell">
                <div className="users-toolbar">
                    <div>
                        <p className="users-eyebrow">Equipo</p>
                        <h2>Listado de usuarios</h2>
                    </div>
                </div>
                <div className="users-empty">
                    <p>{error}</p>
                </div>
            </section>
        )
    }

    return (
        <section className="users-shell">
            <div className="users-toolbar">
                <div>
                    <p className="users-eyebrow">Equipo</p>
                    <h2>Listado de usuarios</h2>
                    <p>Acceso rapido a fichas de empleado, rol y datos de contacto.</p>
                </div>

                <div className="users-summary-card">
                    <span>Total visible</span>
                    <strong>{users.length}</strong>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="users-empty">
                    <p>No hay usuarios disponibles en este momento.</p>
                </div>
            ) : (
                <div className="users-grid">
                    {users.map((user) => (
                        <article key={user.id} className="user-basic">
                            <Link to={`/dashboard/empleados/${user.id}`} className="user-container" state={{user}}>
                                <PhotoContainer photoURL={user.imageURL ? user.imageURL : anon} style="user-photo" alt={user.nombre} />
                                <div className="user-info">
                                    <span className={`user-role-pill ${resolveEmployeeRoleClass(user.tipo)}`}>{resolveEmployeeRoleName(user.tipo)}</span>
                                    <h3 className="user-name">{user.nombre} {user.apellido1} {user.apellido2}</h3>
                                    <p className="user-email">{user.email}</p>
                                    <span className="user-action">Abrir ficha</span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}
