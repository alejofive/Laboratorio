'use client';

import { useLab } from '@/context/LabContext';
import StatsCards from '@/components/StatsCards';
import ExamTable from '@/components/ExamTable';
import NuevoPacienteForm from '@/components/NuevoPacienteForm';

export default function Dashboard() {


  return (
    <div className="print-area">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Laboratorio Clínico</h1>
    </div>
  );
}
