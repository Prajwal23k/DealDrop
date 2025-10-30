import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { createServer } from 'http';
import { Server } from 'socket.io';
dotenv.config();
import { connectDB } from './connection.js'
import auctionRouter from './routes/auction.js';
import { secureRoute } from './middleware/auth.js';
import userAuthRouter from './routes/userAuth.js';
import userRouter from './routes/user.js';
import contactRouter from "./routes/contact.js";
import adminRouter from './routes/admin.js';

const port = process.env.PORT || 4000;

connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io with CORS
const io = new Server(httpServer, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Make io accessible to routes
app.set('io', io);

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));


app.get('/', async (req, res) => {
    res.json({ msg: 'Welcome to Online Auction System API' });
});
app.use('/auth', userAuthRouter)
app.use('/user', secureRoute, userRouter)
app.use('/auction', secureRoute, auctionRouter);
app.use('/contact', contactRouter);
app.use('/admin', secureRoute, adminRouter)

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join auction room
    socket.on('joinAuction', (auctionId) => {
        socket.join(`auction-${auctionId}`);
        console.log(`User ${socket.id} joined auction ${auctionId}`);
    });

    // Leave auction room
    socket.on('leaveAuction', (auctionId) => {
        socket.leave(`auction-${auctionId}`);
        console.log(`User ${socket.id} left auction ${auctionId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`WebSocket server is ready`);
});