import { useState, useContext } from "react";
import { API } from "../api/axios.js";
import { AuthContext } from "../context/authContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/Logo.png";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const res = await API.post("/login", { email, password });
            login(res.data);
            if (res.data.role === "admin") { navigate("/admin") } else { navigate("/dashboard") };
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed. Please verify your credentials.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-10">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.18),transparent_45%)]" />
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_60px_rgba(99,102,241,0.08)] backdrop-blur-xl">
                <div className="text-center">
                    <img src={Logo} alt="DealDrop" className="mx-auto h-14 w-auto" />
                    <h1 className="mt-4 text-2xl font-black tracking-tight text-white">Sign in to DealDrop</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Or{" "}
                        <Link to="/register" className="font-semibold text-sky-400 hover:text-sky-300">
                            create a new account
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {error && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            <span className="font-bold">!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-200">Email address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-sky-400/60 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-200">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-sky-400/60 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-300">
                            <input type="checkbox" className="rounded border-white/20 bg-slate-900 text-sky-500 focus:ring-sky-400/40" />
                            Remember me
                        </label>
                        <a href="#" className="font-semibold text-sky-400 hover:text-sky-300">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:from-sky-400 hover:to-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.55)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Signing in...
                            </span>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );


}

export { Login };