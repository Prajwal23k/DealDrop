import { useEffect, useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";

function MyAuctions() {
    const [auctions, setAuctions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();
    }, []);

    async function fetchAuctions() {
        try {
            const res = await API.get("/my-auctions");
            setAuctions(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <section className="space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-950 p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                            Seller Center
                        </p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                            My Auctions
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-300">
                            Manage your created listings, track active bids, and review ended auctions.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur">
                        <p className="text-xs uppercase tracking-wider text-slate-400">Total Listings</p>
                        <p className="text-2xl font-black text-white">{auctions.length}</p>
                    </div>
                </div>
            </div>

            {auctions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center backdrop-blur">
                    <p className="text-lg font-semibold text-white">No auctions created yet</p>
                    <p className="mt-2 text-sm text-slate-400">
                        You haven't listed any items. Create a new auction to start selling!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {auctions.map((auction) => (
                        <div
                            key={auction._id}
                            onClick={() => navigate(`/auction/${auction._id}`)}
                            className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-400/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]"
                        >
                            <div className="relative">
                                <img
                                    src={auction.image}
                                    alt={auction.title}
                                    className="w-full h-48 object-cover rounded-2xl mb-4 transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${auction.status === "LIVE"
                                                ? "bg-emerald-500/90 text-white"
                                                : auction.status === "UPCOMING"
                                                    ? "bg-amber-500/90 text-white"
                                                    : "bg-slate-700/90 text-slate-200"
                                            }`}
                                    >
                                        {auction.status}
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-bold text-xl mb-2 text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                                {auction.title}
                            </h3>

                            <p className="text-sm text-slate-400 mb-5 line-clamp-2 leading-relaxed">
                                {auction.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-4 rounded-2xl border border-white/5 bg-slate-900/50 p-3">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Price</p>
                                    <p className="font-black text-white mt-0.5">₹{auction.currentPrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Bids</p>
                                    <p className="font-black text-sky-400 mt-0.5">{auction.bidCount || 0}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                                {auction.status === "ENDED" ? (
                                    <p className="text-sm font-semibold text-emerald-400 flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Winner: {auction.winnerId?.name || "None"}
                                    </p>
                                ) : (
                                    <span className="text-sm font-semibold text-sky-400 flex items-center transition group-hover:translate-x-1">
                                        Manage Auction
                                        <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );

}

export { MyAuctions };