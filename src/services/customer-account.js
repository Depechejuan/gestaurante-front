import { customerApiRequest, apiRequest } from "./api-client";

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
    return customerApiRequest("/public/account/me", { token });
}

export function updateCustomerProfile(body, token) {
    return customerApiRequest("/public/account/profile", { method: "PUT", body, token });
}

export function getCustomerAddresses(token) {
    return customerApiRequest("/public/account/addresses", { token });
}

export function createCustomerAddress(body, token) {
    return customerApiRequest("/public/account/addresses", { method: "POST", body, token });
}

export function updateCustomerAddress(id, body, token) {
    return customerApiRequest(`/public/account/addresses/${id}`, { method: "PUT", body, token });
}

export function deleteCustomerAddress(id, token) {
    return customerApiRequest(`/public/account/addresses/${id}`, { method: "DELETE", token });
}

export function getCustomerPaymentMethods(token) {
    return customerApiRequest("/public/account/payment-methods", { token });
}

export function createCustomerPaymentMethod(body, token) {
    return customerApiRequest("/public/account/payment-methods", { method: "POST", body, token });
}

export function deleteCustomerPaymentMethod(id, token) {
    return customerApiRequest(`/public/account/payment-methods/${id}`, { method: "DELETE", token });
}

export function getCustomerOrders(token) {
    return customerApiRequest("/public/account/orders", { token });
}

export function getCustomerOrder(id, token) {
    return customerApiRequest(`/public/account/orders/${id}`, { token });
}
