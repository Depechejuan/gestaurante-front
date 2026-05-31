export function parseLocalizedDecimal(value) {
    if (typeof value === "number")
        return Number.isFinite(value) ? value : Number.NaN;

    const normalized = String(value ?? "")
        .trim()
        .replace(/\s/g, "")
        .replace(",", ".");

    if (!normalized)
        return 0;

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
}
