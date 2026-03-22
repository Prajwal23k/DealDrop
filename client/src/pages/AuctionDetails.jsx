import { API } from "../api/axios";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";

function AuctionDetails() {
    const { id } = useParams();

    const [currentPrice, setCurrentPrice] = useState(0);
    const [bidAmount, setBidAmount] = useState("");
    const [rules, setRules] = useState(null);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        fetchBids();

        socket.emit("join-auction", id);
        socket.emit("get-bid-rules", id);

        socket.off("bid-update").on("bid-update", (data) => {
            if (data.auctionId === id) {
                setCurrentPrice(data.currentPrice);

                setBids((prev) => [
                    {
                        amount: data.currentPrice,
                        bidderId: { name: "Someone" },
                        createdAt: new Date()
                    },
                    ...prev
                ]);
            }
        });

        socket.off("bid-rules").on("bid-rules", (data) => {
            if (data.auctionId === id) {
                setRules(data);
            }
        });

        socket.off("bid-error").on("bid-error", (msg) => {
            alert(msg);
        });

        return () => {
            socket.off("bid-update");
            socket.off("bid-rules");
            socket.off("bid-error");
        };
    }, [id]);

    function handleBid() {
        if (!bidAmount) return alert("Enter bid amount");

        socket.emit("place-bid", {
            auctionId: id,
            bidAmount: Number(bidAmount)
        });
    }

    async function fetchBids() {
        try {
            const res = await API.get(`/auction/${id}/bids`);
            setBids(res.data.bids);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Auction Details</h2>

            <h3>Current Price: ₹{currentPrice}</h3>

            {rules && (
                <p>
                    Bid between ₹{rules.minBid} - ₹{rules.maxBid} (step {rules.divisibleBy})
                </p>
            )}

            <input
                type="number"
                placeholder="Enter bid"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
            />

            <br /><br />

            <button onClick={handleBid}>Place Bid</button>

            <h3>Bid History</h3>

            {bids.length === 0 ? (
                <p>No bids yet</p>
            ) : (
                <ul>
                    {bids.map((bid, index) => (
                        <li key={bid._id || index}>
                            ₹{bid.amount} by {bid.bidderId?.name || "User"} at{" "}
                            {new Date(bid.createdAt).toLocaleTimeString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AuctionDetails;

export {AuctionDetails};

