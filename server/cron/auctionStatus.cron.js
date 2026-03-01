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
            )

            await Auction.updateMany(
                {
                    status : "LIVE",
                    endTime : {$lte : now},
                    isBlocked : false
                },
                {
                    $set : {status : "ENDED"}
                }
            )
        }catch(e)
        {
            console.error("Auction cron error : ",e.message);
        }
    })
}

export {startAuctionStatusCron};