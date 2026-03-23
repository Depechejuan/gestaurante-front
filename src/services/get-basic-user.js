import { authApiRequest } from "./api-client";

export default async function getBasicUser(token) {
    try {
        return await authApiRequest("/Admin/getbasicuser", {
            method: "POST",
            body: { id: token.id },
            token
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}
