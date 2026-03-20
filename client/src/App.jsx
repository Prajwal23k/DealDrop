import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { login } from './pages/login.jsx'
import { register } from './pages/register.jsx'
import { home } from './pages/home.jsx'
import './App.css'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<home/>} />
        <Route path = "/register" element = {<register/>}/>
        <Route path = "/login" element = {<login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
