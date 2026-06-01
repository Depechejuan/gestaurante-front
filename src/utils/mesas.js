function resolveMesaAliasOrder(ubicacion) {
    const match = String(ubicacion ?? "").match(/([A-Z])(\d+)$/i);
    if (!match)
        return { letterOrder: Number.MAX_SAFE_INTEGER, numberOrder: Number.MAX_SAFE_INTEGER };

    return {
        letterOrder: match[1].toUpperCase().charCodeAt(0) - "A".charCodeAt(0),
        numberOrder: Number.parseInt(match[2], 10)
    };
}

export function compareMesasByPublicOrder(leftMesa, rightMesa) {
    const leftOrder = resolveMesaAliasOrder(leftMesa?.ubicacion);
    const rightOrder = resolveMesaAliasOrder(rightMesa?.ubicacion);

    if (leftOrder.letterOrder !== rightOrder.letterOrder)
        return leftOrder.letterOrder - rightOrder.letterOrder;

    if (leftOrder.numberOrder !== rightOrder.numberOrder)
        return leftOrder.numberOrder - rightOrder.numberOrder;

    return String(leftMesa?.ubicacion ?? "").localeCompare(String(rightMesa?.ubicacion ?? ""), "es", { sensitivity: "base" });
}
