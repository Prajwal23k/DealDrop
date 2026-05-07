import { useEffect, useState } from "react";
import { API } from "../api/axios";

function MyBids() {
    const [bids, setBids] = useState([]);

    useEffect(() => {
        fetchBids();
    }, []);

    async function fetchBids() {
        try {
            const res = await API.get("/my-bids");
            setBids(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    function getStatus(bid) {
        const auction = bid.auctionId;

        if (!auction) return "Unknown";

        if (auction.status === "ENDED") {
            if (auction.winnerId === bid.bidderId) return "WON";
            return "LOST";
        }

        if (auction.highestBidder === bid.bidderId) return "WINNING";

        return "OUTBID";
    }

    return (
        <section className="space-y-6 sm:space-y-8">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-5 shadow-lg backdrop-blur sm:rounded-[2rem] sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-400 sm:text-xs">
                    Bid Center
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">My Bids</h2>
                <p className="mt-2 text-sm text-slate-400">
                    Follow your bidding activity and quickly spot whether you are ahead or need to respond.
                </p>
            </div>

            {bids.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center sm:rounded-[2rem]">
                    <p className="text-lg font-semibold text-white">No bids placed yet</p>
                    <p className="mt-2 text-sm text-slate-400">
                        Once you place a bid, your auction activity will show up here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bids.map((bid) => {
                        const auction = bid.auctionId;
                        const status = getStatus(bid);
                        const statusStyle =
                            status === "WINNING"
                                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30"
                                : status === "OUTBID"
                                    ? "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30"
                                    : status === "WON"
                                        ? "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30"
                                        : status === "LOST"
                                            ? "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/30"
                                            : "bg-white/5 text-slate-300 ring-1 ring-white/10";

                        return (
                            <div
                                key={bid._id}
                                className="group flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-[0_0_40px_rgba(56,189,248,0.15)] md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                                            {auction?.title || "Auction"}
                                        </h3>
                                        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 ring-1 ring-white/10">
                                            Active Bid
                                        </span>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                Your Bid
                                            </p>
                                            <p className="mt-2 text-xl font-black text-white sm:text-2xl">
                                                Rs. {bid.amount}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300">
                                                Current Price
                                            </p>
                                            <p className="mt-2 text-xl font-black text-white sm:text-2xl">
                                                Rs. {auction?.currentPrice ?? "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end md:justify-center">
                                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyle}`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );

}

export { MyBids };
