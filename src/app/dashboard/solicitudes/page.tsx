'use client';

import ExamTable from "@/components/ExamTable";
import TopResumen from "@/components/TopResumen";

import { useLab } from "@/context/LabContext";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function SolicitudPage() {
    const { examenes, pacientes } = useLab();
    const [mostrarAnteriores, setMostrarAnteriores] = useState(false);
    const searchParams = useSearchParams();
    const estado = searchParams.get('estado');
    const filtroEstado = estado === 'pendiente' || estado === 'completo' ? estado : undefined;

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

    return (<div className="p-9 w-full min-h-screen">
        <div className="">
            <TopResumen solicitudes={true} />
            <ExamTable
                anterior={true}
                mostrarAnteriores={mostrarAnteriores}
                onToggleMostrarAnteriores={setMostrarAnteriores}
                filtroEstado={filtroEstado}
            />
        </div>
    </div>)
}
