'use client';

import { TipoExamen } from '@/types';

import { useCreateOrder, useCreatePatient, useExams, useOrders, usePatientById, usePatients } from '@/data/createPatients';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { sileo } from 'sileo';
import DetallePaciente from './DetallePaciente';
import { PillFilter } from './PillFilter';
import TopResumen from './TopResumen';
import { Button } from './ui/Button';
import SvgIcon from './ui/SvgIcon';

type GrupoExamen = 'hematologia' | 'quimica' | 'serologia' | 'orina_heces' | 'paneles' | 'perfiles';

type ExamItem = {
  templateId: string;
  label: string;
  value: TipoExamen;
  group: GrupoExamen;
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const categoryToGroup: Record<string, GrupoExamen> = {
  hematologia: 'hematologia',
  'quimica sanguinea': 'quimica',
  'inmunologia y serologia': 'serologia',
  'coprologia y uroanalisis': 'orina_heces',
  'perfiles combinados': 'paneles',
};

const examNameToTipo: Record<string, TipoExamen> = {
  'frotisde sangre periferica': 'frotis_sangre',
  hematologia: 'hematologia',
  'hemoglomina hematocritos': 'hemoglobina_hematocritos',
  hemoparasitos: 'hemoparasitos',
  'tipo de sangre': 'tipo_sangre',
  glicemia: 'glicemia_pre_post',
  'glicemia pre post': 'glicemia_pre_post',
  'quimica sanguinea': 'quimica',
  'quimica sanguinea mas corta': 'quimica_corta',
  quimica: 'quimica',
  'quimica colinesterasa': 'quimica_colinesterasa',
  'quimica colinesteraza': 'quimica_colinesterasa',
  dengue: 'dengue',
  'helicobacter pylori': 'helicobacter_pylori',
  'prueba de embarazo': 'prueba_embarazo',
  serologia: 'serologia',
  'serologia asto psa pylori': 'serologia_asto_psa_pylori',
  'vdrl hepatitis y demas': 'vdrl_hepatitis',
  heces: 'heces',
  orina: 'orina',
  'heces y hematologia': 'heces_hematologia',
  'hematologia y orina': 'hematologia_orina',
  'hematologia y quimica': 'hematologia_quimica',
  'hematologia y serologia': 'hematologia_serologia',
  'nuevo completo': 'nuevo_completo',
  'orina y heces': 'orina_heces',
  'quimica y heces': 'quimica_heces',
  'quimica y orina': 'quimica_orina',
  'quimica y serologia': 'quimica_serologia',
  'serologia y heces': 'serologia_heces',
  'serologia y orina': 'serologia_orina',
};



interface FormValues {
  nombre: string;
  fechaNacimiento: string;
  telefono: string;
  cedula: string;
  direccion: string;
  apellido: string;
  examenes: TipoExamen[];
}

export default function NuevoPacienteForm() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      fechaNacimiento: '',
      telefono: '',
      cedula: '',
      direccion: '',
      apellido: '',
      examenes: [],
    },
  });

  const examenesSeleccionados = watch('examenes');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchExam, setSearchExam] = useState('');
  const [activeCategory, setActiveCategory] = useState<GrupoExamen>('hematologia');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const cedulaValue = watch('cedula');

  const { data: examsData } = useExams();
  const todayApiDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const { data: ordersToday = [] } = useOrders({
    page: 1,
    limit: 100,
    start_date: todayApiDate,
    end_date: todayApiDate,
  });

  const resumenHoy = useMemo(() => {
    const totalParaImprimir = ordersToday.filter((order) => order.status === 'completed' || order.status === 'sent').length;
    const totalSolicitudes = ordersToday.length - totalParaImprimir;

    return {
      totalSolicitudes,
      totalParaImprimir,
    };
  }, [ordersToday]);

  const shouldShowResults = debouncedSearchTerm.trim().length >= 2;
  const isSearching = searchTerm.trim().length > 0;
  const { data: patientsData, isLoading: isLoadingPatients } = usePatients({
    page: 1,
    limit: 10,
    search: shouldShowResults ? debouncedSearchTerm : '',
  });
  const { data: selectedPatientDetail, isLoading: isLoadingPatientDetail } = usePatientById(selectedPatientId);

  const createPatientMutation = useCreatePatient();
  const createOrderMutation = useCreateOrder();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const results = patientsData?.data ?? [];

  const selectedPatient = useMemo(
    () => results.find((patient) => patient._id === selectedPatientId) ?? null,
    [results, selectedPatientId]
  );

  useEffect(() => {
    if (!selectedPatientDetail) return;

    setValue('cedula', selectedPatientDetail.document_number ?? '');
    setValue('nombre', selectedPatientDetail.first_name ?? '');
    setValue('apellido', selectedPatientDetail.last_name ?? '');
    setValue('telefono', selectedPatientDetail.phone ?? '');
    setValue('direccion', selectedPatientDetail.address ?? '');

    if (selectedPatientDetail.birth_date) {
      setValue('fechaNacimiento', selectedPatientDetail.birth_date.split('T')[0]);
    }
  }, [selectedPatientDetail, setValue]);

  const selectedPatientCard = selectedPatientDetail ?? selectedPatient;

  const EXAM_CATEGORIES: { key: GrupoExamen; label: string; iconSrc: string }[] = [
    { key: 'hematologia', label: 'Hematología', iconSrc: '/svg/examenes/Hematología.svg' },
    { key: 'quimica', label: 'Química', iconSrc: '/svg/examenes/Química.svg' },
    { key: 'serologia', label: 'Serología e Infecciosos', iconSrc: '/svg/examenes/serologia.svg' },
    { key: 'orina_heces', label: 'Orina y heces', iconSrc: '/svg/examenes/Muestras.svg' },
    { key: 'paneles', label: 'Paneles Combinados ', iconSrc: '/svg/examenes/Combinados.svg' },
    { key: 'perfiles', label: 'Perfiles Completos', iconSrc: '/svg/examenes/Perfil completo.svg' },
  ];

  const allExams = useMemo<ExamItem[]>(() => {
    if (!examsData?.categories) return [];

    return examsData.categories.flatMap((category) => {
      const normalizedCategoryName = normalizeText(category.name);
      const group = categoryToGroup[normalizedCategoryName] ?? 'perfiles';

      return category.exams
        .map((exam) => {
          const normalizedExamName = normalizeText(exam.name);
          const tipo = examNameToTipo[normalizedExamName];

          if (!tipo) return null;

          return {
            templateId: exam.id,
            label: exam.name,
            value: tipo,
            group,
          };
        })
        .filter((item): item is ExamItem => item !== null);
    });
  }, [examsData]);

  const examCountByCategory: Record<GrupoExamen, number> = {
    hematologia: allExams.filter((exam) => exam.group === 'hematologia').length,
    quimica: allExams.filter((exam) => exam.group === 'quimica').length,
    serologia: allExams.filter((exam) => exam.group === 'serologia').length,
    orina_heces: allExams.filter((exam) => exam.group === 'orina_heces').length,
    paneles: allExams.filter((exam) => exam.group === 'paneles').length,
    perfiles: allExams.filter((exam) => exam.group === 'perfiles').length,
  };

  const visibleExams = allExams.filter((exam) => {
    const byCategory = exam.group === activeCategory;
    const byText = exam.label.toLowerCase().includes(searchExam.toLowerCase());
    return byCategory && byText;
  });

  const selectedExams = examenesSeleccionados || [];
  const shouldShowSelected = selectedExams.length > 0;
  const canCreateFromSearch = Boolean(selectedPatientId) && selectedExams.length > 0;
  const canCreateFromForm = showCreateForm && isValid && selectedExams.length > 0;
  const isSubmitDisabled = !(canCreateFromSearch || canCreateFromForm);

  const onSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const onSelectPatient = (patient: (typeof results)[number]) => {
    setValue('cedula', patient.document_number);
    setValue('nombre', patient.first_name);
    setValue('apellido', patient.last_name);
    setValue('telefono', patient.phone);
    setValue('direccion', '');
    setSelectedPatientId(patient._id);
    setShowCreateForm(false);
    setSearchTerm('');

    sileo.info({
      title: 'Datos cargados',
      description: `Se cargaron los datos de ${patient.first_name} ${patient.last_name}`,
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
      apellido: '',
      fechaNacimiento: '',
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

  const onSubmit = async (data: FormValues) => {
    try {
      const selectedTemplates = allExams
        .filter((exam) => selectedExams.includes(exam.value))
        .map((exam) => exam.templateId);

      if (selectedTemplates.length === 0) {
        toast.error('Debes seleccionar al menos un examen valido');
        return;
      }

      let patientId = '';

      if (showCreateForm) {
        const created = await createPatientMutation.mutateAsync({
          first_name: data.nombre.trim(),
          last_name: data.apellido.trim(),
          document_number: data.cedula.trim(),
          birth_date: data.fechaNacimiento,
          phone: data.telefono.trim(),
          address: data.direccion.trim(),
        });

        patientId = created._id;
      } else {
        if (!selectedPatientId) {
          toast.error('No se encontro el paciente en API para crear la orden');
          return;
        }

        patientId = selectedPatientId;
      }

      await createOrderMutation.mutateAsync({
        patient_id: patientId,
        exam_template_ids: selectedTemplates,
        notes: 'Paciente en ayuno',
      });

      await queryClient.invalidateQueries({ queryKey: ['orders-api'] });

      onClearPatient();
      reset();
      toast.success('Solicitud creada exitosamente');
    } catch {
      toast.error('No se pudo crear la solicitud');
    }
  };

  return (
    <div className="w-full">
      <TopResumen
        totalSolicitudes={resumenHoy.totalSolicitudes}
        totalParaImprimir={resumenHoy.totalParaImprimir}
      />


      <section className="bg-surface border-border-default border rounded-3xl p-4 mt-6 mb-4">

        {!showCreateForm ? (
          <div className="flex flex-wrap items-center gap-4">
            {selectedPatientCard || isLoadingPatientDetail ? (
              <div className="w-full">
                <DetallePaciente
                  paciente={selectedPatientCard ?? undefined}
                  isLoading={isLoadingPatientDetail}
                  onClearPatient={onClearPatient}
                />
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
                              key={result._id}
                              type="button"
                              onClick={() => onSelectPatient(result)}
                              className={`flex w-full items-center hover:bg-gray-200 cursor-pointer z-0 justify-between px-4 py-3 text-left ${index > 0 ? 'border-t border-border-default' : ''}`}
                            >
                              <span className="text-tertiary text-base">
                                {result.first_name} {result.last_name} · {result.document_number} · {result.phone} · {result.age} años
                              </span>
                            </button>
                          ))
                        ) : isLoadingPatients ? (
                          <p className="text-secondary px-4 py-3 text-base">Buscando pacientes...</p>
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
                    <Button className="cursor-pointer whitespace-nowrap rounded-2xl" onClick={onCreatePatient}>
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
                  <label className="block text-tertiary text-sm font-bold mb-1">Cédula</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cedulaValue}
                    onChange={(e) => setValue('cedula', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-secondary ${errors.cedula ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="V-12345678"
                  />
                  {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula.message}</p>}
                </div>

                <div>

                  <div className='flex gap-4'>

                    <div className='flex-1'>
                      <label className="block text-tertiary text-sm font-bold mb-1">Nombre</label>
                      <input
                        type="text"
                        {...register('nombre', { required: 'El nombre es requerido' })}
                        className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-secondary ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nombre"
                      />
                      {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                    </div>
                    <div className='flex-1'>
                      <label className="block text-tertiary text-sm font-bold mb-1">Apellido</label>
                      <input
                        type="text"
                        {...register('apellido', { required: 'El apellido es requerido' })}
                        className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-secondary ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Apellido"
                      />
                      {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-tertiary text-sm font-bold mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    {...register('fechaNacimiento', { required: 'La fecha de nacimiento es requerida' })}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-secondary ${errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento.message}</p>}
                </div>

                <div>
                  <label className="block text-tertiary text-sm font-bold mb-1">Teléfono</label>
                  <input
                    type="tel"
                    {...register('telefono', { required: 'El teléfono es requerido' })}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-secondary ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0414-0000000"
                  />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-tertiary text-sm font-bold mb-1">Dirección</label>
                  <input
                    type="text"
                    {...register('direccion', { required: 'La dirección es requerida' })}
                    className={`w-full px-3 py-2 border rounded-xl focus:border-transparent placeholder:text-secondary ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Av. / Urb / Calle"
                  />
                  {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
                </div>
              </div>
            </div>
          </form >
        ) : null}


      </section>


      <section className="bg-surface border border-border-default rounded-3xl p-4 pb-10">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold leading-none">Exámenes a realizar</h3>
            <p className="text-secondary text-base mt-2">Selecciona uno o varios exámenes para esta solicitud.</p>
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
                className={`text-tertiary flex min-h-16 text-base cursor-pointer items-center gap-2 rounded-xl border px-3 transition-colors duration-200 ${isChecked ? 'border-[#0058A8] bg-[#E4F4FC]' : 'border-border-input'
                  }`}
              >
                <input type="checkbox" className="size-5 shrink-0 cursor-pointer" checked={isChecked} onChange={() => toggleExamen(exam.value)} />
                <span>{exam.label}</span>
              </label>
            );
          })}
        </div>
        {visibleExams.length === 0 ? <p className="text-secondary mt-3 text-sm">No hay exámenes para esta búsqueda.</p> : null}
        {shouldShowSelected ? (
          <div className="mt-6">
            <h4 className="text-xl font-semibold">Exámenes seleccionados: {selectedExams.length}</h4>
            <div className="mt-3 flex flex-wrap gap-3">
              {selectedExams.map((exam) => {
                const examLabel = allExams.find((item) => item.value === exam)?.label ?? exam;
                return <PillFilter selected key={exam} label={examLabel} onRemove={() => toggleExamen(exam)} />;
              })}
            </div>
          </div>
        ) : null}
        {errors.examenes && <p className="text-red-500 text-xs mt-2">{errors.examenes.message}</p>}
      </section>

      <div className="flex items-center justify-end gap-4 mt-6">
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitDisabled || createPatientMutation.isPending || createOrderMutation.isPending}
          className="cursor-pointer whitespace-nowrap rounded-2xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          Guardar y crear solicitud
        </Button>
      </div>
    </div >
  );
}
