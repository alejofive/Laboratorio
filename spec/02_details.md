# Spec - Integracion de `page.tsx` con backend de Orders

## Objetivo
Reemplazar el flujo actual basado en `useLab` en `src/app/dashboard/examen/[id]/page.tsx` por un flujo conectado al backend (`/orders/{{orderId}}`), sin cambios visuales ni de layout.

## Alcance
- Mantener intacta la UI/UX actual (tabs, formularios, botones, estilos, comportamiento visual).
- Cambiar solo la fuente de datos, estado y acciones para que usen API real. 
- Eliminar dependencia del flujo viejo que llega por `useLab` en esta pantalla.

## Analisis del componente actual

### Estado y dependencias actuales
En `src/app/dashboard/examen/[id]/page.tsx` hoy se usa:
- `useLab()` para obtener `examenes`, `pacientes`, `actualizarExamen`, `cambiarEstado`, `getExamenesPorPaciente`, `enviarEmail`.
- `params.id` como identificador del examen individual.
- Estado local para:
  - `isFormValid`
  - `readOnlyByExam`
  - `doctorOrdenanteByExam`
- Render condicional por `examen.tipo` para seleccionar formulario especifico.

### Comportamientos funcionales actuales
- Carga examen por id (`examenes.find(e => e.id === params.id)`).
- Obtiene paciente asociado y examenes del paciente para tabs de navegacion.
- Actualiza resultados en memoria (`actualizarExamen`).
- Guarda resultado con `cambiarEstado(examen.id, 'completo', doctorOrdenanteFinal)`.
- Envia correo desde `enviarEmail`.
- Bloqueo readonly cuando estado es `completo`/`enviado`.

### Restriccion clave
La pantalla asume un modelo local tipado por `TipoExamen` + `Resultados*` (muchos formularios hardcodeados). El backend nuevo entrega una estructura dinamica por `template_snapshot.sections.fields` y `result_payload`.

## Contrato backend recibido

### Endpoint disponible
- `GET /orders/{{orderId}}`

### Entidades clave del response
- Orden:
  - `_id`, `order_number`, `patient_id`, `status`, `notes`, `requested_at`...
- Examenes dentro de `exams[]`:
  - `_id`
  - `exam_template_id`
  - `result_status`
  - `template_snapshot` (name, description, sections, fields)
  - `result_payload` (resultados actuales)

## Decisiones de integracion

### 1) Modelo de ruta
Mantener la ruta visual actual `/dashboard/examen/[id]`, pero redefinir semanticamente `id` como `orderId` para esta primera integracion.

Justificacion:
- El endpoint disponible esta orientado a orden.
- La vista ya renderiza varios examenes y tabs, lo cual encaja con `order.exams`.

### 2) Adaptador frontend (sin tocar UI)
Crear capa de mapeo backend -> view model esperado por la pagina para no reescribir formularios visuales:
- `OrderDTO` / `OrderExamDTO` (crudo del API)
- `ExamenViewModel` (shape minimo compatible con componente y `ExamenTabs`)

Mapeo base propuesto:
- `examen.id` <- `exam._id`
- `examen.tipo` <- normalizado desde `template_snapshot.name`
- `examen.resultados` <- `exam.result_payload`
- `examen.estado` <- map de `result_status`
- `examen.pacienteId` <- `order.patient_id`
- `examen.fechaCreacion` <- `exam.created_at`

### 3) Normalizacion de tipo de examen
Agregar mapper robusto de `template_snapshot.name` a `TipoExamen`:
- Ejemplo inicial: `Hematologia` -> `hematologia`
- Regla: lowercase + remover tildes + reemplazo de espacios/simbolos + tabla de alias.
- Si no hay match: fallback controlado (`unsupported`) y mensaje funcional existente "Tipo de examen no soportado".

### 4) Persistencia de resultados
Se requiere reemplazar flujo local:
- Antes: `actualizarExamen` + `cambiarEstado` en contexto.
- Nuevo: guardar en backend via endpoint de update de resultados.

Nota: este spec asume que existira endpoint de escritura (pendiente confirmar), por ejemplo:
- `PATCH /orders/{orderId}/exams/{examId}` con body `{ result_payload, result_status, doctor_ordenante? }`

Si el backend usa otro contrato, se ajusta solo la capa de servicio, no la UI.

## Cambios tecnicos propuestos

### A. Remover `useLab` de esta pagina
En `src/app/dashboard/examen/[id]/page.tsx`:
- Eliminar `useLab` import y uso.
- Reemplazar con hooks/servicio API:
  - `useOrderById(orderId)` para lectura
  - `saveExamResult(orderId, examId, payload)` para guardado
  - `sendExamEmail(...)` si endpoint existe

### B. Estado local equivalente
Mantener estados actuales de UI:
- `isFormValid`
- `readOnlyByExam`
- `doctorOrdenanteByExam`

Agregar estados de data:
- `order`, `examenes`, `selectedExam`
- `isLoading`, `error`
- `draftResultadosByExam` para cambios del form antes de guardar

### C. Logica de seleccion de examen
Como el param pasa a ser `orderId`, definir examen actual:
- Opcion recomendada: seleccionar el primero de `order.exams`.
- Si hay query `?examId=...`, usarla para tabs y deep link.

### D. Tabs y navegacion
Mantener tabs visuales, pero cambiar href:
- De: `/dashboard/examen/${ex.id}`
- A: `/dashboard/examen/${orderId}?examId=${ex.id}`

Esto evita romper UX actual y permite navegar entre examenes de una misma orden.

### E. Guardado (`Guardar resultado`)
`handleCompletar` debe:
1. Tomar `draftResultadosByExam[examId]` (o snapshot actual).
2. Normalizar `doctorOrdenante` (default "Sin orden medica").
3. Llamar API de guardado.
4. Si ok: marcar readonly y refrescar datos (optimista o refetch).
5. Mostrar `toast` exito/error como hoy.

### F. Email
`handleSendEmail` queda igual en UI, pero reemplaza `enviarEmail` por servicio HTTP cuando exista endpoint.
Si aun no existe endpoint, dejar feature flag/deshabilitacion funcional con mensaje controlado.

## Compatibilidad con formularios existentes

### Riesgo principal
Los formularios esperan tipos concretos (`ResultadosHematologia`, etc.) mientras backend entrega `result_payload` generico.

### Estrategia
- Mantener forms existentes sin cambios visuales.
- Crear funciones `toFormResultados(tipo, result_payload)` y `fromFormResultados(tipo, resultados)`.
- Para `hematologia` (caso del payload compartido) map directo por keys del template (`leucocitos`, `hematies`, etc.).

## Manejo de estados y errores
- Carga inicial: mostrar `Loading` actual.
- Orden no encontrada / 404: conservar bloque "Examen no encontrado".
- Error de red: toast + estado de error recuperable.
- Guardado fallido: mantener editable y no activar readonly.

## Plan de implementacion (sin cambios visuales)
1. Crear tipos DTO y cliente API para `GET /orders/{orderId}`.
2. Implementar adaptador Order -> ExamenViewModel.
3. Refactor de `page.tsx` para consumir API y quitar `useLab`.
4. Implementar seleccion por `examId` en querystring.
5. Conectar `handleResultadosChange` a draft local por examen.
6. Conectar `handleCompletar` a endpoint de guardado real.
7. Validar flujo completo con caso Hematologia.

## Criterios de aceptacion
- La pantalla se ve exactamente igual que antes.
- Ya no se importa ni usa `useLab` en `src/app/dashboard/examen/[id]/page.tsx`.
- Al abrir una orden real, se renderiza al menos un examen desde `order.exams`.
- Los formularios muestran datos de `result_payload`.
- `Guardar resultado` persiste en backend y deja el examen en readonly al exito.
- Navegacion entre examenes de la orden funciona por tabs.

## Dependencias / pendientes de backend
- Confirmar endpoint de escritura de resultados (metodo, ruta y body exacto).
- Confirmar endpoint de envio de email (si aplica en esta fase).
- Confirmar catalogo oficial de mapeo `template_snapshot.name` -> `TipoExamen`.

## Fuera de alcance
- Rediseno visual.
- Reescritura de formularios a render dinamico por template.
- Cambios globales al resto del dashboard fuera de esta pagina.
