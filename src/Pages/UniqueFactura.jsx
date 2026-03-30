import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import getToken from "../services/get-token";
import { assignFacturaCliente, getFactura, searchFacturaClientes, sendFacturaEmail } from "../services/facturas";
import { formatDateTime, formatMoney, orderStateClass, resolveFacturaStatus, translateFacturaStatus } from "../utils/operations";
import "../styles/Staff/operations.css";

function createAssignForm(clienteFactura) {
    const isAnonymous = clienteFactura?.esAnonima;
    return {
        idUsuarioCliente: clienteFactura?.idUsuarioCliente ?? "",
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

export default function UniqueFactura() {
    const { id } = useParams();
    const location = useLocation();
    const token = getToken();
    const tokenValue = token?.token ?? "";
    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [assignForm, setAssignForm] = useState(createAssignForm(null));
    const [sendingEmail, setSendingEmail] = useState(false);
    const isStaffContext = location.pathname.startsWith("/staff/");
    const facturasBasePath = isStaffContext ? "/staff/facturas" : "/dashboard/facturas";

    useEffect(() => {
        const loadFactura = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getFactura(id, token);
                const nextFactura = response?.data ?? null;
                setFactura(nextFactura);
                setAssignForm(createAssignForm(nextFactura?.clienteFactura));
            } catch (err) {
                setError(err.message || "No se ha podido cargar la factura.");
            } finally {
                setLoading(false);
            }
        };

        loadFactura();
    }, [id, tokenValue]);

    const handlePrint = () => {
        window.print();
    };

    const handleSendEmail = async () => {
        const targetEmail = factura?.clienteFactura?.esAnonima || !factura?.clienteFactura?.billingEmail
            ? window.prompt("Indica el email al que quieres enviar esta factura.", "")
            : "";

        if (targetEmail === null) {
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
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

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

    const handleAssign = async (event) => {
        event.preventDefault();
        setAssigning(true);
        setError("");
        setFeedback("");
        try {
            const response = await assignFacturaCliente(id, {
                ...assignForm,
                idUsuarioCliente: assignForm.idUsuarioCliente || null
            }, token);
            const nextFactura = response?.data ?? null;
            setFactura(nextFactura);
            setAssignForm(createAssignForm(nextFactura?.clienteFactura));
            setSearchResults([]);
            setSearchQuery("");
            setFeedback("Factura actualizada con los datos fiscales solicitados.");
        } catch (err) {
            setError(err.message || "No se ha podido asignar la factura al cliente.");
        } finally {
            setAssigning(false);
        }
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

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">Factura</p>
                    <h1>Factura {String(factura.numeroFactura).slice(0, 8)}</h1>
                    <p>
                        {factura.idMesa ? `Mesa ${String(factura.idMesa).slice(0, 8)} · ` : ""}
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
                        <p>gestaurante@local.test · +34 910 000 000</p>
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
                    <p>Descuento: <strong>{formatMoney(factura.descuento)}</strong></p>
                    <p>Total final: <strong>{formatMoney(factura.totalConDescuento)}</strong></p>
                </footer>
            </article>

            <section className="invoice-assign">
                <div className="invoice-assign__header">
                    <div>
                        <p className="staff-ops-eyebrow">Asignación fiscal</p>
                        <h2>Asignar factura a cliente</h2>
                    </div>
                    <span className="invoice-assign__hint">
                        Busca por DNI o CIF y, si hace falta, completa los datos manualmente.
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
                                <span>{cliente.dni || cliente.cif || "Sin documento"}</span>
                            </button>
                        ))}
                    </div>
                )}

                <form className="invoice-assign__form" onSubmit={handleAssign}>
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
                    <button type="submit" className="staff-ops-primary" disabled={assigning}>
                        {assigning ? "Guardando..." : "Asignar factura"}
                    </button>
                </form>
            </section>

            <Link to={facturasBasePath} className="staff-ops-secondary staff-ops-secondary--link">
                Volver a facturas
            </Link>
        </section>
    );
}
