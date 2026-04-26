import { authApiRequest } from "./api-client";

function buildPlatoFormData(body = {}) {
    const formData = new FormData();

    const appendField = (key, value) => {
        if (value === undefined || value === null)
            return;

        formData.append(key, value);
    };

    appendField("idPlato", body.idPlato ?? "");
    appendField("nombre", body.nombre ?? "");
    appendField("descripcion", body.descripcion ?? "");
    appendField("imagen", body.imagen ?? "");
    appendField("disponible", String(Boolean(body.disponible)));
    appendField("precio", String(body.precio ?? 0));
    appendField("idCategoria", body.idCategoria ?? "");
    appendField("categoriaDescripcion", body.categoriaDescripcion ?? "");
    appendField("ingredientesJson", JSON.stringify(body.ingredientes ?? []));

    if (body.photo)
        formData.append("photo", body.photo);

    return formData;
}

export function getAdminPlatos(token) {
    return authApiRequest("/Plato", { token });
}

export function getAdminPlato(id, token) {
    return authApiRequest(`/Plato/${id}`, { token });
}

export function createPlato(body, token) {
    return authApiRequest("/Plato", {
        method: "POST",
        body: buildPlatoFormData(body),
        token,
        isFormData: true
    });
}

export function updatePlato(id, body, token) {
    return authApiRequest(`/Plato/${id}`, {
        method: "PUT",
        body: buildPlatoFormData(body),
        token,
        isFormData: true
    });
}

export function setPlatoDisponibilidad(id, disponible, token) {
    return authApiRequest(`/Plato/${id}/disponibilidad`, {
        method: "PATCH",
        body: { disponible },
        token
    });
}

export function deletePlato(id, token) {
    return authApiRequest(`/Plato/${id}`, { method: "DELETE", token });
}
