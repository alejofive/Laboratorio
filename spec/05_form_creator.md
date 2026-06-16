Sí. La idea correcta sería crear un **Form Builder / Creador de exámenes dinámicos**.

En tu caso no estás creando un formulario cualquiera, sino una **plantilla de examen de laboratorio** que después se usará para cargar resultados.

Ejemplo:

```txt
Examen: Hematología
 └── Sección: Resultados
      ├── Campo: Leucocitos
      ├── Campo: Hematíes
      ├── Campo: Hemoglobina
      ├── Campo: Plaquetas
      └── Campo: Notas
```

---

# 1. Objetivo del módulo

Crear una pantalla donde el usuario pueda:

1. Crear un examen.
2. Agregar nombre, descripción, categoría y precio.
3. Crear una o varias secciones.
4. Dentro de cada sección agregar campos.
5. Definir el tipo de campo:
   - Número
   - Texto
   - Textarea
   - Select
   - Fecha
   - Checkbox

6. Definir si el campo es obligatorio.
7. Definir unidad del campo, por ejemplo:
   - `mm3`
   - `%`
   - `grs%`
   - `Seg`
   - `min`

8. Guardar la plantilla del examen en base de datos.
9. Usar esa plantilla luego para llenar resultados reales de pacientes.

---

# 2. Estructura principal del examen

Tu estructura base está bien. Yo la organizaría así:

```ts
type ExamTemplate = {
  _id?: string
  name: string
  description?: string
  category?: string
  price?: number
  schema_version: number
  sections: ExamSection[]
  is_active: boolean
}

type ExamSection = {
  _id?: string
  title: string
  fields: ExamField[]
}

type ExamField = {
  _id?: string
  key: string
  label: string
  type: FieldType
  options?: string[]
  unit?: string
  required: boolean
}

type FieldType = 'number' | 'text' | 'textarea' | 'select' | 'date' | 'checkbox'
```

---

# 3. Flujo de uso para el usuario

El flujo debería ser sencillo:

```txt
Crear examen
   ↓
Completar datos generales
   ↓
Agregar sección
   ↓
Agregar campos dentro de la sección
   ↓
Configurar cada campo
   ↓
Guardar plantilla
```

Ejemplo visual del flujo:

```txt
[Nombre del examen]
Hematología

[Descripción]
Panel hematológico completo

[Categoría]
Hematology

[Precio]
0

---------------------------------

Sección: Resultados

Campo 1
Label: Leucocitos
Key: leucocitos
Tipo: Número
Unidad: mm3
Obligatorio: Sí

Campo 2
Label: Hemoglobina
Key: hemoglobina
Tipo: Número
Unidad: grs%
Obligatorio: Sí

[+ Agregar campo]

---------------------------------

[+ Agregar sección]

[Guardar examen]
```

---

# 4. Pantallas necesarias

Yo haría estas pantallas:

## A. Lista de exámenes

Ruta:

```txt
/admin/exam-templates
```

Aquí ves todas las plantillas creadas:

```txt
Hematología
Panel hematológico completo
Categoría: hematology
Estado: Activo

[Editar] [Duplicar] [Desactivar]
```

Acciones:

```txt
Crear nuevo examen
Editar examen
Duplicar examen
Desactivar examen
Eliminar examen
```

---

## B. Crear examen

Ruta:

```txt
/admin/exam-templates/create
```

Esta pantalla tendría:

```txt
Datos generales del examen
Secciones
Campos
Vista previa
Guardar
```

---

## C. Editar examen

Ruta:

```txt
/admin/exam-templates/[id]/edit
```

Permite modificar la plantilla existente.

Importante: si una plantilla ya fue usada en resultados de pacientes, lo mejor es **no modificarla directamente**, sino crear una nueva versión.

Por eso tienes:

```ts
schema_version: 1
```

Luego podrías tener:

```ts
schema_version: 2
```

---

## D. Vista previa del formulario

Esta parte es muy importante.

Mientras el usuario crea el examen, debería poder ver cómo se verá al momento de cargar resultados.

Ejemplo:

```txt
Vista previa - Hematología

Resultados

Leucocitos [_________] mm3
Hematíes [_________] mm3
Hemoglobina [_________] grs%
Hematocrito [_________] %
Plaquetas [_________] mm3

Notas
[_________________________]
```

---

# 5. Componentes en React / Next.js

Puedes dividirlo así:

```txt
ExamTemplateForm
 ├── ExamBasicInfo
 ├── SectionsBuilder
 │    └── SectionCard
 │          └── FieldBuilder
 │                └── FieldCard
 └── ExamPreview
```

Estructura de carpetas sugerida:

```txt
src/
 ├── app/
 │    └── admin/
 │         └── exam-templates/
 │              ├── page.tsx
 │              ├── create/
 │              │    └── page.tsx
 │              └── [id]/
 │                   └── edit/
 │                        └── page.tsx
 │
 ├── components/
 │    └── exam-builder/
 │         ├── ExamTemplateForm.tsx
 │         ├── ExamBasicInfo.tsx
 │         ├── SectionsBuilder.tsx
 │         ├── SectionCard.tsx
 │         ├── FieldCard.tsx
 │         ├── FieldTypeSelect.tsx
 │         └── ExamPreview.tsx
 │
 ├── types/
 │    └── exam-template.ts
 │
 └── lib/
      └── api/
           └── exam-templates.ts
```

---

# 6. Estado inicial del formulario

En React puedes manejarlo así:

```ts
const initialExamTemplate = {
  name: '',
  description: '',
  category: '',
  price: 0,
  schema_version: 1,
  is_active: true,
  sections: [
    {
      title: 'Resultados',
      fields: [],
    },
  ],
}
```

---

# 7. Funciones principales del builder

Necesitas funciones como estas:

```ts
addSection()
removeSection(sectionIndex)
updateSection(sectionIndex, data)

addField(sectionIndex)
removeField(sectionIndex, fieldIndex)
updateField(sectionIndex, fieldIndex, data)

saveExamTemplate()
```

Ejemplo:

```ts
const addSection = () => {
  setExamTemplate(prev => ({
    ...prev,
    sections: [
      ...prev.sections,
      {
        title: '',
        fields: [],
      },
    ],
  }))
}
```

Ejemplo para agregar un campo:

```ts
const addField = (sectionIndex: number) => {
  setExamTemplate(prev => {
    const sections = [...prev.sections]

    sections[sectionIndex].fields.push({
      key: '',
      label: '',
      type: 'text',
      options: [],
      unit: '',
      required: false,
    })

    return {
      ...prev,
      sections,
    }
  })
}
```

---

# 8. Tipos de campos

Te recomiendo manejar estos tipos:

```ts
const FIELD_TYPES = [
  {
    label: 'Texto',
    value: 'text',
  },
  {
    label: 'Número',
    value: 'number',
  },
  {
    label: 'Área de texto',
    value: 'textarea',
  },
  {
    label: 'Selección',
    value: 'select',
  },
  {
    label: 'Fecha',
    value: 'date',
  },
  {
    label: 'Checkbox',
    value: 'checkbox',
  },
]
```

---

# 9. Cómo debería verse cada campo en el builder

Cada campo dentro de una sección debería tener esta configuración:

```txt
Nombre visible
[Leucocitos]

Key
[leucocitos]

Tipo de campo
[Número]

Unidad
[mm3]

Obligatorio
[✓]

Opciones
Solo aparece si el tipo es "select"
```

---

# 10. Importante: generar el `key` automáticamente

Para evitar errores, cuando el usuario escriba:

```txt
Leucocitos
```

Puedes generar automáticamente:

```txt
leucocitos
```

Si escribe:

```txt
T. Protombina Control
```

Generas:

```txt
t_protombina_control
```

Función ejemplo:

```ts
export const generateKeyFromLabel = (label: string) => {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}
```

Ejemplo:

```ts
generateKeyFromLabel('Sedimentación 1o.H.')
```

Resultado:

```ts
'sedimentacion_1o_h'
```

---

# 11. Manejo de campos tipo select

Si el campo es tipo `select`, entonces sí necesitas opciones.

Ejemplo:

```json
{
  "key": "grupo_sanguineo",
  "label": "Grupo sanguíneo",
  "type": "select",
  "options": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "required": true
}
```

En la UI:

```txt
Tipo: Select

Opciones:
[A+]
[A-]
[B+]
[B-]

[+ Agregar opción]
```

---

# 12. Validaciones necesarias

Antes de guardar, deberías validar:

```txt
El examen debe tener nombre.
Debe tener al menos una sección.
Cada sección debe tener título.
Cada sección debe tener al menos un campo.
Cada campo debe tener label.
Cada campo debe tener key.
Cada key debe ser única dentro del examen.
Si el campo es select, debe tener al menos una opción.
```

La validación de `key` única es importante.

No debería pasar esto:

```json
{
  "key": "leucocitos"
},
{
  "key": "leucocitos"
}
```

Porque luego cuando guardes resultados, se pisan los valores.

---

# 13. Payload final al guardar

Cuando el usuario guarda, el frontend debería enviar algo así:

```json
{
  "name": "Hematología",
  "description": "Panel hematológico completo.",
  "category": "hematology",
  "price": 0,
  "schema_version": 1,
  "sections": [
    {
      "title": "Resultados",
      "fields": [
        {
          "key": "leucocitos",
          "label": "Leucocitos",
          "type": "number",
          "options": [],
          "unit": "mm3",
          "required": true
        },
        {
          "key": "hemoglobina",
          "label": "Hemoglobina",
          "type": "number",
          "options": [],
          "unit": "grs%",
          "required": true
        },
        {
          "key": "notas",
          "label": "Notas",
          "type": "textarea",
          "options": [],
          "required": false
        }
      ]
    }
  ],
  "is_active": true
}
```

Los campos como `_id`, `created_at`, `updated_at` y `__v` normalmente los genera el backend.

---

# 14. Diferencia entre plantilla y resultado

Esto es importante.

La estructura que compartiste es la **plantilla del examen**.

Ejemplo:

```txt
Examen: Hematología
Campos: leucocitos, hematíes, hemoglobina...
```

Pero cuando se llena un resultado para un paciente, deberías guardar otra cosa.

Ejemplo de resultado:

```json
{
  "patient_id": "123",
  "exam_template_id": "6a31a2e54fe480c545aeb190",
  "exam_name": "Hematología",
  "schema_version": 1,
  "values": {
    "leucocitos": 7200,
    "hematies": 4800000,
    "hemoglobina": 13.8,
    "hematocrito": 42,
    "plaquetas": 250000,
    "notas": "Valores dentro de rango esperado."
  }
}
```

La plantilla define **qué campos existen**.

El resultado guarda **los valores cargados para un paciente**.

---

# 15. Modelo recomendado en base de datos

Si estás usando MongoDB, podrías tener dos colecciones principales:

```txt
exam_templates
exam_results
```

## exam_templates

```js
{
  name: String,
  description: String,
  category: String,
  price: Number,
  schema_version: Number,
  sections: [
    {
      title: String,
      fields: [
        {
          key: String,
          label: String,
          type: String,
          options: [String],
          unit: String,
          required: Boolean
        }
      ]
    }
  ],
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

## exam_results

```js
{
  patient_id: ObjectId,
  exam_template_id: ObjectId,
  exam_name: String,
  schema_version: Number,
  values: Object,
  created_at: Date,
  updated_at: Date
}
```

---

# 16. Experiencia recomendada en la interfaz

Yo lo haría en dos columnas en desktop:

```txt
-------------------------------------------------
| Constructor del examen       | Vista previa    |
|                              |                 |
| Datos generales              | Hematología     |
| Secciones                    | Resultados      |
| Campos                       | Leucocitos ___  |
|                              | Hemoglobina ___ |
-------------------------------------------------
```

En mobile:

```txt
Datos generales
Secciones
Campos
Vista previa
Guardar
```

También agregaría botones claros:

```txt
+ Agregar sección
+ Agregar campo
Duplicar campo
Eliminar campo
Guardar examen
Cancelar
```

---

# 17. MVP recomendado

Para la primera versión, no hagas todo complejo.

Primera versión:

```txt
Crear examen
Editar examen
Agregar secciones
Agregar campos
Tipos: text, number, textarea, select
Required true/false
Unidad
Vista previa
Guardar en backend
```

No agregaría todavía:

```txt
Drag and drop
Condicionales
Fórmulas
Rangos de referencia
Validaciones médicas complejas
Versionado avanzado
```

Eso lo puedes dejar para una segunda versión.

---

# 18. Versión 2 del builder

Después puedes agregar cosas más avanzadas:

```txt
Ordenar campos con drag and drop
Duplicar secciones
Duplicar campos
Rangos de referencia por edad y sexo
Valores normales
Alertas si un valor está fuera de rango
Campos calculados
Fórmulas
Plantillas duplicables
Historial de cambios
Vista previa PDF
```

Ejemplo futuro para rangos:

```json
{
  "key": "hemoglobina",
  "label": "Hemoglobina",
  "type": "number",
  "unit": "grs%",
  "required": true,
  "reference_ranges": [
    {
      "label": "Hombre adulto",
      "min": 13.5,
      "max": 17.5
    },
    {
      "label": "Mujer adulta",
      "min": 12,
      "max": 15.5
    }
  ]
}
```

---

# 19. Plan de desarrollo por fases

## Fase 1 — Estructura de datos

Crear los types de TypeScript:

```txt
ExamTemplate
ExamSection
ExamField
FieldType
```

Crear también helpers:

```txt
generateKeyFromLabel()
validateExamTemplate()
```

---

## Fase 2 — UI base

Crear pantalla:

```txt
/admin/exam-templates/create
```

Con estos bloques:

```txt
Datos generales
Constructor de secciones
Constructor de campos
Vista previa
Botón guardar
```

---

## Fase 3 — Funcionalidad del builder

Implementar:

```txt
Agregar sección
Eliminar sección
Editar título de sección
Agregar campo
Eliminar campo
Editar campo
Cambiar tipo de campo
Agregar opciones para select
Marcar campo obligatorio
```

---

## Fase 4 — Validaciones

Validar antes de guardar:

```txt
Nombre obligatorio
Secciones válidas
Campos válidos
Keys únicas
Select con opciones
```

---

## Fase 5 — Conexión con backend

Crear endpoints:

```txt
GET    /api/exam-templates
POST   /api/exam-templates
GET    /api/exam-templates/:id
PATCH  /api/exam-templates/:id
DELETE /api/exam-templates/:id
```

---

## Fase 6 — Render dinámico del examen

Crear un componente que reciba la plantilla y renderice el formulario real:

```tsx
<DynamicExamForm template={examTemplate} />
```

Este componente se usará cuando el ayudante o doctora cargue los resultados del paciente.

---

# 20. Cómo renderizar el formulario dinámico

Ejemplo sencillo:

```tsx
function DynamicExamForm({ template }) {
  return (
    <form>
      <h1>{template.name}</h1>

      {template.sections.map(section => (
        <div key={section.title}>
          <h2>{section.title}</h2>

          {section.fields.map(field => (
            <div key={field.key}>
              <label>
                {field.label}
                {field.required && ' *'}
              </label>

              {field.type === 'number' && <input type='number' name={field.key} />}

              {field.type === 'text' && <input type='text' name={field.key} />}

              {field.type === 'textarea' && <textarea name={field.key} />}

              {field.type === 'select' && (
                <select name={field.key}>
                  {field.options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.unit && <span>{field.unit}</span>}
            </div>
          ))}
        </div>
      ))}
    </form>
  )
}
```

---

# 21. Recomendación importante para tu caso

Para un laboratorio, yo no dejaría que el usuario escriba todo libremente sin control.

Usaría este enfoque:

```txt
El usuario puede crear plantillas personalizadas,
pero el sistema también debe traer plantillas base.
```

Por ejemplo:

```txt
Plantilla base: Hematología
Plantilla base: Glicemia
Plantilla base: Perfil lipídico
Plantilla base: Orina
```

Y el usuario puede:

```txt
Usar plantilla
Editar copia
Duplicar plantilla
Crear desde cero
```

Esto evita que tengan que crear todos los exámenes manualmente.

---

# 22. Resumen final de la arquitectura

```txt
ExamTemplateBuilder
    crea plantillas de exámenes

ExamTemplate
    guarda la estructura del examen

DynamicExamForm
    usa la plantilla para cargar resultados

ExamResult
    guarda los valores reales del paciente
```

La lógica sería:

```txt
1. Admin crea plantilla "Hematología".
2. Sistema guarda la plantilla.
3. Recepción selecciona paciente.
4. Selecciona examen "Hematología".
5. El sistema renderiza los campos dinámicos.
6. La doctora o ayudante carga los valores.
7. Se guarda el resultado asociado al paciente.
8. Se genera PDF con esos valores.
```

Para tu caso, esta es la forma más ordenada y escalable. No estás creando solo un formulario; estás creando un **sistema de plantillas dinámicas para exámenes clínicos**.
