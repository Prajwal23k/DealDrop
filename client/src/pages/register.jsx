import { useState } from "react";
import { API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const { name, email, phone, password } = form;

        if (!name || !email || !phone || !password) {
            return alert("All fields are mandatory");
        }

        try {
            setLoading(true);

            await API.post("/register", form);

            alert("Registered successfully ✅");
            navigate("/login");

        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-10">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.18),transparent_45%)]" />
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_60px_rgba(56,189,248,0.08)] backdrop-blur-xl">
                <div className="text-center">
                    <img src={Logo} alt="DealDrop" className="mx-auto h-14 w-auto" />
                    <h1 className="mt-4 text-2xl font-black tracking-tight text-white">Create your account</h1>
                    <p className="mt-1 text-sm text-slate-400">Join DealDrop and start exploring live auctions.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {[
                        { name: "name", label: "Full name", type: "text", placeholder: "John Doe" },
                        { name: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
                        { name: "phone", label: "Phone number", type: "tel", placeholder: "+91 98765 43210" },
                        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-semibold text-slate-200">{field.label}</label>
                            <input
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={form[field.name]}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-sky-400/60 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:from-sky-400 hover:to-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.55)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Registering...
                            </span>
                        ) : (
                            "Register"
                        )}
                    </button>

                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <button type="button" onClick={() => navigate("/login")} className="font-semibold text-sky-400 hover:text-sky-300">
                            Sign in
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );



}

export { Register };
