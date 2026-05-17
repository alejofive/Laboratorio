'use client';


import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useLab } from "@/context/LabContext";
import { Button } from "./ui/Button";

export default function TopResumen({ solicitudes }: { solicitudes?: boolean }) {
    const router = useRouter();
    const { pacientes, examenes } = useLab();
    const fechaActual = useMemo(() => {
        const formatter = new Intl.DateTimeFormat('es-ES', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
        });

        const [weekday, rest] = formatter.format(new Date()).split(', ');
        if (!weekday || !rest) return formatter.format(new Date());

        return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${rest}`;
    }, []);

    const { pendientes, completos } = useMemo(() => {
        const hoy = new Date();
        const fechaHoy = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
        let pendientesCount = 0;
        let completosCount = 0;

        pacientes
            .filter((paciente) => paciente.fecha === fechaHoy)
            .forEach((paciente) => {
            const examenesPaciente = examenes.filter((examen) => examen.pacienteId === paciente.id);

            if (examenesPaciente.length === 0) return;

            const todosCompletos = examenesPaciente.every(
                (examen) => examen.estado === 'completo' || examen.estado === 'enviado'
            );

            if (todosCompletos) {
                completosCount += 1;
            } else {
                pendientesCount += 1;
            }
            });

        return { pendientes: pendientesCount, completos: completosCount };
    }, [pacientes, examenes]);

    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            {solicitudes ? (
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Solicitudes</h1>
                </div>
            ) : (
                <div>
                    <h1 className="text-2xl font-semibold text-primary">Resumen del día</h1>
                    <p className="text-secondary text-lg font-normal">{fechaActual}</p>

                </div>
            )}
            <div className="flex items-center gap-3">
                <Button onClick={() => router.push('/dashboard/solicitudes?estado=pendiente')} variant="outline" className="cursor-pointer"><strong>{pendientes}</strong> Solicitudes</Button>
                <Button onClick={() => router.push('/dashboard/solicitudes?estado=completo')} variant="outline-green" className="cursor-pointer"><strong>{completos}</strong> para Imprimir</Button>
            </div>
        </div>
    );
}
