import Navbar from "@/components/Nabvar";
import { LabProvider } from "@/context/LabContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <LabProvider>
            <div className='min-h-screen lg:flex'>
                <Navbar />
                <main className="min-w-0 flex-1 pt-16 lg:pt-0">
                    {children}
                </main>
            </div>
        </LabProvider>
    )
}
