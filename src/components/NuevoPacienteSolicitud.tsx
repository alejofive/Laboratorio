import { Button } from './ui/Button'
import { TextInput } from './ui/FormField'



export function PacienteNuevoSolicitudScreen({ onBackToSearch }: { onBackToSearch?: () => void }) {
    return (
        <div className="space-y-4">
            <section className="rounded-3xl border border-border-default bg-surface p-4">
                <button className="text-tertiary mb-4 text-base flex items-center gap-2 cursor-pointer" onClick={onBackToSearch}>
                    <img src="/svg/arrow-back.svg" alt="Volver a buscar" /> Volver a buscar
                </button>
                <h2 className="mb-3 text-xl font-semibold leading-none">Nuevo paciente</h2>
                <div className="grid gap-3 md:grid-cols-2">
                    <TextInput placeholder="Cédula" />
                    <TextInput placeholder="Nombre completo" />
                    <TextInput placeholder="Edad" />
                    <TextInput placeholder="Teléfono" />
                </div>
                <TextInput className="mt-3" placeholder="Av. / Urb / Calle" />
            </section>
            <div className="flex justify-end">
                <Button>Guardar y crear solicitud</Button>
            </div>
        </div>
    )
}
