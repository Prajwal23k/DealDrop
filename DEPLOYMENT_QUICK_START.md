# Quick Deployment Scripts

## Deploy with Docker

### 1. Build and Run (First Time)
```powershell
# Copy environment template
copy .env.docker .env

# Edit .env with your actual values
notepad .env

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### 2. Stop Services
```powershell
docker-compose down
```

### 3. Restart Services
```powershell
docker-compose restart
```

### 4. View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 5. Check Status
```powershell
docker-compose ps
```

### 6. Complete Cleanup (Remove all data)
```powershell
docker-compose down -v
docker system prune -a
```

## Deploy to Vercel (Quick)

### 1. Install Vercel CLI
```powershell
npm install -g vercel
```

### 2. Deploy Backend
```powershell
cd server
vercel --prod
```

### 3. Deploy Frontend
```powershell
cd ..\client
vercel --prod
```

## Deploy to Render (Quick)

### 1. Create render.yaml
Already created! Just push to GitHub.

### 2. Connect to Render
1. Go to https://render.com
2. Click "New" → "Blueprint"
3. Connect GitHub repository
4. Render will auto-detect render.yaml
5. Add environment variables
6. Click "Apply"

## Deploy to Railway (Quick)

### 1. Install Railway CLI
```powershell
npm install -g @railway/cli
```

### 2. Login
```powershell
railway login
```

### 3. Deploy
```powershell
# From project root
railway init
railway up
```

## Local Development (Without Docker)

### 1. Start MongoDB
```powershell
mongod --dbpath C:\data\db
```

### 2. Start Backend
```powershell
cd server
npm start
```

### 3. Start Frontend
```powershell
cd client
npm run dev
```

## Environment Setup Checklist

- [ ] MongoDB Atlas account created (for cloud deployment)
- [ ] Cloudinary account created and API keys obtained
- [ ] Resend API key obtained
- [ ] JWT_SECRET generated (use `openssl rand -base64 32`)
- [ ] GitHub repository created
- [ ] Environment variables configured
- [ ] `.env` files created (never commit these!)

## Useful Commands

### Generate JWT Secret
```powershell
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Check if ports are in use
```powershell
# Check port 4000 (backend)
netstat -ano | findstr :4000

# Check port 3000 (frontend)
netstat -ano | findstr :3000

# Check port 27017 (MongoDB)
netstat -ano | findstr :27017
```

### Kill process on port
```powershell
# Find PID
netstat -ano | findstr :4000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

## Testing After Deployment

### 1. Test Backend Health
```powershell
curl http://localhost:4000/health
# or
curl https://your-backend.vercel.app/health
```

### 2. Test Frontend
Open browser: http://localhost or your deployed URL

### 3. Test WebSocket
Open two browser windows, navigate to same auction, place bid in one - should update in other.

## Common Issues

### Docker not starting?
```powershell
# Check Docker is running
docker --version
docker ps

# Restart Docker Desktop
```

### Port already in use?
```powershell
# Kill the process using the port
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Environment variables not loading?
```powershell
# Verify .env exists
dir .env

# Check if values are set
# In server/index.js, add console.log(process.env.MONGO_URI)
```

### MongoDB connection failed?
```powershell
# Test MongoDB connection
mongosh mongodb://admin:strongpassword123@localhost:27017/dealdrop?authSource=admin
```

## Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Add error monitoring (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Test all features
- [ ] Add rate limiting
- [ ] Optimize images
- [ ] Enable caching
- [ ] Configure CDN
- [ ] Set up CI/CD pipeline
- [ ] Create staging environment
- [ ] Document API endpoints

## Support

If you encounter issues:
1. Check TROUBLESHOOTING.md
2. Check DEPLOYMENT_GUIDE.md
3. Check logs: `docker-compose logs -f`
4. Create GitHub issue

---

**Quick Start:** 
1. `copy .env.docker .env` 
2. Edit `.env` with your credentials
3. `docker-compose up -d --build`
4. Open http://localhost

**Fastest Deployment:** Push to GitHub → Connect to Railway → Deploy in 2 clicks!
