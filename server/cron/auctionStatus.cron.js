import cron from "node-cron";
import {Auction} from "../models/auction.js";

function startAuctionStatusCron()
{
    cron.schedule("* * * * *",async()=>
    {
        try{
            const now = new Date();

            await Auction.updateMany(
                {
                    status : "UPCOMING",
                    startTime : {$lte : now},
                    isBlocked : false
                },
                {
                    $set : {status : "LIVE"}
                }
            );

            const endingAuctions = await Auction.find(
                {
                    status : "LIVE",
                    endTime : {$lte : now},
                    isBlocked : false
                }
            );

            for(const auction of endingAuctions)
            {
                await Auction.findByIdAndUpdate(auction._id,
                    {
                        status : "ENDED",
                        winnerId : auction.highestBidder || null
                    }
                );
            }

        }catch(e)
        {
            console.error("Auction cron error : ",e.message);
        }
    })
}

export {startAuctionStatusCron};