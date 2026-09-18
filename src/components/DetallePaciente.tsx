import type { PatientApi, PatientDetailResponse } from '@/types/create';
import Image from 'next/image';

type DetallePacienteProps = {
    paciente?: PatientDetailResponse | PatientApi;
    isLoading?: boolean;
    onClearPatient: () => void;
};

const getAgeFromBirthDate = (birthDate?: string) => {
    if (!birthDate) return null;

    const date = new Date(birthDate);
    if (Number.isNaN(date.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age -= 1;
    }

    return age;
};

export default function DetallePaciente({ paciente, isLoading = false, onClearPatient }: DetallePacienteProps) {
    if (isLoading) {
        return (
            <div>
                <h2 className="mb-3 text-xl font-semibold leading-none">Buscar un paciente o crear solicitud</h2>
                <div className="bg-surface-muted rounded-2xl p-4 animate-pulse">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="h-7 w-56 rounded bg-white/50" />
                        <div className="h-8 w-8 rounded bg-white/50" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="h-6 w-44 rounded bg-white/50" />
                        <div className="h-6 w-40 rounded bg-white/50" />
                        <div className="h-6 w-28 rounded bg-white/50" />
                        <div className="h-6 w-52 rounded bg-white/50" />
                    </div>
                </div>
                <div className="text-tertiary mt-3 rounded-xl border border-border-default px-4 py-2 text-base w-28 h-[42px] animate-pulse" />
            </div>
        );
    }

    if (!paciente) return null;

    const nombre = `${paciente.first_name} ${paciente.last_name}`.trim();
    const edadDesdeFecha = getAgeFromBirthDate('birth_date' in paciente ? paciente.birth_date : undefined);
    const edad = edadDesdeFecha ?? ('age' in paciente ? (paciente.age ?? null) : null);

    return (
        <div>
            <h2 className="mb-3 text-xl font-semibold leading-none">Buscar un paciente o crear solicitud</h2>
            <div className="bg-surface-muted rounded-2xl p-4">

                <div className="mb-3 flex items-start justify-between gap-3">
                    <p className="min-w-0 break-words text-lg font-semibold sm:text-xl">{nombre}</p>
                    <button type="button" className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-xl text-secondary transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30" onClick={onClearPatient} aria-label="Quitar paciente seleccionado">
                        <Image src="/svg/xicon.svg" alt="" width={20} height={20} />
                    </button>
                </div>
                <div className="flex flex-col gap-3 text-sm text-secondary sm:flex-row sm:flex-wrap sm:items-center sm:text-base">
                    <span className="flex items-center gap-2"><Image src="/svg/paciente/cedula.svg" alt="" width={20} height={20} /> {paciente.document_number}</span>
                    <span className="flex items-center gap-2"><Image src="/svg/paciente/phone.svg" alt="" width={20} height={20} /> {paciente.phone}</span>
                    <span className="flex items-center gap-2"><Image src="/svg/paciente/calendar.svg" alt="" width={20} height={20} /> {edad ?? '--'} años</span>
                    <span className="flex min-w-0 items-start gap-2"><Image className="mt-0.5 shrink-0" src="/svg/paciente/location.svg" alt="" width={20} height={20} /> <span className="break-words">{paciente.address ?? ''}</span></span>
                </div>
            </div>

            <button className="mt-3 min-h-11 w-full rounded-xl border border-border-default px-4 py-2 text-base text-tertiary transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 sm:w-auto">Ver historial</button>
        </div>
    );
}
