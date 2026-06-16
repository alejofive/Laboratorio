import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExamTemplatePayload, UpdateExamTemplatePayload } from '@/lib/examTemplateBuilder';
import { ExamTemplate } from '@/types/exam-template';

const examTemplatesKey = ['exam-templates'];

type ExamsCategory = { name: string; exams: ExamTemplate[] };
type ExamsListResponse = ExamTemplate[] | { categories?: ExamsCategory[] } | Record<string, unknown>;

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

function normalizeExamTemplatesResponse(response: ExamsListResponse): ExamTemplate[] {
  if (Array.isArray(response)) return response.map(normalizeExamTemplateSummary);

  if ('categories' in response && Array.isArray(response.categories)) {
    return (response.categories as ExamsCategory[]).flatMap((category) =>
      (category.exams ?? []).map((exam) => normalizeExamTemplateSummary({ ...exam, category: exam.category ?? category.name }))
    );
  }

  return Object.values(response)
    .flatMap((value) => (Array.isArray(value) ? value : []))
    .filter((exam): exam is ExamTemplate => {
      return Boolean(exam && typeof exam === 'object' && 'name' in exam && ('id' in exam || '_id' in exam));
    })
    .map(normalizeExamTemplateSummary);
}

function normalizeExamTemplateSummary(template: ExamTemplate): ExamTemplate {
  return {
    ...template,
    schema_version: template.schema_version ?? 1,
    sections: Array.isArray(template.sections) ? template.sections : [],
    is_active: template.is_active ?? true,
  };
}

function stringifyExamPayload(payload: ExamTemplatePayload | UpdateExamTemplatePayload) {
  const { schema_version: _schemaVersion, _id: _id, id: _idAlias, created_at: _createdAt, updated_at: _updatedAt, ...safePayload } = payload as Record<string, unknown>;
  return JSON.stringify(safePayload);
}

async function requestExamTemplate<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL no esta configurada.');
  }

  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function fetchExamTemplate(id: string) {
  return requestExamTemplate<ExamTemplate>(`/exams/${id}`);
}

export function useExamTemplates() {
  return useQuery({
    queryKey: examTemplatesKey,
    queryFn: async () => normalizeExamTemplatesResponse(await requestExamTemplate<ExamsListResponse>('/exams')),
  });
}

export function useExamTemplate(id: string | null) {
  return useQuery({
    queryKey: [...examTemplatesKey, id],
    enabled: Boolean(id),
    queryFn: () => requestExamTemplate<ExamTemplate>(`/exams/${id}`),
  });
}

export function useCreateExamTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: ExamTemplatePayload) =>
      requestExamTemplate<ExamTemplate>('/exams', {
        method: 'POST',
        body: stringifyExamPayload(template),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examTemplatesKey }),
  });
}

export function useUpdateExamTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, template }: { id: string; template: UpdateExamTemplatePayload }) =>
      requestExamTemplate<ExamTemplate>(`/exams/${id}`, {
        method: 'PATCH',
        body: stringifyExamPayload(template),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: examTemplatesKey });
      queryClient.invalidateQueries({ queryKey: [...examTemplatesKey, variables.id] });
    },
  });
}

export function useDeleteExamTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      requestExamTemplate<{ ok: boolean }>(`/exams/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examTemplatesKey }),
  });
}
