import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAppDialog } from "../Context/AppDialogContext";
import useMesaLabels from "../Hooks/useMesaLabels";
import getToken from "../services/get-token";
import { assignFacturaCliente, chargeFactura, getFactura, searchFacturaClientes, sendFacturaEmail, updateFactura } from "../services/facturas";
import { formatDateTime, formatMoney, orderStateClass, resolveFacturaStatus, translateFacturaStatus } from "../utils/operations";
import "../styles/Staff/operations.css";

function createAssignForm(clienteFactura) {
    const isAnonymous = clienteFactura?.esAnonima;
    return {
        idUsuarioCliente: isAnonymous ? "" : clienteFactura?.idUsuarioCliente ?? "",
        createCustomer: false,
        fiscalName: isAnonymous ? "" : clienteFactura?.billingName ?? "",
        dni: "",
        cif: "",
        billingStreet: isAnonymous ? "" : clienteFactura?.billingStreet ?? "",
        billingCity: isAnonymous ? "" : clienteFactura?.billingCity ?? "",
        billingProvince: isAnonymous ? "" : clienteFactura?.billingProvince ?? "",
        billingPostalCode: isAnonymous ? "" : clienteFactura?.billingPostalCode ?? "",
        billingEmail: isAnonymous ? "" : clienteFactura?.billingEmail ?? "",
        billingPhone: isAnonymous ? "" : clienteFactura?.billingPhone ?? "",
        saveOnCustomer: true
    };
}

function createDiscountForm(factura) {
    return {
        tipoDescuento: factura?.tipoDescuento ?? 0,
        valorDescuento: factura?.valorDescuento ?? 0,
        motivoDescuento: factura?.motivoDescuento ?? ""
    };
}

function createChargeForm() {
    return {
        metodoPago: 0,
        importeEntregado: ""
    };
}

function resolveDiscountLabel(tipoDescuento) {
    return Number(tipoDescuento) === 1 ? "Porcentaje" : "Importe fijo";
}

export default function UniqueFactura() {
    const { id } = useParams();
    const location = useLocation();
    const token = getToken();
    const tokenValue = token?.token ?? "";
    const { getMesaShortLabel } = useMesaLabels(Boolean(token?.token));
    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [assignForm, setAssignForm] = useState(createAssignForm(null));
    const [discountForm, setDiscountForm] = useState(createDiscountForm(null));
    const [updatingDiscount, setUpdatingDiscount] = useState(false);
    const [chargeForm, setChargeForm] = useState(createChargeForm());
    const [charging, setCharging] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const { prompt } = useAppDialog();
    const isStaffContext = location.pathname.startsWith("/staff/");
    const facturasBasePath = isStaffContext ? "/staff/facturas" : "/dashboard/facturas";
    const anonymousOption = searchResults.find((cliente) => cliente.esAnonimo);

    useEffect(() => {
        const loadFactura = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getFactura(id, token);
                const nextFactura = response?.data ?? null;
                setFactura(nextFactura);
                setAssignForm(createAssignForm(nextFactura?.clienteFactura));
                setDiscountForm(createDiscountForm(nextFactura));
            } catch (err) {
                setError(err.message || "No se ha podido cargar la factura.");
            } finally {
                setLoading(false);
            }
        };

        loadFactura();
    }, [id, tokenValue]);

    useEffect(() => {
        const loadAnonymousOption = async () => {
            try {
                const response = await searchFacturaClientes("", token);
                setSearchResults(response?.data ?? []);
            } catch {
                setSearchResults([]);
            }
        };

        loadAnonymousOption();
    }, [tokenValue]);

    const handlePrint = () => {
        window.print();
    };

    const handleSendEmail = async () => {
        const targetEmail = factura?.clienteFactura?.esAnonima || !factura?.clienteFactura?.billingEmail
            ? await prompt({
                title: "Enviar factura por email",
                message: "Indica el email al que quieres enviar esta factura.",
                inputLabel: "Email de destino",
                inputType: "email",
                placeholder: "cliente@email.com",
                confirmLabel: "Enviar"
            })
            : "";

        if (targetEmail === false) {
            return;
        }

        setSendingEmail(true);
        setError("");
        setFeedback("");
        try {
            const response = await sendFacturaEmail(id, { email: targetEmail?.trim() ?? "" }, token);
            const sentTo = response?.data?.sentTo || targetEmail || factura?.clienteFactura?.billingEmail;
            setFeedback(`Factura enviada correctamente a ${sentTo}.`);
        } catch (err) {
            setError(err.message || "No se ha podido enviar la factura por email.");
        } finally {
            setSendingEmail(false);
        }
    };

    const handleSearch = async () => {
        setSearching(true);
        setError("");
        try {
            const response = await searchFacturaClientes(searchQuery, token);
            setSearchResults(response?.data ?? []);
        } catch (err) {
            setError(err.message || "No se ha podido buscar el cliente.");
        } finally {
            setSearching(false);
        }
    };

    const handleSelectCustomer = (cliente) => {
        setAssignForm((current) => ({
            ...current,
            idUsuarioCliente: cliente.idUsuarioCliente,
            createCustomer: false,
            fiscalName: cliente.fiscalName || cliente.fullName || current.fiscalName,
            dni: cliente.dni || "",
            cif: cliente.cif || "",
            billingStreet: cliente.billingStreet || current.billingStreet,
            billingCity: cliente.billingCity || current.billingCity,
            billingProvince: cliente.billingProvince || current.billingProvince,
            billingPostalCode: cliente.billingPostalCode || current.billingPostalCode,
            billingEmail: cliente.email || current.billingEmail,
            billingPhone: cliente.phone || current.billingPhone
        }));
        setFeedback(`Cliente seleccionado: ${cliente.fiscalName || cliente.fullName || cliente.email}`);
    };

    const handleSaveDiscount = async (event) => {
        event.preventDefault();
        setUpdatingDiscount(true);
        setError("");
        setFeedback("");
        try {
            const response = await updateFactura(id, {
                tipoDescuento: Number(discountForm.tipoDescuento),
                valorDescuento: Number(discountForm.valorDescuento || 0),
                motivoDescuento: discountForm.motivoDescuento
            }, token);
            const nextFactura = response?.data ?? null;
            setFactura(nextFactura);
            setDiscountForm(createDiscountForm(nextFactura));
            setFeedback("Descuento actualizado correctamente.");
        } catch (err) {
            setError(err.message || "No se ha podido actualizar el descuento.");
        } finally {
            setUpdatingDiscount(false);
        }
    };

    const handleChargeFactura = async (event) => {
        event.preventDefault();
        setCharging(true);
        setError("");
        setFeedback("");
        try {
            const response = await chargeFactura(id, {
                metodoPago: Number(chargeForm.metodoPago),
                importeEntregado: Number(chargeForm.metodoPago) === 0 ? Number(chargeForm.importeEntregado || 0) : null
            }, token);
            const nextFactura = response?.data ?? null;
            setFactura(nextFactura);
            setFeedback("Factura cobrada correctamente.");
        } catch (err) {
            setError(err.message || "No se ha podido cobrar la factura.");
        } finally {
            setCharging(false);
        }
    };

    const submitAssign = async (createCustomer) => {
        setAssigning(true);
        setError("");
        setFeedback("");
        try {
            const response = await assignFacturaCliente(id, {
                ...assignForm,
                createCustomer,
                idUsuarioCliente: assignForm.idUsuarioCliente || null
            }, token);
            const nextFactura = response?.data ?? null;
            setFactura(nextFactura);
            setAssignForm(createAssignForm(nextFactura?.clienteFactura));
            setDiscountForm(createDiscountForm(nextFactura));
            setSearchResults([]);
            setSearchQuery("");
            setFeedback("Factura actualizada con los datos fiscales solicitados.");
        } catch (err) {
            setError(err.message || "No se ha podido asignar la factura al cliente.");
        } finally {
            setAssigning(false);
        }
    };

    const handleAssign = async (event, createCustomer = false) => {
        event.preventDefault();
        await submitAssign(createCustomer);
    };

    if (loading) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>Cargando factura...</p>
                </div>
            </section>
        );
    }

    if (!factura) {
        return (
            <section className="staff-ops-shell">
                <div className="staff-ops-empty">
                    <p>No se ha encontrado la factura solicitada.</p>
                </div>
                <Link to={facturasBasePath} className="staff-ops-secondary staff-ops-secondary--link">
                    Volver a facturas
                </Link>
            </section>
        );
    }

    const facturaStatus = resolveFacturaStatus(factura.estado);
    const clienteFactura = factura.clienteFactura ?? {};
    const isPaid = facturaStatus === "PAGADO";
    const chargePreview = Number(chargeForm.metodoPago) === 0
        ? Math.max(0, Number(chargeForm.importeEntregado || 0) - Number(factura.totalConDescuento || 0))
        : 0;

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Factura</p>
                    <h1>Factura {String(factura.numeroFactura).slice(0, 8)}</h1>
                    <p>
                        {factura.idMesa ? `${getMesaShortLabel(factura.idMesa)} · ` : ""}
                        {formatDateTime(factura.fechaFactura)}
                    </p>
                </div>

                <div className="staff-ops-actions">
                    <button type="button" className="staff-ops-primary" onClick={handlePrint}>
                        Imprimir
                    </button>
                    <button type="button" className="staff-ops-secondary" onClick={handleSendEmail} disabled={sendingEmail}>
                        {sendingEmail ? "Enviando..." : "Enviar por email"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="staff-ops-warning">
                    <strong>Error</strong>
                    <p>{error}</p>
                </div>
            )}

            {feedback && (
                <div className="staff-ops-warning staff-ops-warning--success">
                    <strong>Estado</strong>
                    <p>{feedback}</p>
                </div>
            )}

            <article className="invoice-sheet">
                <header className="invoice-sheet__header">
                    <div>
                        <p className="invoice-sheet__eyebrow">Gestaurante</p>
                        <h2>Factura simplificada</h2>
                        <p>C/ Servicio 17 · 28000 Madrid</p>
                    </div>

                    <div className="invoice-sheet__status">
                        <span className={`mesa-detail-card__label ops-badge ${orderStateClass(facturaStatus)}`}>
                            {translateFacturaStatus(facturaStatus)}
                        </span>
                        <strong>{formatMoney(factura.totalConDescuento)}</strong>
                    </div>
                </header>

                <section className="invoice-sheet__meta">
                    <div className="invoice-sheet__card">
                        <h3>Datos de factura</h3>
                        <p>Número: {String(factura.numeroFactura)}</p>
                        <p>Fecha: {formatDateTime(factura.fechaFactura)}</p>
                        <p>Canal: {factura.canalPedido ?? "SALA"}</p>
                        <p>Pedidos incluidos: {factura.pedidoIds?.length ?? 0}</p>
                    </div>

                    <div className="invoice-sheet__card">
                        <h3>Cliente</h3>
                        <p>{clienteFactura.billingName}</p>
                        {!clienteFactura.esAnonima && (
                            <>
                                <p>{clienteFactura.billingDocument || "Sin documento fiscal"}</p>
                                <p>{clienteFactura.billingStreet}</p>
                                <p>{clienteFactura.billingPostalCode} · {clienteFactura.billingCity}</p>
                                <p>{clienteFactura.billingProvince}</p>
                                <p>{clienteFactura.billingEmail}</p>
                                <p>{clienteFactura.billingPhone}</p>
                            </>
                        )}
                    </div>
                </section>

                <div className="invoice-sheet__table-wrap">
                    <table className="invoice-sheet__table">
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Artículo</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {factura.lineas?.length ? factura.lineas.map((linea) => (
                                <tr key={linea.idDetallePedido}>
                                    <td>{String(linea.idPedido).slice(0, 8)}</td>
                                    <td>{linea.platoNombre}</td>
                                    <td>{linea.cantidad}</td>
                                    <td>{formatMoney(linea.precioUnitario)}</td>
                                    <td>{formatMoney(linea.totalLinea)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5">No hay líneas disponibles en esta factura.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="invoice-sheet__totals">
                    <p>Total bruto: <strong>{formatMoney(factura.precioTotal)}</strong></p>
                    <p>Descuento ({resolveDiscountLabel(factura.tipoDescuento)}): <strong>{formatMoney(factura.descuento)}</strong></p>
                    {!!factura.motivoDescuento && <p>Motivo descuento: <strong>{factura.motivoDescuento}</strong></p>}
                    <p>Total final: <strong>{formatMoney(factura.totalConDescuento)}</strong></p>
                    {factura.metodoCobro !== null && factura.metodoCobro !== undefined && (
                        <>
                            <p>Método de cobro: <strong>{Number(factura.metodoCobro) === 0 ? "Efectivo" : "Tarjeta"}</strong></p>
                            {factura.fechaCobro && <p>Fecha de cobro: <strong>{formatDateTime(factura.fechaCobro)}</strong></p>}
                            {factura.importeEntregado !== null && factura.importeEntregado !== undefined && (
                                <p>Importe entregado: <strong>{formatMoney(factura.importeEntregado)}</strong></p>
                            )}
                            {factura.cambioEntregado !== null && factura.cambioEntregado !== undefined && Number(factura.cambioEntregado) > 0 && (
                                <p>Cambio entregado: <strong>{formatMoney(factura.cambioEntregado)}</strong></p>
                            )}
                        </>
                    )}
                </footer>
            </article>

            <section className="invoice-assign">
                <div className="invoice-assign__header">
                    <div>
                        <p className="staff-ops-eyebrow">Cobro y descuento</p>
                        <h2>Gestionar importe final</h2>
                    </div>
                    <span className="invoice-assign__hint">
                        Ajusta descuentos antes de cobrar. El cobro en efectivo calculará el cambio automáticamente.
                    </span>
                </div>

                {isPaid ? (
                    <div className="invoice-assign__hint invoice-assign__hint--inline">
                        La factura ya está cobrada. El descuento queda bloqueado para mantener la trazabilidad del cobro.
                    </div>
                ) : (
                    <form className="invoice-assign__form" onSubmit={handleSaveDiscount}>
                        <div className="invoice-choice-grid">
                            <button
                            type="button"
                            className={`invoice-choice-card ${Number(discountForm.tipoDescuento) === 0 ? "invoice-choice-card--active" : "invoice-choice-card--inactive"}`}
                            onClick={() => setDiscountForm((current) => ({ ...current, tipoDescuento: 0 }))}
                        >
                            Importe fijo
                            </button>
                            <button
                            type="button"
                            className={`invoice-choice-card ${Number(discountForm.tipoDescuento) === 1 ? "invoice-choice-card--active" : "invoice-choice-card--inactive"}`}
                            onClick={() => setDiscountForm((current) => ({ ...current, tipoDescuento: 1 }))}
                        >
                            Porcentaje
                        </button>
                    </div>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                        value={discountForm.valorDescuento}
                        onChange={(event) => setDiscountForm((current) => ({ ...current, valorDescuento: event.target.value }))}
                        placeholder={Number(discountForm.tipoDescuento) === 1 ? "Ej. 5" : "Ej. 2.50"}
                    />
                    <input
                        type="text"
                        maxLength="250"
                        value={discountForm.motivoDescuento}
                        onChange={(event) => setDiscountForm((current) => ({ ...current, motivoDescuento: event.target.value }))}
                        placeholder="Motivo del descuento"
                    />
                    <button type="submit" className="staff-ops-secondary" disabled={updatingDiscount}>
                        {updatingDiscount ? "Guardando..." : "Guardar descuento"}
                    </button>
                    </form>
                )}

                {!isPaid && (
                    <form className="invoice-assign__form" onSubmit={handleChargeFactura}>
                        <div className="invoice-choice-grid">
                            <button
                                type="button"
                                className={`invoice-choice-card ${Number(chargeForm.metodoPago) === 0 ? "invoice-choice-card--active" : ""}`}
                                onClick={() => setChargeForm((current) => ({ ...current, metodoPago: 0 }))}
                            >
                                Efectivo
                            </button>
                            <button
                                type="button"
                                className={`invoice-choice-card ${Number(chargeForm.metodoPago) === 1 ? "invoice-choice-card--active" : ""}`}
                                onClick={() => setChargeForm((current) => ({ ...current, metodoPago: 1 }))}
                            >
                                Tarjeta
                            </button>
                        </div>

                        {Number(chargeForm.metodoPago) === 0 && (
                            <>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={chargeForm.importeEntregado}
                                    onChange={(event) => setChargeForm((current) => ({ ...current, importeEntregado: event.target.value }))}
                                    placeholder="Importe entregado en efectivo"
                                />
                                <p className="invoice-assign__hint invoice-assign__hint--inline">
                                    Cambio a devolver: <strong>{formatMoney(chargePreview)}</strong>
                                </p>
                            </>
                        )}

                        <button type="submit" className="staff-ops-primary" disabled={charging}>
                            {charging ? "Cobrando..." : "Cobrar factura"}
                        </button>
                    </form>
                )}
            </section>

            <section className="invoice-assign">
                <div className="invoice-assign__header">
                    <div>
                        <p className="staff-ops-eyebrow">Asignación fiscal</p>
                        <h2>Asignar factura a cliente</h2>
                    </div>
                    <span className="invoice-assign__hint">
                        La factura parte de Cliente anónimo. Puedes buscar un cliente existente o crear uno nuevo desde aquí.
                    </span>
                </div>

                <div className="invoice-assign__search">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Buscar por DNI, CIF, email o nombre fiscal"
                    />
                    <button type="button" className="staff-ops-secondary" onClick={handleSearch} disabled={searching}>
                        {searching ? "Buscando..." : "Buscar cliente"}
                    </button>
                </div>

                {!!searchResults.length && (
                    <div className="invoice-assign__results">
                        {searchResults.map((cliente) => (
                            <button
                                key={cliente.idUsuarioCliente}
                                type="button"
                                className="invoice-assign__result"
                                onClick={() => handleSelectCustomer(cliente)}
                            >
                                <strong>{cliente.fiscalName || cliente.fullName || cliente.email}</strong>
                                <span>{cliente.esAnonimo ? "Cliente por defecto" : (cliente.dni || cliente.cif || "Sin documento")}</span>
                            </button>
                        ))}
                    </div>
                )}

                {anonymousOption && (
                    <div className="invoice-assign__actions">
                        <button
                            type="button"
                            className="staff-ops-secondary"
                            onClick={() => handleSelectCustomer(anonymousOption)}
                        >
                            Usar cliente anónimo
                        </button>
                    </div>
                )}

                <form className="invoice-assign__form" onSubmit={(event) => handleAssign(event, false)}>
                    <input
                        value={assignForm.fiscalName}
                        onChange={(event) => setAssignForm({ ...assignForm, fiscalName: event.target.value })}
                        placeholder="Nombre fiscal"
                        required
                    />
                    <div className="invoice-assign__row">
                        <input
                            value={assignForm.dni}
                            onChange={(event) => setAssignForm({ ...assignForm, dni: event.target.value, cif: "" })}
                            placeholder="DNI"
                        />
                        <input
                            value={assignForm.cif}
                            onChange={(event) => setAssignForm({ ...assignForm, cif: event.target.value, dni: "" })}
                            placeholder="CIF"
                        />
                    </div>
                    <input
                        value={assignForm.billingStreet}
                        onChange={(event) => setAssignForm({ ...assignForm, billingStreet: event.target.value })}
                        placeholder="Dirección fiscal"
                        required
                    />
                    <div className="invoice-assign__row">
                        <input
                            value={assignForm.billingPostalCode}
                            onChange={(event) => setAssignForm({ ...assignForm, billingPostalCode: event.target.value })}
                            placeholder="Código postal"
                            required
                        />
                        <input
                            value={assignForm.billingCity}
                            onChange={(event) => setAssignForm({ ...assignForm, billingCity: event.target.value })}
                            placeholder="Ciudad"
                            required
                        />
                        <input
                            value={assignForm.billingProvince}
                            onChange={(event) => setAssignForm({ ...assignForm, billingProvince: event.target.value })}
                            placeholder="Provincia"
                            required
                        />
                    </div>
                    <div className="invoice-assign__row">
                        <input
                            value={assignForm.billingEmail}
                            onChange={(event) => setAssignForm({ ...assignForm, billingEmail: event.target.value })}
                            placeholder="Email de factura"
                            required
                        />
                        <input
                            value={assignForm.billingPhone}
                            onChange={(event) => setAssignForm({ ...assignForm, billingPhone: event.target.value })}
                            placeholder="Teléfono"
                            required
                        />
                    </div>
                    <label className="invoice-assign__checkbox">
                        <input
                            type="checkbox"
                            checked={assignForm.saveOnCustomer}
                            onChange={(event) => setAssignForm({ ...assignForm, saveOnCustomer: event.target.checked })}
                        />
                        Guardar estos datos también en la ficha del cliente si existe
                    </label>
                    <div className="invoice-assign__actions">
                        <button
                            type="button"
                            className="staff-ops-primary"
                            disabled={assigning}
                            onClick={(event) => handleAssign(event, false)}
                        >
                            {assigning ? "Guardando..." : "Asignar factura"}
                        </button>
                        <button
                            type="button"
                            className="staff-ops-secondary"
                            disabled={assigning}
                            onClick={(event) => handleAssign(event, true)}
                        >
                            {assigning ? "Guardando..." : "Dar de alta cliente y asignar"}
                        </button>
                    </div>
                </form>
            </section>

            <Link to={facturasBasePath} className="staff-ops-secondary staff-ops-secondary--link">
                Volver a facturas
            </Link>
        </section>
    );
}
