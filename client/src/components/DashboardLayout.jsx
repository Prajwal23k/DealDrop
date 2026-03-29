import { Outlet } from "react-router-dom";
import { Sidebar } from "./SideBar";
import { Topbar } from "./Topbar";

function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <Topbar />

                <main className="p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export {DashboardLayout};