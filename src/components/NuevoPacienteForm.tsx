'use client';

import { useLab } from '@/context/LabContext';
import { TipoExamen } from '@/types';
import {
  UserCheck,
  Droplets,
  FlaskConical,
  Microscope,
  TestTube,
  Activity,
  Baby,
  Shield,
  Cross,
  FileText,
  MicroscopeIcon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { sileo } from 'sileo';
import DetallePaciente from './DetallePaciente';
import TopResumen from './TopResumen';
import SvgIcon from './ui/SvgIcon';
import { Button } from './ui/Button';
import { PillFilter } from './PillFilter';

type GrupoExamen = 'hematologia' | 'quimica' | 'serologia' | 'orina_heces' | 'paneles' | 'perfiles';

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
  const { crearPaciente, buscarPacientePorCedula, pacientes } = useLab();

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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchExam, setSearchExam] = useState('');
  const [activeCategory, setActiveCategory] = useState<GrupoExamen>('hematologia');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const cedulaValue = watch('cedula');

  const shouldShowResults = searchTerm.trim().length >= 2;
  const isSearching = searchTerm.trim().length > 0;

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];

    return pacientes.filter((paciente) => {
      return (
        paciente.cedula.toLowerCase().includes(term) ||
        paciente.nombre.toLowerCase().includes(term) ||
        paciente.telefono.toLowerCase().includes(term)
      );
    });
  }, [pacientes, searchTerm]);

  const selectedPatient = useMemo(
    () => pacientes.find((paciente) => paciente.id === selectedPatientId) ?? null,
    [pacientes, selectedPatientId]
  );

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

  const EXAM_CATEGORIES: { key: GrupoExamen; label: string; iconSrc: string }[] = [
    { key: 'hematologia', label: 'Hematologia', iconSrc: '/svg/examenes/Hematología.svg' },
    { key: 'quimica', label: 'Quimica', iconSrc: '/svg/examenes/Química.svg' },
    { key: 'serologia', label: 'Serologia', iconSrc: '/svg/examenes/serologia.svg' },
    { key: 'orina_heces', label: 'Orina y heces', iconSrc: '/svg/examenes/Muestras.svg' },
    { key: 'paneles', label: 'Paneles', iconSrc: '/svg/examenes/Combinados.svg' },
    { key: 'perfiles', label: 'Perfiles', iconSrc: '/svg/examenes/Perfil completo.svg' },
  ];

  const examCountByCategory: Record<GrupoExamen, number> = {
    hematologia: examenesDisponibles.filter((exam) => exam.group === 'hematologia').length,
    quimica: examenesDisponibles.filter((exam) => exam.group === 'quimica').length,
    serologia: examenesDisponibles.filter((exam) => exam.group === 'serologia').length,
    orina_heces: examenesDisponibles.filter((exam) => exam.group === 'orina_heces').length,
    paneles: examenesDisponibles.filter((exam) => exam.group === 'paneles').length,
    perfiles: examenesDisponibles.filter((exam) => exam.group === 'perfiles').length,
  };

  const visibleExams = examenesDisponibles.filter((exam) => {
    const byCategory = exam.group === activeCategory;
    const byText = exam.label.toLowerCase().includes(searchExam.toLowerCase());
    return byCategory && byText;
  });

  const selectedExams = examenesSeleccionados || [];
  const shouldShowSelected = selectedExams.length > 0;

  const onSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const onSelectPatient = (paciente: (typeof pacientes)[number]) => {
    setValue('cedula', paciente.cedula);
    setValue('nombre', paciente.nombre);
    setValue('edad', paciente.edad.toString());
    setValue('telefono', paciente.telefono);
    setValue('direccion', paciente.direccion);
    setSelectedPatientId(paciente.id);
    setShowCreateForm(false);
    setSearchTerm('');

    sileo.info({
      title: 'Datos cargados',
      description: `Se cargaron los datos de ${paciente.nombre}`,
      duration: 2000,
      fill: 'black',
      styles: {
        title: 'text-white!',
        description: 'text-white/75!',
        badge: 'bg-white/20!',
      },
    });
  };

  const onCreatePatient = () => {
    reset({
      nombre: '',
      edad: '',
      telefono: '',
      cedula: '',
      direccion: '',
      examenes: [],
    });
    setSelectedPatientId(null);
    setShowCreateForm(true);
    setSearchTerm('');
  };

  const onClearPatient = () => {
    setSelectedPatientId(null);
    setShowCreateForm(false);
    setSearchTerm('');
  };

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
    <div className="w-full">
      <TopResumen />


      <section className="bg-surface border-border-default border rounded-3xl p-4 mt-5 mb-4">

        {!showCreateForm ? (
          <div className="flex flex-wrap items-center gap-4">
            {selectedPatient ? (
              <div className="w-full">
                <DetallePaciente paciente={selectedPatient} onClearPatient={onClearPatient} />
              </div>
            ) : (
              <div className='w-full'>
                <h2 className="mb-3 text-xl font-semibold leading-none">Buscar un paciente o crear solicitud</h2>
                <div className='flex items-center gap-3 justify-between'>
                  <div className="border-border-input relative bg-surface min-w-72 flex-1 rounded-xl border px-5 py-3 leading-none">
                    <input
                      className="text-secondary w-full bg-transparent pr-8 outline-none"
                      value={searchTerm}
                      onChange={(event) => onSearchTermChange(event.target.value)}
                      placeholder="Buscar por cédula, nombre o teléfono..."
                    />
                    {searchTerm ? (
                      <button
                        type="button"
                        className="text-secondary absolute right-4 top-2 text-xl"
                        onClick={() => onSearchTermChange('')}
                      >
                        ×
                      </button>
                    ) : null}

                    {shouldShowResults ? (
                      <div className="border-border-default bg-white z-20 mt-2 rounded-3xl border absolute top-10 left-0 right-0 shadow-2xl">
                        {results.length > 0 ? (
                          results.map((result, index) => (
                            <button
                              key={result.id}
                              type="button"
                              onClick={() => onSelectPatient(result)}
                              className={`flex w-full items-center hover:bg-gray-200 cursor-pointer z-0 justify-between px-4 py-3 text-left ${index > 0 ? 'border-t border-border-default' : ''}`}
                            >
                              <span className="text-tertiary text-base">
                                {result.nombre} · {result.cedula} · {result.telefono} · {result.edad} años
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="text-secondary px-4 py-3 text-base">No se encontraron pacientes.</p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={`origin-right overflow-hidden transition-all duration-300 ease-out ${isSearching ? 'pointer-events-none max-w-0 scale-95 opacity-0' : 'max-w-xs scale-100 opacity-100'}`}
                    aria-hidden={isSearching}
                  >
                    <Button className="cursor-pointer whitespace-nowrap" onClick={onCreatePatient}>
                      <SvgIcon src='/svg/plus.svg' size={24} /> Crear paciente nuevo
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {showCreateForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="">
              <button className="text-tertiary mb-4 text-base flex items-center gap-2 cursor-pointer" onClick={onClearPatient}>
                <SvgIcon src='/svg/arrow-back.svg' size={20} />
                <span className="text-secondary text-base">Volver a buscar</span>
              </button>
              <h2 className="mb-3 text-xl font-semibold leading-none">Nuevo paciente</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-tertiary text-sm font-bold mb-1">Cedula</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cedulaValue}
                    onChange={handleCedulaChange}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-gray-500 ${errors.cedula ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="V-12345678"
                  />
                  {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula.message}</p>}
                </div>

                <div>
                  <label className="block text-tertiary text-sm font-bold mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    {...register('nombre', { required: 'El nombre es requerido' })}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-gray-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nombre y apellido"
                  />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                </div>

                <div>
                  <label className="block text-tertiary text-sm font-bold mb-1">Edad</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    {...register('edad', { required: 'La edad es requerida', min: { value: '1', message: 'Debe ser mayor a 0' } })}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-gray-500 ${errors.edad ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ej. 34"
                  />
                  {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad.message}</p>}
                </div>

                <div>
                  <label className="block text-tertiary text-sm font-bold mb-1">Teléfono</label>
                  <input
                    type="tel"
                    {...register('telefono', { required: 'El teléfono es requerido' })}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-gray-500 ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0414-0000000"
                  />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-tertiary text-sm font-bold mb-1">Dirección</label>
                  <input
                    type="text"
                    {...register('direccion', { required: 'La dirección es requerida' })}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-gray-500 ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Av. / Urb / Calle"
                  />
                  {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
                </div>
              </div>
            </div>
          </form >
        ) : null}


      </section>


      <section className="bg-surface border border-border-default rounded-3xl p-4 h-[358px]">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold leading-none">Examenes a realizar</h3>
            <p className="text-secondary text-base">Selecciona uno o varios examenes para esta solicitud.</p>
          </div>
          <input
            className="text-secondary border-border-input rounded-xl border px-4 py-2 text-base"
            placeholder="Buscar examen"
            value={searchExam}
            onChange={(event) => setSearchExam(event.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {EXAM_CATEGORIES.map((category) => (
            <PillFilter
              key={category.key}
              label={`${category.label} (${examCountByCategory[category.key]})`}
              active={activeCategory === category.key}
              onClick={() => setActiveCategory(category.key)}
              iconSrc={category.iconSrc}
              iconAlt={category.key}
            />
          ))}
        </div>
        <input type="hidden" {...register('examenes', { validate: (value) => value.length > 0 || '' })} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {visibleExams.map((exam) => {
            const isChecked = selectedExams.includes(exam.value);

            return (
              <label
                key={exam.value}
                className={`text-tertiary flex min-h-16 items-center gap-2 rounded-xl border px-3 text-sm transition-colors duration-200 ${isChecked ? 'border-[#0058A8] bg-[#E4F4FC]' : 'border-border-input'
                  }`}
              >
                <input type="checkbox" className="size-4" checked={isChecked} onChange={() => toggleExamen(exam.value)} />
                <span>{exam.label}</span>
              </label>
            );
          })}
        </div>
        {visibleExams.length === 0 ? <p className="text-secondary mt-3 text-sm">No hay examenes para esta busqueda.</p> : null}
        {shouldShowSelected ? (
          <div className="mt-6">
            <h4 className="text-xl font-semibold">Examenes seleccionados: {selectedExams.length}</h4>
            <div className="mt-3 flex flex-wrap gap-3">
              {selectedExams.map((exam) => {
                const examLabel = examenesDisponibles.find((item) => item.value === exam)?.label ?? exam;
                return <PillFilter selected key={exam} label={examLabel} onRemove={() => toggleExamen(exam)} />;
              })}
            </div>
          </div>
        ) : null}
        {errors.examenes && <p className="text-red-500 text-xs mt-2">{errors.examenes.message}</p>}
      </section>

      <div className="flex items-center justify-end gap-4 mt-6">
        <button
          type="submit"
          className="cursor-pointer bg-brand-primary hover:bg-brand-light text-white font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2"
        >
          Guardar y crear solicitud
        </button>
      </div>
    </div >
  );
}
