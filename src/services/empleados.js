import { authApiRequest } from "./api-client";

export function getEmpleado(id, token) {
    return authApiRequest(`/admin/user/${id}`, {
        method: "GET",
        token
    });
}

export function updateEmpleado(id, form, token) {
    const body = new FormData();

    Object.entries(form).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "")
            return;

        body.append(key, value);
    });

    return authApiRequest(`/admin/user/${id}`, {
        method: "PUT",
        body,
        token,
        isFormData: true
    });
}
