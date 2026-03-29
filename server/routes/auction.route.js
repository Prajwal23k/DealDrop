import express from "express";
import { createAuction,getAllAuctions, getAuctionById } from "../controllers/auction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const auctionRouter = express.Router();

auctionRouter.post("/createAuction",authMiddleware,roleMiddleware(["seller"]),createAuction);

auctionRouter.get("/auctions", getAllAuctions);
auctionRouter.get("/auction/:id", getAuctionById);

export { auctionRouter };