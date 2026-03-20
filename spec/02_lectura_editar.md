# Spec: Flujo lectura/edicion en formularios de examenes

## Objetivo
Estandarizar el comportamiento de todos los formularios para que, al guardar, queden en modo bloqueado (solo lectura). El usuario solo podra volver a editar al presionar el boton de alternancia (`Editar`), y despues de guardar nuevamente, el formulario volvera a bloquearse.

## Contexto actual
- Existe un boton de alternancia en `src/app/dashboard/examen/[id]/page.tsx` que muestra `Solo lectura` / `Editar`.
- Actualmente no todos los formularios reciben o aplican `readOnly`, por lo que el bloqueo no es consistente.
- El guardado se ejecuta desde el boton `Guardar` (accion `handleCompletar`), que marca estado del examen como `completo`.
- Se detecto un bug: al enfocar/seleccionar un input, algunos formularios se bloquean como si se hubiera ejecutado `Guardar`.

## Alcance
- Pantalla de detalle de examen: `src/app/dashboard/examen/[id]/page.tsx`.
- Todos los formularios bajo `src/components/forms/*.tsx`.
- Campos editables de entrada (inputs, textarea, select, checkbox, radio, toggles y controles equivalentes).

## Requerimiento funcional
1. **Estado inicial del formulario**
   - Si el examen aun no ha sido guardado/completado por primera vez, el formulario inicia en modo edicion.
   - Si el examen ya tiene datos guardados y/o estado `completo` o `enviado`, el formulario inicia bloqueado.

2. **Al guardar**
    - Al presionar `Guardar` y finalizar correctamente la accion, el formulario debe pasar automaticamente a modo solo lectura.
    - El boton de alternancia debe cambiar su texto a `Editar`.
    - El bloqueo solo puede ocurrir por una accion de guardado/completado exitosa, nunca por eventos de foco, click o cambio de campos.

3. **Al editar nuevamente**
   - Si el usuario presiona `Editar`, el formulario se desbloquea y permite cambios.
   - Al volver a presionar `Guardar`, el formulario se bloquea otra vez.

4. **Comportamiento del boton de alternancia**
   - Cuando el formulario esta editable: mostrar `Solo lectura`.
   - Cuando el formulario esta bloqueado: mostrar `Editar`.

## Reglas de UI/UX
- En modo solo lectura, todos los campos deben impedir modificacion real de datos.
- En modo solo lectura, los campos deben conservar apariencia visual normal (sin overlay gris ni opacidad reducida global).
- Los controles bloqueados deben mantener legibilidad visual (no perder contraste) y no parecer deshabilitados por estilo agresivo.
- El estado visual del boton debe reflejar claramente el modo actual.
- No se debe perder informacion cargada al alternar entre `Editar` y `Solo lectura`.

## Criterios de aceptacion
- Dado cualquier tipo de examen, cuando se guarda, todos sus campos quedan bloqueados.
- Dado cualquier tipo de examen, cuando se presiona `Editar`, todos los campos se habilitan.
- Dado cualquier tipo de examen, cuando se vuelve a guardar, todos los campos vuelven a bloquearse.
- Dado cualquier tipo de examen, al hacer foco/click en un input no debe cambiar el modo del formulario ni bloquearse automaticamente.
- Dado el formulario en modo bloqueado, la UI mantiene estilo normal (sin verse "gris"), pero no permite editar hasta presionar `Editar`.
- No deben existir formularios con comportamiento distinto al resto.
- El texto del boton de alternancia siempre coincide con el modo activo.

## Lineamientos tecnicos propuestos
- Unificar prop `readOnly?: boolean` en todos los componentes de formulario.
- Pasar `readOnly` desde `page.tsx` a todos los `Form*` dentro de `renderForm()`.
- En cada formulario, aplicar `disabled`/`readOnly` segun tipo de control.
- En `handleCompletar`, ademas de guardar/completar, forzar `setReadOnly(true)` tras guardado exitoso.
- Mantener una sola fuente de verdad del modo (`readOnly`) en la pagina contenedora.
- Evitar cambios de `readOnly` desde `onFocus`, `onBlur`, `onChange` o side effects derivados de interaccion de campos.
- Para preservar estilo normal en modo bloqueado, preferir `readOnly` en inputs/textarea y bloquear interaccion en componentes custom sin aplicar opacidad global.

## Riesgos y consideraciones
- Formularios con componentes custom pueden no respetar `disabled` de forma nativa.
- Algunos controles requieren `readOnly` (texto) y otros `disabled` (select/checkbox).
- Debe verificarse que validaciones (`isFormValid`) no rompan al cambiar a modo bloqueado.

## Archivos impactados (estimado)
- `src/app/dashboard/examen/[id]/page.tsx`
- `src/components/forms/*.tsx`
