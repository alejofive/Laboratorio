# Spec 08 - FormDengue: mostrar solo valor en campos tipo select al guardar

## Contexto

En `src/components/forms/FormDengue.tsx`, los campos `IgG` e `IgM` se renderizan con el componente `Select` (`src/components/ui/Select.tsx`).

Actualmente, cuando el formulario pasa a modo lectura (`readOnly = true`) despues de guardar, el `Select` queda deshabilitado pero sigue visible como control (trigger, borde e icono). El requerimiento es que el usuario vea solo el valor elegido, no el selector.

## Objetivo

Al guardar y entrar en modo lectura, reemplazar la vista del control `select` por texto plano con el valor seleccionado por el usuario, manteniendo el mismo layout del formulario.

## Analisis del componente actual

1. `FormDengue` renderiza `IgG` e `IgM` en un `map` usando `Select` y pasa `readOnly` al componente.
2. `Select` usa Radix Select con `disabled={readOnly}`.
3. En modo `readOnly`, el control no permite cambios, pero visualmente sigue viendose como select.
4. El valor mostrado es correcto (`data[campo.key]`), por lo que el problema es de presentacion en estado bloqueado.

## Alcance

- `src/components/forms/FormDengue.tsx`.
- Comportamiento visual de `IgG` e `IgM` cuando `readOnly = true`.

## Fuera de alcance

- Cambios funcionales al guardado/persistencia de datos.
- Cambios de opciones (`Negativo`/`Positivo`).
- Refactor global de todos los `Select` del sistema (a menos que se decida explicitamente en otro spec).

## Requerimientos funcionales

1. En modo edicion (`readOnly = false`), `IgG` e `IgM` se comportan igual que hoy (select editable).
2. En modo lectura (`readOnly = true`), no se debe renderizar el control `Select` para `IgG`/`IgM`.
3. En modo lectura, se debe mostrar solo el valor seleccionado por el usuario para cada campo.
4. Si un campo no tiene valor, mostrar un fallback consistente (recomendado: `-`).
5. El label de cada campo (`IgG`, `IgM`) debe mantenerse visible en ambos modos.

## Reglas de UI/UX

1. Mantener la misma grilla/estructura (`grid`, espaciados y orden de campos).
2. El texto en modo lectura debe verse como dato confirmado, no como control interactivo.
3. No mostrar icono de flecha ni borde de selector en modo lectura.

## Enfoque tecnico propuesto

En `FormDengue.tsx`, para cada campo de `campos`:

1. Si `readOnly` es `false`, renderizar `Select` (flujo actual).
2. Si `readOnly` es `true`, renderizar bloque de lectura con:
   - `label` del campo.
   - valor en texto (`data[campo.key]` o `-` si vacio).

Esto evita impacto global en `src/components/ui/Select.tsx` y resuelve el requerimiento solo para Dengue.

## Criterios de aceptacion

1. Dado un formulario de Dengue guardado (modo lectura), no se visualiza ningun select en `IgG` ni `IgM`.
2. Dado un formulario de Dengue guardado, se visualiza el valor elegido en cada campo (`Negativo` o `Positivo`).
3. Dado un campo sin seleccion, en modo lectura se muestra `-`.
4. Al pulsar `Editar`, reaparecen los selects con los mismos valores previos.
5. La disposicion visual del formulario no cambia entre edicion y lectura.

## Casos de prueba sugeridos

1. Seleccionar `IgG = Positivo`, `IgM = Negativo`, guardar y validar texto en modo lectura.
2. Dejar `IgM` vacio, guardar y validar fallback `-` para `IgM`.
3. Alternar `Guardar` -> `Editar` -> `Guardar` y validar que no se pierden valores.
4. Validar en mobile y desktop que la grilla conserva orden y alineacion.
