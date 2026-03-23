# Spec 06 - Orden de pacientes anteriores en `ExamTable`

## Contexto

En `src/components/ExamTable.tsx`, la lista de pacientes (`sortedPacientes`) actualmente se ordena solo por fecha descendente, sin priorizar el estado general del paciente (pendiente/completo).

Cuando el usuario activa el switch para ver **pacientes anteriores** (`mostrarAnteriores = true`), se necesita un orden más útil para operación diaria:

1. Mostrar primero pacientes **pendientes**.
2. Luego mostrar pacientes **completados**.
3. Dentro de cada grupo, ordenar por fecha.

## Objetivo

Mejorar la priorización visual de pacientes anteriores para que los casos pendientes aparezcan primero, manteniendo un orden cronológico consistente dentro de cada bloque.

## Definiciones

- **Pendiente (estado mostrado = `pendiente`)**: paciente con al menos un examen cuyo `estado` no sea `completo` ni `enviado`.
- **Completado (estado mostrado = `completo`)**: paciente cuyos exámenes estén todos en `completo` o `enviado`.

La definición debe ser exactamente la misma que ya usa el componente para renderizar `EstadoBadge`.

## Requerimientos funcionales

1. Si `mostrarAnteriores` es `true`, la tabla debe ordenarse por:
   - Prioridad de estado: `pendiente` antes que `completo`.
   - Fecha dentro de cada estado.
2. Si `mostrarAnteriores` es `false`, se mantiene el comportamiento actual (pacientes de hoy, sin agrupación por estado).
3. La búsqueda por nombre/cédula debe aplicarse **antes** de paginar, sin romper el nuevo orden.
4. La paginación debe respetar el orden final (pendientes primero, luego completados).

## Reglas de ordenamiento

Para `mostrarAnteriores = true`:

1. Determinar el estado global del paciente usando sus exámenes.
2. Separar virtualmente en dos grupos: pendientes y completados.
3. Ordenar cada grupo por fecha descendente (más reciente primero).
4. Concatenar: `[pendientesOrdenados, completadosOrdenados]`.

## Consideraciones técnicas

1. **Parsing de fecha**:
   - `paciente.fecha` se maneja con formato visual `d/m/yyyy`.
   - Evitar `new Date(paciente.fecha)` como fuente principal de orden, porque depende del parser del runtime y puede ser inconsistente.
   - Implementar una función utilitaria local para transformar `d/m/yyyy` a timestamp estable.
2. **Consistencia de estado**:
   - Reutilizar la lógica de `todosCompletos` para evitar discrepancias entre orden y badge.
3. **Empates**:
   - Si dos pacientes tienen misma fecha y mismo grupo, usar `nombre` ascendente como desempate para orden estable.

## Criterios de aceptación

1. Con pacientes anteriores mixtos, siempre se listan primero los pendientes.
2. Ningún paciente completo aparece por encima de un pendiente cuando ambos cumplen filtros.
3. Dentro de pendientes y dentro de completados, las fechas se muestran de más reciente a más antigua.
4. La búsqueda por texto mantiene el orden definido después de filtrar.
5. La paginación no altera la prioridad pendiente/completo.

## Casos de prueba sugeridos

1. Dataset con 3 pendientes y 3 completos en distintas fechas: validar agrupación y orden por fecha.
2. Dataset con fechas iguales entre pacientes del mismo grupo: validar desempate por nombre.
3. Dataset con todos completos: validar que solo aplique orden por fecha.
4. Dataset con todos pendientes: validar que solo aplique orden por fecha.
5. Filtro por búsqueda que reduzca resultados a ambos grupos: validar prioridad pendiente.

## Fuera de alcance

- Cambios de UI visual (badges, estilos, columnas).
- Cambios de copy o textos de la tabla.
- Reestructuración del modelo de datos de paciente/examen.
