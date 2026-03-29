import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from './pages/Login.jsx'
import { Register } from './pages/register.jsx'
import { Home } from './pages/Home.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import './App.css'
import { AuctionDetails } from './pages/AuctionDetails.jsx'
import { CreateAuction } from "./pages/createAuction.jsx"
import { DashboardLayout } from "./components/DashboardLayout.jsx"
import { DashboardHome } from "./pages/DashboardHome.jsx"
import { DashboardAuctions } from "./pages/DashboardAuctions.jsx"
import { MyBids } from "./pages/MyBids.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/auction/:id" element={<AuctionDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-auction" element={<CreateAuction />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="auctions" element={<DashboardAuctions />} />
          <Route path="bids" element={<MyBids />} />
          {/* <Route path="profile" element={<Profile />} /> */}

          {/* Seller */}
          <Route path="create" element={<CreateAuction />} />
          {/* <Route path="my-auctions" element={<MyAuctions />} /> */}

          {/* Admin */}
          <Route path="requests" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
