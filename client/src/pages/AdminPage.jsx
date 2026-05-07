import { useEffect, useState } from "react";
import { API } from "../api/axios";

function AdminPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    async function fetchRequests() {
        const res = await API.get("/seller-requests");
        setRequests(res.data);
    }

    async function approve(userId) {
        await API.patch(`/approve-seller/${userId}`);
        fetchRequests();
    }

    async function reject(userId) {
        try {
            await API.patch(`/reject-seller/${userId}`);
            alert("Rejected ❌");
            fetchRequests();
        } catch (e) {
            alert("Failed to reject");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 px-4 py-10 sm:px-6 lg:px-8">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                    {/* Header */}
                    <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-950 px-6 py-8 text-white sm:px-10">
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                                    Admin Control
                                </p>
                                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                    Seller Approval Dashboard
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                                    Review pending seller requests, inspect applicant details, and approve trusted accounts.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:min-w-[320px]">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Pending</p>
                                    <p className="mt-2 text-3xl font-black">{requests.length}</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Status</p>
                                    <p className="mt-2 text-lg font-bold">
                                        {requests.length > 0 ? "Needs Review" : "All Clear"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-8 sm:px-10">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-white">Seller Requests</h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Approve verified users to let them publish auctions.
                                </p>
                            </div>

                            <div className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300">
                                {requests.length} request{requests.length === 1 ? "" : "s"} in queue
                            </div>
                        </div>

                        {requests.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/20">
                                    <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="mt-5 text-xl font-bold text-white">No pending requests</h3>
                                <p className="mt-2 text-sm text-slate-400">
                                    Everything is up to date. New seller applications will appear here automatically.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 lg:grid-cols-2">
                                {requests.map((user, index) => (
                                    <div
                                        key={user._id}
                                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400" />

                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-lg font-black uppercase text-white shadow-lg shadow-indigo-500/30">
                                                    {(user.name || user.email || "U")[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                                                        Applicant {index + 1}
                                                    </p>
                                                    <h3 className="mt-1 text-xl font-extrabold text-white">{user.name}</h3>
                                                    <p className="mt-1 text-sm text-slate-400">Awaiting seller access approval</p>
                                                </div>
                                            </div>

                                            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                                                Pending
                                            </span>
                                        </div>

                                        <div className="mt-6 grid gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-4 text-sm text-slate-300">
                                            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                                                <span className="font-semibold text-slate-400">Email</span>
                                                <span className="truncate text-right font-bold text-white">{user.email}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="font-semibold text-slate-400">User ID</span>
                                                <span className="max-w-[60%] truncate text-right font-mono text-xs text-slate-400">
                                                    {user._id}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                            <button
                                                onClick={() => reject(user._id)}
                                                className="inline-flex items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                                            >
                                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => approve(user._id)}
                                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40"
                                            >
                                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Approve Seller
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}

export { AdminPage };
