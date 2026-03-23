# Spec: Mostrar tag de examen tambien con un solo examen

## Objetivo
Garantizar que el tag/encabezado del examen en la parte superior del formulario se muestre siempre, incluso cuando el paciente tenga un solo examen asociado.

## Contexto actual
- Cuando existen varios examenes, se muestra la franja superior con tabs y el contexto del examen actual.
- Cuando solo existe un examen, actualmente esa seccion no se renderiza.
- Esto provoca inconsistencia visual entre pantallas con 1 examen vs multiples examenes.

## Alcance
- Pantalla de examen en `src/app/dashboard/examen/[id]/page.tsx`.
- Componente superior de navegacion/contexto en `src/components/ExamenTabs.tsx`.

## Requerimiento funcional
1. **Visibilidad del tag**
   - El tag/encabezado del examen debe mostrarse siempre.
   - Si hay un solo examen, no se oculta el bloque superior.

2. **Comportamiento con multiples examenes**
   - Si hay varios examenes, se mantiene el comportamiento actual de tabs navegables.
   - El examen activo sigue resaltado como hasta ahora.

3. **Comportamiento con un solo examen**
   - Se renderiza el mismo bloque superior (tag/encabezado), pero sin requerir lista de tabs multiples.
   - Debe verse el nombre/tipo del examen actual y conservar el boton de `Editar`/`Solo lectura`.

## Reglas de UI/UX
- Mantener consistencia visual entre casos de 1 y varios examenes.
- Evitar saltos de layout por ocultar/mostrar el encabezado.
- No introducir elementos redundantes cuando solo hay un examen (por ejemplo, tabs vacios).

## Criterios de aceptacion
- Dado un paciente con un solo examen, cuando abre el formulario, se visualiza el tag/encabezado superior del examen.
- Dado un paciente con multiples examenes, se siguen mostrando tabs como actualmente.
- Dado cualquier caso (1 o varios), se mantiene visible el control `Editar`/`Solo lectura`.
- Dado el cambio, no se rompe la navegacion entre examenes cuando hay multiples.

## Lineamientos tecnicos
- Evitar retorno temprano en `ExamenTabs` que esconda todo el componente cuando `examenes.length <= 1`.
- Si solo hay un examen, renderizar encabezado sin tabs o con una variante simplificada.
- Mantener props actuales (`readOnly`, `setCurrentReadOnly`, `examenActualId`) para no romper integracion.

## Riesgos y consideraciones
- Verificar espaciado superior en ambas variantes para evitar diferencias de altura no deseadas.
- Revisar el estado activo/estilos de tabs para no aplicar estilos de seleccion cuando no hay tabs.

## Archivos impactados (estimado)
- `src/components/ExamenTabs.tsx`
- `src/app/dashboard/examen/[id]/page.tsx` (solo si se requiere ajuste de integracion)
