import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Topbar() {
    const { logout } = useContext(AuthContext);

    return (
        <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800">
                Dashboard
            </h1>

            <button
                onClick={logout}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
                Logout
            </button>
        </div>
    );
}

export {Topbar};