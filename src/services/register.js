import { authApiRequest } from "./api-client";

async function sendRegister(form, token) {
    return await authApiRequest("/admin/register", {
        method: "POST",
        body: form,
        token
    });
}

export default sendRegister;
