import { ExamTemplateSection } from '@/types/exam-template';

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
      required: Boolean(field.required),
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
  for (const section of sections) {
    for (const field of section.fields) {
      if (!field.required) continue;

      const value = values[field.key];
      if (field.type === 'checkbox') {
        if (!value) return false;
        continue;
      }

      if (field.type === 'radio') {
        const selected = String(value ?? '').trim();
        if (!selected) return false;
        if (field.options.length > 0 && !field.options.includes(selected)) return false;
        continue;
      }

      if (String(value ?? '').trim() === '') return false;
    }
  }

  return true;
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
