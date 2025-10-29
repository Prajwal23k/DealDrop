# DealDrop - Online Auction System

A full-stack online auction platform built with React, Node.js, Express, and MongoDB. Users can create, bid on, and manage auctions in real-time.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT tokens and HTTP-only cookies
- **Auction Management**: Create, view, and manage auction listings
- **Real-time Bidding**: Place and track bids on active auctions
- **User Profiles**: Manage personal information and view auction history
- **Admin Dashboard**: Administrative controls for user and auction management
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Image Upload**: Cloudinary integration for auction images
- **Email Notifications**: Automated emails using Resend API
- **Geo-location Tracking**: IP-based location tracking for security

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **Redux Toolkit** - State management
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Resend** - Email service

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v20 or higher)
- **MongoDB** (Local installation or Atlas account)
- **npm** or **yarn**
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Prajwal23k/DealDrop.git
cd DealDrop
```

### 2. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file

### 3. Client Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

### 4. Start MongoDB

**For Local MongoDB:**

```bash
# Windows (Run as Administrator)
mongod --dbpath C:\data\db

# macOS/Linux
mongod --dbpath /data/db
```

**For MongoDB Atlas:**
- Update `MONGO_URI` in server `.env` with your Atlas connection string
- Whitelist your IP address in MongoDB Atlas Network Access

### 5. Run the Application

**Start the Server:**

```bash
cd server
npm start
```

Server will run on `http://localhost:4000`

**Start the Client (in a new terminal):**

```bash
cd client
npm run dev
```

Client will run on `http://localhost:3000`

## 📁 Project Structure

```
DealDrop/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── assets/        # Images, icons, etc.
│   │   ├── components/    # Reusable components
│   │   ├── init/          # Initialization components
│   │   ├── layout/        # Layout components
│   │   ├── pages/         # Page components
│   │   ├── routers/       # Route configurations
│   │   ├── store/         # Redux store & slices
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### User
- `GET /user` - Get current user
- `PATCH /user` - Update user profile
- `GET /user/logins` - Get user login history

### Auction
- `GET /auction/show` - Get all auctions
- `GET /auction/:id` - Get auction by ID
- `POST /auction` - Create new auction
- `PUT /auction/:id` - Update auction
- `DELETE /auction/:id` - Delete auction

### Admin
- `GET /admin/users` - Get all users
- `DELETE /admin/user/:id` - Delete user

### Contact
- `POST /contact` - Send contact message

## 🔧 Configuration

### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to server `.env`

### Resend Email Setup
1. Sign up at [Resend](https://resend.com/)
2. Get your API key from the dashboard
3. Add it to server `.env`

### MongoDB Setup

**Option 1: Local MongoDB**
- Install MongoDB Community Edition
- Create data directory: `C:\data\db` (Windows) or `/data/db` (macOS/Linux)
- Start MongoDB service

**Option 2: MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Whitelist your IP address
- Get connection string and update `MONGO_URI`

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 or 4000 is already in use:
- Change `PORT` in server `.env`
- Update `ORIGIN` in server `.env` to match client port
- Update `VITE_API` in client `.env` to match server port

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in server `.env`
- For Atlas: Verify IP whitelist and credentials

### CORS Errors
- Ensure `ORIGIN` in server `.env` matches client URL exactly
- Restart the server after changing `.env`

### JWT Token Errors
- Ensure `JWT_SECRET` and `JWT_EXPIRES_IN` are set in server `.env`
- Clear browser cookies and try again

## 📝 Scripts

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React and the React community
- Express.js team
- MongoDB team
- All contributors and open-source projects used

---

**Note:** Make sure to never commit your `.env` files to version control. Add them to `.gitignore` to keep your credentials safe.