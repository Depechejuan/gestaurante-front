const pedidoStatusByValue = {
    0: "PENDIENTE",
    1: "CONFIRMADO",
    2: "PREPARACION",
    3: "LISTO",
    4: "ENTREGADO",
    5: "CANCELADO"
};

const detalleStatusByValue = {
    0: "ACTIVA",
    1: "CANCELADA"
};

const facturaStatusByValue = {
    0: "PENDIENTE",
    1: "PAGADO",
    2: "CANCELADO"
};

export function resolvePedidoStatus(status) {
    return typeof status === "number" ? pedidoStatusByValue[status] ?? "PENDIENTE" : status;
}

export function resolveDetalleStatus(status) {
    return typeof status === "number" ? detalleStatusByValue[status] ?? "ACTIVA" : status;
}

export function resolveFacturaStatus(status) {
    return typeof status === "number" ? facturaStatusByValue[status] ?? "PENDIENTE" : status;
}

export function formatMoney(amount) {
    const numeric = Number(amount ?? 0);
    if (Number.isNaN(numeric)) {
        return "0,00 EUR";
    }

    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR"
    }).format(numeric);
}

export function formatDateTime(value) {
    if (!value) {
        return "Sin fecha";
    }

    try {
        return new Intl.DateTimeFormat("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit"
        }).format(new Date(value));
    } catch {
        return "Fecha no valida";
    }
}

export function translatePedidoStatus(status) {
    const normalizedStatus = resolvePedidoStatus(status);
    const dictionary = {
        PENDIENTE: "Pendiente",
        CONFIRMADO: "Confirmado",
        PREPARACION: "En preparacion",
        LISTO: "Listo",
        ENTREGADO: "Entregado",
        CANCELADO: "Cancelado"
    };

    return dictionary[normalizedStatus] ?? normalizedStatus ?? "Sin estado";
}

export function translateDetalleStatus(status) {
    const normalizedStatus = resolveDetalleStatus(status);
    const dictionary = {
        ACTIVA: "Activa",
        CANCELADA: "Cancelada"
    };

    return dictionary[normalizedStatus] ?? normalizedStatus ?? "Sin estado";
}

export function translateFacturaStatus(status) {
    const normalizedStatus = resolveFacturaStatus(status);
    const dictionary = {
        PENDIENTE: "Pendiente",
        PAGADO: "Pagada",
        CANCELADO: "Cancelada"
    };

    return dictionary[normalizedStatus] ?? normalizedStatus ?? "Sin estado";
}

export function orderStateClass(status) {
    const normalized = String(status ?? "").toLowerCase();
    return normalized ? `ops-badge--${normalized}` : "ops-badge--neutral";
}
