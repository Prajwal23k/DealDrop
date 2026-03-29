import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Sidebar() {
    const { user } = useContext(AuthContext);

    const linkClass = ({ isActive }) =>
        `block px-4 py-2 rounded-lg font-medium transition ${
            isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <div className="w-64 bg-white border-r flex flex-col p-4">
            {/* Logo */}
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">
                DealDrop
            </h2>

            {/* User Info */}
            <div className="mb-6">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
                <NavLink to="/dashboard" className={linkClass}>
                    Dashboard
                </NavLink>

                <NavLink to="/dashboard/auctions" className={linkClass}>
                    Browse Auctions
                </NavLink>

                <NavLink to="/dashboard/bids" className={linkClass}>
                    My Bids
                </NavLink>

                <NavLink to="/dashboard/profile" className={linkClass}>
                    Profile
                </NavLink>

                {/* Seller */}
                {user?.role === "seller" && (
                    <>
                        <hr className="my-3" />
                        <NavLink to="/dashboard/create" className={linkClass}>
                            Create Auction
                        </NavLink>

                        <NavLink to="/dashboard/my-auctions" className={linkClass}>
                            My Auctions
                        </NavLink>
                    </>
                )}

                {/* Admin */}
                {user?.role === "admin" && (
                    <>
                        <hr className="my-3" />
                        <NavLink to="/dashboard/requests" className={linkClass}>
                            Seller Requests
                        </NavLink>
                    </>
                )}
            </nav>
        </div>
    );
}

export {Sidebar};