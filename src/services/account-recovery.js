import { apiRequest } from "./api-client";

export function requestPasswordReset(body) {
    return apiRequest("/auth/forgot-password", { method: "POST", body });
}

export function resetPassword(body) {
    return apiRequest("/auth/reset-password", { method: "POST", body });
}
