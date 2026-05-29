'use client';

import ExamTable from "@/components/ExamTable";
import TopResumen from "@/components/TopResumen";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";


function SolicitudPageContent() {
    const [mostrarAnteriores, setMostrarAnteriores] = useState(false);
    const [summary, setSummary] = useState({ totalSolicitudes: 0, totalParaImprimir: 0 });
    const searchParams = useSearchParams();
    const estado = searchParams.get('estado');
    const filtroEstado = estado === 'pendiente' || estado === 'completo' ? estado : undefined;

    return (<div className="p-9 w-full min-h-screen">
        <div className="">
            <TopResumen
                solicitudes={true}
                filtroEstado={filtroEstado}
                totalSolicitudes={summary.totalSolicitudes}
                totalParaImprimir={summary.totalParaImprimir}
            />
            <ExamTable
                anterior={true}
                mostrarAnteriores={mostrarAnteriores}
                onToggleMostrarAnteriores={setMostrarAnteriores}
                filtroEstado={filtroEstado}
                onSummaryChange={setSummary}
            />
        </div>
    </div>)
}

export default function SolicitudPage() {
    return (
        <Suspense fallback={<div className="p-9 w-full min-h-screen" />}>
            <SolicitudPageContent />
        </Suspense>
    );
}
