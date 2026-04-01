# AGENTS.md

## Qué hace este proyecto
`gestaurante-front` es el frontend de Gestaurante. Es una SPA en React + Vite para tres grandes áreas:

- `Cliente público`: home, carta, contacto, detalle de platos, pedido online y flujo QR de mesa.
- `Staff`: sala, cocina, reparto, pedidos, mesas, facturas y clientes.
- `Admin`: empleados, clientes, mesas, facturas y carta.

El frontend consume el backend ASP.NET del repositorio `gestaurante-back` y está pensado para trabajar en local con Vite.

## Arquitectura
La app está organizada por dominio visual y por responsabilidad:

- `src/Pages`: pantallas completas enrutadas.
- `src/Components`: piezas reutilizables de UI.
- `src/Components/Forms`: formularios concretos.
- `src/Layouts`: layout por área (`Cliente`, `Staff`, `Admin`).
- `src/Auth`: contexto y lógica de sesión para empleados y clientes.
- `src/Routes`: guards de rutas protegidas.
- `src/services`: acceso a API, almacenamiento local y utilidades de sesión.
- `src/Hooks`: hooks de composición y carga.
- `src/styles`: estilos segmentados por área.
- `src/utils`: helpers de formato y lógica compartida ligera.

### Patrones importantes
- La navegación principal se define en [src/App.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/App.jsx).
- La autenticación interna y de cliente están separadas:
  - [src/Auth/Auth-Context.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Auth/Auth-Context.jsx)
  - [src/Auth/Customer-Auth-Context.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Auth/Customer-Auth-Context.jsx)
- La capa HTTP común está en [src/services/api-client.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/api-client.js).
- El carrito de QR y el pedido online usan `localStorage` hasta confirmar:
  - [src/services/table-order-storage.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/table-order-storage.js)
  - [src/services/online-order-storage.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/online-order-storage.js)

## Ubicación de cada cosa

### Enrutado
- [src/App.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/App.jsx): mapa global de rutas.

### Área cliente
- [src/Pages/Home.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Home.jsx)
- [src/Pages/PlatosPublic.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/PlatosPublic.jsx)
- [src/Pages/UniquePlatoPublic.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/UniquePlatoPublic.jsx)
- [src/Pages/MesaQrMenu.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/MesaQrMenu.jsx)
- [src/Pages/OnlineOrder.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/OnlineOrder.jsx)
- [src/Pages/CustomerAccount.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/CustomerAccount.jsx)
- [src/Pages/CustomerOrders.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/CustomerOrders.jsx)
- [src/Pages/CustomerAddresses.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/CustomerAddresses.jsx)
- [src/Pages/CustomerPaymentMethods.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/CustomerPaymentMethods.jsx)

### Área staff
- [src/Pages/Dashboard-Staff.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Dashboard-Staff.jsx)
- [src/Pages/Mesas.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Mesas.jsx)
- [src/Pages/MesaDetail.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/MesaDetail.jsx)
- [src/Pages/Pedidos.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Pedidos.jsx)
- [src/Pages/UniquePedido.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/UniquePedido.jsx)
- [src/Pages/PedidosOnline.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/PedidosOnline.jsx)
- [src/Pages/Facturas.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Facturas.jsx)
- [src/Pages/UniqueFactura.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/UniqueFactura.jsx)
- [src/Pages/Clientes.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Clientes.jsx)

### Área admin
- [src/Pages/Dashboard.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/Dashboard.jsx)
- [src/Components/Empleados.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Components/Empleados.jsx)
- [src/Components/UniqueEmpleado.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Components/UniqueEmpleado.jsx)
- [src/Pages/PlatosAdmin.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/PlatosAdmin.jsx)
- [src/Pages/UniquePlatoAdmin.jsx](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/Pages/UniquePlatoAdmin.jsx)

### Servicios API
- `auth y sesión`: [src/services/login.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/login.js), [src/services/get-basic-user.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/get-basic-user.js)
- `clientes`: [src/services/clientes.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/clientes.js), [src/services/customer-account.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/customer-account.js)
- `catálogo`: [src/services/public-catalog.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/public-catalog.js), [src/services/platos.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/platos.js), [src/services/categorias.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/categorias.js), [src/services/ingredientes.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/ingredientes.js)
- `operación`: [src/services/mesas.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/mesas.js), [src/services/pedidos.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/pedidos.js), [src/services/facturas.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/facturas.js)

## Instalación y ejecución

### Requisitos
- Node.js 20+ recomendado
- npm
- Backend corriendo en local o accesible por red

### Instalar dependencias
```bash
cd /Users/juanleon/Documents/gestaurante/gestaurante-front
npm install
```

### Variables de entorno
Crear o completar [`.env`](/Users/juanleon/Documents/gestaurante/gestaurante-front/.env) a partir de [`.env.example`](/Users/juanleon/Documents/gestaurante/gestaurante-front/.env.example).

Valores habituales en local:
```env
PUBLIC_URL=http://localhost:5173
VITE_API_HOST=http://localhost:3003
VITE_API_PORT=3003
```

### Ejecutar en desarrollo
```bash
cd /Users/juanleon/Documents/gestaurante/gestaurante-front
npm run dev
```

### Build de producción
```bash
cd /Users/juanleon/Documents/gestaurante/gestaurante-front
npm run build
```

## Reglas útiles para trabajar aquí
- No dupliques lógica de API: usa [src/services/api-client.js](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/services/api-client.js).
- Si un flujo es de cliente y otro de empleados, mantén separados los contextos de autenticación.
- La carta pública, el QR y el pedido online deben reutilizar el mismo contrato de catálogo cuando sea posible.
- Cuando cambies estados visuales de staff, revisa también:
  - [src/styles/Staff/main.css](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/styles/Staff/main.css)
  - [src/styles/Staff/operations.css](/Users/juanleon/Documents/gestaurante/gestaurante-front/src/styles/Staff/operations.css)
- Los paneles internos están pensados con fuerte prioridad móvil/tablet para staff y desktop/tablet para admin.

## Puntos delicados del proyecto
- El pedido online y el QR usan almacenamiento local mientras el pedido no se confirma.
- Hay dos tipos de sesión:
  - empleados
  - clientes
- Algunas pantallas de facturas, pedidos y clientes dependen de que el backend esté con migraciones al día.
- Si el backend devuelve `401/403`, la capa API puede cerrar sesión automáticamente.

## Comandos rápidos
```bash
# desarrollo
npm run dev

# build
npm run build

# lint
npm run lint
```
