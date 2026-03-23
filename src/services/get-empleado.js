import { authApiRequest } from "./api-client";

export default async function getEmpleado(id, token) {
    try {
        const response = await authApiRequest(`/admin/user/${id}`, {
            method: "GET",
            token
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}
