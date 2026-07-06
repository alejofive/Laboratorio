'use client';

import { Copy, FilePlus2, Pencil, Power, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cleanExamTemplatePayload } from '@/lib/examTemplateBuilder';
import { fetchExamTemplate, useCreateExamTemplate, useDeleteExamTemplate, useExamTemplates, useUpdateExamTemplate } from '@/lib/api/exam-templates';
import { useState } from 'react';

function getTemplateId(template: { _id?: string; id?: string }) {
  return template._id ?? template.id ?? '';
}

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function ExamTemplateList() {
  const { data: templates = [], isLoading, error } = useExamTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const createTemplate = useCreateExamTemplate();
  const updateTemplate = useUpdateExamTemplate();
  const deleteTemplate = useDeleteExamTemplate();
  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const filteredTemplates = normalizedSearchTerm
    ? templates.filter((template) => {
      const sections = template.sections ?? [];
      const searchableText = normalizeSearchText([
        template.name,
        template.description,
        template.category,
        ...sections.flatMap((section) => [
          section.title,
          ...(section.fields ?? []).map((field) => field.label),
        ]),
      ].filter(Boolean).join(' '));

      return searchableText.includes(normalizedSearchTerm);
    })
    : templates;

  const duplicateTemplate = async (templateId: string) => {
    const template = await fetchExamTemplate(templateId);
    if (!template) return;

    await createTemplate.mutateAsync({
      ...cleanExamTemplatePayload(template),
      name: `${template.name} - copia`,
      is_active: true,
    });
  };

  const toggleActive = async (templateId: string) => {
    const template = templates.find((item) => getTemplateId(item) === templateId);
    if (!template) return;

    await updateTemplate.mutateAsync({
      id: templateId,
      template: { is_active: !template.is_active },
    });
  };

  return (
    <div className="min-h-screen w-full p-9">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">Administracion</p>
          <h1 className="mt-2 text-3xl font-bold text-primary">Plantillas de examenes</h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary">Crea y administra las estructuras dinamicas que luego se usan para cargar resultados de pacientes.</p>
        </div>
        <Link href="/dashboard/exam-templates/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary">
          <FilePlus2 size={18} />
          Crear nuevo examen
        </Link>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          No se pudieron cargar las plantillas. {error instanceof Error ? error.message : null}
        </div>
      ) : null}

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border-default bg-surface px-4 py-3">
        <Search size={18} className="text-secondary" />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar plantilla por nombre, categoría o campo"
          className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-secondary"
        />
      </div>

      <div className="rounded-3xl border border-border-default bg-surface">
        {isLoading ? <p className="p-6 text-sm text-secondary">Cargando plantillas...</p> : null}

        {!isLoading && templates.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-bold text-primary">Todavia no hay plantillas</p>
            <p className="mt-2 text-sm text-secondary">Crea la primera plantilla para dejar de depender de formularios fijos.</p>
          </div>
        ) : null}

        {!isLoading && templates.length > 0 && filteredTemplates.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-bold text-primary">No hay plantillas para esa busqueda</p>
            <p className="mt-2 text-sm text-secondary">Prueba con otro nombre, categoria o campo.</p>
          </div>
        ) : null}

        <div className="divide-y divide-border-default">
          {filteredTemplates.map((template) => {
            const templateId = getTemplateId(template);
            const sections = template.sections ?? [];
            const fieldCount = sections.reduce((total, section) => total + (section.fields?.length ?? 0), 0);

            return (
              <article key={templateId || template.name} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-primary">{template.name}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${template.is_active ? 'bg-success-soft text-success' : 'bg-surface-muted text-secondary'}`}>
                      {template.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-secondary">{template.description || 'Sin descripcion'}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-tertiary">
                    <span>Categoria: {template.category || '-'}</span>
                    <span>Version: {template.schema_version ?? '-'}</span>
                    <span>Secciones: {sections.length}</span>
                    <span>Campos: {fieldCount}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/dashboard/exam-templates/${templateId}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-border-default px-3 py-2 text-sm font-bold text-primary hover:bg-surface-muted">
                    <Pencil size={16} />
                    Editar
                  </Link>
                  <button type="button" onClick={() => duplicateTemplate(templateId)} className="inline-flex items-center gap-2 rounded-xl border border-border-default px-3 py-2 text-sm font-bold text-primary hover:bg-surface-muted">
                    <Copy size={16} />
                    Duplicar
                  </button>
                  <button type="button" onClick={() => toggleActive(templateId)} className="inline-flex items-center gap-2 rounded-xl border border-border-default px-3 py-2 text-sm font-bold text-primary hover:bg-surface-muted">
                    <Power size={16} />
                    {template.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button type="button" onClick={() => deleteTemplate.mutate(templateId)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
