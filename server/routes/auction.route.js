import express from "express";
import { createAuction,getAllAuctions } from "../controllers/auction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const auctionRouter = express.Router();

auctionRouter.post(
    "/auction",
    authMiddleware,
    roleMiddleware(["seller"]),
    createAuction
);

auctionRouter.get("/auctions", getAllAuctions);

export { auctionRouter };