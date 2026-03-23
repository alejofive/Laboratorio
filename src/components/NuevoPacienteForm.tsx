'use client';

import { useLab } from '@/context/LabContext';
import { TipoExamen } from '@/types';
import {
  UserCheck,
  UserRoundPlus,
  Droplets,
  FlaskConical,
  Microscope,
  TestTube,
  Activity,
  Baby,
  Shield,
  Cross,
  FileText,
  MicroscopeIcon,
  TestTube2,
  Search
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { sileo } from 'sileo';

type GrupoExamen = 'hematologia' | 'quimica' | 'serologia' | 'orina_heces' | 'paneles' | 'perfiles';

const gruposExamenes: { key: GrupoExamen; label: string }[] = [
  { key: 'hematologia', label: 'Hematologia' },
  { key: 'quimica', label: 'Quimica' },
  { key: 'serologia', label: 'Serologia e infecciosos' },
  { key: 'orina_heces', label: 'Orina y heces' },
  { key: 'paneles', label: 'Paneles combinados' },
  { key: 'perfiles', label: 'Perfiles completos' },
];

const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
  red: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  rose: { border: 'border-rose-500', bg: 'bg-rose-50', text: 'text-rose-700' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  violet: { border: 'border-violet-500', bg: 'bg-violet-50', text: 'text-violet-700' },
  pink: { border: 'border-pink-500', bg: 'bg-pink-50', text: 'text-pink-700' },
  cyan: { border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-700' },
  teal: { border: 'border-teal-500', bg: 'bg-teal-50', text: 'text-teal-700' },
  yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  lime: { border: 'border-lime-500', bg: 'bg-lime-50', text: 'text-lime-700' },
  emerald: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  sky: { border: 'border-sky-500', bg: 'bg-sky-50', text: 'text-sky-700' },
};

const examenesDisponibles: { value: TipoExamen; label: string; icon: React.ReactNode; color: string; group: GrupoExamen }[] = [
  { value: 'hematologia', label: 'Hematologia', icon: <Droplets className="w-5 h-5 text-rose-500" />, color: 'rose', group: 'hematologia' },
  { value: 'hemoglobina_hematocritos', label: 'Hemoglobina Hematocritos', icon: <Droplets className="w-5 h-5 text-pink-500" />, color: 'pink', group: 'hematologia' },
  { value: 'frotis_sangre', label: 'Frotis de sangre periferica', icon: <Microscope className="w-5 h-5 text-red-600" />, color: 'red', group: 'hematologia' },
  { value: 'hemoparasitos', label: 'Hemoparasitos', icon: <Microscope className="w-5 h-5 text-red-700" />, color: 'red', group: 'hematologia' },
  { value: 'tipo_sangre', label: 'Tipo de sangre', icon: <Droplets className="w-5 h-5 text-red-400" />, color: 'red', group: 'hematologia' },

  { value: 'quimica', label: 'Quimica', icon: <FlaskConical className="w-5 h-5 text-green-600" />, color: 'green', group: 'quimica' },
  { value: 'quimica_corta', label: 'Quimica sanguinea mas corta', icon: <FlaskConical className="w-5 h-5 text-lime-500" />, color: 'lime', group: 'quimica' },
  { value: 'quimica_colinesterasa', label: 'Quimica Colinesterasa', icon: <FlaskConical className="w-5 h-5 text-green-500" />, color: 'green', group: 'quimica' },
  { value: 'glicemia_pre_post', label: 'Glicemia pre post', icon: <FlaskConical className="w-5 h-5 text-amber-500" />, color: 'amber', group: 'quimica' },

  { value: 'serologia', label: 'Serologia', icon: <Shield className="w-5 h-5 text-blue-700" />, color: 'blue', group: 'serologia' },
  { value: 'vdrl_hepatitis', label: 'VDRL Hepatitis y demas', icon: <Cross className="w-5 h-5 text-rose-600" />, color: 'rose', group: 'serologia' },
  { value: 'serologia_asto_psa_pylori', label: 'Serologia ASTO PSA Pylori', icon: <Activity className="w-5 h-5 text-blue-600" />, color: 'blue', group: 'serologia' },
  { value: 'helicobacter_pylori', label: 'Helicobacter Pylori', icon: <MicroscopeIcon className="w-5 h-5 text-purple-500" />, color: 'purple', group: 'serologia' },
  { value: 'dengue', label: 'Dengue', icon: <Droplets className="w-5 h-5 text-red-500" />, color: 'red', group: 'serologia' },

  { value: 'orina', label: 'Orina', icon: <TestTube className="w-5 h-5 text-yellow-500" />, color: 'yellow', group: 'orina_heces' },
  { value: 'heces', label: 'Heces', icon: <FileText className="w-5 h-5 text-amber-700" />, color: 'amber', group: 'orina_heces' },
  { value: 'prueba_embarazo', label: 'Prueba de embarazo', icon: <Baby className="w-5 h-5 text-pink-400" />, color: 'pink', group: 'orina_heces' },

  { value: 'hematologia_quimica', label: 'Hematologia y Quimica', icon: <FlaskConical className="w-5 h-5 text-indigo-500" />, color: 'indigo', group: 'paneles' },
  { value: 'hematologia_serologia', label: 'Hematologia y Serologia', icon: <Shield className="w-5 h-5 text-violet-500" />, color: 'violet', group: 'paneles' },
  { value: 'quimica_heces', label: 'Quimica y Heces', icon: <FlaskConical className="w-5 h-5 text-emerald-500" />, color: 'emerald', group: 'paneles' },
  { value: 'quimica_orina', label: 'Quimica y Orina', icon: <FlaskConical className="w-5 h-5 text-teal-600" />, color: 'teal', group: 'paneles' },
  { value: 'quimica_serologia', label: 'Quimica y Serologia', icon: <Shield className="w-5 h-5 text-blue-500" />, color: 'blue', group: 'paneles' },
  { value: 'serologia_heces', label: 'Serologia y Heces', icon: <Shield className="w-5 h-5 text-indigo-600" />, color: 'indigo', group: 'paneles' },
  { value: 'serologia_orina', label: 'Serologia y Orina', icon: <Shield className="w-5 h-5 text-sky-500" />, color: 'sky', group: 'paneles' },
  { value: 'orina_heces', label: 'Orina y Heces', icon: <FlaskConical className="w-5 h-5 text-teal-500" />, color: 'teal', group: 'paneles' },

  { value: 'nuevo_completo', label: 'Nuevo Completo', icon: <TestTube className="w-5 h-5 text-cyan-500" />, color: 'cyan', group: 'perfiles' },
];

interface FormValues {
  nombre: string;
  edad: string;
  telefono: string;
  cedula: string;
  direccion: string;
  examenes: TipoExamen[];
}

export default function NuevoPacienteForm() {
  const { crearPaciente, buscarPacientePorCedula } = useLab();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nombre: '',
      edad: '',
      telefono: '',
      cedula: '',
      direccion: '',
      examenes: [],
    },
  });

  const examenesSeleccionados = watch('examenes');
  const [busqueda, setBusqueda] = useState('');
  const cedulaValue = watch('cedula');

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cedula = e.target.value;
    setValue('cedula', cedula);

    if (cedula.length >= 3) {
      const pacienteExistente = buscarPacientePorCedula(cedula);
      if (pacienteExistente) {
        setValue('nombre', pacienteExistente.nombre);
        setValue('edad', pacienteExistente.edad.toString());
        setValue('telefono', pacienteExistente.telefono);
        setValue('direccion', pacienteExistente.direccion);
        sileo.info({
          title: 'Datos cargados',
          description: `Se cargaron los datos de ${pacienteExistente.nombre}`,
          duration: 2000,
          fill: 'black',
          styles: {
            title: 'text-white!',
            description: 'text-white/75!',
            badge: 'bg-white/20!',
          },
        });
      }
    }
  };

  const examenesFiltrados = examenesDisponibles.filter(examen =>
    examen.label.toLowerCase().includes(busqueda.toLowerCase())
  );

  const examenesAgrupados = gruposExamenes
    .map(grupo => ({
      ...grupo,
      examenes: examenesFiltrados.filter(examen => examen.group === grupo.key),
    }))
    .filter(grupo => grupo.examenes.length > 0);

  const toggleExamen = (tipo: TipoExamen) => {
    const current = examenesSeleccionados || [];
    const newExamenes = current.includes(tipo)
      ? current.filter(e => e !== tipo)
      : [...current, tipo];
    setValue('examenes', newExamenes, { shouldValidate: true });
  };

  const onSubmit = (data: FormValues) => {
    crearPaciente({
      nombre: data.nombre,
      edad: parseInt(data.edad) || 0,
      telefono: data.telefono,
      cedula: data.cedula,
      direccion: data.direccion,
      examenes: data.examenes,
    });

    reset();
    sileo.success({
      title: 'Paciente guardado exitosamente',
      duration: 3000,
      fill: 'black',
      styles: {
        title: 'text-white!',
        description: 'text-white/75!',
        badge: 'bg-white/20!',
      },
    });
  };

  return (
    <div className="w-lvh m-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex gap-2 items-center"><UserRoundPlus className='text-cyan-600' />Datos del Paciente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cedula *</label>
              <input
                type="text"
                inputMode="numeric"
                value={cedulaValue}
                onChange={handleCedulaChange}
                className={`w-full px-3 py-2 border rounded-md focus:border-transparent placeholder:text-gray-500 ${errors.cedula ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="12345678"
              />
              {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                {...register('nombre', { required: 'El nombre es requerido' })}
                className={`w-full px-3 py-2 border rounded-md focus:border-transparent placeholder:text-gray-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Juan Pérez García"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Edad *</label>
              <input
                type="text"
                inputMode="numeric"
                {...register('edad', { required: 'La edad es requerida', min: { value: '1', message: 'Debe ser mayor a 0' } })}
                className={`w-full px-3 py-2 border rounded-md focus:border-transparent placeholder:text-gray-500 ${errors.edad ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="35"
              />
              {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono *</label>
              <input
                type="tel"
                {...register('telefono', { required: 'El teléfono es requerido' })}
                className={`w-full px-3 py-2 border rounded-md focus:border-transparent placeholder:text-gray-500 ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="555-1234-5678"
              />
              {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Dirección *</label>
              <input
                type="text"
                {...register('direccion', { required: 'La dirección es requerida' })}
                className={`w-full px-3 py-2 border rounded-md focus:border-transparent placeholder:text-gray-500 ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Dr. Nombre del Médico"
              />
              {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-lg border p-6 shadow-sm ${errors.examenes ? 'border-red-500' : 'border-gray-200'}`}>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-5'>
              <h2 className="text-lg font-medium text-gray-900  flex gap-2 items-center"><TestTube2 className='text-cyan-600' />Exámenes a Realizar *</h2>
              <div className={`overflow-hidden transition-all duration-300 ease-out ${examenesSeleccionados?.length ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                <p className='bg-cyan-100 text-xs rounded-full px-4 py-0.5 text-cyan-800 font-medium whitespace-nowrap'>Examenes: {examenesSeleccionados?.length || 0}</p>
              </div>
            </div>
            <div className='relative'>
              <Search className='text-gray-400 absolute top-1.5 right-3' />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className='border border-gray-300 rounded-lg h-9 w-80 pl-5 pr-10 text-gray-700 focus:outline-none focus:border-cyan-500'
                placeholder='Buscar examen...'
              />
            </div>
          </div>
          <input type="hidden" {...register('examenes', { validate: (value) => value.length > 0 || 'Selecciona al menos un examen' })} />

          <div className="space-y-5">
            {examenesAgrupados.map(grupo => (
              <div key={grupo.key}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{grupo.label}</p>
                  <span className="text-xs text-gray-400">{grupo.examenes.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {grupo.examenes.map(examen => {
                    const isSelected = examenesSeleccionados?.includes(examen.value);
                    const colors = colorClasses[examen.color] || colorClasses.cyan;

                    return (
                      <div
                        key={examen.value}
                        onClick={() => toggleExamen(examen.value)}
                        className={`flex items-center gap-3 h-12 px-2 rounded-lg border cursor-pointer transition-colors ${isSelected
                          ? `${colors.border} ${colors.bg}`
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        {examen.icon}
                        <span className={`text-sm ${isSelected ? colors.text : 'text-gray-700'}`}>{examen.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {examenesAgrupados.length === 0 && (
              <p className="text-sm text-gray-500">No se encontraron examenes para esa busqueda.</p>
            )}
          </div>
          {errors.examenes && <p className="text-red-500 text-xs mt-2">{errors.examenes.message}</p>}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="cursor-pointer px-4 py-2.5 w-24 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            Crear solicitud
            <UserCheck />
          </button>
        </div>
      </form >
    </div >
  );
}
