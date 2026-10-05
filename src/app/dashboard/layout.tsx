import Navbar from "@/components/Nabvar";
import { LabProvider } from "@/context/LabContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <LabProvider>
            <div className='min-h-screen lg:flex'>
                <Navbar />
                <main id="main-content" className="min-w-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
                    {children}
                </main>
            </div>
        </LabProvider>
    )
}
