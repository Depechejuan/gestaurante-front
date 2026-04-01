export function resolvePlatoType(plato, index = 0) {
    return plato.categoriaDescripcion || plato.categoria || ["Entrantes", "Platos", "Postres"][index % 3];
}

export function decorateCatalogItems(platos = []) {
    return platos.map((plato, index) => ({
        ...plato,
        tipoVisible: resolvePlatoType(plato, index)
    }));
}
