import deleteToken from "./delete-token";
import getToken from "./get-token";

function isLocalHostname(hostname) {
    return ["localhost", "127.0.0.1", "::1"].includes(String(hostname ?? "").toLowerCase());
}

function normalizeHost(rawHost) {
    return String(rawHost ?? "").trim().replace(/\/+$/, "");
}

function resolveApiHost() {
    const explicitHost = normalizeHost(import.meta.env.VITE_API_HOST);
    const browserLocation = typeof window !== "undefined" ? window.location : null;
    const browserHost = browserLocation?.hostname ?? "127.0.0.1";
    const apiPort = import.meta.env.VITE_API_PORT?.trim() || "3000";

    if (explicitHost) {
        try {
            const explicitUrl = new URL(explicitHost, browserLocation?.origin ?? "http://127.0.0.1");
            if (browserLocation && !isLocalHostname(browserHost) && isLocalHostname(explicitUrl.hostname))
                return browserLocation.origin;

            return normalizeHost(explicitUrl.toString());
        } catch {
            if (browserLocation && !isLocalHostname(browserHost) && /localhost|127\.0\.0\.1/i.test(explicitHost))
                return browserLocation.origin;

            return explicitHost;
        }
    }

    if (!browserLocation)
        return `http://127.0.0.1:${apiPort}`;

    if (isLocalHostname(browserHost))
        return `http://${browserHost}:${apiPort}`;

    return browserLocation.origin;
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
        requireAuth = false,
        isFormData = false
    } = options;

    const activeToken = token?.token ?? getToken()?.token ?? null;
    const requestHeaders = buildHeaders(headers, body !== undefined && !isFormData, requireAuth ? activeToken : null);

    let response;
    try {
        const normalizedPath = path.startsWith("/") ? path : `/${path}`;
        response = await fetch(`${host}${normalizedPath}`, {
            method,
            headers: requestHeaders,
            body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body)
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

export function customerApiRequest(path, options = {}) {
    const { token, headers, ...restOptions } = options;
    const tokenValue = token?.token ?? token ?? null;

    return apiRequest(path, {
        ...restOptions,
        headers: tokenValue
            ? {
                ...headers,
                Authorization: `Bearer ${tokenValue}`
            }
            : headers
    });
}
