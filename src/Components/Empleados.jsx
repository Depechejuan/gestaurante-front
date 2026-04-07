import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom";

import getToken from "../services/get-token"
import getEmpleados from "../services/get-empleados";
import PhotoContainer from "./PhotoContainer";
import { resolveEmployeeRoleClass, resolveEmployeeRoleName, resolveEmployeeRoleValue } from "../constants/roles";
import { formatDni, formatNuss } from "../utils/identity";

import "../styles/Admin/users.css"

import anon from '../assets/img/empty-user.png'

const employeeSections = [
    { key: "administradores", title: "Administradores", roleValue: 0 },
    { key: "camareros", title: "Camareros", roleValue: 1 },
    { key: "cocineros", title: "Cocineros", roleValue: 2 },
    { key: "repartidores", title: "Repartidores", roleValue: 3 }
];

function sortEmployees(leftEmployee, rightEmployee) {
    const leftName = `${leftEmployee.nombre} ${leftEmployee.apellido1} ${leftEmployee.apellido2}`.trim();
    const rightName = `${rightEmployee.nombre} ${rightEmployee.apellido1} ${rightEmployee.apellido2}`.trim();
    return leftName.localeCompare(rightName, "es");
}

function buildEmployeeSections(users) {
    const activeUsers = users.filter((user) => user.activo);
    const inactiveUsers = users.filter((user) => !user.activo).sort(sortEmployees);

    return [
        ...employeeSections.map((section) => ({
            ...section,
            users: activeUsers
                .filter((user) => Number(resolveEmployeeRoleValue(user.tipo)) === section.roleValue)
                .sort(sortEmployees)
        })),
        {
            key: "desactivados",
            title: "Empleados desactivados",
            users: inactiveUsers
        }
    ].filter((section) => section.users.length);
}

export default function Empleados() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [token] = useState(() => getToken());
    const groupedUsers = useMemo(() => buildEmployeeSections(users), [users]);

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
                <div className="users-sections">
                    {groupedUsers.map((section) => (
                        <section key={section.key} className="users-section">
                            <div className="users-section__header">
                                <div>
                                    <p className="users-eyebrow">Equipo</p>
                                    <h3>{section.title}</h3>
                                </div>
                                <span className="users-section__count">{section.users.length}</span>
                            </div>

                            <div className="users-grid">
                                {section.users.map((user) => (
                                    <article key={user.id} className="user-basic">
                                        <Link to={`/dashboard/empleados/${user.id}`} className="user-container" state={{user}}>
                                            <PhotoContainer photoURL={user.imageURL ? user.imageURL : anon} style="user-photo" alt={user.nombre} />
                                            <div className="user-info">
                                                <span className={`user-role-pill ${resolveEmployeeRoleClass(user.tipo)}`}>{resolveEmployeeRoleName(user.tipo)}</span>
                                                <h3 className="user-name">{user.nombre} {user.apellido1} {user.apellido2}</h3>
                                                <p className="user-email">{user.email}</p>
                                                <ul className="user-meta-list">
                                                    <li>DNI: {formatDni(user.dni) || "No indicado"}</li>
                                                    <li>NUSS: {formatNuss(user.nuss) || "No indicado"}</li>
                                                </ul>
                                                <span className="user-action">Abrir ficha</span>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </section>
    )
}
