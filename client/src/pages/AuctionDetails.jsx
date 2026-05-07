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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Simple Top Nav */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Auctions</span>
                        </Link>
                        <div className="text-xl font-extrabold text-gray-900 tracking-tight">
                            <span className="text-indigo-600">Deal</span>Drop
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Column: Product Info */}
                    <div className="lg:w-2/3 space-y-8">
                        {/* Image Placeholder */}
                        <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-100 ring-1 ring-slate-200/50 shadow-2xl shadow-indigo-100/50 w-full min-h-[400px] sm:min-h-[500px]">
                            <div className="absolute top-6 left-6 z-10 flex items-center rounded-full bg-white/90 backdrop-blur-md px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-800 shadow-xl border border-white/60">
                                {auctionData?.status === "UPCOMING" && (
                                    <>
                                        <span className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></span>
                                        Upcoming
                                    </>
                                )}

                                {auctionData?.status === "LIVE" && (
                                    <>
                                        <span className="mr-3 h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
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
                                        <span className="mr-3 h-2 w-2 rounded-full bg-green-500"></span>
                                        Paid
                                    </>
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/20 to-transparent z-[5]"></div>
                            <img
                                src={auctionData?.image || "https://via.placeholder.com/500"}
                                alt="auction"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                            />
                        </div>

                        {/* Title and Description */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{auctionData.title}</h1>
                            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed text-lg">
                                <p>{auctionData.description || "No detailed description available for this item."}</p>
                            </div>

                            {/* Rules / Constraints */}
                            {rules && (
                                <div className="mt-8 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Bidding Rules
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                                            Minimum Bid: <span className="font-bold ml-1 text-gray-900">₹{rules.minBid}</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                                            Maximum Bid: <span className="font-bold ml-1 text-gray-900">₹{rules.maxBid}</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                                            Bid Multiple (Step): <span className="font-bold ml-1 text-gray-900">₹{rules.divisibleBy}</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Bidding Section */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24 space-y-6">

                            {/* Bidding Panel */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100 overflow-hidden">
                                <div className="bg-indigo-600 px-6 py-4">
                                    <h2 className="text-white font-bold text-lg">Current Price</h2>
                                    <div className="text-4xl font-black text-white mt-1">₹{currentPrice}</div>

                                    <div className="mt-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">

                                        {/* UPCOMING */}
                                        {auctionData?.status === "UPCOMING" && (
                                            <>
                                                <p className="text-xs uppercase tracking-widest text-indigo-100">
                                                    Starts In
                                                </p>

                                                <p className="mt-1 text-2xl font-black text-white tracking-wider">
                                                    {timeLeft}
                                                </p>
                                            </>
                                        )}

                                        {/* LIVE */}
                                        {auctionData?.status === "LIVE" && (
                                            <>
                                                <p className="text-xs uppercase tracking-widest text-indigo-100">
                                                    Ends In
                                                </p>

                                                <p className="mt-1 text-2xl font-black text-white tracking-wider">
                                                    {timeLeft}
                                                </p>
                                            </>
                                        )}

                                        {/* ENDED */}
                                        {auctionData?.status === "ENDED" && (
                                            <>
                                                <p className="text-xs uppercase tracking-widest text-indigo-100">
                                                    Auction Status
                                                </p>

                                                <p className="mt-1 text-xl font-black text-red-300">
                                                    Auction Ended
                                                </p>
                                            </>
                                        )}

                                        {/* PAID */}
                                        {auctionData?.status === "PAID" && (
                                            <>
                                                <p className="text-xs uppercase tracking-widest text-indigo-100">
                                                    Payment Status
                                                </p>

                                                <p className="mt-1 text-xl font-black text-green-300">
                                                    Payment Completed ✅
                                                </p>
                                            </>
                                        )}

                                    </div>
                                </div>

                                <div className="p-6">
                                    {auctionData?.status === "LIVE" && (
                                        <form onSubmit={handleBid} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Your Bid (₹)
                                                </label>

                                                <input
                                                    type="number"
                                                    placeholder={`Min: ₹${currentPrice + (rules?.divisibleBy || 1)}`}
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="block w-full pl-4 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl"
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl"
                                            >
                                                Place Bid Now
                                            </button>
                                        </form>
                                    )}

                                    {/* 🔥 ENDED STATE */}
                                    {auctionData?.status === "ENDED" && (
                                        <div className="mt-4 pt-4 border-t border-green-200/50">
                                            <p className="text-sm text-green-700 font-bold">
                                                Winning Bidder
                                            </p>

                                            <p className="text-lg font-bold">
                                                {auctionData?.winnerId?.name || "Anonymous"}
                                            </p>

                                            <p className="mt-2">
                                                Final Price: ₹{auctionData.currentPrice}
                                            </p>

                                            {/* PAY BUTTON */}
                                            {auctionData?.winnerId?._id === user?._id && (
                                                <button
                                                    onClick={handlePayment}
                                                    className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl"
                                                >
                                                    Pay Now 💳
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* 🔥 PAID STATE */}
                                    {auctionData?.status === "PAID" && (
                                        <div className="mt-4 pt-4 text-center">
                                            <p className="text-green-600 font-bold text-lg">
                                                Payment Completed ✅
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bid History */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Bid History</h3>
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full">{bids.length} bids</span>
                                </div>
                                <div className="p-0 max-h-[400px] overflow-y-auto">
                                    {bids.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="font-medium text-sm">No bids have been placed yet.</p>
                                            {auctionData.status !== "ENDED" && <p className="text-xs mt-1">Be the first to bid!</p>}
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-50">
                                            {bids.map((bid, index) => {
                                                const isWinner = bid.bidderId?._id === auctionData?.winnerId?._id && auctionData?.status === "ENDED";
                                                const isLatest = index === 0;

                                                return (
                                                    <li
                                                        key={bid._id || index}
                                                        className={`p-4 hover:bg-gray-50 transition-colors ${isWinner ? 'bg-green-50/50' : ''} ${isLatest && !isWinner ? 'bg-indigo-50/30' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${isWinner ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                    {(bid.bidderId?.name || "U")[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className={`font-bold ${isWinner ? 'text-green-800' : 'text-gray-900'} flex items-center`}>
                                                                        {bid.bidderId?.name || "Anonymous User"}
                                                                        {isWinner && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full px-1.5 uppercase tracking-wider">Winner</span>}
                                                                        {isLatest && !isWinner && auctionData.status !== "ENDED" && <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Highest</span>}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                                        {new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className={`font-black text-lg ${isWinner ? 'text-green-600' : 'text-gray-900'}`}>
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

