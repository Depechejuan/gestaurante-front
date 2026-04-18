import { getEmpleados as getAllEmpleados } from "./empleados";

export default async function getEmpleados(token) {
    try {
        const response = await getAllEmpleados(token);
        return response.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}
