import {Auction} from "../models/auction.js";

async function createAuction(req,res)
{
    try{
        const title = req.body.title;
        const description = req.body.description;
        const startingPrice = req.body.startingPrice;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;

        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        if(!title || !startingPrice || !startTime || !endTime)
        {
            return res.status(400).json({message : "All fields are required"});
        }

        if(start <= now)
        {
            return res.status(400).json({message : "Enter Valid Start Date"});
        }

        if(end <= start)
        {
            return res.status(400).json({message : "Enter Valid End Date"});
        }

        const auction = await Auction.create(
            {
                title : title,
                description : description,
                startingPrice : startingPrice,
                startTime : startTime,
                endTime : endTime,
                sellerId : req.user.userId
            }
        );

        return res.status(201).json({
            message : "Auction Created Successfully",
            auctionId : auction._id,
            status : auction.status
        });
    }catch(e)
    {
        console.error("Create auction failed : ",e.message);
        return res.status(500).json({messsage : "Internal Server Error"});
    }
}

export {createAuction};