# WebSocket Implementation Guide

## Overview
DealDrop now uses Socket.io for real-time bidding updates. When a user places a bid, all other users viewing the same auction will see the update instantly without refreshing the page.

## Features Implemented

### 1. **Real-time Bid Updates**
- When any user places a bid, all users viewing that auction receive instant notification
- Current price updates automatically
- Bid history updates in real-time

### 2. **Connection Status Indicator**
- Green indicator shows "Live bidding active" when connected
- Red indicator shows "Reconnecting..." if connection is lost
- Automatic reconnection on network issues

### 3. **Auction Rooms**
- Each auction has its own room
- Users automatically join when viewing an auction
- Users leave when navigating away
- Prevents unnecessary broadcast to all users

## Architecture

### Server Side (Socket.io Server)
**Location:** `server/index.js`

```javascript
// Socket.io events handled:
- 'connection'      - New user connects
- 'joinAuction'     - User joins specific auction room
- 'leaveAuction'    - User leaves auction room
- 'disconnect'      - User disconnects
```

**Bid Broadcasting:**
Location: `server/controllers/auction.controller.js`

When a bid is placed:
1. Bid saved to database
2. Socket.io emits 'newBid' event to auction room
3. All users in that room receive update

### Client Side (Socket.io Client)

**Context Provider:** `client/src/context/SocketContext.jsx`
- Manages WebSocket connection
- Provides socket instance to components
- Handles connection/disconnection

**Hook Usage:** `useSocket()`
```javascript
const { socket, isConnected } = useSocket();
```

**Implementation:** `client/src/pages/ViewAuction.jsx`
- Joins auction room on mount
- Listens for 'newBid' events
- Updates UI in real-time
- Leaves room on unmount

## How It Works

### Flow Diagram
```
User A places bid
    ↓
POST /auction/:id (HTTP)
    ↓
Server validates & saves bid
    ↓
Socket.io emits 'newBid' to room
    ↓
All users in auction room receive event
    ↓
UI updates automatically
```

### Event Data Structure

**newBid Event:**
```javascript
{
  auctionId: "auction_id",
  bidAmount: 200020,
  bidder: {
    _id: "user_id",
    name: "Chaitanya Kelkar"
  },
  currentPrice: 200020,
  totalBids: 3,
  timestamp: "2025-10-30T..."
}
```

## Testing WebSocket

### 1. Start All Services
```bash
# Terminal 1: MongoDB
mongod --dbpath C:\data\db

# Terminal 2: Server
cd server
npm start
# Should see: "WebSocket server is ready"

# Terminal 3: Client
cd client
npm run dev
```

### 2. Test Real-time Updates

**Setup:**
1. Open `http://localhost:3000` in Chrome
2. Open `http://localhost:3000` in another browser/incognito
3. Login with different accounts in each

**Test:**
1. Navigate to same auction in both browsers
2. Check green "Live bidding active" indicator
3. Place bid in Browser 1
4. Browser 2 should show:
   - Blue notification with bidder name
   - Updated current price
   - New bid in history
   - All without refresh!

### 3. Check Browser Console
```javascript
// You should see:
✅ Connected to WebSocket server
Joined auction room: [auction_id]
New bid received: {...}
```

## Configuration

### Environment Variables

**Server (.env):**
```env
PORT=4000
ORIGIN=http://localhost:3000  # Must match client URL
```

**Client (.env):**
```env
VITE_API=http://localhost:4000  # WebSocket connects here
```

## Components Using WebSocket

### 1. SocketProvider
- Location: `client/src/context/SocketContext.jsx`
- Purpose: Global WebSocket connection
- Wrapped in: `main.jsx`

### 2. WebSocketIndicator
- Location: `client/src/components/WebSocketIndicator.jsx`
- Purpose: Shows connection status
- Used in: All layouts

### 3. ViewAuction
- Location: `client/src/pages/ViewAuction.jsx`
- Purpose: Real-time bidding page
- Features:
  - Joins/leaves auction rooms
  - Listens for bid updates
  - Shows real-time notifications

## Troubleshooting

### Issue: "Not connected" showing
**Solutions:**
1. Check server is running: `http://localhost:4000`
2. Check CORS settings in `server/index.js`
3. Check browser console for errors
4. Verify `VITE_API` in client `.env`

### Issue: Bids not updating in real-time
**Solutions:**
1. Check server console for "User joined auction"
2. Open browser dev tools → Network → WS tab
3. Check WebSocket connection is established
4. Verify `io.to()` is emitting to correct room

### Issue: Connection keeps dropping
**Solutions:**
1. Check firewall settings
2. Try different transport: `transports: ['websocket']`
3. Increase timeout in Socket.io config
4. Check network stability

## Performance Considerations

### Scalability
- Each auction has its own room (prevents broadcast to all users)
- Only users viewing auction receive updates
- Automatic cleanup when users leave

### Resource Usage
- WebSocket connection is persistent but lightweight
- Reconnects automatically on network issues
- Single connection per client

### Optimization Tips
1. **Room Management**: Always leave rooms when unmounting
2. **Event Cleanup**: Remove listeners on component unmount
3. **Throttling**: Consider throttling rapid bid updates
4. **Compression**: Enable Socket.io compression for production

## Production Deployment

### Vercel/Heroku/AWS
```javascript
// Use environment variable for WebSocket URL
const socket = io(process.env.VITE_API, {
  withCredentials: true,
  secure: true  // Use secure connection in production
});
```

### HTTPS/WSS
- WebSocket uses WSS in production (secure)
- Automatically handled by Socket.io
- Ensure CORS is properly configured

## Future Enhancements

### Planned Features
1. **Typing Indicators**: Show when users are typing bids
2. **User Count**: Display number of viewers
3. **Auction Notifications**: Alert when auction ending soon
4. **Chat System**: Add auction-specific chat
5. **Admin Broadcasts**: Send messages to all users

### Advanced Features
1. **Redis Adapter**: For horizontal scaling
2. **Presence System**: Track online users
3. **Private Messages**: Between buyer and seller
4. **Notification Bell**: Real-time notification center

## Code Examples

### Listen for Custom Events
```javascript
// In any component
const { socket } = useSocket();

useEffect(() => {
  if (socket) {
    socket.on('customEvent', (data) => {
      console.log('Custom event:', data);
    });

    return () => {
      socket.off('customEvent');
    };
  }
}, [socket]);
```

### Emit Custom Events
```javascript
// Server side
io.to('room-name').emit('eventName', { data });

// Client side
socket.emit('eventName', { data });
```

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Socket.io Guide](https://socket.io/how-to/use-with-react)
- [Socket.io Client API](https://socket.io/docs/v4/client-api/)

## Summary

✅ **Implemented:**
- Real-time bid updates
- Auction room system
- Connection status indicator
- Automatic reconnection
- Clean event handling

✅ **Benefits:**
- Instant bid updates (no refresh needed)
- Better user experience
- Competitive bidding environment
- Reduced server load (no polling)

✅ **Next Steps:**
- Test with multiple users
- Monitor performance
- Add more real-time features
- Deploy to production

---

**Last Updated:** October 30, 2025
**Version:** 1.0.0
