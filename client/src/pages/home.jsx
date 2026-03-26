import { AuthContext } from "../context/authContext.jsx";
import { useContext, useState, useEffect } from "react";
import { API } from "../api/axios.js";
import { useNavigate, Link } from "react-router-dom";

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

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            {/* Navigation Header */}
            <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Left: Name */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-3xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-700 transition">
                                DealDrop
                            </Link>
                        </div>
                        
                        {/* Middle: Search */}
                        <div className="flex-1 flex justify-center px-4 md:px-8 hidden md:flex">
                            <div className="w-full max-w-lg">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Search live auctions..."
                                        className="w-full pl-5 pr-12 py-2.5 rounded-full border-2 border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 shadow-sm transition-all duration-300"
                                    />
                                    <button className="absolute right-0 top-0 mt-2.5 mr-4 text-gray-400 group-hover:text-indigo-600 transition-colors">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Auth */}
                        <div className="flex items-center space-x-6">
                            {user ? (
                                <>
                                    <div className="flex flex-col text-right hidden sm:flex">
                                        <span className="text-xs text-gray-500 font-medium">Welcome back,</span>
                                        <span className="text-gray-900 font-bold capitalize">{user.username || user.role}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="px-5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-colors duration-300"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transform font-semibold transition-all duration-300">
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                {/* Horizontal Image Banner */}
                <section className="relative w-full h-80 md:h-[28rem] bg-gray-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-black/60 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
                        alt="Auction Banner"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
                        <span className="px-4 py-1.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
                            Premium Auctions Daily
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg leading-tight">
                            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Incredible Deals</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-md font-light">
                            Bid on exclusive items, transparently and securely.
                        </p>
                    </div>
                </section>

                {/* 3 Sections Top Text Area */}
                <section className="bg-white py-12 md:py-16 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Section */}
                            <div className="text-center p-6 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
                                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Exclusive Items</h3>
                                <p className="text-gray-600 text-sm">Find rare collections and unique items you simply won't find anywhere else.</p>
                            </div>
                            
                            {/* Mid Section */}
                            <div className="text-center p-6 rounded-2xl bg-cyan-50/50 hover:bg-cyan-50 transition-colors">
                                <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Secure Bidding</h3>
                                <p className="text-gray-600 text-sm">A fully transparent process designed to keep your funds and data safe.</p>
                            </div>

                            {/* Right Section */}
                            <div className="text-center p-6 rounded-2xl bg-teal-50/50 hover:bg-teal-50 transition-colors">
                                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                                <p className="text-gray-600 text-sm">Win your auction and get your item delivered quickly to your doorstep.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Upcoming Auctions Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                        <div>
                            <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs">Live Now</span>
                            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Upcoming Auctions</h2>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 font-bold text-sm hidden sm:block pb-1">
                            View All &rarr;
                        </button>
                    </div>

                    {auctions.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                            <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-900">No auctions available</h3>
                            <p className="text-gray-500 mt-2">Check back later for exciting new deals.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {auctions.map((auction) => (
                                <div 
                                    key={auction._id} 
                                    onClick={() => navigate(`/auction/${auction._id}`)} 
                                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group border border-gray-100 transform hover:-translate-y-1"
                                >
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm z-10 flex items-center">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                                            {auction.status || "Live"}
                                        </div>
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auction.title)}&background=random&size=400`} 
                                            alt={auction.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5 flex-grow flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">{auction.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{auction.description}</p>
                                        
                                        <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-50">
                                            <div>
                                                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Current Bid</span>
                                                <span className="text-xl font-black text-indigo-600">₹{auction.currentPrice}</span>
                                            </div>
                                            <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                Bid Now
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-extrabold text-white mb-4 tracking-tight"><span className="text-indigo-500">Deal</span>Drop</h3>
                            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-4">
                                Your premier destination for exclusive auctions, antique collections, and everyday deals.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">Live Auctions</a></li>
                                <li><a href="#" className="hover:text-indigo-400 transition-colors">How it Works</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact Us</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    support@dealdrop.com
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +1 (800) DEAL-DRP
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 flex justify-between items-center text-xs text-gray-500">
                        <p>© {new Date().getFullYear()} DealDrop Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export { Home };