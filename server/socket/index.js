// import {io} from "../server.js";
import { socketAuth } from "./socketAuth.js";
import { Auction } from "../models/auction.js";
import {Bid} from "../models/bid.js";

function initSocket(io) {
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("User Connected : ", socket.user.userId);

        socket.on("join-auction", (auctionId) => {
            socket.join(auctionId);
            console.log(`User joined auction ${auctionId}`);
        });

        socket.on("place-bid",async({auctionId,bidAmount})=>{
            try{
                const userId = socket.user.userId;
                const role = socket.user.role;

                if(!["bidder","seller"].includes(role))
                {
                    return socket.emit("bid-error","You are not allowed to place bids");
                }

                const auction = await Auction.findById(auctionId);
                if(!auction)
                {
                    return socket.emit("bid-error","Auction not found");
                }

                if(auction.status !== "LIVE")
                {
                    return socket.emit("bid-error","Auction is not Live");
                }

                if(role === "seller" && auction.sellerId.toString() === userId)
                {
                    return socket.emit("bid-error","Seller cannot bid on own auction");
                }

                if(bidAmount <= auction.currentPrice)
                {
                    return socket.emit("bid-error",`Bid must be higher than ${auction.currentPrice}`);
                }

                const updatedAuction = await Auction.findOneAndUpdate(
                    {
                        _id : auctionId,
                        status : "LIVE",
                        currentPrice : { $lt :bidAmount}
                    },
                    {
                        $set:
                        {
                            currentPrice : bidAmount,
                            highestBidder : userId
                        },
                        $inc : {bidCount : 1}
                    },
                    {
                        returnDocument: "after" 
                    }   
                );

                if(!updatedAuction)
                {
                    return socket.emit("bid-error","Bid failed due to concurrent update");
                }
                await Bid.create(
                    {
                        auctionId : auctionId,
                        bidderId : userId,
                        amount : bidAmount
                    }
                );

                io.to(auctionId).emit("bid-update",
                    {
                        auctionId,
                        currentPrice:updatedAuction.currentPrice,
                        highestBidder:updatedAuction.highestBidder,
                        bidCount:updatedAuction.bidCount
                    }
                );
            }catch(e){
                console.error("bid-error",e.message);
                socket.emit("bid-error","Internal Server Error");
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected : ", socket.user.userId);
        });
    });
}

export {initSocket};