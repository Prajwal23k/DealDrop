import { useState, useContext } from "react"
import { API } from "../api/axios.js"
import { AuthContext } from "../context/authContext.jsx"
import { useNavigate } from "react-router-dom"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await API.post("/login", {email,password});
            login(res.data);
            navigate("/");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export { Login };