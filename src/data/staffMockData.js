export const mesasMock = [
    {
        id: "m1",
        nombre: "Mesa 1",
        zona: "Terraza",
        capacidad: 4,
        estado: "Ocupada",
        nota: "Cliente habitual. Prefiere agua fria y servicio rapido.",
        comandas: [
            {
                id: "c101",
                titulo: "Comanda principal",
                estado: "En curso",
                total: "42,80 EUR",
                actualizada: "Hace 4 min",
                items: ["2 x Risotto", "1 x Burrata", "2 x Agua"]
            },
            {
                id: "c102",
                titulo: "Postres",
                estado: "Pendiente",
                total: "13,00 EUR",
                actualizada: "Hace 1 min",
                items: ["1 x Tiramisu", "1 x Cafe solo"]
            }
        ]
    },
    {
        id: "m2",
        nombre: "Mesa 2",
        zona: "Sala",
        capacidad: 2,
        estado: "Libre",
        nota: "Lista para rotacion de mediodia.",
        comandas: []
    },
    {
        id: "m3",
        nombre: "Mesa 3",
        zona: "Barra",
        capacidad: 3,
        estado: "Reservada",
        nota: "Reserva prevista a las 21:00.",
        comandas: [
            {
                id: "c103",
                titulo: "Bebidas de espera",
                estado: "Servida",
                total: "9,50 EUR",
                actualizada: "Hace 12 min",
                items: ["2 x Vermut", "1 x Agua con gas"]
            }
        ]
    },
    {
        id: "m4",
        nombre: "Mesa 4",
        zona: "Terraza",
        capacidad: 6,
        estado: "Ocupada",
        nota: "Grupo grande. Posible segunda ronda de comandas.",
        comandas: [
            {
                id: "c104",
                titulo: "Comanda grupo",
                estado: "En cocina",
                total: "86,20 EUR",
                actualizada: "Hace 6 min",
                items: ["3 x Hamburguesa", "2 x Ensalada", "4 x Refresco", "1 x Patatas"]
            }
        ]
    }
];

export const comandasMock = mesasMock.flatMap((mesa) =>
    mesa.comandas.map((comanda) => ({
        ...comanda,
        mesaId: mesa.id,
        mesaNombre: mesa.nombre,
        zona: mesa.zona
    }))
);

export function getMesaMockById(id) {
    return mesasMock.find((mesa) => mesa.id === id) ?? null;
}

export function getComandaMockById(id) {
    return comandasMock.find((comanda) => comanda.id === id) ?? null;
}
