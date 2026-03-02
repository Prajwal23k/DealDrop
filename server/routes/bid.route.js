import { getBidHistory } from "../controllers/bid.controller.js";
import express from "express";

const bidRouter = express.Router();

bidRouter.get("/auction/:auctionId/bids",getBidHistory);

export {bidRouter};