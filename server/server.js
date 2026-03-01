import express from "express";
import {connect} from "./config/db.js"
import { authRouter } from "./routes/auth.route.js";
import { auctionRouter } from "./routes/auction.route.js";
import { startAuctionStatusCron } from "./cron/auctionStatus.cron.js";
import env from "dotenv"

env.config();

const app = express();
const port = 5000;

app.use(express.json());

connect();
startAuctionStatusCron();


app.use("/api",authRouter);
app.use("/api",auctionRouter);
app.get("/",(req,res)=>
{
    res.send("Server running !!!");
});

app.listen(port,()=>
{
    console.log(`Server is running on http://localhost:${port}`);
});

