import { apiRequest } from "./api-client";

async function sendLogin(form) {
    try {
        return await apiRequest("/user/login", {
            method: "POST",
            body: form
        });
    } catch (err) {
        console.log(err);
        return null;
    }
}

export default sendLogin;
