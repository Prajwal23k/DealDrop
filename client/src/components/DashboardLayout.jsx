import { Outlet } from "react-router-dom";
import { Sidebar } from "./SideBar";

function DashboardLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.18),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0b1120_55%,_#000000_100%)] text-slate-100 lg:flex-row">
            <Sidebar />

            <div className="relative flex min-h-screen flex-1 flex-col">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-10 top-16 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl" />
                    <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
                </div>

                
                    <main className="h-screen flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                        <div className="mx-auto min-h-full max-w-7xl rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:rounded-[2rem] md:p-6">
                            <Outlet />
                        </div>
                    </main>
                
            </div>
        </div>
    );

}

export { DashboardLayout };
