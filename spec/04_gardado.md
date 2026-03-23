# Spec: Comportamiento de formularios al guardar (modo bloqueado)

## Objetivo
Definir el comportamiento visual y funcional de los formularios despues de `Guardar` para que la pantalla conserve exactamente la misma estructura del formulario, cambiando unicamente el render de los controles editables a vista de lectura.

## Analisis del comportamiento esperado
- El guardado ya cambia correctamente el estado del examen a modo bloqueado.
- El problema a corregir es visual: no deben quedar controles editables visibles en ese estado.
- La estructura (secciones, titulos, espaciados, columnas, orden de campos) debe permanecer igual a como estaba antes de guardar.
- El cambio debe sentirse como transicion de edicion a lectura, no como cambio de layout.

## Alcance
- Todos los formularios en `src/components/forms/*.tsx`.
- Flujo de guardado y bloqueo en `src/app/dashboard/examen/[id]/page.tsx`.
- Tipos de campo: `input` (texto/numero), `textarea`, `select`, `radio`.

## Requerimiento funcional
1. **Transicion despues de guardar**
   - Al guardar exitosamente, el formulario pasa a modo bloqueado.
   - En modo bloqueado no se muestran controles editables (`input`, `select`, `textarea`, radios no seleccionados).

2. **Regla principal de estructura**
   - No cambia la estructura del formulario: mismo contenedor, mismas secciones, mismas posiciones y mismo orden visual.
   - Solo cambia el contenido de cada campo editable por su valor de lectura.

3. **Render por tipo de control**
   - `input`/`textarea`: ocultar el control y mostrar el valor escrito por el usuario.
   - `select`: ocultar el control y mostrar la opcion seleccionada (label visible al usuario).
   - `radio`: mostrar solo la opcion seleccionada; ocultar todas las no seleccionadas.

4. **Regla de estilo para radios en bloqueado**
   - El texto de la opcion seleccionada se renderiza con tipografia normal (`font-weight: 400`).
   - No aplicar estilos de enfasis automatico (negrita) por estado seleccionado.

5. **Volver a editar**
   - Al presionar `Editar`, reaparecen todos los controles originales en su lugar.
   - Los valores se conservan intactos al alternar entre bloqueado y edicion.

## Reglas de UI/UX
- La vista bloqueada debe leerse como datos confirmados, sin romper la familiaridad del formulario original.
- No introducir cambios de layout, reflujo de secciones ni reorganizacion de campos.
- Evitar mayusculas completas forzadas en titulos o etiquetas durante el modo bloqueado.

## Correcciones solicitadas
- En campos `input`/`textarea`/`select`: ocultar completamente el control editable y mostrar solo el valor en lectura.
- En grupos de `radio`: no dejar solo la palabra/label.
- En `radio`, mantener visible el circulo del radio seleccionado junto con su texto.
- En `radio`, ocultar todas las opciones no seleccionadas.

## Criterios de aceptacion
- Dado un formulario guardado, cuando entra en modo bloqueado, no se ven controles editables.
- Dado un formulario guardado, su estructura visual permanece igual que en modo edicion.
- Dado un `select` en modo bloqueado, se muestra el valor elegido por el usuario.
- Dado un grupo de radios en modo bloqueado, solo se muestra la opcion seleccionada.
- Dado un grupo de radios en modo bloqueado, la opcion seleccionada mantiene visible el circulo del radio junto con su texto.
- Dado un grupo de radios en modo bloqueado, el texto visible no esta en negrita.
- Dado que el usuario pulsa `Editar`, reaparecen los controles editables con los mismos valores.

## Lineamientos tecnicos
- Mantener `readOnly` como fuente de verdad en el contenedor.
- Aplicar transformacion de render sobre los controles sin reemplazar la estructura del formulario completa.
- Asegurar limpieza/rollback de transformaciones visuales al volver a edicion.
- Estandarizar una regla de fallback para campos vacios (por ejemplo `-`) cuando aplique.

## Riesgos y consideraciones
- Formularios con componentes custom pueden requerir manejo especifico para preservar estructura.
- En `select`, validar que se muestre el label y no solo el value interno si difieren.
- Verificar que la validacion no interfiera al ocultar controles en modo bloqueado.

## Archivos impactados (estimado)
- `src/app/dashboard/examen/[id]/page.tsx`
- `src/components/forms/*.tsx`
