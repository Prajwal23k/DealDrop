import { useEffect, useState } from "react";
import {API} from "../api/axios";

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
        <div>
            <h2 className="text-2xl font-bold mb-6">My Bids</h2>

            {bids.length === 0 ? (
                <p>No bids placed yet</p>
            ) : (
                <div className="space-y-4">
                    {bids.map((bid) => {
                        const auction = bid.auctionId;
                        const status = getStatus(bid);

                        return (
                            <div
                                key={bid._id}
                                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-bold">
                                        {auction?.title}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Your Bid: ₹{bid.amount}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Current: ₹{auction?.currentPrice}
                                    </p>
                                </div>

                                <div>
                                    <span
                                        className={`px-3 py-1 rounded text-sm font-semibold ${
                                            status === "WINNING"
                                                ? "bg-green-100 text-green-600"
                                                : status === "OUTBID"
                                                ? "bg-red-100 text-red-600"
                                                : status === "WON"
                                                ? "bg-blue-100 text-blue-600"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        {status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export {MyBids};