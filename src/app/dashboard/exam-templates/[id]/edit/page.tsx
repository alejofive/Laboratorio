'use client';

import { useParams, useRouter } from 'next/navigation';
import { ExamTemplateForm } from '@/components/exam-builder/ExamTemplateForm';
import { ExamTemplatePayload } from '@/lib/examTemplateBuilder';
import { useExamTemplate, useUpdateExamTemplate } from '@/lib/api/exam-templates';

export default function EditExamTemplatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const templateId = params.id;
  const { data: template, isLoading, error } = useExamTemplate(templateId);
  const updateTemplate = useUpdateExamTemplate();

  const handleSave = async (nextTemplate: ExamTemplatePayload) => {
    await updateTemplate.mutateAsync({ id: templateId, template: nextTemplate });
    router.push('/dashboard/exam-templates');
  };

  if (isLoading) {
    return <div className="mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 text-sm text-secondary sm:px-6 lg:p-9">Cargando plantilla...</div>;
  }

  if (error || !template) {
    return <div className="mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 text-sm text-red-600 sm:px-6 lg:p-9">No se pudo cargar la plantilla.</div>;
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 sm:px-6 lg:p-9">
      <ExamTemplateForm initialValue={template} mode="edit" onSave={handleSave} isSaving={updateTemplate.isPending} />
    </div>
  );
}
