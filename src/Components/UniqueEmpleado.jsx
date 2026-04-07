import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import EditUser from "./Forms/Edit-User";
import PhotoContainer from "./PhotoContainer";
import { resolveEmployeeRoleClass, resolveEmployeeRoleName } from "../constants/roles";
import getToken from "../services/get-token";
import { getEmpleado, updateEmpleado } from "../services/empleados";
import { formatDni, formatNuss } from "../utils/identity";

import anon from '../assets/img/empty-user.png'

export default function UniqueEmpleado() {
    const { id } = useParams();
    const location = useLocation();
    const [isShowed, setIsShowed] = useState(false)
    const [user, setUser] = useState(location.state?.user ?? null);
    const [loading, setLoading] = useState(!location.state?.user);
    const [error, setError] = useState("");
    const [toggling, setToggling] = useState(false);
    const [token] = useState(() => getToken());

    useEffect(() => {
        if (user || !id || !token?.token) {
            setLoading(false);
            return;
        }

        const loadUser = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getEmpleado(id, token);
                setUser(response?.data ?? null);
            } catch (err) {
                setError(err.message || "No se ha podido cargar la ficha del empleado.");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id, token, user]);

    const showForm = () => {
        setIsShowed(prev => !prev)
    }

    const handleToggleActive = async () => {
        if (!user)
            return;

        setToggling(true);
        setError("");
        try {
            const response = await updateEmpleado(user.id, { Activo: !user.activo }, token);
            setUser(response?.data ?? user);
        } catch (err) {
            setError(err.message || "No se ha podido cambiar el estado del empleado.");
        } finally {
            setToggling(false);
        }
    };

    if (loading) {
        return (
            <section className="user-detail user-detail--empty">
                <p className="users-eyebrow">Empleado</p>
                <h2>Cargando ficha</h2>
                <p>Estamos recuperando los datos completos del empleado.</p>
                <Link to="/dashboard/empleados" className="user-back-link">Volver al listado</Link>
            </section>
        )
    }

    if (!user) {
        return (
            <section className="user-detail user-detail--empty">
                <p className="users-eyebrow">Empleado</p>
                <h2>Ficha no disponible</h2>
                <p>{error || "No se ha podido recuperar la información del empleado."}</p>
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
                        <span className={`user-role-pill ${user.activo ? "role-1" : "role-unknown"}`}>{user.activo ? "Activo" : "Desactivado"}</span>
                        <p className="user-email">{user.email}</p>
                    </div>
                </div>

                <div className="user-detail__actions">
                    <button type="button" className="user-edit-toggle" onClick={showForm}>
                        {isShowed ? "Cancelar edicion" : "Editar empleado"}
                    </button>
                    <button
                        type="button"
                        className={user.activo ? "user-state-toggle user-state-toggle--danger" : "user-state-toggle"}
                        onClick={handleToggleActive}
                        disabled={toggling}
                    >
                        {toggling ? "Guardando..." : user.activo ? "Desactivar empleado" : "Activar empleado"}
                    </button>
                </div>
            </div>

            <div className="user-detail-info">
                <div className="user-detail-card">
                    <span className="user-detail-card__label">DNI</span>
                    <strong>{formatDni(user.dni) || "No indicado"}</strong>
                </div>
                <div className="user-detail-card">
                    <span className="user-detail-card__label">NUSS</span>
                    <strong>{formatNuss(user.nuss) || "No indicado"}</strong>
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

            {isShowed && <EditUser user={user} onSaved={(nextUser) => {
                setUser(nextUser);
                setIsShowed(false);
            }}/>}
        </article>
    )
}
