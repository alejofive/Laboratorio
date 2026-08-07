import { ExamTemplateSection } from '@/types/exam-template';
import { z } from 'zod';

export type TemplateFormValues = Record<string, string | boolean>;

const aliasMap: Record<string, string[]> = {
  t_protombina: ['t_protrombina'],
  t_protombina_control: ['t_protrombina_control'],
  t_protrombina: ['t_protombina'],
  t_protrombina_control: ['t_protombina_control'],
  notas: ['observaciones'],
  observaciones: ['notas'],
};

export function normalizeTemplateSections(sections?: ExamTemplateSection[]): ExamTemplateSection[] {
  if (!sections) return [];

  return sections.map((section) => ({
    ...section,
    title: section.title || 'Resultados',
    fields: (section.fields || []).map((field) => ({
      ...field,
      label: field.label || field.key,
      options: Array.isArray(field.options) ? field.options : [],
      type: field.type || 'text',
    })),
  }));
}

export function normalizePayloadAliases(values: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...values };

  Object.entries(aliasMap).forEach(([target, aliases]) => {
    if (normalized[target] !== undefined) return;

    const aliasFound = aliases.find((alias) => normalized[alias] !== undefined);
    if (aliasFound) {
      normalized[target] = normalized[aliasFound];
    }
  });

  return normalized;
}

export function buildInitialValuesFromTemplate(
  sections: ExamTemplateSection[],
  payload?: Record<string, unknown>,
): TemplateFormValues {
  const source = normalizePayloadAliases(payload ?? {});
  const values: TemplateFormValues = {};

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      const rawValue = source[field.key];

      if (field.type === 'checkbox') {
        values[field.key] = Boolean(rawValue);
        return;
      }

      values[field.key] = rawValue === undefined || rawValue === null ? '' : String(rawValue);
    });
  });

  return values;
}

export function validateTemplateValues(sections: ExamTemplateSection[], values: TemplateFormValues): boolean {
  return buildTemplateValuesSchema(sections).safeParse(values).success;
}

export function getTemplateValidationErrors(sections: ExamTemplateSection[], values: TemplateFormValues): string[] {
  const result = buildTemplateValuesSchema(sections).safeParse(values);
  if (result.success) return [];

  return result.error.issues.map((issue) => issue.message);
}

function buildTemplateValuesSchema(sections: ExamTemplateSection[]) {
  const shape: Record<string, z.ZodType<string | boolean>> = {};

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      const label = field.label || field.key;

      if (field.type === 'checkbox') {
        shape[field.key] = z.boolean();
        return;
      }

      if (field.type === 'number') {
        shape[field.key] = z.string().refine(
          (value) => !value.trim() || /^-?\d*([.,]\d*)?$/.test(value),
          `${label} debe ser un numero valido.`,
        );
        return;
      }

      if (field.type === 'date') {
        shape[field.key] = z.string().refine((value) => {
          if (!value.trim()) return true;
          const date = new Date(`${value}T00:00:00`);
          return !Number.isNaN(date.getTime());
        }, `${label} debe ser una fecha valida.`);
        return;
      }

      if (field.type === 'select' || field.type === 'radio') {
        shape[field.key] = z.string().refine(
          (value) => !value.trim() || field.options.includes(value),
          `${label} debe tener una opcion valida.`,
        );
        return;
      }

      shape[field.key] = z.string();
    });
  });

  return z.object(shape);
}

export function extractTemplatePayload(sections: ExamTemplateSection[], values: TemplateFormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      payload[field.key] = values[field.key] ?? '';
    });
  });

  return payload;
}
