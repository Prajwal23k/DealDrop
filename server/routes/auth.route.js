import { register, login, requestSeller, getSellerRequests, approveSeller } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {roleMiddleware} from "../middlewares/role.middleware.js"
import express from "express";


const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/request-seller", authMiddleware, requestSeller);
authRouter.get("/seller-requests", authMiddleware, roleMiddleware(["admin"]), getSellerRequests);
authRouter.patch("/approve-seller/:userId", authMiddleware, roleMiddleware(["admin"]), approveSeller);


export { authRouter };
