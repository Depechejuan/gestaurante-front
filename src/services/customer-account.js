import { apiRequest } from "./api-client";

function buildCustomerHeaders(token) {
    return {
        Authorization: `Bearer ${token}`
    };
}

export function registerCustomer(body) {
    return apiRequest("/public/account/register", { method: "POST", body });
}

export function verifyCustomerEmail(body) {
    return apiRequest("/public/account/verify-email", { method: "POST", body });
}

export function resendCustomerCode(body) {
    return apiRequest("/public/account/resend-code", { method: "POST", body });
}

export function loginCustomer(body) {
    return apiRequest("/public/account/login", { method: "POST", body });
}

export function getCustomerProfile(token) {
    return apiRequest("/public/account/me", { headers: buildCustomerHeaders(token) });
}

export function updateCustomerProfile(body, token) {
    return apiRequest("/public/account/profile", { method: "PUT", body, headers: buildCustomerHeaders(token) });
}

export function getCustomerAddresses(token) {
    return apiRequest("/public/account/addresses", { headers: buildCustomerHeaders(token) });
}

export function createCustomerAddress(body, token) {
    return apiRequest("/public/account/addresses", { method: "POST", body, headers: buildCustomerHeaders(token) });
}

export function updateCustomerAddress(id, body, token) {
    return apiRequest(`/public/account/addresses/${id}`, { method: "PUT", body, headers: buildCustomerHeaders(token) });
}

export function deleteCustomerAddress(id, token) {
    return apiRequest(`/public/account/addresses/${id}`, { method: "DELETE", headers: buildCustomerHeaders(token) });
}

export function getCustomerPaymentMethods(token) {
    return apiRequest("/public/account/payment-methods", { headers: buildCustomerHeaders(token) });
}

export function createCustomerPaymentMethod(body, token) {
    return apiRequest("/public/account/payment-methods", { method: "POST", body, headers: buildCustomerHeaders(token) });
}

export function deleteCustomerPaymentMethod(id, token) {
    return apiRequest(`/public/account/payment-methods/${id}`, { method: "DELETE", headers: buildCustomerHeaders(token) });
}

export function getCustomerOrders(token) {
    return apiRequest("/public/account/orders", { headers: buildCustomerHeaders(token) });
}

export function getCustomerOrder(id, token) {
    return apiRequest(`/public/account/orders/${id}`, { headers: buildCustomerHeaders(token) });
}
