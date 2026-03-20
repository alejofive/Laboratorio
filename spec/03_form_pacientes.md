# Spec: Historial de pacientes y consistencia de examenes por cedula

## Objetivo
Unificar el formato visual del historial de paciente con la tabla principal de examenes y corregir la logica para que, cuando un paciente regresa otro dia con la misma cedula, sus nuevos examenes tambien aparezcan en el historial y en la tabla de pacientes.

## Problema detectado
- El historial por cedula (`/dashboard/pacientes/[cedula]`) solo tomaba el primer registro encontrado de `pacientes` para filtrar por `pacienteId`.
- Al registrar al mismo paciente otro dia, se crea un `pacienteId` nuevo, por lo que sus nuevos examenes quedaban asociados a ese nuevo ID y no se mostraban en el historial anterior.
- En la tabla de pacientes, `getPacientesUnicos` se quedaba con el primer paciente por cedula y no consolidaba bien visitas/examenes de registros posteriores.

## Alcance
- Pagina de historial por cedula: `src/app/dashboard/pacientes/[cedula]/page.tsx`.
- Consolidacion por cedula en contexto: `src/context/LabContext.tsx` (funcion `getPacientesUnicos`).

## Cambios implementados
1. **Historial de paciente con formato tipo `ExamTable`**
   - Se reemplazo el render agrupado por bloques por una tabla con columnas:
     - Paciente
     - Examenes
     - Fecha
     - Estado
     - Acciones
   - Se aplico el mismo estilo base (thead, filas hover, chips de examenes, badge de estado y boton de accion).

2. **Historial por cedula consolidado en multiples visitas**
   - La pagina ahora obtiene todos los registros `pacientes` con la misma cedula.
   - Cada visita (cada `pacienteId`) se renderiza como fila del historial.
   - Los examenes se filtran por el `pacienteId` de cada visita para incluir tambien examenes de dias posteriores.

3. **Correccion en tabla general de pacientes (`getPacientesUnicos`)**
   - Se consolidan todos los registros con la misma cedula en una sola entrada.
   - Se acumulan examenes de todos los `pacienteId` asociados.
   - Se selecciona como `paciente` de referencia el mas reciente por fecha (`dd/mm/yyyy`).
   - Se ordena el arreglo de examenes consolidado por `fechaCreacion` descendente.

## Criterios de aceptacion
- Si un paciente se registra hoy y manana con la misma cedula, la tabla de pacientes debe reflejar sus examenes nuevos.
- El historial por cedula debe mostrar todas las visitas del paciente (no solo la primera).
- El historial debe mantener diseno de tabla consistente con `ExamTable`.
- La accion por fila debe permitir continuar examenes pendientes o ver examenes completos.

## Notas tecnicas
- Se agrego parseo explicito de fechas `dd/mm/yyyy` para comparar visitas correctamente.
- Se mantiene compatibilidad con el modelo actual de datos (multiples registros `paciente` para una misma cedula).

## Archivos impactados
- `src/app/dashboard/pacientes/[cedula]/page.tsx`
- `src/context/LabContext.tsx`
