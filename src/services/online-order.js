import { apiRequest } from "./api-client";

export function createOnlineOrder(body, token) {
    return apiRequest("/public/checkout/order", {
        method: "POST",
        body,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
