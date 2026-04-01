import { authApiRequest } from "./api-client";

export default async function getBasicUser(token) {
    try {
        return await authApiRequest("/user/me", {
            method: "GET",
            token
        });
    } catch (err) {
        console.error(err);
        return null;
    }
}
