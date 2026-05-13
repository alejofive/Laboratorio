

export function PacienteNuevoSolicitudScreen({ onBackToSearch }: { onBackToSearch?: () => void }) {
    return (
        <div className="space-y-4">
            <section className="surface-card rounded-3xl p-4">
                <button className="text-tertiary mb-4 text-base flex items-center gap-2 cursor-pointer" onClick={onBackToSearch}>
                    <img src="/svg/arrow-back.svg" alt="Volver a buscar" /> Volver a buscar
                </button>
                <h2 className="mb-3 text-xl font-semibold leading-none">Nuevo paciente</h2>
                <div className="grid gap-3 md:grid-cols-2">
                    <input className="border-border-input rounded-xl border p-3 text-base" placeholder="Cédula" />
                    <input className="border-border-input rounded-xl border p-3 text-base" placeholder="Nombre completo" />
                    <input className="border-border-input rounded-xl border p-3 text-base" placeholder="Edad" />
                    <input className="border-border-input rounded-xl border p-3 text-base" placeholder="Teléfono" />
                </div>
                <input className="border-border-input mt-3 w-full rounded-xl border p-3 text-base" placeholder="Av. / Urb / Calle" />
            </section>
            <div className="flex justify-end">
                <button className="bg-brand-soft rounded-2xl px-6 py-3 leading-none font-medium text-white">Guardar y crear solicitud</button>
            </div>
        </div>
    )
}
