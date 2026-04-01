import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import getToken from "../services/get-token";
import { getClientes } from "../services/clientes";
import "../styles/Staff/operations.css";

function resolveClienteLabel(cliente) {
    return cliente.fiscalName || `${cliente.firstName} ${cliente.lastName}`.trim() || cliente.email;
}

export default function Clientes() {
    const location = useLocation();
    const token = getToken();
    const [query, setQuery] = useState("");
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const isStaffContext = location.pathname.startsWith("/staff/");

    useEffect(() => {
        const loadClientes = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getClientes(token, query);
                setClientes(response?.data ?? []);
            } catch (err) {
                setError(err.message || "No se ha podido cargar la lista de clientes.");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = window.setTimeout(loadClientes, query.trim() ? 250 : 0);
        return () => window.clearTimeout(timeoutId);
    }, [query]);

    const titleCopy = useMemo(() => ({
        eyebrow: isStaffContext ? "Sala" : "Administracion",
        title: "Clientes",
        description: isStaffContext
            ? "Consulta rapida de clientes para cobro, facturas y vinculacion fiscal."
            : "Base de clientes registrada para pedidos online, facturacion y seguimiento."
    }), [isStaffContext]);

    return (
        <section className="staff-ops-shell">
            <div className="staff-ops-header">
                <div>
                    <p className="staff-ops-eyebrow">{titleCopy.eyebrow}</p>
                    <h1>{titleCopy.title}</h1>
                    <p>{titleCopy.description}</p>
                </div>
                <div className="staff-ops-actions">
                    <label className="ops-search">
                        <span>Buscar</span>
                        <input
                            type="search"
                            placeholder="Email, nombre, DNI o CIF"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </label>
                </div>
            </div>

            {error && (
                <div className="staff-ops-warning">
                    <strong>Error</strong>
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="staff-ops-empty">
                    <p>Cargando clientes...</p>
                </div>
            ) : !clientes.length ? (
                <div className="staff-ops-empty">
                    <p>No hay clientes que coincidan con la búsqueda actual.</p>
                </div>
            ) : (
                <div className="comandas-list">
                    {clientes.map((cliente) => (
                        <article key={cliente.idUsuarioCliente} className="comanda-card">
                            <div className="comanda-card__top">
                                <div>
                                    <span className={`mesa-detail-card__label ops-badge ${cliente.emailVerificado ? "ops-badge--listo" : "ops-badge--pendiente"}`}>
                                        {cliente.emailVerificado ? "Email verificado" : "Pendiente de validar"}
                                    </span>
                                    <h3>{resolveClienteLabel(cliente)}</h3>
                                </div>
                                <span className={`mesa-detail-card__label ops-badge ${cliente.activo ? "ops-badge--listo" : "ops-badge--cancelado"}`}>
                                    {cliente.activo ? "Activo" : "Inactivo"}
                                </span>
                            </div>

                            <p className="ops-inline-meta">{cliente.email}</p>

                            <ul>
                                <li>Telefono: {cliente.phone || "Sin telefono"}</li>
                                <li>DNI: {cliente.dni || "No indicado"}</li>
                                <li>CIF: {cliente.cif || "No indicado"}</li>
                                <li>
                                    Direccion fiscal: {cliente.billingStreet
                                        ? `${cliente.billingStreet}, ${cliente.billingPostalCode} ${cliente.billingCity}, ${cliente.billingProvince}`
                                        : "No configurada"}
                                </li>
                            </ul>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
