'use client';

import ExamTable from "@/components/ExamTable";
import StatsCards from "@/components/StatsCards";
import { useLab } from "@/context/LabContext";
import { useMemo, useState } from "react";


export default function SolicitudPage() {
    const { examenes, pacientes } = useLab();
    const [mostrarAnteriores, setMostrarAnteriores] = useState(false);

    const getFechaHoy = () => {
        const hoy = new Date();
        return `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
    };

    const stats = useMemo(() => {
        const fechaHoy = getFechaHoy();

        const pacientesFiltrados = pacientes.filter((paciente) =>
            mostrarAnteriores ? paciente.fecha !== fechaHoy : paciente.fecha === fechaHoy
        );

        const pacienteIds = new Set(pacientesFiltrados.map((paciente) => paciente.id));
        const examenesFiltrados = examenes.filter((examen) => pacienteIds.has(examen.pacienteId));

        return {
            total: examenesFiltrados.length,
            pendientes: examenesFiltrados.filter((ex) => ex.estado === "pendiente").length,
            enProceso: examenesFiltrados.filter((ex) => ex.estado === "en_proceso").length,
            completos: examenesFiltrados.filter((ex) => ex.estado === "completo").length,
            enviados: examenesFiltrados.filter((ex) => ex.estado === "enviado").length,
        };
    }, [examenes, pacientes, mostrarAnteriores]);

    return (<div className="px-32 py-5 w-full min-h-screen">
        <div className="">
            <StatsCards stats={stats} mostrarAnteriores={mostrarAnteriores} />

            <ExamTable
                anterior={true}
                mostrarAnteriores={mostrarAnteriores}
                onToggleMostrarAnteriores={setMostrarAnteriores}
            />
        </div>
    </div>)
}
