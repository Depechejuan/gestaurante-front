import deleteToken from "./delete-token";
import getToken from "./get-token";

const host = import.meta.env.VITE_API_HOST;

async function parseResponse(response) {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        return null;
    }

    try {
        return await response.json();
    } catch {
        return null;
    }
}

function buildHeaders(headers = {}, hasBody = false, authToken = null) {
    const nextHeaders = { ...headers };

    if (hasBody && !nextHeaders["Content-Type"]) {
        nextHeaders["Content-Type"] = "application/json";
    }

    if (authToken) {
        nextHeaders.Authorization = `Bearer ${authToken}`;
    }

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

    const response = await fetch(`${host}${path}`, {
        method,
        headers: requestHeaders,
        body: body === undefined ? undefined : JSON.stringify(body)
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
        if (requireAuth && (response.status === 401 || response.status === 403)) {
            deleteToken();
        }

        const error = new Error(payload?.error?.message || payload?.error || payload?.message || "Something Went Wrong");
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export function authApiRequest(path, options = {}) {
    return apiRequest(path, { ...options, requireAuth: true });
}
