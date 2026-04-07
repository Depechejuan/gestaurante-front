export const EMPLOYEE_ROLE_NAMES = {
    0: "Administrador",
    1: "Camarero",
    2: "Cocinero",
    3: "Repartidor"
};

const EMPLOYEE_ROLE_NAMES_BY_ENUM = {
    ADMINISTRADOR: "Administrador",
    CAMARERO: "Camarero",
    COCINERO: "Cocinero",
    REPARTIDOR: "Repartidor"
};

export function resolveEmployeeRoleName(value) {
    if (typeof value === "number")
        return EMPLOYEE_ROLE_NAMES[value] ?? "Sin rol";

    if (typeof value === "string") {
        const normalized = value.trim().toUpperCase();
        return EMPLOYEE_ROLE_NAMES_BY_ENUM[normalized] ?? value;
    }

    return "Sin rol";
}

export function resolveEmployeeRoleValue(value) {
    if (typeof value === "number")
        return value;

    if (typeof value === "string") {
        const normalized = value.trim().toUpperCase();
        const entry = Object.entries(EMPLOYEE_ROLE_NAMES_BY_ENUM).find(([key]) => key === normalized);
        if (entry)
            return Object.keys(EMPLOYEE_ROLE_NAMES).find((roleValue) => EMPLOYEE_ROLE_NAMES[roleValue] === entry[1]) ?? null;
    }

    return null;
}

export function resolveEmployeeRoleClass(value) {
    const normalizedValue = resolveEmployeeRoleValue(value);
    return normalizedValue == null ? "role-unknown" : `role-${normalizedValue}`;
}

function decodeBase64Url(value) {
    if (!value)
        return null;

    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

    if (typeof atob === "function")
        return atob(padded);

    if (typeof Buffer !== "undefined")
        return Buffer.from(padded, "base64").toString("utf-8");

    return null;
}

export function extractEmployeeRoleFromJwt(token) {
    if (!token)
        return null;

    try {
        const payload = token.split(".")[1];
        const decoded = decodeBase64Url(payload);
        if (!decoded)
            return null;

        const data = JSON.parse(decoded);
        const roleValue = data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? data.role;
        return resolveEmployeeRoleName(roleValue);
    } catch {
        return null;
    }
}

export const STAFF_ROLES = ["Administrador", "Camarero", "Cocinero", "Repartidor"];
export const BILLING_ROLES = ["Administrador", "Camarero"];
export const ADMIN_ROLES = ["Administrador"];
