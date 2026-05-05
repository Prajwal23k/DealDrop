import axios from 'axios';
import { Auction } from "../models/auction.js";

async function getPriceRecommendation(title,category)
{
    const auctions = await Auction.find({
        category,
        title: { $regex: title, $options: "i" },
        status : "ENDED"
    });

    const prices = auctions.map(a => a.currentPrice);

    const response = await axios.post("http://localhost:8000/recommend-price",
        {
            title,
            prices
        }
    );

    console.log("Python response:", response.data);

    return response.data;
}

export {getPriceRecommendation};