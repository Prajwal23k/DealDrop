# DealDrop - Online Auction System 🔨

A modern, full-stack online auction platform with real-time bidding capabilities. Built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time updates.

## 🌟 Features

- **User Authentication**: Secure JWT-based authentication with HTTP-only cookies
- **Real-time Bidding**: Live bid updates using WebSocket (Socket.io)
- **Auction Management**: Create, update, and manage auction listings
- **Image Upload**: Cloudinary integration for product images
- **Email Notifications**: Automated emails via Resend API
- **Admin Dashboard**: User and auction management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Geo-location Tracking**: IP-based location for security
- **Connection Status**: Visual WebSocket connection indicator

## 🛠️ Tech Stack

### Frontend
- React 19.1.0
- React Router 7.6.1
- Redux Toolkit 2.8.2
- TanStack Query 5.77.2
- Tailwind CSS 4.1.7
- Socket.io Client 4.8.1
- Vite 6.3.5
- Axios

### Backend
- Node.js 20+
- Express 5.1.0
- MongoDB 8.0.5
- Mongoose 8.15.1
- Socket.io 4.8.1
- JWT Authentication
- Bcrypt for password hashing
- Cloudinary (image storage)
- Resend (email service)

## 📋 Prerequisites

- Node.js (v20 or higher)
- MongoDB (v8.0 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Prajwal23k/DealDrop.git
cd DealDrop
```

### 2. Environment Setup

#### Server Environment Variables

Create `server/.env`:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/dealdrop

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# CORS
ORIGIN=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Client Environment Variables

Create `client/.env`:

```env
VITE_API=http://localhost:4000
VITE_AUCTION_API=http://localhost:4000/auction
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Start MongoDB

**Windows (Run as Administrator):**
```bash
mongod --dbpath C:\data\db
```

**macOS/Linux:**
```bash
mongod --dbpath /data/db
```

### 5. Run the Application

**Terminal 1 - Start Server:**
```bash
cd server
npm start
```

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📁 Project Structure

```
DealDrop/
├── client/                     # Frontend React application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── api/              # API service functions
│   │   ├── assets/           # Images, icons
│   │   ├── components/       # Reusable components
│   │   │   ├── Landing/     # Landing page components
│   │   │   ├── WebSocketIndicator.jsx
│   │   │   └── ...
│   │   ├── context/         # React contexts (Socket)
│   │   ├── init/            # Initialization components
│   │   ├── layout/          # Layout components
│   │   ├── pages/           # Page components
│   │   │   ├── Admin/      # Admin pages
│   │   │   └── legal/      # Legal pages
│   │   ├── routers/        # Route configurations
│   │   ├── store/          # Redux store & slices
│   │   └── utils/          # Utility functions
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── server/                    # Backend Node.js application
│   ├── controllers/          # Request handlers
│   │   ├── admin.controller.js
│   │   ├── auction.controller.js
│   │   ├── contact.controller.js
│   │   ├── user.controller.js
│   │   └── userAuth.controller.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js
│   │   ├── checkAdmin.js
│   │   └── multer.js
│   ├── models/              # Mongoose schemas
│   │   ├── Login.js
│   │   ├── product.js
│   │   └── user.js
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   │   └── cloudinaryService.js
│   ├── utils/               # Utility functions
│   │   ├── geoDetails.js
│   │   └── jwt.js
│   ├── connection.js        # MongoDB connection
│   ├── index.js            # Entry point with Socket.io
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Docker orchestration
├── render.yaml              # Render deployment config
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### User
- `GET /user` - Get current user profile
- `PATCH /user` - Update user profile
- `GET /user/logins` - Get login history

### Auction
- `GET /auction/show` - Get all auctions
- `GET /auction/:id` - Get auction details
- `POST /auction` - Create new auction (auth required)
- `PUT /auction/:id` - Update auction (auth required)
- `DELETE /auction/:id` - Delete auction (auth required)
- `POST /auction/:id` - Place bid (auth required)

### Admin
- `GET /admin/users` - Get all users (admin only)
- `DELETE /admin/user/:id` - Delete user (admin only)

### Contact
- `POST /contact` - Send contact message

### Health
- `GET /health` - Health check endpoint

## ⚡ Real-time Features (WebSocket)

The application uses Socket.io for real-time bidding:

### Events
- `joinAuction` - Join auction room
- `leaveAuction` - Leave auction room
- `newBid` - Broadcast new bid to all users in auction room

### Connection Indicator
- Green badge: Connected and live
- Red badge: Reconnecting...

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Copy environment template
copy .env.docker .env

# Edit .env with your credentials
notepad .env

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:
- MongoDB on port 27017
- Backend on port 4000
- Frontend on port 80

## ☁️ Cloud Deployment

### Option 1: Render (Recommended)

1. Push your code to GitHub
2. Go to https://render.com
3. Click "New" → "Blueprint"
4. Connect your repository
5. Render will auto-detect `render.yaml`
6. Add environment variables
7. Click "Apply"

### Option 2: Vercel + Render

**Backend on Render:**
- Deploy backend as Web Service
- Add all environment variables

**Frontend on Vercel:**
```bash
cd client
vercel --prod
```

### Option 3: Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## 🔧 Configuration

### Get API Keys

**MongoDB Atlas** (Free Cloud Database):
- Sign up: https://www.mongodb.com/cloud/atlas/register
- Create cluster
- Get connection string
- Update `MONGO_URI` in `.env`

**Cloudinary** (Image Storage):
- Sign up: https://cloudinary.com/
- Dashboard → Account Details
- Copy credentials to `.env`

**Resend** (Email Service):
- Sign up: https://resend.com/
- Create API key
- Add to `.env`

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGO_URI` format
- For local: `mongodb://localhost:27017/dealdrop`
- For Atlas: Use connection string with credentials

### CORS Errors
- Verify `ORIGIN` in server `.env` matches client URL
- Restart server after changing `.env`

### WebSocket Not Connecting
- Check server is running and accessible
- Verify `VITE_API` in client `.env`
- Check browser console for connection errors
- Ensure no firewall blocking WebSocket connections

### Port Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4000 | xargs kill
```

### Environment Variables Not Loading
- Ensure `.env` file exists in correct directory
- Restart server/client after changes
- Check file is not named `.env.txt`
- Verify no quotes around values

## 📝 Scripts

### Server
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
```

### Client
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔒 Security Notes

- Never commit `.env` files to Git
- Use strong, unique `JWT_SECRET` in production
- Enable HTTPS in production
- Keep dependencies updated
- Use environment-specific configurations
- Validate and sanitize all inputs
- Implement rate limiting for production

## 📊 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `4000` |
| `MONGO_URI` | Yes | MongoDB connection | `mongodb://localhost:27017/dealdrop` |
| `JWT_SECRET` | Yes | JWT signing key | Generate with crypto |
| `JWT_EXPIRES_IN` | Yes | Token expiration | `7d` |
| `ORIGIN` | Yes | Frontend URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Yes | Resend API key | `re_...` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary name | Your cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary key | Your API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary secret | Your API secret |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Prajwal** - Initial work - [Prajwal23k](https://github.com/Prajwal23k)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js team
- MongoDB team
- Socket.io for real-time capabilities
- Cloudinary for image management
- All open-source contributors

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting section above

---

**⚠️ Important:** Never commit `.env` files or credentials to version control. Keep your API keys secure!

**Made with ❤️ using the MERN Stack**
