# Spec: Integracion `ExamTable` con endpoint `/orders`

## Objetivo

Integrar `src/components/ExamTable.tsx` con `GET /orders` sin cambiar el diseno visual actual, manteniendo filtros (fecha, busqueda, estado), paginacion y flujo de click sobre fila.

## Alcance

- Cambiar solo la fuente de datos de la tabla: de `useLab()` legacy a endpoint remoto `/orders`.
- Mantener exactamente la misma estructura visual de tabla y toolbar.
- Mantener filtro por fecha (`hoy`, `ayer`, `ultimos 7 dias`, fecha manual).
- Mantener filtro por estado recibido desde query param (`pendiente`, `completo`).
- Mantener click en fila para abrir detalle en `/dashboard/examen/[id]`.
- Adaptar el detalle para que soporte `orders/{orderId}` cuando no exista examen legacy.

No incluye:
- Rediseno UI.
- Reemplazo total del flujo legacy de captura de resultados.

## Endpoints

### 1) Listado de solicitudes

`GET /orders`

Respuesta esperada: array

```json
[
  {
    "id": "6a149bc80e046da5de899f21",
    "order_number": "ORD-20260525-0101",
    "status": "pending",
    "created_at": "2026-05-25T18:58:16.926Z",
    "patient": {
      "id": "6a149bc80e046da5de899f05",
      "document_number": "12490966",
      "name": "Cenaid Rujano"
    },
    "exams": {
      "total": 1,
      "completed": 0
    }
  }
]
```

### 2) Detalle de orden

`GET /orders/{orderId}`

Respuesta esperada: objeto con `exams[]` y `template_snapshot.name`.

## Mapeo funcional

### Tabla (`ExamTable`)

- `# Solicitud` -> `order.order_number`
- `Paciente` -> `order.patient.name`
- `Cedula` -> `order.patient.document_number`
- `Fecha` -> `order.created_at` (formato local)
- `Examenes` -> `order.exams.completed / order.exams.total`
- `Estado badge`:
  - `completed` o `sent` -> `completo`
  - resto -> `pendiente`

### Filtros

- Fecha:
  - `hoy`: `created_at` mismo dia
  - `ayer`: `created_at` dia anterior
  - `ultimos7`: rango inclusivo desde hoy-6 hasta hoy
  - `fecha`: coincide con fecha seleccionada
- Busqueda: por `patient.name`, `patient.document_number`, `order_number`
- Estado: usar filtro actual `pendiente/completo` mapeado desde `status` API

## Flujo click fila

1. Usuario hace click en fila de tabla.
2. Navega a `/dashboard/examen/{order.id}`.
3. En `src/app/dashboard/examen/[id]/page.tsx`:
   - primero intenta flujo legacy (buscar examen local por id).
   - si no existe examen local, consulta `GET /orders/{orderId}`.
   - consulta paciente por `patient_id` con endpoint de pacientes existente.
   - muestra vista de orden con:
     - numero de orden
     - datos de paciente
     - lista de examenes a realizar (`template_snapshot.name`)
     - notas

Con esto el click no se rompe en el nuevo modelo.

## Cambios tecnicos

### `src/types/create.ts`

- Agregar:
  - `OrderStatusApi`
  - `OrderItem`
  - `GetOrdersResponse`
  - `OrderExamDetail`
  - `OrderDetailResponse`

### `src/data/createPatients.ts`

- Agregar hook `useOrders({ page, limit })` para `GET /orders`.
- Agregar hook `useOrderById(orderId)` para `GET /orders/{orderId}`.

### `src/components/ExamTable.tsx`

- Reemplazar `useLab()` por `useOrders()`.
- Mantener clases y layout actual.
- Aplicar filtros sobre `orders`.
- Mantener paginacion y textos actuales.

### `src/app/dashboard/examen/[id]/page.tsx`

- Agregar fallback de orden:
  - si no existe examen legacy, consultar orden por id y renderizar datos de paciente + examenes.

## Criterios de aceptacion

1. Tabla carga registros desde `/orders`.
2. No cambia el diseno visual de la tabla.
3. Filtros de fecha funcionan igual que antes.
4. Filtro de estado funciona con estados de API.
5. Busqueda encuentra por nombre, cedula y numero de orden.
6. Click en fila abre detalle usando `orderId` y muestra examenes a realizar.

## Riesgos

- El detalle nuevo (fallback por orden) no reemplaza aun la captura completa de resultados del flujo legacy; solo garantiza visualizacion de paciente y examenes a realizar.
- Si API devuelve forma paginada distinta a array, ajustar parser de `useOrders`.
