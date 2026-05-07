import { useContext } from "react";
import { AuthContext } from "../context/authContext.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { API } from "../api/axios.js"
import { Link, useNavigate } from "react-router-dom";

function Profile() {
    const [userData, setUserData] = useState(null);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showSellerForm, setShowSellerForm] = useState(false);

    const [sellerForm, setSellerForm] = useState({
        sellerType: "",
        sellingCategory: "",
        sellerReason: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await API.get("/me");
            setUserData(res.data);
        } catch (e) {
            console.error(e);
        }
    }

    async function requestSeller() {

        try {

            const res = await API.post(
                "/request-seller",
                sellerForm
            );

            alert(res.data.message);

            setShowSellerForm(false);

            setSellerForm({
                sellerType: "",
                sellingCategory: "",
                sellerReason: ""
            });

            fetchProfile();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                "Request failed"
            );
        }
    }

    async function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    if (!userData) return (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-6 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">
                Profile
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-200">
                Loading your account...
            </p>
            <div className="mt-4 flex justify-center">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/2 animate-pulse bg-gradient-to-r from-sky-400 to-indigo-400" />
                </div>
            </div>
        </div>
    );

    return (
        <section className="mx-auto max-w-4xl space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)] md:p-8">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                        Account Overview
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                        Profile
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        Review your personal details, account role, and seller access status from one clean profile panel.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
                {/* User Info */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-lg font-black uppercase text-white shadow-lg shadow-sky-500/30">
                            {(userData.name || "U")[0]}
                        </div>
                        <h3 className="text-lg font-bold text-white">User Info</h3>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {[
                            { label: "Name", value: userData.name },
                            { label: "Email", value: userData.email, breakAll: true },
                            { label: "Phone", value: userData.phone },
                            { label: "Role", value: userData.role, capitalize: true },
                        ].map((f) => (
                            <div key={f.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-sky-400/30 hover:bg-white/[0.06]">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                    {f.label}
                                </p>
                                <p className={`mt-2 text-lg font-semibold text-white ${f.breakAll ? "break-all" : ""} ${f.capitalize ? "capitalize" : ""}`}>
                                    {f.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Access & Actions */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                    <h3 className="text-lg font-bold text-white">Access & Actions</h3>

                    {userData.role !== "admin" && (
                        <div className="mt-5 rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                                Seller Status
                            </p>
                            <p className="mt-3 text-2xl font-black capitalize text-white">
                                {userData.sellerRequest}
                            </p>
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        {userData.role !== "seller" && userData.role !== "admin" && (
                            <button
                                onClick={() => setShowSellerForm(true)}
                                className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.02] hover:shadow-sky-500/40"
                            >
                                Request Seller Access
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="cursor-pointer w-full rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            {showSellerForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

                    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">

                        <h2 className="text-2xl font-black text-white">
                            Seller Request
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Tell us what kind of seller you want to become.
                        </p>

                        {/* Seller Type */}
                        <div className="mt-6">
                            <label className="text-sm font-semibold text-slate-300">
                                Seller Type
                            </label>

                            <select
                                value={sellerForm.sellerType}
                                onChange={(e) =>
                                    setSellerForm({
                                        ...sellerForm,
                                        sellerType: e.target.value
                                    })
                                }
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-sky-400"
                            >
                                <option value="">Select Type</option>
                                <option value="Individual">Individual</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div className="mt-4">
                            <label className="text-sm font-semibold text-slate-300">
                                Selling Category
                            </label>

                            <select
                                value={sellerForm.sellingCategory}
                                onChange={(e) =>
                                    setSellerForm({
                                        ...sellerForm,
                                        sellingCategory: e.target.value
                                    })
                                }
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-sky-400"
                            >
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home">Home</option>
                                <option value="Sports">Sports</option>
                                <option value="Jewellery">Jewellery</option>
                            </select>
                        </div>

                        {/* Reason */}
                        <div className="mt-4">
                            <label className="text-sm font-semibold text-slate-300">
                                Reason
                            </label>

                            <textarea
                                placeholder="Why do you want seller access?"
                                value={sellerForm.sellerReason}
                                onChange={(e) =>
                                    setSellerForm({
                                        ...sellerForm,
                                        sellerReason: e.target.value
                                    })
                                }
                                className="mt-2 min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-sky-400"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                onClick={() => setShowSellerForm(false)}
                                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={requestSeller}
                                className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.02]"
                            >
                                Submit Request
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </section>
    );

}

export { Profile }
