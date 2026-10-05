# Responsive Crear Solicitud

## Objetivo

Adaptar `/dashboard` para telefono, tablet y escritorio sin modificar contratos de API, validaciones ni el flujo de creacion de pacientes y ordenes.

## Navegacion

- Mantener el sidebar desde `lg`.
- Mostrar debajo de `lg` una cabecera fija con logo, contexto de ruta y boton hamburguesa.
- Abrir la navegacion movil como drawer con overlay, cierre por enlace, Escape o clic exterior, bloqueo de scroll y restauracion de foco.

## Contenido

- Usar un contenedor centrado `max-w-7xl` con padding progresivo.
- Apilar busqueda y acciones en telefono.
- Distribuir datos del paciente en una, dos o tres columnas segun el espacio disponible.
- Limitar dropdowns y popovers al viewport.
- Escalar el catalogo de examenes de una a cinco columnas entre telefono y pantallas `2xl`.
- Mantener los tokens, componentes, radios y estrategia de bordes del UI Kit.

## Accion principal

- Mostrar en movil una barra inferior fija con contador de examenes y el boton de guardado.
- Conservar en escritorio la accion alineada al final del contenido.
- Reservar espacio inferior para evitar que la barra cubra informacion.

## Accesibilidad

- Proveer nombres y estados ARIA en drawer, buscador y selector de fecha.
- Mantener objetivos tactiles adecuados y foco visible.
- Soportar Escape en overlays y navegacion por teclado en la busqueda de pacientes.

## Verificacion

Validar anchos de 320, 375, 430, 768, 1024, 1280 y 1536 px, contenido largo, diez resultados de busqueda, drawer y selector de fecha abiertos, navegacion por teclado y estados de carga.
