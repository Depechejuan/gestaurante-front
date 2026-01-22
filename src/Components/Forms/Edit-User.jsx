export default function EditUser({user}) {
    

    return(
        <form className="edit-form" onSubmit={user}>
            <label>Nombre</label>
            <input />
            <label>Primer Apellido</label>
            <input />
            <label>Segundo Apellido</label>
            <input />
            <label>DNI</label>
            <input />
            <label>NUSS</label>
            <input />

            <label>Contraseña</label>
            <input type="password"/>
            <label>Puesto</label>
            <input />
        </form>
    )
}