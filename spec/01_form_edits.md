# Spec: Quitar edicion de labels en Dengue y Hematologia

## Objetivo
Eliminar la opcion de renombrar labels en los formularios de `dengue` y `hematologia`, manteniendo labels fijos del sistema.

## Alcance
- Formulario `FormDengue`
- Formulario `FormHematologia`

## Cambios implementados
1. Se removio el uso de `onLabelChange` en ambos formularios para que no aparezca el modo de edicion de labels.
2. Se eliminaron estados y handlers locales de labels en ambos formularios.
3. Los labels ahora se renderizan desde constantes internas (`defaultLabels`) y no son editables por el usuario.
4. Se retiro `labels` de los tipos:
   - `ResultadosDengue`
   - `ResultadosHematologia`

## Comportamiento esperado
- El usuario puede seguir editando valores de resultados.
- El usuario ya no puede editar nombres de labels en dengue ni hematologia.
- El modo `Solo lectura` sigue bloqueando campos de captura, pero ya no existe edicion de labels ni en modo normal ni en solo lectura.

## Archivos impactados
- `src/components/forms/FormDengue.tsx`
- `src/components/forms/FormHematologia.tsx`
- `src/types/index.ts`
