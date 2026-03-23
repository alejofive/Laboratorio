# Spec 07 - Campo `Ordenado por` en pantalla de examen

## Contexto

En `src/app/dashboard/examen/[id]/page.tsx` se renderiza el formulario del examen y en `src/components/ExamenTabs.tsx` se muestra el control `Editar`/`Solo lectura`.

Se requiere agregar un input junto al boton `Solo lectura` para capturar el nombre del doctor que ordeno el examen.

## Objetivo

Permitir registrar el doctor ordenante por examen, con autocompletado inicial basado en examenes previos del mismo paciente, sin propagacion de cambios entre examenes ya guardados.

## Alcance

- UI del encabezado del examen (tabs + acciones): `src/components/ExamenTabs.tsx`.
- Integracion y flujo de guardado: `src/app/dashboard/examen/[id]/page.tsx`.
- Modelo de datos de examen: `src/types/index.ts`.
- Mutaciones de examen en contexto/API: `src/context/LabContext.tsx` y `src/app/api/examenes/route.ts` (la API ya acepta `PATCH` parcial).

## Requerimientos funcionales

1. **Nuevo campo visible en encabezado**
   - Mostrar un input label `Ordenado por` al lado del boton `Solo lectura`/`Editar`.
   - El input pertenece al examen actual (no al paciente global).

2. **Persistencia por examen**
   - Al presionar `Guardar`, se debe persistir el valor en el examen actual.
   - El campo se guarda como metadata del examen (ejemplo: `doctorOrdenante`).

3. **Autocompletado para examenes del mismo paciente**
   - Si el examen actual no tiene `doctorOrdenante`, precargar el input con el primer nombre ya registrado en otro examen del mismo paciente.
   - El “primer nombre” se define como el primer examen del paciente por `fechaCreacion` ascendente que tenga `doctorOrdenante` no vacio.

4. **Aislamiento de cambios**
   - Si el usuario cambia el nombre en un examen, solo se actualiza ese examen.
   - Los demas examenes mantienen su valor previo (incluyendo el nombre original del primer doctor).
   - Nunca hacer updates en lote por paciente para este campo.

5. **Compatibilidad con datos existentes**
   - Examenes viejos sin `doctorOrdenante` deben seguir funcionando sin errores.
   - El campo es opcional a nivel de schema (backward compatible).

## Reglas de comportamiento

1. **Prioridad de valor mostrado en input**
   - 1) `doctorOrdenante` del examen actual (si existe).
   - 2) fallback al primer `doctorOrdenante` encontrado en examenes del mismo paciente.
   - 3) string vacio si no hay datos.

2. **Edicion vs solo lectura**
   - Cuando `readOnly = true`, el input debe quedar en modo no editable (disabled o readOnly visualmente consistente).
   - Cuando `readOnly = false`, el usuario puede editar el campo.

3. **Normalizacion minima del dato**
   - Al guardar, aplicar `trim()` para evitar guardar espacios al inicio/fin.
   - Si queda vacio tras `trim()`, guardar como vacio o `undefined` segun convencion del proyecto (sin romper lectura).

## Cambios de datos (propuestos)

Agregar propiedad opcional en `Examen`:

```ts
doctorOrdenante?: string;
```

No se requieren migraciones obligatorias porque `PATCH /api/examenes` ya fusiona campos parciales en `db.examenes`.

## Criterios de aceptacion

1. En la pantalla de examen se ve `Ordenado por` junto al control `Solo lectura`/`Editar`.
2. Al guardar un examen con valor en `Ordenado por`, al recargar se mantiene el valor en ese examen.
3. Si el paciente tiene otro examen sin doctor, el input aparece prellenado con el primer doctor ya registrado del paciente.
4. Si en ese segundo examen se cambia el nombre y se guarda, solo cambia ese examen.
5. El examen original conserva su `doctorOrdenante` inicial sin modificarse.
6. Examenes antiguos sin ese campo no rompen UI ni guardado.

## Casos de prueba sugeridos

1. **Primer examen del paciente**: ingresar `Dr. Perez`, guardar, validar persistencia.
2. **Segundo examen sin doctor propio**: abrir y validar prefill `Dr. Perez`.
3. **Override en segundo examen**: cambiar a `Dra. Gomez`, guardar; validar que el primero sigue `Dr. Perez`.
4. **Tercer examen sin doctor propio**: abrir y validar que toma `Dr. Perez` (primer doctor historico), no `Dra. Gomez`.
5. **Paciente sin ningun doctor previo**: input inicia vacio.

## Fuera de alcance

- Mostrar el doctor ordenante en tablas/listados externos (si no existe requerimiento explicito).
- Filtros/reportes por doctor.
- Reglas avanzadas de validacion (catalogo de doctores, autocomplete remoto, etc.).
