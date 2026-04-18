import { getEmpleado as getEmpleadoById } from "./empleados";

export default async function getEmpleado(id, token) {
    try {
        const response = await getEmpleadoById(id, token);
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}
