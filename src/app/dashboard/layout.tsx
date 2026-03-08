import Navbar from "@/components/Nabvar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex'>
            <div className='w-full flex min-h-screen'>
                <Navbar />
                <div className="w-full items-center justify-center">
                    {children}
                </div>
            </div>
        </div>
    )
}