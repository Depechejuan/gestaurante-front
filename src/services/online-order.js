import { customerApiRequest } from "./api-client";

export function createOnlineOrder(body, token) {
    return customerApiRequest("/public/checkout/order", {
        method: "POST",
        body,
        token
    });
}
