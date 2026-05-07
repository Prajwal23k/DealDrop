import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Logo from "../assets/Logo_dark_theme.png";

function Sidebar() {
    const { user } = useContext(AuthContext);

    const linkClass = ({ isActive }) =>
        `block px-4 py-2 rounded-lg font-medium transition ${isActive
            ? "bg-indigo-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <aside className="sticky top-0 h-screen w-full shrink-0 overflow-y-auto border-b border-white/10 bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white shadow-2xl shadow-black/50 lg:w-72 lg:border-b-0 lg:border-r">
            <div className="flex h-full flex-col p-4 sm:p-5">
                
                    <div className="flex flex-col items-center justify-center">
                        <img
                        src={Logo}
                        alt="DealDrop"
                        className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10 shadow-[0_0_25px_rgba(56,189,248,0.18)]"
                    />
                    </div>

                <nav className="mt-6 flex-1 space-y-2">
                    {[
                        { to: "/dashboard", end: true, label: "Dashboard", hint: "Overview" },
                        { to: "/dashboard/auctions", label: "Browse Auctions", hint: "Explore" },
                        { to: "/dashboard/bids", label: "My Bids", hint: "Track" },
                        { to: "/dashboard/profile", label: "Profile", hint: "Manage" },
                    ].map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `group flex items-center justify-between rounded-2xl border px-4 py-3 font-medium transition ${isActive
                                    ? "border-sky-400/40 bg-gradient-to-r from-sky-500/90 to-indigo-500/90 text-white shadow-[0_0_25px_rgba(56,189,248,0.35)]"
                                    : "border-transparent bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
                                }`
                            }
                        >
                            <span>{item.label}</span>
                            <span className="text-xs opacity-70 transition group-hover:translate-x-1">{item.hint}</span>
                        </NavLink>
                    ))}

                    {user?.role === "seller" && (
                        <>
                            <div className="my-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/10" />
                                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Seller</p>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>
                            {[
                                { to: "/dashboard/create", label: "Create Auction", hint: "Launch" },
                                { to: "/dashboard/my-auctions", label: "My Auctions", hint: "Review" },
                            ].map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `group flex items-center justify-between rounded-2xl border px-4 py-3 font-medium transition ${isActive
                                            ? "border-emerald-400/40 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                                            : "border-transparent bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
                                        }`
                                    }
                                >
                                    <span>{item.label}</span>
                                    <span className="text-xs opacity-70 transition group-hover:translate-x-1">{item.hint}</span>
                                </NavLink>
                            ))}
                        </>
                    )}

                    {user?.role === "admin" && (
                        <>
                            <div className="my-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/10" />
                                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Admin</p>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>
                            <NavLink
                                to="/dashboard/requests"
                                className={({ isActive }) =>
                                    `group flex items-center justify-between rounded-2xl border px-4 py-3 font-medium transition ${isActive
                                        ? "border-amber-400/40 bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white shadow-[0_0_25px_rgba(245,158,11,0.35)]"
                                        : "border-transparent bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
                                    }`
                                }
                            >
                                <span>Seller Requests</span>
                                <span className="text-xs opacity-70 transition group-hover:translate-x-1">Review</span>
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </aside>
    );

}

export { Sidebar };
