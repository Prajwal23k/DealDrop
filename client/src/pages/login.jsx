import { useState,createContext } from "react"
import { API } from "../api/axios.js"
import { AuthContext} from "../context/authContext.jsx"
import { useNavigate } from "react-router-dom"

function login()
{
        const [email,setEmail] = useState("");
        const [password,setPassword] = useState("")
}

export {login}