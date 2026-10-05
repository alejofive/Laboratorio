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

    return (<div className="mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 sm:px-6 lg:p-9">
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
        <Suspense fallback={<div className="min-h-dvh w-full px-4 py-6 sm:px-6 lg:p-9" />}>
            <SolicitudPageContent />
        </Suspense>
    );
}
