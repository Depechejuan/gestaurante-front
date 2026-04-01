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
    2: "PAGADO_LOCAL",
    3: "PAGADO_MOCK",
    4: "REEMBOLSADO_MOCK"
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
        EN_CAMINO: "En camino",
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
        PAGADO_MOCK: "Pagado online",
        REEMBOLSADO_MOCK: "Reembolsado"
    };

    return dictionary[status] ?? status ?? "Estado de pago";
}

export function orderStateClass(status) {
    const normalized = String(status ?? "").toLowerCase();
    return normalized ? `ops-badge--${normalized}` : "ops-badge--neutral";
}
