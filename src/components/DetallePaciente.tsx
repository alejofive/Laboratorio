import type { PatientApi, PatientDetailResponse } from '@/types/create';

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

                <div className="mb-2 flex items-center justify-between">
                    <p className="text-xl font-semibold">{nombre}</p>
                    <button type="button" className="cursor-pointer text-secondary text-xl" onClick={onClearPatient}>
                        <img src="/svg/xicon.svg" alt="Cerrar" />
                    </button>
                </div>
                <p className="text-secondary text-base flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-2"><img src="/svg/paciente/cedula.svg" alt="Cedula" /> {paciente.document_number}</span>
                    <span className="flex items-center gap-2"><img src="/svg/paciente/phone.svg" alt="Telefono" /> {paciente.phone}</span>
                    <span className="flex items-center gap-2"><img src="/svg/paciente/calendar.svg" alt="Edad" /> {edad ?? '--'} años</span>
                    <span className="flex items-center gap-2"><img src="/svg/paciente/location.svg" alt="Direccion" /> {paciente.address ?? ''}</span>
                </p>
            </div>

            <button className="text-tertiary mt-3 rounded-xl border border-border-default px-4 py-2 text-base">Ver historial</button>
        </div>
    );
}
