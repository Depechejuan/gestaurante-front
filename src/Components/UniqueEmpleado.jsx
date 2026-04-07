import { useState } from "react"
import { Link, useLocation } from "react-router-dom";
import EditUser from "./Forms/Edit-User";
import PhotoContainer from "./PhotoContainer";
import { resolveEmployeeRoleClass, resolveEmployeeRoleName } from "../constants/roles";

import anon from '../assets/img/empty-user.png'

export default function UniqueEmpleado() {
    const [isShowed, setIsShowed] = useState(false)
    const location = useLocation();
    const user = location.state?.user;

    const showForm = () => {
        setIsShowed(prev => !prev)
    }

    if (!user) {
        return (
            <section className="user-detail user-detail--empty">
                <p className="users-eyebrow">Empleado</p>
                <h2>Ficha no disponible</h2>
                <p>
                    Esta vista necesita llegar desde el listado para reutilizar los datos del
                    usuario seleccionados en memoria.
                </p>
                <Link to="/dashboard/empleados" className="user-back-link">Volver al listado</Link>
            </section>
        )
    }

    return(
        <article className="user-detail">
            <div className="user-detail__hero">
                <div className="user-detail__identity">
                    <PhotoContainer photoURL={user.imageURL ? user.imageURL : anon} style="user-photo-full" alt={user.nombre} />
                    <div className="user-text">
                        <p className="users-eyebrow">Empleado</p>
                        <h2>{user.nombre} {user.apellido1} {user.apellido2}</h2>
                        <span className={`user-role-pill ${resolveEmployeeRoleClass(user.tipo)}`}>{resolveEmployeeRoleName(user.tipo)}</span>
                        <p className="user-email">{user.email}</p>
                    </div>
                </div>

                <button type="button" className="user-edit-toggle" onClick={showForm}>
                    {isShowed ? "Cerrar edicion" : "Editar usuario"}
                </button>
            </div>

            <div className="user-detail-info">
                <div className="user-detail-card">
                    <span className="user-detail-card__label">DNI</span>
                    <strong>{user.dni}</strong>
                </div>
                <div className="user-detail-card">
                    <span className="user-detail-card__label">NUSS</span>
                    <strong>{user.nuss}</strong>
                </div>
                <div className="user-detail-card">
                    <span className="user-detail-card__label">Email</span>
                    <strong>{user.email}</strong>
                </div>
                <div className="user-detail-card">
                    <span className="user-detail-card__label">Rol</span>
                    <strong>{resolveEmployeeRoleName(user.tipo)}</strong>
                </div>
            </div>

            {isShowed && <EditUser user={user}/>}
        </article>
    )
}
