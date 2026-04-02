import deleteToken from "./delete-token";
import getToken from "./get-token";

function resolveApiHost() {
    const explicitHost = import.meta.env.VITE_API_HOST?.trim();
    if (explicitHost)
        return explicitHost.replace(/\/+$/, "");

    const browserHost = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";
    const apiPort = import.meta.env.VITE_API_PORT?.trim() || "3000";
    return `http://${browserHost}:${apiPort}`;
}

const host = resolveApiHost();

function resolveErrorMessage(payload) {
    if (!payload)
        return "Something Went Wrong";

    if (typeof payload.error === "string" && payload.error.trim())
        return payload.error;

    if (typeof payload?.error?.message === "string" && payload.error.message.trim())
        return payload.error.message;

    if (typeof payload.message === "string" && payload.message.trim())
        return payload.message;

    if (typeof payload.title === "string" && payload.title.trim())
        return payload.title;

    if (payload.errors && typeof payload.errors === "object") {
        const firstError = Object.values(payload.errors)
            .flat()
            .find((value) => typeof value === "string" && value.trim());

        if (firstError)
            return firstError;
    }

    return "Something Went Wrong";
}

async function parseResponse(response) {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json"))
        return null;

    try {
        return await response.json();
    } catch {
        return null;
    }
}

function buildHeaders(headers = {}, hasBody = false, authToken = null) {
    const nextHeaders = { ...headers };

    if (hasBody && !nextHeaders["Content-Type"])
        nextHeaders["Content-Type"] = "application/json";

    if (authToken)
        nextHeaders.Authorization = `Bearer ${authToken}`;

    return nextHeaders;
}

export async function apiRequest(path, options = {}) {
    const {
        method = "GET",
        body,
        headers,
        token,
        requireAuth = false
    } = options;

    const activeToken = token?.token ?? getToken()?.token ?? null;
    const requestHeaders = buildHeaders(headers, body !== undefined, requireAuth ? activeToken : null);

    let response;
    try {
        response = await fetch(`${host}${path}`, {
            method,
            headers: requestHeaders,
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch (error) {
        const networkError = new Error("No se ha podido establecer conexión con el servidor.");
        networkError.status = 0;
        networkError.cause = error;
        throw networkError;
    }

    const payload = await parseResponse(response);

    if (!response.ok) {
        if (requireAuth && response.status === 401)
            deleteToken();

        const error = new Error(resolveErrorMessage(payload));
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export function authApiRequest(path, options = {}) {
    return apiRequest(path, { ...options, requireAuth: true });
}
