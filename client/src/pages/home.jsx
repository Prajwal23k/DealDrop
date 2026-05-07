import { AuthContext } from "../context/authContext.jsx";
import { useContext, useState, useEffect } from "react";
import { API } from "../api/axios.js";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/Logo_dark_theme.png";

function Home() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        fetchAuctions();
    }, []);

    async function fetchAuctions() {
        try {
            const res = await API.get("/auctions");
            setAuctions(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    async function requestSeller() {
        try {
            const res = await API.post("/request-seller");
            alert(res.data.message);
        } catch (e) {
            alert(e.response?.data?.message);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={Logo}
                            alt="DealDrop"
                            className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10 shadow-[0_0_25px_rgba(56,189,248,0.18)]"
                        />
                        <span className="hidden text-lg font-black tracking-tight text-white sm:block">DealDrop</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <>
                                <div className="hidden text-right sm:block">
                                    <p className="text-xs text-slate-400">Welcome,</p>
                                    <p className="text-sm font-semibold text-white">{user.username || user.name}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 active:scale-95"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] transition hover:from-sky-400 hover:to-indigo-400 hover:shadow-[0_0_28px_rgba(99,102,241,0.5)] active:scale-95"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.22),transparent_45%)]" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
                <div className="mx-auto mt-6 max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.03] px-4 py-16 shadow-[0_0_60px_rgba(56,189,248,0.08)] backdrop-blur-xl sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-3xl text-center ">
                        <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-sky-300">
                            Premium Auctions Daily
                        </span>
                        <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Discover{" "}
                            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                                Incredible Deals
                            </span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
                            Bid on exclusive items with a faster, cleaner, and more transparent
                            experience built for modern online auctions.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <button
                                onClick={() => {
                                    document
                                        .getElementById("upcoming-auctions")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                }}
                                className="w-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:-translate-y-0.5 hover:from-sky-400 hover:to-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.55)] active:scale-95 sm:w-auto"
                            >
                                Explore Auctions
                            </button>
                            {user?.role === "seller" && (
                                <button
                                    onClick={() => navigate("/create-auction")}
                                    className="w-full rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-white/10 active:scale-95 sm:w-auto"
                                >
                                    Create Auction
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        { title: "Exclusive Items", desc: "Find rare collections and unique items you simply will not find anywhere else.", color: "from-sky-500 to-cyan-500" },
                        { title: "Secure Bidding", desc: "A transparent auction flow designed to keep your bids, account, and data safe.", color: "from-indigo-500 to-purple-500" },
                        { title: "Fast Delivery", desc: "Win your auction and move quickly from bidding to delivery with less friction.", color: "from-emerald-500 to-teal-500" },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-sky-400/30 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(56,189,248,0.15)]"
                        >
                            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-lg transition group-hover:scale-110`}>
                                <span className="text-xl font-black">★</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{f.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* AUCTIONS */}
            <section
                id="upcoming-auctions"
                className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
            >
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Upcoming Auctions</h2>
                    </div>
                </div>

                {auctions.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
                        <p className="text-lg font-semibold text-white">No auctions available</p>
                        <p className="mt-2 text-sm text-slate-400">Check back later for exciting new deals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {auctions
                            .filter((auction) => auction.status === "UPCOMING")
                            .map((auction) => (
                                <article
                                    key={auction._id}
                                    onClick={() => navigate(`/auction/${auction._id}`)}
                                    className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-[0_0_50px_rgba(56,189,248,0.18)]"
                                >
                                    <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                                        {auction.image && (
                                            <img
                                                src={auction.image}
                                                alt={auction.title}
                                                className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                                                loading="lazy"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                                        <span className="absolute right-3 top-3 rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md backdrop-blur">
                                            {auction.status || "Live"}
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="text-lg font-bold tracking-tight text-white transition group-hover:text-sky-300">
                                            {auction.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 text-sm text-slate-400">{auction.description}</p>

                                        <div className="mt-auto flex items-end justify-between pt-5">
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-slate-500">Current Bid</p>
                                                <p className="mt-1 text-xl font-black text-white">₹{auction.currentPrice}</p>
                                            </div>
                                            <span className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(56,189,248,0.4)] transition group-hover:from-sky-400 group-hover:to-indigo-400">
                                                Bid Now
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                    </div>
                )}

                {/* Become Seller CTA */}
                {user && user.role !== "seller" && (
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 p-6 backdrop-blur sm:flex-row sm:p-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Want to become a seller?</h3>
                            <p className="mt-1 text-sm text-slate-300">Request seller access and start listing your auctions.</p>
                        </div>
                        <button
                            onClick={requestSeller}
                            className="rounded-full bg-white text-slate-900 px-6 py-3 font-semibold shadow-md transition hover:bg-slate-100 active:scale-95"
                        >
                            Request Seller Access
                        </button>
                    </div>
                )}
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-10 md:grid-cols-3">
                        <div>
                            <h4 className="text-lg font-black text-white">DealDrop</h4>
                            <p className="mt-3 text-sm text-slate-400">
                                Your destination for exclusive auctions, collectible finds, and everyday deals
                                with a cleaner bidding experience.
                            </p>
                        </div>
                        <div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Contact</h4>
                            <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                <li>support@dealdrop.com</li>
                                <li>+1 (800) DEAL-DRP</li>
                            </ul>
                        </div>
                    </div>
                    <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
                        © {new Date().getFullYear()} DealDrop Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );


}

export { Home };
