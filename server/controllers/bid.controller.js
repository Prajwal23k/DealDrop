import { Bid } from "../models/bid.js";

async function getBidHistory(req,res)
{
    try{
        const auctionId = req.params.auctionId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const skip = (page-1) * limit;

        const bids = await Bid.find({auctionId})
            .populate("bidderId", "name role _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBids = await Bid.countDocuments({auctionId});
        return res.status(200).json({
            totalBids,
            page,
            limit,
            bids
        });
    }catch (error) {
        console.error("Fetch bid history error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export {getBidHistory};