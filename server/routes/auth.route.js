import {register,login,requestSeller} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import express from "express";


const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.get("/seller-requests", authMiddleware, roleMiddleware(["admin"]), getSellerRequests);
authRouter.patch("/approve-seller/:userId", authMiddleware, roleMiddleware(["admin"]), approveSeller);


export {authRouter};
