import {io} from "../server.js";
import {socketAuth} from "./socketAuth.js";

io.use(socketAuth);

io.on("connection",(socket)=>{
    console.log("User Connected : ",socket.user.UserId);

    socket.on("join-auction",(auctionId)=>{
        socket.join(auctionId);
        console.log(`User joined auction ${auctionId}`);
    });

    socket.on("disconnect",()=>{
        console.log("User disconnected : ", socket.user.userId);
    });
});