# DealDrop Troubleshooting Guide

## Current Setup Verification

### 1. Check All Services Are Running

Open **3 separate terminals/command prompts**:

#### Terminal 1: MongoDB
```bash
# Run as Administrator
mongod --dbpath C:\data\db
```
**Expected Output:** "waiting for connections on port 27017"

#### Terminal 2: Backend Server
```bash
cd server
npm start
```
**Expected Output:** 
- "Server is running on port 4000"
- "Connected to MongoDB"

#### Terminal 3: Frontend Client
```bash
cd client
npm run dev
```
**Expected Output:** 
- "VITE v6.3.5 ready"
- "Local: http://localhost:3000/"

---

## 2. Verify Environment Variables

### Client (.env)
Location: `client/.env`
```env
VITE_API=http://localhost:4000
VITE_AUCTION_API=http://localhost:4000/auction
```

---

## 3. Common Issues & Solutions

### Issue: "Signup failed" or "Cannot read properties of undefined"

**Solution:**
1. Check browser console (F12 → Console tab)
2. Check server terminal for errors
3. Verify MongoDB is running
4. Clear browser cookies and cache
5. Try in incognito mode

### Issue: "CORS Error" in console

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:4000/...' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
1. Verify `ORIGIN=http://localhost:3000` in server `.env`
2. Restart the server after changing `.env`
3. Check client port matches (should be 3000)

### Issue: "MongoDB Connection Error"

**Solutions:**
1. Ensure MongoDB service is running
2. Check port 27017 is not blocked:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 27017
   ```
3. Verify `MONGO_URI` in server `.env`
4. Create data directory if missing:
   ```powershell
   mkdir C:\data\db
   ```

### Issue: Images not uploading

**Solution:**
1. Check Cloudinary credentials in server `.env`
2. Verify file size is under 5MB
3. Check server terminal for Cloudinary errors
4. Test Cloudinary credentials at https://cloudinary.com

### Issue: Dashboard shows no data or errors

**Solutions:**
1. Create a test auction first
2. Check browser console for API errors
3. Verify you're logged in (check cookies)
4. Test API endpoint manually:
   ```powershell
   curl http://localhost:4000/auction/stats
   ```

### Issue: "Cannot GET /api/auction" or 404 errors

**Solution:**
1. Verify backend routes are correct
2. Check `VITE_AUCTION_API` in client `.env`
3. Ensure backend server is running on port 4000
4. Test API:
   ```powershell
   curl http://localhost:4000/auction
   ```

---

## 4. Fresh Start (Complete Reset)

If nothing works, follow these steps:

### Step 1: Stop Everything
```powershell
# Press Ctrl+C in all terminal windows
```

### Step 2: Clear Data
```powershell
# Delete node_modules
cd client
rm -r node_modules
cd ../server
rm -r node_modules

# Clear MongoDB data (optional - will delete all auctions)
# rm -r C:\data\db
# mkdir C:\data\db
```

### Step 3: Reinstall Dependencies
```powershell
cd client
npm install

cd ../server
npm install
```

### Step 4: Verify .env Files
- Double-check both `client/.env` and `server/.env`
- Make sure there are no extra spaces or quotes

### Step 5: Start Fresh
```powershell
# Terminal 1: MongoDB
mongod --dbpath C:\data\db

# Terminal 2: Server
cd server
npm start

# Terminal 3: Client
cd client
npm run dev
```

### Step 6: Test Flow
1. Open http://localhost:3000
2. Create a new account
3. Create a test auction
4. View the auction
5. Place a bid

---

## 5. Verification Checklist

### Backend Health Check
```powershell
# Test server is running
curl http://localhost:4000

# Expected: {"msg":"Welcome to Online Auction System API"}
```

### Database Check
```powershell
# Connect to MongoDB
mongosh

# Check database
use dealdrop
show collections
db.users.countDocuments()
db.products.countDocuments()

exit
```

### Frontend Check
1. Open http://localhost:3000
2. Press F12 (Developer Tools)
3. Check Console tab - should have no red errors
4. Check Network tab - API calls should return 200 status

---

## 6. Expected vs Actual Output

### Dashboard Should Show:
- ✅ Three stat cards (Total, Active, Your Auctions)
- ✅ "All Auctions" section with auction cards
- ✅ "Your Auctions" section
- ✅ Clean, modern styling with proper spacing

### Auction Card Should Display:
- ✅ Product image
- ✅ Category badge
- ✅ Item name and description
- ✅ Current price in green
- ✅ Bid count
- ✅ Time left in red
- ✅ Seller name
- ✅ "View Details" button

### Create Auction Form Should Have:
- ✅ All input fields properly labeled
- ✅ Date picker for start/end dates
- ✅ Image upload with preview
- ✅ Category dropdown
- ✅ "Create Auction" button

### Auction Details Page Should Show:
- ✅ Large product image
- ✅ Item details (name, description, category)
- ✅ Pricing information (starting price, current price)
- ✅ Bid count and time left
- ✅ "Place Your Bid" form (if not your auction)
- ✅ Seller information
- ✅ Bid history section at bottom

---

## 7. Debug Mode

### Enable Detailed Logging

**Client Side:**
Add this to check API responses:
```javascript
// In client/src/api/auction.js
console.log('API Response:', res.data);
```

**Server Side:**
Already has logging. Check terminal for:
- Request logs
- Error messages
- Database connection status

---

## 8. Contact for Help

If issues persist:
1. Screenshot the error
2. Check server terminal output
3. Check browser console
4. Note the exact steps to reproduce
5. Provide:
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - MongoDB version: `mongod --version`

---

## Quick Commands Reference

```powershell
# Check if ports are in use
netstat -ano | findstr :3000
netstat -ano | findstr :4000
netstat -ano | findstr :27017

# Kill process on port (if needed)
# Find PID from above command, then:
taskkill /PID <PID> /F

# Check MongoDB status
mongosh --eval "db.version()"

# Test server endpoint
curl http://localhost:4000

# View MongoDB data
mongosh
use dealdrop
db.products.find().pretty()
db.users.find().pretty()
```

---

## Platform-Specific Notes

### Windows
- Use PowerShell or Command Prompt as Administrator for MongoDB
- Paths use backslashes: `C:\data\db`
- Use `mongod` (with 'd') to start MongoDB server

### Important
- Always start MongoDB FIRST before backend
- Always start backend BEFORE frontend
- Keep all three terminals running while developing

---

## Success Indicators

✅ MongoDB: "waiting for connections"  
✅ Backend: "Connected to MongoDB"  
✅ Frontend: Opens browser automatically to http://localhost:3000  
✅ No red errors in browser console  
✅ Can signup/login successfully  
✅ Can create auctions  
✅ Can view and bid on auctions  

---

**Last Updated:** October 30, 2025
