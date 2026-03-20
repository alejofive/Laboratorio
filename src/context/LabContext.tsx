'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Examen, Paciente, EstadoExamen, ResultadosExamen } from '@/types';

interface LabContextType {
  examenes: Examen[];
  pacientes: Paciente[];
  isLoading: boolean;
  crearPaciente: (paciente: Omit<Paciente, 'id' | 'fecha'>) => Promise<Examen[]>;
  actualizarExamen: (id: string, resultados: ResultadosExamen, estado?: EstadoExamen) => Promise<void>;
  cambiarEstado: (id: string, estado: EstadoExamen) => Promise<void>;
  getExamenesPorPaciente: (pacienteId: string) => Examen[];
  getPacientesUnicos: () => Map<string, { paciente: Paciente; examenes: Examen[] }>;
  getStats: () => { total: number; pendientes: number; enProceso: number; completos: number; enviados: number };
  buscarPacientePorCedula: (cedula: string) => Paciente | undefined;
  enviarEmail: (examenId: string, email: string) => Promise<void>;
}

const LabContext = createContext<LabContextType | null>(null);

async function fetchPacientes(): Promise<Paciente[]> {
  const res = await fetch('/api/pacientes');
  if (!res.ok) throw new Error('Error fetching pacientes');
  return res.json();
}

async function fetchExamenes(): Promise<Examen[]> {
  const res = await fetch('/api/examenes');
  if (!res.ok) throw new Error('Error fetching examenes');
  return res.json();
}

export function LabProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: pacientes = [], isLoading: loadingPacientes } = useQuery({
    queryKey: ['pacientes'],
    queryFn: fetchPacientes,
  });

  const { data: examenes = [], isLoading: loadingExamenes } = useQuery({
    queryKey: ['examenes'],
    queryFn: fetchExamenes,
  });

  const isLoading = loadingPacientes || loadingExamenes;

  const crearPacienteMutation = useMutation({
    mutationFn: async (pacienteData: Omit<Paciente, 'id' | 'fecha'>) => {
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacienteData),
      });
      if (!res.ok) throw new Error('Error creating paciente');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['examenes'] });
    },
  });

  const actualizarExamenMutation = useMutation({
    mutationFn: async ({ id, resultados, estado }: { id: string; resultados: ResultadosExamen; estado?: EstadoExamen }) => {
      const res = await fetch('/api/examenes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resultados, estado }),
      });
      if (!res.ok) throw new Error('Error updating examen');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examenes'] });
    },
  });

  const cambiarEstadoMutation = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: EstadoExamen }) => {
      const res = await fetch('/api/examenes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado }),
      });
      if (!res.ok) throw new Error('Error changing estado');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examenes'] });
    },
  });

  const enviarEmailMutation = useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => {
      const res = await fetch('/api/examenes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, emailEnviado: email, estado: 'enviado' }),
      });
      if (!res.ok) throw new Error('Error sending email');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examenes'] });
    },
  });

  const crearPaciente = async (pacienteData: Omit<Paciente, 'id' | 'fecha'>): Promise<Examen[]> => {
    const result = await crearPacienteMutation.mutateAsync(pacienteData);
    return result.examenes;
  };

  const actualizarExamen = async (id: string, resultados: ResultadosExamen, estado?: EstadoExamen): Promise<void> => {
    await actualizarExamenMutation.mutateAsync({ id, resultados, estado });
  };

  const cambiarEstado = async (id: string, estado: EstadoExamen): Promise<void> => {
    await cambiarEstadoMutation.mutateAsync({ id, estado });
  };

  const getExamenesPorPaciente = (pacienteId: string): Examen[] => {
    return examenes.filter(ex => ex.pacienteId === pacienteId);
  };

  const getPacientesUnicos = (): Map<string, { paciente: Paciente; examenes: Examen[] }> => {
    const pacientesMap = new Map<string, { paciente: Paciente; examenes: Examen[] }>();

    const parseFechaPaciente = (fecha: string) => {
      const [dia, mes, anio] = fecha.split('/').map(Number);
      return new Date(anio, (mes || 1) - 1, dia || 1).getTime();
    };
    
    pacientes.forEach(paciente => {
      const examenesPaciente = getExamenesPorPaciente(paciente.id);
      const existente = pacientesMap.get(paciente.cedula);

      if (!existente) {
        pacientesMap.set(paciente.cedula, { paciente, examenes: examenesPaciente });
        return;
      }

      const fechaPacienteActual = parseFechaPaciente(paciente.fecha);
      const fechaPacienteExistente = parseFechaPaciente(existente.paciente.fecha);
      const pacienteMasReciente = fechaPacienteActual >= fechaPacienteExistente ? paciente : existente.paciente;

      pacientesMap.set(paciente.cedula, {
        paciente: pacienteMasReciente,
        examenes: [...existente.examenes, ...examenesPaciente],
      });
    });

    pacientesMap.forEach((data, cedula) => {
      pacientesMap.set(cedula, {
        paciente: data.paciente,
        examenes: [...data.examenes].sort(
          (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        ),
      });
    });
    
    return pacientesMap;
  };

  const getStats = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const todayExamenes = examenes.filter(ex => {
      const examDate = ex.fechaCreacion.split('T')[0];
      return examDate === todayStr;
    });

    return {
      total: todayExamenes.length,
      pendientes: todayExamenes.filter(ex => ex.estado === 'pendiente').length,
      enProceso: todayExamenes.filter(ex => ex.estado === 'en_proceso').length,
      completos: todayExamenes.filter(ex => ex.estado === 'completo').length,
      enviados: todayExamenes.filter(ex => ex.estado === 'enviado').length,
    };
  };

  const enviarEmail = async (examenId: string, email: string): Promise<void> => {
    await enviarEmailMutation.mutateAsync({ id: examenId, email });
  };

  const buscarPacientePorCedula = (cedula: string): Paciente | undefined => {
    return pacientes.find(p => p.cedula === cedula);
  };

  return (
    <LabContext.Provider value={{
      examenes,
      pacientes,
      isLoading,
      crearPaciente,
      actualizarExamen,
      cambiarEstado,
      getExamenesPorPaciente,
      getPacientesUnicos,
      getStats,
      buscarPacientePorCedula,
      enviarEmail
    }}>
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error('useLab must be used within LabProvider');
  }
  return context;
}
