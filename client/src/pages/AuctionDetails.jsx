import { API } from "../api/axios";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";

function AuctionDetails()
{
    const {id} = useParams();
    const [currentPrice,setCurrentPrice] = useState(0);
    const [bidAmount,setBidAmount] = useState("");
    const [rules,setRules] = useState(null);

    useEffect(()=>
    {
        socket.emit("join-auction",id);

        socket.emit("get-bid-rules",id);

        socket.on("bid-update", (data) => {
            if (data.auctionId === id) {
                setCurrentPrice(data.currentPrice);
            }
        });

        socket.on("bid-rules", (data) => {
            if (data.auctionId === id) {
                setRules(data);
                setCurrentPrice(data.minBid - 100); 
            }
        });

        socket.on("bid-error", (msg) => {
            alert(msg);
        });

        return ()=>
        {
            socket.off("bid-update");
            socket.off("bid-rules");
        };
    },[id]);

    function handleBid()
    {
        if (!bidAmount) return alert("Enter bid amount");

        socket.emit("place-bid",{
            auctionId : id,
            bidAmount:Number(bidAmount)
        });
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
        </div>
    );
}


export {AuctionDetails};

