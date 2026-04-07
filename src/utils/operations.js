const pedidoStatusByValue = {
    0: "PENDIENTE",
    1: "CONFIRMADO",
    2: "PREPARACION",
    3: "LISTO",
    4: "ENTREGADO",
    5: "CANCELADO",
    6: "EN_CAMINO"
};

const detalleStatusByValue = {
    0: "ACTIVA",
    1: "CANCELADA",
    2: "EN_COCINA",
    3: "PREPARADO",
    4: "ENTREGADA"
};

const facturaStatusByValue = {
    0: "PENDIENTE",
    1: "PAGADO",
    2: "CANCELADO"
};

const canalPedidoByValue = {
    0: "SALA",
    1: "QR",
    2: "ONLINE"
};

const tipoEntregaByValue = {
    0: "MESA",
    1: "RECOGIDA",
    2: "DOMICILIO"
};

const estadoPagoByValue = {
    0: "NO_APLICA",
    1: "PENDIENTE_LOCAL",
    2: "PAGADO_ONLINE",
    3: "PAGADO_LOCAL",
    4: "REEMBOLSADO_ONLINE"
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

export function resolveCanalPedido(value) {
    return typeof value === "number" ? canalPedidoByValue[value] ?? "SALA" : value;
}

export function resolveTipoEntrega(value) {
    return typeof value === "number" ? tipoEntregaByValue[value] ?? "MESA" : value;
}

export function resolveEstadoPago(value) {
    return typeof value === "number" ? estadoPagoByValue[value] ?? "NO_APLICA" : value;
}

export function formatMoney(amount) {
    const numeric = Number(amount ?? 0);
    if (Number.isNaN(numeric))
        return "0,00 EUR";

    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR"
    }).format(numeric);
}

export function formatDateTime(value) {
    if (!value)
        return "Sin fecha";

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
        CONFIRMADO: "Pendiente",
        PREPARACION: "En preparación",
        LISTO: "Listo",
        EN_CAMINO: "En entrega",
        ENTREGADO: "Entregado",
        CANCELADO: "Cancelado"
    };

    return dictionary[normalizedStatus] ?? normalizedStatus ?? "Sin estado";
}

export function translateDetalleStatus(status) {
    const normalizedStatus = resolveDetalleStatus(status);
    const dictionary = {
        ACTIVA: "Pendiente",
        EN_COCINA: "En cocina",
        PREPARADO: "Preparado",
        ENTREGADA: "Entregada",
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

export function translateCanalPedido(value) {
    const status = resolveCanalPedido(value);
    const dictionary = {
        SALA: "Sala",
        QR: "Mesa QR",
        ONLINE: "Pedido online"
    };

    return dictionary[status] ?? status ?? "Canal desconocido";
}

export function translateTipoEntrega(value) {
    const status = resolveTipoEntrega(value);
    const dictionary = {
        MESA: "Mesa",
        RECOGIDA: "Recogida",
        DOMICILIO: "Domicilio"
    };

    return dictionary[status] ?? status ?? "Entrega desconocida";
}

export function translateEstadoPago(value) {
    const status = resolveEstadoPago(value);
    const dictionary = {
        NO_APLICA: "Sin cobro",
        PENDIENTE_LOCAL: "Pago en local",
        PAGADO_LOCAL: "Cobrado en local",
        PAGADO_ONLINE: "Pagado online",
        REEMBOLSADO_ONLINE: "Reembolsado"
    };

    return dictionary[status] ?? status ?? "Estado de pago";
}

export function normalizeDeliveryAddress(value) {
    const address = String(value ?? "").trim();
    if (!address)
        return "";

    const separator = " · ";
    return address.includes(separator)
        ? address.split(separator).slice(1).join(separator).trim()
        : address;
}

export function orderStateClass(status) {
    const normalized = String(status ?? "").toLowerCase();
    return normalized ? `ops-badge--${normalized}` : "ops-badge--neutral";
}

function normalizeTextForSort(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function resolveDishCategoryOrder(value) {
    const normalized = normalizeTextForSort(value);

    const explicitOrder = [
        "bebidas",
        "vinos",
        "ensaladas",
        "entrantes",
        "platos principales",
        "pizzas",
        "pizzas especiales",
        "pastas",
        "postre",
        "cafe"
    ];

    const explicitIndex = explicitOrder.findIndex((entry) => normalized === entry || normalized.includes(entry));
    if (explicitIndex >= 0)
        return explicitIndex;

    if (normalized.includes("postre"))
        return 90;

    if (normalized.includes("cafe"))
        return 91;

    return 50;
}

export function sortPedidoDetalles(detalles = []) {
    return [...detalles].sort((left, right) => {
        const leftCategory = left.categoriaDescripcion ?? left.tipoVisible ?? "";
        const rightCategory = right.categoriaDescripcion ?? right.tipoVisible ?? "";

        const categoryDifference = resolveDishCategoryOrder(leftCategory) - resolveDishCategoryOrder(rightCategory);
        if (categoryDifference !== 0)
            return categoryDifference;

        const typeDifference = normalizeTextForSort(leftCategory).localeCompare(normalizeTextForSort(rightCategory), "es");
        if (typeDifference !== 0)
            return typeDifference;

        return normalizeTextForSort(left.platoNombre ?? left.nombre).localeCompare(normalizeTextForSort(right.platoNombre ?? right.nombre), "es");
    });
}

export function isDetalleBillable(detalle) {
    return resolveDetalleStatus(detalle?.estado) !== "CANCELADA";
}

export function isDetalleDelivered(detalle) {
    return resolveDetalleStatus(detalle?.estado) === "ENTREGADA";
}

export function isPedidoReadyForFactura(pedido) {
    const detallesFacturables = (pedido?.detalles ?? []).filter(isDetalleBillable);
    if (!detallesFacturables.length)
        return false;

    return detallesFacturables.every(isDetalleDelivered);
}

export function resolvePedidoFacturaLabel(pedido) {
    if (pedido?.estaFacturado)
        return "Facturado";

    return isPedidoReadyForFactura(pedido)
        ? "Listo para facturar"
        : "Pendiente de factura";
}
