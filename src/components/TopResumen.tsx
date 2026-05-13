'use client';

import { Button } from "./ui/Button";

export default function TopResumen() {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold text-primary">Resumen del día</h1>
                <p className="text-secondary text-lg font-normal">Martes, 05 mayo</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" >4 Solicitudes</Button>
                <Button variant="outline-green" >1 para Imprimir</Button>
            </div>
        </div>
    );
}
