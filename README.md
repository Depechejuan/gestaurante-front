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

## Roadmap futuro: experiencia cliente y pedido online

Este bloque recoge el plan de evolución general del proyecto para la parte pública y para el futuro canal de pedido online.
No implica que todo deba implementarse de golpe. La recomendación es hacerlo por fases.

### Resumen
- Consolidar primero el catálogo real: platos, categorías, ingredientes, disponibilidad, imágenes y alérgenos.
- Cerrar el flujo QR de mesa ya iniciado para que el cliente pueda pedir de forma fiable desde `/mesa/:id`.
- Preparar después el pedido online sin registro para recogida.
- Añadir más adelante `delivery` y pago online opcional, una vez el flujo base esté estable.

### Mejoras prioritarias de front

#### Parte pública
- Elevar la carta pública a producto real:
  - navegación por tipo
  - filtros
  - búsqueda
  - badges de alérgenos
  - disponibilidad visible
- Mejorar home, contacto y about con más jerarquía comercial y llamadas a la acción más útiles.
- Añadir estados UX coherentes:
  - loading
  - vacío
  - error recuperable
  - sesión expirada
  - producto no disponible

#### Flujo QR de cliente
- Mantener el carrito solo en `localStorage` mientras el pedido no se haya enviado.
- No tocar base de datos mientras el cliente añade, quita o cambia cantidades.
- Al pulsar `Enviar`, mandar el pedido al backend una sola vez.
- Solo si el backend lo acepta, limpiar el carrito local.
- Mostrar el histórico de pedidos de esa sesión pública de mesa.
- Mantener la restricción temporal de sesión única por mesa.

#### Checkout futuro de cliente
- Preparar una experiencia sin registro obligatorio.
- Pedir solo los datos mínimos necesarios.
- Permitir en el futuro elegir entre:
  - recogida
  - delivery
- Permitir pago opcional:
  - online
  - en local

### Plan por fases

#### Fase 1: QR de mesa completo
- Conectar la carta real al flujo público de mesa.
- Mostrar carrito, histórico y feedback de envío.
- Recuperar carrito no enviado tras cerrar navegador.
- Invalidar la sesión pública al cerrar mesa.

#### Fase 2: pedido online para recogida
- Crear un flujo público de pedido sin registro.
- Mantener carrito local hasta confirmación final.
- Persistir el pedido solo al enviarlo.
- Mostrar un identificador público temporal para consultar el estado del pedido.

#### Fase 3: delivery y pago online opcional
- Añadir dirección, zonas y coste de envío.
- Añadir selector de método de pago.
- Integrar pasarela de pago sin obligar al usuario a crear cuenta.
- Mantener la alternativa de pago en local cuando el canal lo permita.

#### Fase 4: mejoras comerciales
- repetición rápida de pedido
- promociones o códigos descuento
- favoritos
- notificaciones
- reserva online

### Decisiones ya fijadas
- El canal cliente no debe usar JWT interno de staff/admin.
- El cliente no necesita registro para pedir.
- El carrito es un borrador local, no una fuente de verdad persistente.
- El pedido definitivo vive en backend solo a partir del envío.
- El histórico económico debe depender del snapshot de pedido/factura, no del precio actual del plato.
