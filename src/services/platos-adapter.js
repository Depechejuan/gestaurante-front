const platosMock = [
    {
        id: "plato-mock-1",
        nombre: "Ravioli de setas",
        descripcion: "Borrador de plato para trabajar el backoffice mientras la API real de carta sigue pendiente.",
        imagen: "",
        precio: "16,50 EUR",
        disponible: true,
        categoria: "Pasta",
        ingredientes: "Pasta fresca, setas, mantequilla, parmesano",
        menuNotes: "Candidato para carta de temporada",
        tags: "temporada, veggie"
    },
    {
        id: "plato-mock-2",
        nombre: "Arroz meloso de marisco",
        descripcion: "Registro provisional para validar layout, fichas y estados internos del panel admin.",
        imagen: "",
        precio: "22,00 EUR",
        disponible: false,
        categoria: "Arroces",
        ingredientes: "Caldo, sepia, gamba, arroz",
        menuNotes: "Pendiente de definicion final con cocina",
        tags: "arroz, especialidad"
    }
];

export async function getMockPlatos() {
    return structuredClone(platosMock);
}
