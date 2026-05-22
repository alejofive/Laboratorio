# Spec: Integracion APIs - Crear Paciente y Solicitud

## Objetivo
Integrar el flujo de creacion de paciente y creacion de solicitud (orden) en `src/components/NuevoPacienteForm.tsx` usando React Query y backend real.

## Base URL
- Variable de entorno: `NEXT_PUBLIC_API_BASE_URL`
- Valor: `https://laboratory-backend-hd97.onrender.com/api`
- Archivo: `.env.local`

## Analisis del componente actual

### Estado actual
- `NuevoPacienteForm` usa `useLab()` para `crearPaciente`, `buscarPacientePorCedula`, listado de pacientes y examenes.
- El formulario actual tiene campos: `nombre`, `edad`, `telefono`, `cedula`, `direccion`, `examenes`.
- Los examenes disponibles son un arreglo hardcodeado (`examenesDisponibles`) con enums locales (`TipoExamen`).
- El boton `Guardar y crear solicitud` ejecuta solo `crearPaciente(...)` del contexto.
- No existe flujo de dos pasos backend: `POST /patients` y luego `POST /orders`.

### Gaps vs requerimiento
- Falta separar `nombre` en `first_name` y `last_name`.
- Falta mapear modelo local a payload backend (`document_number`, `birth_date`, `sex`, etc.).
- Falta cargar examenes desde `GET /exams` y usar IDs reales (`exam_template_ids`).
- Falta crear orden con `POST /orders` usando `patient_id` retornado de `POST /patients`.
- El campo `edad` actual no mapea directo al backend (backend requiere `birth_date`).

## Contratos API

### 1) Crear paciente
- Endpoint: `POST /patients`
- Payload:

```json
{
  "first_name": "Luis",
  "last_name": "Fernandez",
  "document_number": "v-12345678",
  "birth_date": "1990-05-14",
  "sex": "male",
  "phone": "04141234567",
  "address": "Caracas, Distrito Capital"
}
```

- Respuesta esperada: objeto paciente con `id` (o `_id`) reutilizable para orden.

### 2) Obtener examenes
- Endpoint: `GET /exams`
- Respuesta:

```json
{
  "categories": [
    {
      "name": "Hematologia",
      "exams": [
        {
          "id": "6a0ec7d8c151d346e34ac582",
          "name": "frotisde sangre periferica"
        }
      ]
    }
  ]
}
```

- Uso en UI: pintar categorias y examenes dinamicamente.

### 3) Crear solicitud
- Endpoint: `POST /orders`
- Payload:

```json
{
  "patient_id": "{{patientId}}",
  "exam_template_ids": ["{{examId1}}", "{{examId2}}"],
  "notes": "Paciente en ayuno"
}
```

## Diseno tecnico propuesto

### Estructura de datos frontend
- Reemplazar `FormValues.nombre` por:
  - `first_name: string`
  - `last_name: string`
- Reemplazar `edad` por `birth_date` (tipo date string `YYYY-MM-DD`).
- Agregar `sex` con opciones (`male`, `female`).
- Mantener `telefono`, `cedula`, `direccion`.
- Cambiar `examenes: TipoExamen[]` a `exam_template_ids: string[]`.

### React Query (queries y mutations)
- `useQuery(['exams'])`:
  - `GET ${NEXT_PUBLIC_API_BASE_URL}/exams`
  - transform para UI: categorias y lista filtrable.
- `useMutation(createPatient)`:
  - `POST /patients`.
- `useMutation(createOrder)`:
  - `POST /orders`.
- `useMutation(createPatientAndOrder)` (orquestadora en submit):
  1. Crear paciente.
  2. Extraer `patient_id`.
  3. Crear orden con examenes seleccionados.

### Flujo de submit
1. Validar formulario.
2. Validar que exista al menos 1 examen seleccionado.
3. Ejecutar `POST /patients`.
4. Con el `patient_id`, ejecutar `POST /orders`.
5. Mostrar toast de exito y limpiar formulario/seleccion.
6. Si falla cualquier paso, mostrar error y no limpiar estado.

## Cambios UI requeridos en `NuevoPacienteForm.tsx`
- Cambiar campo "Nombre completo" por dos inputs:
  - "Nombre"
  - "Apellido"
- Reemplazar "Edad" por "Fecha de nacimiento" (`type="date"`).
- Agregar selector de sexo.
- Mantener "Cédula", "Teléfono", "Dirección".
- Fuente de examenes:
  - Eliminar dependencia de `examenesDisponibles` hardcodeado.
  - Renderizar examenes desde `GET /exams`.
  - Guardar en estado/form los `id` de examenes seleccionados.

## Mapeo categorias backend -> frontend
- Backend devuelve `categories[].name` (texto libre).
- Frontend debe mapear por nombre normalizado para tabs/filtros visuales actuales.
- Regla robusta sugerida:
  - normalizar a minusculas sin tildes.
  - contains:
    - `hemat` -> `hematologia`
    - `quim` -> `quimica`
    - `inmun` o `serolog` -> `serologia`
    - `copro` o `uro` -> `orina_heces`
    - `perfil` o `combin` -> `paneles/perfiles` segun nombre

## Manejo de errores y UX
- Error en `POST /patients`: mostrar "No se pudo crear el paciente".
- Error en `POST /orders`: mostrar "Paciente creado, pero fallo la solicitud".
- Estado loading en boton principal durante submit encadenado.
- Deshabilitar submit si:
  - faltan campos obligatorios,
  - no hay examenes seleccionados,
  - submit en progreso.

## Criterios de aceptacion
- Se crea paciente en backend con payload exacto esperado.
- Se crea orden inmediatamente despues con `patient_id` real y `exam_template_ids` seleccionados.
- El formulario usa `first_name` y `last_name` (no "nombre completo").
- Los examenes visibles provienen de `GET /exams`.
- El flujo completo funciona desde "Guardar y crear solicitud".

## Proxima implementacion (pendiente)
- Refactor de `LabContext` o creacion de capa API dedicada para `patients`, `orders`, `exams`.
- Actualizacion de tipos TS para contratos backend.
- Integracion final en `NuevoPacienteForm.tsx` con React Query y payloads reales.
