import { authApiRequest } from "./api-client";

export default async function getEmpleados(token) {
    try {
        const response = await authApiRequest("/admin/getusers", {
            method: "POST",
            token
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}
