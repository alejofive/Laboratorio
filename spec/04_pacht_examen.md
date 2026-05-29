# Spec: Guardado de resultados de examen via backend (`/result`)

## Objetivo
Mover el guardado de resultados del examen para que use el endpoint dedicado del backend:

- `POST /orders/{orderId}/exams/{examId}/result`

con payload:

```json
{
  "result_payload": {
    "tsh_valor": 212
  },
  "bioanalyst_name": "Ana Perez"
}
```

## Estado actual (analisis de `src/app/dashboard/examen/[id]/page.tsx`)

- El guardado ocurre en `handleCompletar`.
- Actualmente llama `saveOrderExamResult(orderId, examen.id, payload)`.
- `saveOrderExamResult` (en `src/data/createPatients.ts`) hace `PATCH` o `PUT` a:
  - `/orders/{orderId}/exams/{examId}`
- Payload actual enviado desde `handleCompletar`:
  - `result_payload`
  - `result_status: 'completed'`
  - `doctor_ordenante`

## Brecha contra el nuevo requerimiento

1. URL no coincide: se necesita `/result`.
2. Metodo no coincide: se requiere `POST`.
3. Campos no coinciden:
   - requerido: `bioanalyst_name`
   - actual: `doctor_ordenante`
   - `result_status` ya no forma parte del contrato indicado.

## Diseno propuesto

### 1) Nueva accion de datos para guardar resultado

Crear una funcion nueva en `src/data/createPatients.ts` (sin romper la existente):

- Nombre sugerido: `createOrderExamResult`
- Firma sugerida:

```ts
createOrderExamResult(orderId: string, examId: string, payload: {
  result_payload: Record<string, unknown>;
  bioanalyst_name: string;
})
```

- Implementacion:
  - `POST` a `${API_BASE_URL}/orders/${orderId}/exams/${examId}/result`
  - `Content-Type: application/json`
  - manejo de errores igual al patron actual.

Nota: mantener `saveOrderExamResult` para compatibilidad hasta migrar todo.

### 2) Ajuste en flujo de `ExamenPage`

En `src/app/dashboard/examen/[id]/page.tsx`, dentro de `handleCompletar`:

- Reusar la logica existente para construir `result_payload`:
  - `payloadByTemplate` o `fallbackPayload`.
- Cambiar la llamada de guardado a la nueva funcion `createOrderExamResult`.
- Mapear el nombre del bioanalista:
  - Fuente inicial: input actualmente usado como `doctorOrdenanteInput`.
  - Campo enviado: `bioanalyst_name`.

Payload final esperado:

```json
{
  "result_payload": { "...": "..." },
  "bioanalyst_name": "Ana Perez"
}
```

### 3) Estado UI luego de guardar

Aunque el endpoint nuevo no reciba `result_status`, el comportamiento visual debe mantenerse:

- marcar localmente examen como `completo` (`setEstadoByExam`).
- activar `readOnly` para el examen actual.
- mostrar toast de exito/error.

## Cambios de contrato y nombres

- `doctor_ordenante` deja de enviarse al backend en este flujo.
- El valor de la caja de texto pasa a representar `bioanalyst_name` para la peticion.
- Recomendado (no bloqueante para este patch): renombrar variables UI en una fase 2 para evitar confusion semantica.

## Criterios de aceptacion

1. Al hacer clic en `Guardar resultado`, se dispara una peticion:
   - `POST /orders/{orderId}/exams/{examId}/result`
2. El body incluye exactamente:
   - `result_payload` con los valores del formulario.
   - `bioanalyst_name` con texto no vacio.
3. Si backend responde OK:
   - toast de exito.
   - examen queda en estado completo en UI.
   - formulario en modo solo lectura.
4. Si backend falla:
   - toast con mensaje de error.
   - no se marca como completo.

## Riesgos y validaciones

- Riesgo: endpoint podria requerir otros campos no documentados.
  - Mitigacion: validar con respuesta real de API y ajustar tipado.
- Riesgo: confusion de negocio entre medico ordenante y bioanalista.
  - Mitigacion: separar ambos campos en UI en una iteracion posterior.

## Plan de implementacion (tecnico)

1. Agregar `createOrderExamResult` en `src/data/createPatients.ts`.
2. Reemplazar llamada en `handleCompletar` dentro de `src/app/dashboard/examen/[id]/page.tsx`.
3. Enviar `bioanalyst_name` desde el input actual.
4. Probar manualmente:
   - examen con template dinamico.
   - examen con formulario legacy.
   - caso exito/error de backend.
