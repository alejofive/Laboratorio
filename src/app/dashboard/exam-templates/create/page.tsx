'use client';

import { useRouter } from 'next/navigation';
import { ExamTemplateForm } from '@/components/exam-builder/ExamTemplateForm';
import { ExamTemplatePayload } from '@/lib/examTemplateBuilder';
import { useCreateExamTemplate } from '@/lib/api/exam-templates';

export default function CreateExamTemplatePage() {
  const router = useRouter();
  const createTemplate = useCreateExamTemplate();

  const handleSave = async (template: ExamTemplatePayload) => {
    await createTemplate.mutateAsync(template);
    router.push('/dashboard/exam-templates');
  };

  return (
    <div className="min-h-screen w-full p-9">
      <ExamTemplateForm mode="create" onSave={handleSave} isSaving={createTemplate.isPending} />
    </div>
  );
}
