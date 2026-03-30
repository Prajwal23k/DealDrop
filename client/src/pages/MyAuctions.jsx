import { useEffect, useState } from "react";
import {API} from "../api/axios";
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
        <div>
            <h2 className="text-2xl font-bold mb-6">My Auctions</h2>

            {auctions.length === 0 ? (
                <p>No auctions created yet</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction) => (
                        <div
                            key={auction._id}
                            onClick={() =>
                                navigate(`/auction/${auction._id}`)
                            }
                            className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
                        >
                            <h3 className="font-bold text-lg mb-2">
                                {auction.title}
                            </h3>

                            <p className="text-sm text-gray-500 mb-3">
                                {auction.description}
                            </p>

                            <p>
                                💰 Price: ₹{auction.currentPrice}
                            </p>

                            <p>
                                📊 Bids: {auction.bidCount}
                            </p>

                            <p
                                className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                                    auction.status === "LIVE"
                                        ? "bg-green-100 text-green-600"
                                        : auction.status === "UPCOMING"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {auction.status}
                            </p>

                            {/* Winner */}
                            {auction.status === "ENDED" && (
                                <p className="mt-2 text-sm text-indigo-600">
                                    🏆 Winner:{" "}
                                    {auction.winnerId?.name || "No bids"}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export {MyAuctions};