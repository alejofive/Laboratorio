import type { Paciente } from "@/types";
import { Button } from "./ui/Button";

type DetallePacienteProps = {
    paciente: Paciente;
    onClearPatient: () => void;
};

export default function DetallePaciente({ paciente, onClearPatient }: DetallePacienteProps) {
    return (
        <div>
            <h2 className="mb-3 text-xl font-semibold leading-none">Buscar un paciente o crear solicitud</h2>
            <div className="bg-surface-muted rounded-2xl p-4">

                <div className="mb-2 flex items-center justify-between">
                    <p className="text-xl font-semibold">{paciente.nombre}</p>
                    <button type="button" className="cursor-pointer text-secondary text-xl" onClick={onClearPatient}>
                        <img src="/svg/xicon.svg" alt="Cerrar" />
                    </button>
                </div>
                <p className="text-secondary text-base flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-2"><img src="/svg/paciente/cedula.svg" alt="Cedula" /> {paciente.cedula}</span>
                    <span className="flex items-center gap-2"><img src="/svg/paciente/phone.svg" alt="Telefono" /> {paciente.telefono}</span>
                    <span className="flex items-center gap-2"><img src="/svg/paciente/calendar.svg" alt="Edad" /> {paciente.edad} anos</span>
                    <span className="flex items-center gap-2"><img src="/svg/paciente/location.svg" alt="Direccion" /> {paciente.direccion}</span>
                </p>
            </div>

            <button className="text-tertiary mt-3 rounded-xl border border-border-default px-4 py-2 text-base">Ver historial</button>
        </div>
    );
}
