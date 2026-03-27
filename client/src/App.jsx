import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { Login } from './pages/login.jsx'
import { Register } from './pages/register.jsx'
import { Home } from './pages/home.jsx'
import './App.css'
import { AuctionDetails } from './pages/AuctionDetails.jsx'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/auction/:id" element = {<AuctionDetails/>} />
        <Route path = "/register" element = {<Register/>}/> 
        <Route path = "/login" element = {<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
