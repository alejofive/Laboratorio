import { ExamTemplate, ExamTemplateFieldType } from '@/types/exam-template';

export interface ExamTemplatePayloadField {
  key: string;
  label: string;
  type: ExamTemplateFieldType;
  options?: string[];
  unit?: string;
  reference_value?: string;
  required: boolean;
}

export interface ExamTemplatePayloadSection {
  title: string;
  fields: ExamTemplatePayloadField[];
}

export interface ExamTemplatePayload {
  name: string;
  description?: string;
  category?: string;
  price?: number;
  is_active: boolean;
  sections: ExamTemplatePayloadSection[];
}

export type UpdateExamTemplatePayload = Partial<ExamTemplatePayload>;

export const FIELD_TYPES: { label: string; value: ExamTemplateFieldType }[] = [
  { label: 'Texto', value: 'text' },
  { label: 'Numero', value: 'number' },
  { label: 'Area de texto', value: 'textarea' },
  { label: 'Seleccion', value: 'select' },
  { label: 'Radio', value: 'radio' },
  { label: 'Fecha', value: 'date' },
  { label: 'Checkbox', value: 'checkbox' },
];

export const initialExamTemplate: ExamTemplate = {
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
};

export function generateKeyFromLabel(label: string) {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function validateExamTemplate(template: ExamTemplate) {
  const errors: string[] = [];
  const keys = new Set<string>();
  const duplicatedKeys = new Set<string>();

  if (!template.name.trim()) {
    errors.push('El examen debe tener nombre.');
  }

  if (template.sections.length === 0) {
    errors.push('Debe tener al menos una seccion.');
  }

  template.sections.forEach((section, sectionIndex) => {
    const sectionLabel = `Seccion ${sectionIndex + 1}`;

    if (!section.title.trim()) {
      errors.push(`${sectionLabel}: debe tener titulo.`);
    }

    if (section.fields.length === 0) {
      errors.push(`${sectionLabel}: debe tener al menos un campo.`);
    }

    section.fields.forEach((field, fieldIndex) => {
      const fieldLabel = `${sectionLabel}, campo ${fieldIndex + 1}`;
      const key = field.key.trim();

      if (!field.label.trim()) {
        errors.push(`${fieldLabel}: debe tener nombre visible.`);
      }

      if (!key) {
        errors.push(`${fieldLabel}: debe tener key.`);
      }

      if (key) {
        if (keys.has(key)) duplicatedKeys.add(key);
        keys.add(key);
      }

      if ((field.type === 'select' || field.type === 'radio') && (field.options ?? []).filter(Boolean).length === 0) {
        errors.push(`${fieldLabel}: ${field.type} debe tener al menos una opcion.`);
      }
    });
  });

  duplicatedKeys.forEach((key) => {
    errors.push(`La key "${key}" esta duplicada. Cada key debe ser unica dentro del examen.`);
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function cleanExamTemplatePayload(template: ExamTemplate): ExamTemplatePayload {
  return {
    name: template.name.trim(),
    description: '',
    category: template.category?.trim() ?? '',
    price: 0,
    is_active: Boolean(template.is_active),
    sections: template.sections.map((section) => ({
      title: section.title.trim(),
      fields: section.fields.map((field) => {
        const payloadField: ExamTemplatePayloadField = {
          key: field.key.trim(),
          label: field.label.trim(),
          type: field.type,
          required: false,
        };

        if (field.unit?.trim()) {
          payloadField.unit = field.unit.trim();
        }

        if (field.reference_value?.trim()) {
          payloadField.reference_value = field.reference_value.trim();
        }

        if (field.type === 'select' || field.type === 'radio') {
          payloadField.options = field.options.map((option) => option.trim()).filter(Boolean);
        }

        return payloadField;
      }),
    })),
  };
}
