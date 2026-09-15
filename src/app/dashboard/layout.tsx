import Navbar from "@/components/Nabvar";
import { LabProvider } from "@/context/LabContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <LabProvider>
            <div className='flex'>
                <div className='w-full flex min-h-screen'>
                    <Navbar />
                    <div className="w-full items-center justify-center">
                        {children}
                    </div>
                </div>
            </div>
        </LabProvider>
    )
}
