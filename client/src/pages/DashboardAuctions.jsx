import { useEffect, useState } from "react";
import {API} from "../api/axios";
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

    // 🔍 Filter logic
    const filteredAuctions =
        filter === "ALL" ? auctions : auctions.filter((a) => a.status === filter);

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Auctions</h2>

                {/* Filters */}
                <div className="flex gap-2">
                    {["ALL", "LIVE", "UPCOMING", "ENDED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded ${
                                filter === f
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredAuctions.length === 0 ? (
                <p>No auctions found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAuctions.map((auction) => (
                        <div
                            key={auction._id}
                            onClick={() =>
                                navigate(`/auction/${auction._id}`)
                            }
                            className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition p-4"
                        >
                            <h3 className="font-bold text-lg mb-2">
                                {auction.title}
                            </h3>

                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {auction.description}
                            </p>

                            <div className="flex justify-between items-center">
                                <span className="text-indigo-600 font-bold">
                                    ₹{auction.currentPrice}
                                </span>

                                <span className={`text-xs px-2 py-1 rounded ${
                                    auction.status === "LIVE"
                                        ? "bg-green-100 text-green-600"
                                        : auction.status === "UPCOMING"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-gray-200 text-gray-600"
                                }`}>
                                    {auction.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export {DashboardAuctions};