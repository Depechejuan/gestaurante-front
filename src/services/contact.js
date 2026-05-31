import { apiRequest } from "./api-client";

export function sendContactMessage(body) {
    return apiRequest("/public/contact", {
        method: "POST",
        body
    });
}
