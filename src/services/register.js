import { authApiRequest } from "./api-client";

async function sendRegister(form, token) {
    try {
        return await authApiRequest("/admin/register", {
            method: "POST",
            body: form,
            token
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}

export default sendRegister;
