import { useState } from "react"
import getToken from "../../services/get-token";

const tipoOptions = [
    { value: 0, label: 'Administrador' },
    { value: 1, label: 'Camarero' },
    { value: 2, label: 'Cocinero' },
];

export default function EditUser({user}) {
    const [userEdit, setUserEdit] = useState(user)

    const [errors, setErrors] = useState({});
    const dniRegex = /^\d{8}-[A-Z]$/;
    const nussRegex = /^\d{2}-\d{8}-\d$/;
    const token = getToken()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserEdit({
            ...userEdit,
            [name]: value
        });
    }

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate())
            return;
        console.log("Enviar:", userEdit);
    };


    const validate = () => {
        const newErrors = {};

        if (!dniRegex.test(userEdit.dni)) {
        newErrors.dni = "Formato DNI inválido (12345678-A)";
        }

        if (!nussRegex.test(userEdit.nuss)) {
        newErrors.nuss = "Formato NUSS inválido (28-12345678-5)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return(
        <form className="edit-form" onSubmit={handleSubmit}>
            <label>Nombre</label>
            <input 
                name="Nombre"
                value={user.nombre}
                onChange={handleChange} 
            />
            <label>Primer Apellido</label>
            <input
                name="Primer Apellido"
                onChange={handleChange}
                value={user.apellido1}
            />
            <label>Segundo Apellido</label>
            <input
                value={user.apellido2}
                name="Segundo Apellido"
                onChange={handleChange}
            />
            <label>DNI</label>
            <input
                value={user.dni}
                name="DNI"
                onChange={handleChange}
            />
            <label>NUSS</label>
            <input
                value={user.nuss}
                name="NUSS"
                onChange={handleChange}
            />

            <label>Contraseña</label>
            <input
                name="password"
                type="password"
            />

            <label>Puesto</label>
            <select
                name="tipo"
                value={userEdit.tipo}
                onChange={handleChange}
            >
                {tipoOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            <button>Enviar</button>
        </form>
    )
}