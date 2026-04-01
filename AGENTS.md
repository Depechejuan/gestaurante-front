# AGENTS.md

## Qué hace este proyecto
`gestaurante-front` es el frontend de Gestaurante. Es una SPA en React + Vite para tres áreas:

- `Cliente público`: home, carta, detalle de platos, QR de mesa y pedido online
- `Staff`: sala, cocina, reparto, pedidos, mesas, facturas y clientes
- `Admin`: empleados, clientes, mesas, facturas y carta

Consume la API ASP.NET del repositorio `gestaurante-back`.

## Arquitectura
- `src/Pages`: pantallas completas
- `src/Components`: piezas reutilizables de UI
- `src/Components/Forms`: formularios
- `src/Layouts`: layout por área
- `src/Auth`: sesiones de empleados y clientes
- `src/Context`: providers compartidos de UI, como diálogos
- `src/Routes`: guards de rutas protegidas
- `src/services`: cliente HTTP, storage y acceso a API
- `src/Hooks`: hooks de composición
- `src/utils`: helpers de formato y lógica ligera
- `src/constants`: roles y constantes compartidas
- `src/styles`: estilos por área

### Piezas clave
- rutas globales: [src/App.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/App.jsx)
- auth empleado: [src/Auth/Auth-Context.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Auth/Auth-Context.jsx)
- auth cliente: [src/Auth/Customer-Auth-Context.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Auth/Customer-Auth-Context.jsx)
- cliente HTTP: [src/services/api-client.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/api-client.js)
- diálogos comunes: [src/Context/AppDialogContext.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Context/AppDialogContext.jsx)
- catálogo compartido: [src/utils/catalog.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/utils/catalog.js)
- storage compartido: [src/services/storage-utils.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/storage-utils.js), [src/services/auth-storage.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/auth-storage.js)

## Ubicación de cada cosa

### Cliente público
- [src/Pages/Home.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Home.jsx)
- [src/Pages/PlatosPublic.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/PlatosPublic.jsx)
- [src/Pages/UniquePlatoPublic.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/UniquePlatoPublic.jsx)
- [src/Pages/MesaQrMenu.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/MesaQrMenu.jsx)
- [src/Pages/OnlineOrder.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/OnlineOrder.jsx)
- [src/Pages/CustomerAccount.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/CustomerAccount.jsx)
- [src/Pages/CustomerOrders.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/CustomerOrders.jsx)
- [src/Pages/CustomerAddresses.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/CustomerAddresses.jsx)
- [src/Pages/CustomerPaymentMethods.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/CustomerPaymentMethods.jsx)

### Staff
- [src/Pages/Dashboard-Staff.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Dashboard-Staff.jsx)
- [src/Pages/Mesas.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Mesas.jsx)
- [src/Pages/MesaDetail.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/MesaDetail.jsx)
- [src/Pages/Pedidos.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Pedidos.jsx)
- [src/Pages/UniquePedido.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/UniquePedido.jsx)
- [src/Pages/PedidosOnline.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/PedidosOnline.jsx)
- [src/Pages/Facturas.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Facturas.jsx)
- [src/Pages/UniqueFactura.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/UniqueFactura.jsx)
- [src/Pages/Clientes.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Clientes.jsx)

### Admin
- [src/Pages/Dashboard.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Dashboard.jsx)
- [src/Components/Empleados.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Components/Empleados.jsx)
- [src/Components/UniqueEmpleado.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Components/UniqueEmpleado.jsx)
- [src/Pages/PlatosAdmin.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/PlatosAdmin.jsx)
- [src/Pages/UniquePlatoAdmin.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/UniquePlatoAdmin.jsx)

## Instalación y ejecución

### Requisitos
- Node.js 20+
- npm
- backend accesible

### Instalar dependencias
```bash
cd /Users/juanleon/Documents/gestaurante/gestaurante-front
npm install
```

### Variables de entorno
Crear [`.env`](/Users/juanleon/Documents/gestaurante/gestaurante-front/.env) a partir de [`.env.example`](/Users/juanleon/Documents/gestaurante/gestaurante-front/.env.example).

Valores habituales:
```env
PUBLIC_URL=http://localhost:5173
VITE_API_HOST=http://localhost:3003
VITE_API_PORT=3003
VITE_ENABLE_MOCK_PUBLIC_CATALOG=false
```

### Ejecutar en desarrollo
```bash
cd /Users/juanleon/Documents/gestaurante/gestaurante-front
npm run dev
```

### Build
```bash
cd /Users/juanleon/Documents/gestaurante/gestaurante-front
npm run build
```

## Reglas útiles
- No toques `localStorage` directamente desde páginas; usa utilidades de `src/services`.
- No uses `window.confirm` ni `window.prompt`; usa [src/Context/AppDialogContext.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Context/AppDialogContext.jsx).
- La carta pública, el QR y el pedido online deben reutilizar el mismo contrato de catálogo siempre que sea posible.
- Si un flujo es de cliente y otro de empleados, mantén separados los contextos de autenticación.
- Si el backend devuelve `401/403`, deja que la capa común de API gestione la expiración de sesión.

## Puntos delicados
- El pedido online y el QR usan `localStorage` hasta confirmar.
- Hay dos tipos de sesión: empleados y clientes.
- El fallback a catálogo mock solo debe activarse con `VITE_ENABLE_MOCK_PUBLIC_CATALOG=true` y solo en desarrollo.
- Algunas vistas internas dependen de que el backend esté con migraciones aplicadas.

## Comandos rápidos
```bash
# desarrollo
npm run dev

# build
npm run build

# lint
npm run lint
```
