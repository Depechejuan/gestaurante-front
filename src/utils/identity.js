export function formatDni(value) {
    if (!value)
        return "";

    const normalized = value.toString().trim().toUpperCase().replace(/\s+/g, "");
    const compact = normalized.replace(/-/g, "");

    if (/^\d{8}[A-Z]$/.test(compact))
        return `${compact.slice(0, 8)}-${compact.slice(8)}`;

    return normalized;
}

export function formatNuss(value) {
    if (!value)
        return "";

    const normalized = value.toString().trim().replace(/\s+/g, "");
    const compact = normalized.replace(/-/g, "");

    if (/^\d{11}$/.test(compact))
        return `${compact.slice(0, 2)}-${compact.slice(2, 10)}-${compact.slice(10)}`;

    if (/^\d{13}$/.test(compact))
        return `${compact.slice(0, 2)}-${compact.slice(2, 12)}-${compact.slice(12)}`;

    return normalized;
}
