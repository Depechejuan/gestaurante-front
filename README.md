# gestaurante-front
Front-end de la Aplicación de Gestaurante

## Plan pendiente: paneles internos

Este bloque recoge un plan de trabajo acordado para la rama `juan-platos-public`.
No está implementado todavía. Se deja aquí como referencia para retomarlo más adelante.

### STAFF

#### Mesas
- Reutilizar la sección ya existente de `Mesas` y conectarla a backend real.
- Pintar tantas mesas como existan en base de datos.
- Añadir acciones de crear, editar y borrar mesa.
- Usar un icono de mesa desde `src/assets/Icons`, con fallback visual temporal para no romper la interfaz.
- En el detalle de mesa:
  - mostrar los pedidos actuales asociados
  - si no hay pedidos, enseñar mensaje informativo, no error
  - permitir crear pedido y entrar en su detalle
  - permitir cerrar mesa
- `Cerrar mesa` debe obtener todos los pedidos de esa mesa y generar una factura.
- El marcado parcial del pedido se hará por línea.
- Debe existir también acción para marcar el pedido completo.

#### Cocina
- Crear una ruta propia de cocina, separada de `Pedidos`.
- Los cocineros verán los pedidos que les han llegado a cocina.
- Podrán marcar líneas o pedidos como listos para servir.
- `Administrador` también tendrá acceso a esta vista.

### ADMIN

#### Facturas
- Crear un gestor de facturas real en admin.
- Listado de facturas.
- Detalle de factura.
- Acción de imprimir.
- Acción de mandar por email como mock visual, sin implementación real todavía.

#### Platos
- Mantener el CRUD de platos como provisional mientras no exista backend definitivo.
- El módulo debe seguir mostrando el warning de `INCOMPLETO`.

#### Mesas
- Añadir CRUD de mesas también en el panel admin.
- Reutilizar la misma base de servicios/componentes que staff cuando sea posible.

### Integración y auth
- Adaptar el front al JWT endurecido del backend.
- Cerrar sesión automáticamente si el token deja de ser válido.
- Mantener protección por rol en rutas y menús.
- No inventar persistencia falsa donde el backend todavía no exponga relaciones completas.

### Restricciones y decisiones ya tomadas
- La rama objetivo es `juan-platos-public`.
- No implementar este plan todavía sin petición expresa.
- La vista de cocina irá en una ruta separada.
- `Cerrar mesa` debe facturar todos los pedidos de esa mesa.
- El marcado parcial se hace por línea de pedido.
