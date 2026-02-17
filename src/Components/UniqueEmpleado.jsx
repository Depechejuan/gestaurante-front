import { useState } from "react"
import { useParams, useLocation } from "react-router-dom";
import getToken from "../services/get-token";
import EditUser from "./Forms/Edit-User";
import PhotoContainer from "./PhotoContainer";

import anon from '../assets/img/empty-user.png'

export default function UniqueEmpleado() {
    const [token] = useState(()=> getToken())
    const [isShowed, setIsShowed] = useState(false)
    
    const { id } = useParams();
    const location = useLocation();
    const user = location.state?.user;
    

    const showForm = () => {
        setIsShowed(prev => !prev)
    }

    const rol = ["Administrador", "Camarero", "Cocinero"];

    return(
        <article className="user-detail">
            <h2>{user.nombre} {user.apellido1} {user.apellido2}</h2>
            <hr className="separador"></hr>
            <div className="user-detail-info">
                <div className="user-container">
                    <div className="user-text">
                        <p><span className="prop-bold">DNI</span>: {user.dni}</p>
                        <p><span className="prop-bold">NUSS</span>: {user.nuss}</p>
                        <p><span className="prop-bold">Email</span>: {user.email}</p>
                        <p><span className="prop-bold">Rol</span>: {rol[user.tipo]}</p>
                    </div>
                    <PhotoContainer photoURL={user.imageURL ? user.imageURL : anon} style="user-photo-full" alt={user.nombre} />
                </div>

            </div>

            <button onClick={showForm}>Editar</button>
            {isShowed && (
                <EditUser user={user}/>
            )}

            
        </article>
    )
}