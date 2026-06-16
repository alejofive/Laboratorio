import { redirect } from 'next/navigation';

export default async function AdminEditExamTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/exam-templates/${id}/edit`);
}
