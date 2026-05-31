# gestaurante-front
Front-end de la Aplicación de Gestaurante

## Flujo operativo de pedido online
- La vista `/staff/online` centraliza recogidas y domicilios.
- Cuando sala marca todas las lineas online como ok:
  - `DOMICILIO` queda como `PENDIENTE_ENTREGA`; el repartidor ve cliente, telefono, direccion y elementos a entregar.
  - `RECOGIDA` queda como `EN_ESPERA`; el camarero la finaliza cuando el cliente pasa a recogerla.
- El repartidor solo ve pedidos a domicilio en `PENDIENTE_ENTREGA` o `EN_CAMINO`, y los avanza a `EN_CAMINO` y despues a `ENTREGADO`.
- Este flujo depende de migraciones incrementales del backend; no requiere ni permite resetear la base de datos.

## Plan pendiente: paneles internos

Este bloque recoge un plan de trabajo acordado para la rama `juan-platos-public`.
Solo deben quedar aqui las piezas que siguen pendientes o a medias.

### STAFF

#### Cocina
- Crear una ruta propia de cocina, separada de `Pedidos`.
- Los cocineros verán los pedidos que les han llegado a cocina.
- Podrán marcar líneas o pedidos como listos para servir.
- `Administrador` también tendrá acceso a esta vista.

### ADMIN

#### Platos
- Mantener el CRUD de platos como provisional mientras no exista backend definitivo.
- El módulo debe seguir mostrando el warning de `INCOMPLETO`.

### Restricciones y decisiones ya tomadas
- La rama objetivo es `juan-platos-public`.
- La vista de cocina irá en una ruta separada.
- `Cerrar mesa` debe facturar todos los pedidos de esa mesa.
- El marcado parcial se hace por línea de pedido.

## Roadmap futuro: experiencia cliente y pedido online

Nota: el flujo base de pedido online con recogida, domicilio y reparto ya esta operativo. Este roadmap queda como referencia historica y para mejoras comerciales o de experiencia.

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
- Terminar de conectar la carta real al flujo QR.
- Revisar el histórico visible del cliente y su presentación final.
- Endurecer estados UX de expiración, bloqueo y reintento.

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
- Rematar la experiencia final del histórico y del estado del pedido enviado.

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

### Ya implementado
- CRUD real de mesas en staff/admin.
- Detalle real de mesa con pedidos y cierre de mesa.
- Gestor real de facturas en admin con impresión y envío por email.
- Capa HTTP compartida con logout automatico ante `401/403`.
- Flujo QR con sesion publica de mesa y carrito persistido en `localStorage`.
