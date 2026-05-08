import { API } from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/authContext.jsx";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { socket } from "../socket/socket";

function AuctionDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [bidAmount, setBidAmount] = useState("");
    const [rules, setRules] = useState(null);
    const [bids, setBids] = useState([]);
    const [auctionData, setAuctionData] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [paying, setPaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        fetchAuction();
        fetchBids();

        socket.connect();

        socket.on("connect", () => {
            setIsSocketConnected(true);
            socket.emit("join-auction", id);
            socket.emit("get-bid-rules", id);
        });

        socket.off("bid-update").on("bid-update", (data) => {
            if (data.auctionId === id) {
                setCurrentPrice(data.currentPrice);

                const newBid = {
                    _id: Date.now().toString(),
                    amount: data.currentPrice,
                    bidderId: { name: "Someone (Live)" },
                    createdAt: new Date().toISOString()
                };

                setBids((prev) => {
                    // 🔥 prevent duplicate same price entries
                    if (prev.some(b => b.amount === data.currentPrice)) {
                        return prev;
                    }
                    return [newBid, ...prev];
                });
            }
        });

        socket.off("bid-rules").on("bid-rules", (data) => {
            if (data.auctionId === id) {
                setRules(data);
            }
        });

        socket.off("bid-error").on("bid-error", (msg) => {
            alert(msg); // fallback to alert or custom toast
        });

        return () => {
            socket.off("bid-update");
            socket.off("bid-rules");
            socket.off("bid-error");
            socket.off("connect");
            socket.disconnect();
        };
    }, [id]);

    useEffect(() => {

        if (!auctionData) return;

        const interval = setInterval(() => {

            const now = new Date();

            let targetTime;

            // 🔥 UPCOMING → countdown to start
            if (auctionData.status === "UPCOMING") {
                targetTime = new Date(auctionData.startTime);
            }

            // 🔥 LIVE → countdown to end
            else if (auctionData.status === "LIVE") {
                targetTime = new Date(auctionData.endTime);
            }

            else {
                setTimeLeft("");
                return;
            }

            const diff = targetTime - now;

            if (diff <= 0) {
                setTimeLeft("00:00:00");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds
                        .toString()
                        .padStart(2, "0")}`
            );

        }, 1000);

        return () => clearInterval(interval);

    }, [auctionData]);

    function handleBid(e) {
        e.preventDefault();
        if (!bidAmount || Number(bidAmount) <= 0) {
            return alert("Invalid bid");
        }

        socket.emit("place-bid", {
            auctionId: id,
            bidAmount: Number(bidAmount)
        });
        setBidAmount("");
    }

    async function fetchBids() {
        try {
            const res = await API.get(`/auction/${id}/bids`);
            setBids(res.data.bids || []);
        } catch (e) {
            console.error("Failed to fetch bids", e);
        }
    }

    async function fetchAuction() {
        try {
            const res = await API.get(`/auction/${id}`);
            setAuctionData(res.data);
            setCurrentPrice(res.data.currentPrice);
        } catch (e) {
            console.error("Failed to fetch auction", e);
        }
    }

    async function handlePayment() {
        try {
            setPaying(true);
            console.log("PAY CLICKED");

            const res = await API.post("/create-order", {
                auctionId: id
            });

            console.log("ORDER:", res.data);

            const options = {
                key: "rzp_test_Sd8GYtb4F1KUFZ", // 🔥 replace
                amount: res.data.amount,
                currency: "INR",
                name: "DealDrop",
                description: "Auction Payment",
                order_id: res.data.id,

                handler: async function (response) {
                    await API.post("/verify-payment", {
                        ...response,
                        auctionId: id
                    });


                    await fetchAuction();

                    setPaying(false);
                    alert("Payment Successful 🎉");
                }
            };

            if (!window.Razorpay) {
                alert("Razorpay not loaded ❌");
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (e) {
            console.error("PAY ERROR:", e);
            alert("Payment failed");
        }
    }
    
        if (!auctionData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-sky-400/30 border-t-sky-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 font-sans text-slate-100 selection:bg-sky-500/30 selection:text-sky-100 relative overflow-hidden">
            {/* Decorative background glows */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-sky-500/15 blur-3xl"></div>
            <div className="pointer-events-none absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-indigo-500/15 blur-3xl"></div>
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/10 blur-3xl"></div>

            {/* Top Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/"
                            className="group flex items-center text-slate-400 hover:text-sky-300 transition-colors"
                        >
                            <span className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] group-hover:border-sky-400/40 group-hover:bg-sky-400/10 transition">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </span>
                            <span className="font-medium text-sm">Back to Auctions</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {/* Left Column */}
                    <div className="lg:w-2/3 space-y-8">
                        {/* Image */}
                        <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] w-full min-h-[360px] sm:min-h-[480px]">
                            <div className="absolute top-5 left-5 z-10 flex items-center rounded-full border border-white/15 bg-slate-950/70 backdrop-blur-md px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-100 shadow-xl">
                                {auctionData?.status === "UPCOMING" && (
                                    <>
                                        <span className="mr-3 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]"></span>
                                        Upcoming
                                    </>
                                )}
                                {auctionData?.status === "LIVE" && (
                                    <>
                                        <span className="mr-3 h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.8)]"></span>
                                        Live Auction
                                    </>
                                )}
                                {auctionData?.status === "ENDED" && (
                                    <>
                                        <span className="mr-3 h-2 w-2 rounded-full bg-slate-400"></span>
                                        Ended
                                    </>
                                )}
                                {auctionData?.status === "PAID" && (
                                    <>
                                        <span className="mr-3 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]"></span>
                                        Paid
                                    </>
                                )}
                            </div>

                            {/* Socket indicator */}
                            

                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-[5]"></div>
                            <img
                                src={auctionData?.image || "https://via.placeholder.com/500"}
                                alt={auctionData?.title || "auction"}
                                className="absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-[1.5s] ease-out group-hover:scale-[1.04]"
                            />
                        </div>

                        {/* Title and Description */}
                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                                {auctionData.title}
                            </h1>
                            <p className="text-slate-300/90 leading-relaxed text-base sm:text-lg">
                                {auctionData.description || "No detailed description available for this item."}
                            </p>

                            {rules && (
                                <div className="mt-8 rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent p-6">
                                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                        Bidding Rules
                                    </h3>
                                    <ul className="grid sm:grid-cols-3 gap-3 text-sm">
                                        <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400">Min Bid</p>
                                            <p className="mt-1 font-bold text-white text-lg">₹{rules.minBid}</p>
                                        </li>
                                        <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400">Max Bid</p>
                                            <p className="mt-1 font-bold text-white text-lg">₹{rules.maxBid}</p>
                                        </li>
                                        <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400">Step</p>
                                            <p className="mt-1 font-bold text-white text-lg">₹{rules.divisibleBy}</p>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:w-1/3">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Bidding Panel */}
                            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.4)]">
                                <div className="relative bg-gradient-to-br from-sky-500/20 via-indigo-500/15 to-transparent border-b border-white/10 px-6 py-5 overflow-hidden">
                                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl"></div>
                                    <div className="relative">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-200">Current Price</p>
                                        <div className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">
                                            ₹{currentPrice}
                                        </div>

                                        <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur">
                                            {auctionData?.status === "UPCOMING" && (
                                                <>
                                                    <p className="text-[10px] uppercase tracking-widest text-amber-200/80">Starts In</p>
                                                    <p className="mt-1 text-2xl font-black text-amber-300 tracking-wider tabular-nums">{timeLeft}</p>
                                                </>
                                            )}
                                            {auctionData?.status === "LIVE" && (
                                                <>
                                                    <p className="text-[10px] uppercase tracking-widest text-rose-200/80">Ends In</p>
                                                    <p className="mt-1 text-2xl font-black text-rose-300 tracking-wider tabular-nums">{timeLeft}</p>
                                                </>
                                            )}
                                            {auctionData?.status === "ENDED" && (
                                                <>
                                                    <p className="text-[10px] uppercase tracking-widest text-slate-400">Auction Status</p>
                                                    <p className="mt-1 text-xl font-black text-rose-300">Auction Ended</p>
                                                </>
                                            )}
                                            {auctionData?.status === "PAID" && (
                                                <>
                                                    <p className="text-[10px] uppercase tracking-widest text-emerald-200/80">Payment Status</p>
                                                    <p className="mt-1 text-xl font-black text-emerald-300">Completed ✅</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {auctionData?.status === "LIVE" && (
                                        <form onSubmit={handleBid} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">
                                                    Your Bid (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder={`Min: ₹${currentPrice + (rules?.divisibleBy || 1)}`}
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="block w-full px-4 py-4 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/40 transition"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold py-4 shadow-[0_10px_40px_rgba(56,189,248,0.35)] hover:shadow-[0_15px_50px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                                            >
                                                <span className="relative z-10">Place Bid Now</span>
                                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                            </button>
                                        </form>
                                    )}

                                    {auctionData?.status === "UPCOMING" && (
                                        <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-center">
                                            <p className="text-sm text-amber-200 font-medium">Bidding hasn't started yet. Come back when it goes live!</p>
                                        </div>
                                    )}

                                    {auctionData?.status === "ENDED" && (
                                        <div className="space-y-4">
                                            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                                                <p className="text-[10px] uppercase tracking-widest text-emerald-200">Winning Bidder</p>
                                                <p className="mt-1 text-lg font-bold text-white">
                                                    {auctionData?.winnerId?.name || "Anonymous"}
                                                </p>
                                                <p className="mt-2 text-sm text-emerald-200/80">
                                                    Final Price: <span className="text-white font-bold">₹{auctionData.currentPrice}</span>
                                                </p>
                                            </div>

                                            {auctionData?.winnerId &&
                                                auctionData?.bidCount > 0 &&
                                                auctionData?.winnerId?._id === user?._id && (
                                                    <button
                                                        onClick={handlePayment}
                                                        disabled={paying}
                                                        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 shadow-[0_10px_40px_rgba(16,185,129,0.35)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                                    >
                                                        {paying ? "Processing..." : "Pay Now 💳"}
                                                    </button>
                                                )}
                                        </div>
                                    )}

                                    {auctionData?.status === "PAID" && (
                                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-center">
                                            <p className="text-emerald-300 font-bold text-lg">Payment Completed ✅</p>
                                            <p className="text-xs text-emerald-200/70 mt-1">Thank you for your purchase!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bid History */}
                            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                                <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                                    <h3 className="text-base font-bold text-white">Bid History</h3>
                                    <span className="rounded-full border border-sky-400/30 bg-sky-500/15 text-sky-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                                        {bids.length} bids
                                    </span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {bids.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400">
                                            <svg className="w-10 h-10 mx-auto text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-medium text-sm text-slate-300">No bids placed yet.</p>
                                            {auctionData.status !== "ENDED" && (
                                                <p className="text-xs mt-1 text-slate-500">Be the first to bid!</p>
                                            )}
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-white/5">
                                            {bids.map((bid, index) => {
                                                const isWinner =
                                                    bid.bidderId?._id === auctionData?.winnerId?._id &&
                                                    auctionData?.status === "ENDED";
                                                const isLatest = index === 0;

                                                return (
                                                    <li
                                                        key={bid._id || index}
                                                        className={`p-4 transition-colors ${
                                                            isWinner
                                                                ? "bg-emerald-500/10"
                                                                : isLatest
                                                                ? "bg-sky-500/10"
                                                                : "hover:bg-white/[0.03]"
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-center gap-3">
                                                            <div className="flex items-center min-w-0">
                                                                <div
                                                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0 ${
                                                                        isWinner
                                                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                                                            : isLatest
                                                                            ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                                                                            : "bg-white/[0.06] text-slate-300 border border-white/10"
                                                                    }`}
                                                                >
                                                                    {(bid.bidderId?.name || "U")[0].toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-bold text-white text-sm flex items-center flex-wrap gap-2 truncate">
                                                                        <span className="truncate">{bid.bidderId?.name || "Anonymous"}</span>
                                                                        {isWinner && (
                                                                            <span className="text-[9px] bg-emerald-500/90 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                                                Winner
                                                                            </span>
                                                                        )}
                                                                        {isLatest && !isWinner && auctionData.status !== "ENDED" && (
                                                                            <span className="text-[9px] bg-sky-500/90 text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                                                                Highest
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                    <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                                                                        {new Date(bid.createdAt).toLocaleTimeString([], {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            second: "2-digit",
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`font-black text-lg tabular-nums shrink-0 ${
                                                                    isWinner
                                                                        ? "text-emerald-300"
                                                                        : isLatest
                                                                        ? "text-sky-300"
                                                                        : "text-white"
                                                                }`}
                                                            >
                                                                ₹{bid.amount}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );


    
}

export { AuctionDetails };

