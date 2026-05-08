import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";

function DashboardAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [filter, setFilter] = useState("ALL");

    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();
    }, []);

    async function fetchAuctions() {
        try {
            const res = await API.get("/auctions");
            setAuctions(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    // ðŸ” Filter logic
    const filteredAuctions =
        filter === "ALL" ? auctions : auctions.filter((a) => a.status === filter);

    return (
        <section className="space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-lg backdrop-blur-xl sm:rounded-[2rem] sm:p-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-400 sm:text-xs">
                        Marketplace
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Auctions</h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-400">
                        Explore live, upcoming, and completed listings through a cleaner bidding dashboard.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 ">
                    {["ALL", "LIVE", "UPCOMING", "ENDED", "PAID"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${filter === f
                                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.4)]"
                                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-sky-400/40 hover:bg-white/[0.08] hover:text-sky-300 cursor-pointer"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {filteredAuctions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center sm:rounded-[2rem]">
                    <p className="text-lg font-semibold text-white">No auctions found</p>
                    <p className="mt-2 text-sm text-slate-400">
                        Try another filter or check back when new auctions go live.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredAuctions.map((auction) => (
                        <article
                            key={auction._id}
                            onClick={() => navigate(`/auction/${auction._id}`)}
                            className="group flex h-full flex-col cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-lg backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-[0_0_40px_rgba(56,189,248,0.18)] sm:p-5"
                        >
                            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-800">
                                <img
                                    src={auction.image}
                                    alt={auction.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                                <span
                                    className={`absolute right-3 top-3 z-10 rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow backdrop-blur ${auction.status === "LIVE"
                                            ? "bg-emerald-500/90"
                                            : auction.status === "UPCOMING"
                                                ? "bg-amber-500/90"
                                                : "bg-slate-700/90"
                                        }`}
                                >
                                    {auction.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold tracking-tight text-white transition group-hover:text-sky-300 sm:text-xl">
                                {auction.title}
                            </h3>

                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{auction.description}</p>

                            <div className="mt-auto pt-5 flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                                        Current Bid
                                    </p>
                                    <span className="mt-1 block text-xl font-black text-white sm:text-2xl">
                                        Rs. {auction.currentPrice}
                                    </span>
                                </div>

                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );

}

export { DashboardAuctions };
