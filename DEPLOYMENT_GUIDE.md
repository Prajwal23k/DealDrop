# DealDrop Deployment Guide

## 🚀 Deployment Options

This guide covers multiple deployment strategies for the DealDrop auction system.

---

## Option 1: Vercel (Recommended - Easiest)

### Why Vercel?
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Built-in CI/CD
- ✅ Global CDN
- ✅ Easy environment variable management
- ⚠️ **Note:** Vercel serverless functions have limitations with WebSockets

### Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. MongoDB Atlas account (for production database)

### Step 1: Prepare Your Code

**Push to GitHub:**
```powershell
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit for deployment"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/DealDrop.git
git branch -M main
git push -u origin main
```

### Step 2: Setup MongoDB Atlas

1. **Create MongoDB Atlas Account:** https://www.mongodb.com/cloud/atlas/register
2. **Create a Cluster:**
   - Choose FREE tier (M0)
   - Select region closest to your users
3. **Configure Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username/password (save these!)
5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dealdrop?retryWrites=true&w=majority`

### Step 3: Deploy Backend to Vercel

1. **Import Project:**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select **root directory** → Click "Edit"
   - Set **Root Directory** to `server`
   - Click "Continue"

2. **Configure Environment Variables:**
   ```env
   # Add these in Vercel dashboard:
   PORT=4000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dealdrop
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   ORIGIN=https://your-frontend-url.vercel.app
   RESEND_API_KEY=re_your_resend_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Copy the deployment URL (e.g., `https://dealdrop-server.vercel.app`)

### Step 4: Deploy Frontend to Vercel

1. **Import Project Again:**
   - Click "Add New" → "Project"
   - Import same GitHub repository
   - Select **root directory** → Click "Edit"
   - Set **Root Directory** to `client`
   - Click "Continue"

2. **Configure Environment Variables:**
   ```env
   VITE_API=https://your-backend-url.vercel.app
   VITE_AUCTION_API=https://your-backend-url.vercel.app/auction
   ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Copy the deployment URL

4. **Update Backend ORIGIN:**
   - Go to your server project in Vercel
   - Settings → Environment Variables
   - Update `ORIGIN` to your frontend URL
   - Redeploy server

### ⚠️ Important: WebSocket Limitations on Vercel

Vercel's serverless functions **do not support persistent WebSocket connections**. For real-time bidding, you have two options:

**Option A: Use Polling (Quick Fix)**
- Modify client to poll for bid updates every 2-3 seconds
- Works on Vercel but less efficient

**Option B: Deploy Backend Elsewhere**
- Deploy backend to Render/Railway/Heroku (see Option 2)
- Keep frontend on Vercel
- Best for production WebSocket support

---

## Option 2: Render (Best for WebSockets)

### Why Render?
- ✅ Native WebSocket support
- ✅ Free tier available (with limitations)
- ✅ PostgreSQL/MongoDB support
- ✅ Auto-deploy from Git
- ✅ Perfect for Socket.io

### Deploy Backend to Render

1. **Create Account:** https://render.com

2. **Create New Web Service:**
   - Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** dealdrop-server
     - **Region:** Choose closest to users
     - **Branch:** main
     - **Root Directory:** server
     - **Runtime:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** Free

3. **Add Environment Variables:**
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ORIGIN=https://your-frontend-url.onrender.com
   RESEND_API_KEY=your_resend_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy service URL (e.g., `https://dealdrop-server.onrender.com`)

### Deploy Frontend to Render

1. **Create New Static Site:**
   - Dashboard → "New" → "Static Site"
   - Connect same repository
   - Configure:
     - **Name:** dealdrop-client
     - **Branch:** main
     - **Root Directory:** client
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** dist

2. **Add Environment Variables:**
   ```env
   VITE_API=https://your-backend-url.onrender.com
   VITE_AUCTION_API=https://your-backend-url.onrender.com/auction
   ```

3. **Deploy:**
   - Click "Create Static Site"
   - Update backend ORIGIN to frontend URL

---

## Option 3: Railway (Easiest WebSocket Support)

### Why Railway?
- ✅ Excellent WebSocket support
- ✅ Simple deployment process
- ✅ Free tier with $5 credit
- ✅ Automatic HTTPS
- ✅ Great for full-stack apps

### Deploy to Railway

1. **Create Account:** https://railway.app

2. **Deploy Backend:**
   - Dashboard → "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js
   - Add environment variables (same as above)
   - Click "Deploy"

3. **Deploy Frontend:**
   - Same project → "New Service" → "GitHub Repo"
   - Select same repository
   - Configure root directory to `client`
   - Add environment variables
   - Deploy

4. **Configure Custom Domains** (optional):
   - Click on service → Settings → "Generate Domain"
   - Use generated domains or add custom domain

---

## Option 4: Docker + Cloud (Production-Ready)

### Why Docker?
- ✅ Consistent environments
- ✅ Easy scaling
- ✅ Works on any cloud provider
- ✅ Best for production

### Step 1: Create Docker Files

**server/Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 4000

# Start application
CMD ["npm", "start"]
```

**client/Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**client/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**docker-compose.yml (root directory):**
```yaml
version: '3.8'

services:
  # MongoDB
  mongodb:
    image: mongo:8.0
    container_name: dealdrop-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: dealdrop
    volumes:
      - mongodb_data:/data/db
    networks:
      - dealdrop-network

  # Backend
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: dealdrop-backend
    restart: always
    ports:
      - "4000:4000"
    environment:
      PORT: 4000
      MONGO_URI: mongodb://admin:password@mongodb:27017/dealdrop?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 7d
      ORIGIN: http://localhost
      RESEND_API_KEY: ${RESEND_API_KEY}
      CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME}
      CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY}
      CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET}
    depends_on:
      - mongodb
    networks:
      - dealdrop-network

  # Frontend
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: dealdrop-frontend
    restart: always
    ports:
      - "80:80"
    environment:
      VITE_API: http://localhost:4000
      VITE_AUCTION_API: http://localhost:4000/auction
    depends_on:
      - backend
    networks:
      - dealdrop-network

volumes:
  mongodb_data:

networks:
  dealdrop-network:
    driver: bridge
```

### Step 2: Build and Run

```powershell
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Step 3: Deploy to Cloud

**AWS ECS / Google Cloud Run / Azure Container Instances:**
1. Push images to container registry
2. Create container instances
3. Configure load balancer
4. Set up environment variables

---

## Option 5: Traditional VPS (DigitalOcean/Linode/AWS EC2)

### Setup on Ubuntu Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-8.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Clone repository
git clone https://github.com/YOUR_USERNAME/DealDrop.git
cd DealDrop

# Setup backend
cd server
npm install
nano .env  # Add environment variables

# Install PM2 for process management
sudo npm install -g pm2
pm2 start index.js --name dealdrop-server
pm2 startup
pm2 save

# Setup frontend
cd ../client
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/dealdrop
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /home/user/DealDrop/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/dealdrop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL (optional but recommended)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔧 Pre-Deployment Checklist

### Environment Variables
- [ ] MongoDB connection string updated for production
- [ ] JWT_SECRET changed from development value
- [ ] ORIGIN set to actual frontend URL
- [ ] Cloudinary credentials added
- [ ] Resend API key added

### Security
- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable MongoDB authentication
- [ ] Configure CORS properly
- [ ] Add rate limiting (optional)
- [ ] Enable HTTPS/SSL

### Code Updates
- [ ] Remove console.logs from production code
- [ ] Set NODE_ENV=production
- [ ] Minify frontend assets
- [ ] Optimize images
- [ ] Add error tracking (Sentry)

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Backup strategy in place

### Testing
- [ ] Test signup/login
- [ ] Test auction creation
- [ ] Test bidding functionality
- [ ] Test real-time updates
- [ ] Test on multiple devices
- [ ] Test WebSocket connection

---

## 📊 Comparison Table

| Platform | WebSocket | Free Tier | Ease | Build Time | Best For |
|----------|-----------|-----------|------|------------|----------|
| **Vercel** | ❌ Limited | ✅ Yes | ⭐⭐⭐⭐⭐ | Fast | Static sites |
| **Render** | ✅ Full | ✅ Yes* | ⭐⭐⭐⭐ | Medium | Full-stack |
| **Railway** | ✅ Full | ⚠️ $5 credit | ⭐⭐⭐⭐⭐ | Fast | Full-stack |
| **Docker** | ✅ Full | N/A | ⭐⭐⭐ | Slow | Production |
| **VPS** | ✅ Full | ❌ No | ⭐⭐ | Slow | Custom setup |

*Render free tier has sleep after 15 minutes of inactivity

---

## 🎯 Recommended Deployment Strategy

### For Development/Testing:
**Option 1: Render (Free)**
- Full WebSocket support
- Easy deployment
- Free tier available

### For Production:
**Option 2: Railway or Docker + Cloud**
- Reliable WebSocket connections
- Better performance
- Scalable infrastructure

### Budget Option:
**Option 3: VPS (DigitalOcean $5/month)**
- Full control
- No limitations
- Custom configuration

---

## 🚨 Common Deployment Issues

### Issue 1: WebSocket Connection Failed
**Solution:**
- Ensure backend supports WebSocket protocol
- Check CORS configuration
- Verify firewall allows WebSocket connections
- Use WSS (secure) in production

### Issue 2: Environment Variables Not Loading
**Solution:**
```javascript
// Add logging in index.js
console.log('Environment check:', {
  mongoUri: process.env.MONGO_URI ? '✅ Set' : '❌ Missing',
  jwtSecret: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
  port: process.env.PORT
});
```

### Issue 3: CORS Errors
**Solution:**
```javascript
// server/index.js - Update CORS
app.use(cors({
  origin: [
    process.env.ORIGIN,
    'https://your-production-url.com',
    'https://www.your-production-url.com'
  ],
  credentials: true
}));
```

### Issue 4: Build Fails on Platform
**Solution:**
- Check Node.js version matches (20.x)
- Verify all dependencies in package.json
- Clear build cache and retry
- Check build logs for specific errors

### Issue 5: Database Connection Timeout
**Solution:**
- Whitelist deployment platform IP in MongoDB Atlas
- Use correct connection string format
- Test connection locally first
- Check MongoDB Atlas cluster is running

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Docker Documentation](https://docs.docker.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Socket.io Deployment](https://socket.io/docs/v4/deployment/)

---

## 🎉 Post-Deployment

After successful deployment:

1. **Test all features:**
   - User registration
   - Login/logout
   - Auction creation
   - Bidding system
   - Real-time updates
   - Image uploads

2. **Monitor:**
   - Check server logs regularly
   - Monitor error rates
   - Track response times
   - Watch database usage

3. **Optimize:**
   - Enable caching
   - Compress responses
   - Optimize images
   - Add CDN for static assets

4. **Share:**
   - Update README with live URL
   - Add screenshots
   - Create demo video
   - Share with users!

---

**Last Updated:** October 30, 2025  
**Questions?** Check TROUBLESHOOTING.md or create an issue on GitHub
