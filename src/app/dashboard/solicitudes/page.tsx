'use client';

import ExamTable from "@/components/ExamTable";
import StatsCards from "@/components/StatsCards";
import { useLab } from "@/context/LabContext";
import { useMemo } from "react";


export default function SolicitudPage() {

    const { getStats } = useLab();
    const stats = useMemo(() => getStats(), [getStats]);

    return (<div className="px-32 py-5 w-full min-h-screen">
        <div className="">
            <StatsCards stats={stats} />

            <ExamTable anterior={true} />
        </div>
    </div>)
}
