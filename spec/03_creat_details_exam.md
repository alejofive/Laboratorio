# Spec - Adaptar formularios por `template_snapshot.sections`

## Objetivo
Adaptar `src/app/dashboard/examen/[id]/page.tsx` para que los formularios existentes se alimenten dinamicamente desde `template_snapshot.sections` del backend (`useOrderById`), sin romper estilos ni layout actual.

## Contexto actual
- La pagina ya consume `useOrderById(orderId)` y renderiza examenes por `order.exams`.
- Hoy el render de formularios depende de `examen.tipo` y un `switch` fijo con componentes `Form*`.
- Existe mapeo parcial para hematologia (`mapHematologiaPayload`, `mapExamToPayload`).
- El backend ya envia el contrato necesario para construir formulario dinamico:
  - `template_snapshot.name`
  - `template_snapshot.sections[]`
  - `sections[].fields[]` con `key`, `label`, `type`, `required`, `unit`, `options`.

## Problema a resolver
- Los formularios actuales dependen de tipos locales (`Resultados*`) y no siempre calzan con campos reales enviados por backend.
- Si backend agrega/quita/renombra campos, el frontend queda desalineado.
- Se necesita conservar apariencia visual actual mientras la fuente de verdad pase a ser el template.

## Alcance
- Mantener visual intacto: cards, spacing, tipografia, botones, readonly, tabs.
- Adaptar carga, validacion y guardado de resultados por campos del template.
- Mantener compatibilidad con formularios existentes donde haya mapeo confiable.
- Agregar fallback dinamico para examenes no cubiertos por mapeos especificos.

## Fuera de alcance
- Rediseno de UI.
- Cambios de ruta (`/dashboard/examen/[id]`).
- Modificar contrato backend.

## Contrato backend relevante
- `GET /orders/{orderId}` devuelve `exams[]` con:
  - `result_status`
  - `template_snapshot.sections[].fields[]`
  - `result_payload`

## Diseño propuesto

### 1) Modelo de datos intermedio
Crear un modelo normalizado para formulario:
- `TemplateFieldVM`
  - `key`, `label`, `type`, `required`, `unit`, `options`
- `TemplateSectionVM`
  - `title`, `fields: TemplateFieldVM[]`
- `ExamFormSchemaVM`
  - `examId`, `examType`, `sections`

Fuente:
- `ExamFormSchemaVM` se construye desde `exam.template_snapshot.sections`.

### 2) Estrategia de render sin romper estilo
Mantener arquitectura actual con dos modos:

- **Modo A (preferido): formulario existente mapeable**
  - Si `tipo` tiene adaptador definido (`hematologia`, luego otros), usar `Form*` actual.
  - El adaptador toma `sections.fields` como referencia para:
    - defaults
    - required
    - labels/units

- **Modo B (fallback dinamico)**
  - Si no hay adaptador de tipo, renderizar `DynamicExamForm`.
  - `DynamicExamForm` usa exactamente el mismo lenguaje visual:
    - contenedores `border border-surface-muted rounded-3xl`
    - header por seccion
    - grid responsive igual a forms actuales
    - `InputNumber`, `input`, `textarea`, `select` segun `field.type`

Esto evita bloquear nuevos templates y mantiene consistencia visual.

### 3) Capa de adaptadores
Agregar adaptadores por examen:
- `fromPayloadToFormValues(exam, payload, sections)`
- `fromFormValuesToPayload(exam, formValues, sections)`
- `validateByTemplate(formValues, sections)`

Reglas:
- Claves del backend (`field.key`) son la fuente canonica.
- Alias solo para compatibilidad historica (ej. `t_protombina` vs `t_protrombina`).
- Campos ausentes en `result_payload` inicializan a `''` o valor neutro por tipo.

### 4) Validacion unificada por template
Reemplazar validaciones hardcodeadas por validacion declarativa:
- `required === true` => valor obligatorio.
- `type === number` => permitir vacio durante edicion, validar formato al guardar.
- `type === select|radio` => validar opcion incluida en `options`.

El estado `isFormValid` sale de esta validacion, no de listas fijas por componente.

### 5) Guardado
En `handleCompletar`:
- Tomar draft del examen activo.
- Convertir a payload por adaptador/template.
- Enviar con `saveOrderExamResult(orderId, examId, { result_payload, result_status: 'completed', doctor_ordenante })`.
- Mantener readonly y toasts actuales.

### 6) Readonly
No cambiar mecanismo visual actual de readonly (DOM transform con `data-readonly-*`).
Solo asegurar que tambien aplique a controles de `DynamicExamForm`.

## Cambios técnicos propuestos

### A. Tipos
- Extender tipos de `OrderExamDetail.template_snapshot` para reflejar exactamente `sections.fields`.
- Crear tipos nuevos en `src/types/create.ts` o `src/types/exam-template.ts`:
  - `ExamTemplateField`
  - `ExamTemplateSection`
  - `ExamTemplateSnapshot`

### B. Utilidades
Crear `src/lib/examTemplate.ts` con:
- `normalizeTemplateSections(exam)`
- `buildInitialValuesFromTemplate(sections, payload)`
- `validateTemplateValues(sections, values)`
- `normalizePayloadAliases(values)`

### C. Componente dinamico fallback
Crear `src/components/forms/DynamicExamForm.tsx`:
- Props:
  - `sections`
  - `values`
  - `onChange`
  - `onValidChange`
  - `readOnly`
- Sin alterar estilo base existente.

### D. Refactor de `page.tsx`
- Mantener `switch` actual para forms existentes.
- Antes de renderizar, decidir:
  - `if (hasTypedAdapter(examen.tipo))` => `Form*`
  - `else` => `DynamicExamForm`
- Sustituir validacion por template para todos los examenes gradualmente.

## Plan de implementación
1. Crear tipos de template y utilidades de normalizacion/validacion.
2. Implementar `DynamicExamForm` con estilo clonado de formularios actuales.
3. Integrar `DynamicExamForm` en `page.tsx` como fallback.
4. Migrar hematologia a adaptador basado en `sections.fields` (sin hardcode de required).
5. Generalizar `mapExamPayload/mapExamToPayload` para usar template + alias.
6. Probar guardado y recarga de datos (`result_payload`) por examen.

## Riesgos y mitigación
- **Riesgo:** templates con tipos no soportados.
  - **Mitigacion:** fallback seguro a `input type="text"` y warning en consola.
- **Riesgo:** diferencias de naming historico.
  - **Mitigacion:** tabla de alias bidireccional (entrada/salida).
- **Riesgo:** ruptura de validacion en forms legacy.
  - **Mitigacion:** mantener validacion existente como respaldo temporal por feature flag interna.

## Criterios de aceptación
- No hay cambios visuales perceptibles en la pantalla.
- Los campos renderizados corresponden a `template_snapshot.sections.fields`.
- `result_payload` se hidrata correctamente en el formulario al abrir un examen.
- Guardar persiste los mismos keys que el template define.
- Examenes nuevos no mapeados a `TipoExamen` siguen siendo editables via `DynamicExamForm`.
- Estado readonly y flujo de `Guardar resultado` siguen funcionando.

## Pruebas sugeridas
- Caso hematologia con payload vacio -> render completo por template y validacion required.
- Caso hematologia con payload previo -> rehidratacion exacta.
- Caso con campo `textarea` (`notas`) -> persistencia roundtrip.
- Caso con tipo no mapeado -> fallback dinamico funcional.
- Caso readonly (`completed`) -> controles bloqueados y valores visibles igual que hoy.
