import { ExamTemplateSection } from '@/types/exam-template';
import { z } from 'zod';

/**
 * One checked option of a `multiselect` field. `option` is the immutable catalog
 * entry (empty for findings typed by hand) and `text` is the editable line, which
 * starts out pre-filled with the option name. `value` is the selected secondary
 * value (e.g. a quantity), only meaningful when the owning field declares
 * `value_options`.
 */
export interface MultiSelectEntry {
  option: string;
  text: string;
  value?: string;
}

export type TemplateFormValue = string | boolean | MultiSelectEntry[];

export type TemplateFormValues = Record<string, TemplateFormValue>;

export function isMultiSelectEntries(value: unknown): value is MultiSelectEntry[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        Boolean(entry) &&
        typeof entry === 'object' &&
        typeof (entry as MultiSelectEntry).option === 'string' &&
        typeof (entry as MultiSelectEntry).text === 'string' &&
        ((entry as MultiSelectEntry).value === undefined ||
          typeof (entry as MultiSelectEntry).value === 'string'),
    )
  );
}

export function toMultiSelectEntries(value: unknown): MultiSelectEntry[] {
  return isMultiSelectEntries(value) ? value : [];
}

/** Keeps entries in catalog order so the printed report is stable regardless of click order. */
export function sortMultiSelectEntries(
  entries: MultiSelectEntry[],
  options: string[],
): MultiSelectEntry[] {
  return [...entries].sort((a, b) => {
    const aIndex = a.option ? options.indexOf(a.option) : options.length;
    const bIndex = b.option ? options.indexOf(b.option) : options.length;
    return aIndex - bIndex;
  });
}

/**
 * `valueOptions` mirrors the owning field's `value_options`: when present, entries
 * that resolved a secondary value (e.g. a quantity) are rendered as
 * `Cristales: <name> — <value>`, matching the label style of the fixed crystal
 * `select` fields. Entries without a resolved value, or fields without
 * `value_options`, keep the original plain-text formatting.
 */
export function formatMultiSelectValue(entries: MultiSelectEntry[], valueOptions?: string[]): string {
  return entries
    .map((entry) => {
      if (valueOptions?.length) {
        const name = (entry.option || entry.text).trim();
        if (name && entry.value) return `Cristales: ${name} — ${entry.value}`;
      }

      return (entry.text.trim() || entry.option).trim();
    })
    .filter(Boolean)
    .join('; ');
}

const FLEXIBLE_SELECT_PREFIX = 'select:v1:';

type FlexibleSelectValue =
  | { mode: 'preset'; option: string; supplementaryText?: string }
  | { mode: 'custom'; customValue: string };

export function decodeFlexibleSelectValue(value: unknown): FlexibleSelectValue | null {
  if (typeof value !== 'string' || !value.startsWith(FLEXIBLE_SELECT_PREFIX)) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value.slice(FLEXIBLE_SELECT_PREFIX.length)));
    if (!parsed || typeof parsed !== 'object' || !('mode' in parsed)) return null;

    const candidate = parsed as Record<string, unknown>;
    if (
      candidate.mode === 'preset' &&
      typeof candidate.option === 'string' &&
      (candidate.supplementaryText === undefined || typeof candidate.supplementaryText === 'string')
    ) {
      return {
        mode: 'preset',
        option: candidate.option,
        ...(typeof candidate.supplementaryText === 'string'
          ? { supplementaryText: candidate.supplementaryText }
          : {}),
      };
    }

    if (candidate.mode === 'custom' && typeof candidate.customValue === 'string') {
      return { mode: 'custom', customValue: candidate.customValue };
    }
  } catch {
    return null;
  }

  return null;
}

export function getFlexibleSelectParts(value: unknown, options: string[]) {
  const decoded = decodeFlexibleSelectValue(value);
  if (decoded?.mode === 'preset') {
    return { option: decoded.option, text: decoded.supplementaryText ?? '' };
  }

  if (decoded?.mode === 'custom') {
    return { option: '', text: decoded.customValue };
  }

  const legacyValue = typeof value === 'string' ? value : '';
  return options.includes(legacyValue)
    ? { option: legacyValue, text: '' }
    : { option: '', text: legacyValue };
}

export function buildFlexibleSelectValue(option: string, text: string): string {
  if (option) {
    if (!text.trim()) return option;
    return `${FLEXIBLE_SELECT_PREFIX}${encodeURIComponent(
      JSON.stringify({ mode: 'preset', option, supplementaryText: text }),
    )}`;
  }

  if (!text.trim()) return '';
  return `${FLEXIBLE_SELECT_PREFIX}${encodeURIComponent(JSON.stringify({ mode: 'custom', customValue: text }))}`;
}

export function formatTemplateInputValue(value: TemplateFormValue | undefined): string {
  if (isMultiSelectEntries(value)) return formatMultiSelectValue(value);

  const decoded = decodeFlexibleSelectValue(value);
  if (decoded?.mode === 'preset') {
    return decoded.supplementaryText === undefined
      ? decoded.option
      : `${decoded.option} ${decoded.supplementaryText}`;
  }

  if (decoded?.mode === 'custom') return decoded.customValue;
  return String(value ?? '');
}

export function formatTemplateValue(value: TemplateFormValue | undefined, valueOptions?: string[]): string {
  if (isMultiSelectEntries(value)) return formatMultiSelectValue(value, valueOptions);

  const decoded = decodeFlexibleSelectValue(value);
  if (decoded?.mode === 'preset') {
    return [decoded.option, decoded.supplementaryText?.trim()].filter(Boolean).join(' ');
  }

  if (decoded?.mode === 'custom') return decoded.customValue.trim();
  return String(value ?? '').trim();
}

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

      if (field.type === 'multiselect') {
        values[field.key] = toMultiSelectEntries(rawValue);
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
  const shape: Record<string, z.ZodType<string | boolean | MultiSelectEntry[]>> = {};

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      const label = field.label || field.key;

      if (field.type === 'checkbox') {
        shape[field.key] = z.boolean();
        return;
      }

      if (field.type === 'multiselect') {
        shape[field.key] = z
          .array(z.object({ option: z.string(), text: z.string(), value: z.string().optional() }))
          .refine(
            (entries) => {
              if (!field.value_options?.length) return true;
              return entries.every((entry) =>
                entry.option || entry.text.trim() ? Boolean(entry.value?.trim()) : true,
              );
            },
            `${label}: selecciona una cantidad para cada elemento agregado.`,
          );
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

      if (field.type === 'select') {
        shape[field.key] = z.string().refine((value) => {
          if (!value.trim()) return true;
          if (field.options.includes(value)) return true;

          const decoded = decodeFlexibleSelectValue(value);
          if (decoded?.mode === 'custom') return Boolean(decoded.customValue.trim());
          if (decoded?.mode === 'preset') return field.options.includes(decoded.option);

          return false;
        }, `${label} debe tener una opcion valida.`);
        return;
      }

      if (field.type === 'radio') {
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
      if (field.type === 'multiselect') {
        payload[field.key] = toMultiSelectEntries(values[field.key]);
        return;
      }

      payload[field.key] = values[field.key] ?? '';
    });
  });

  return payload;
}
