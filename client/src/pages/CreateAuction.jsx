import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/axios.js";

function CreateAuction() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        startingPrice: "",
        startTime: "",
        endTime: ""
    });

    function handleChange(e) {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await API.post("/createAuction", form);
            alert("Auction Created Successfully");
            navigate("/");
        }
        catch (e) {
            console.error(e);
            alert(e.response?.data?.message || "Failed to create auction");
        }
    }

    return (
        <section className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 text-white shadow-[0_30px_80px_rgba(13,148,136,0.25)] md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-50/80">
                    Seller Studio
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">
                    Create Auction
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-emerald-50">
                    Set up a new listing with timing and pricing details in a
                    cleaner seller workflow.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Title
                        </label>
                        <input
                            name="title"
                            placeholder="Enter auction title"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Describe the item, condition, and bidding highlights"
                            onChange={handleChange}
                            className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Starting Price
                        </label>
                        <input
                            type="number"
                            name="startingPrice"
                            placeholder="Starting Price"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                        />
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Tip
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Use a clear title and a realistic opening price to
                            attract stronger early bidding.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Start Time
                        </label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            End Time
                        </label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                    >
                        Create Auction
                    </button>
                </div>
            </form>
        </section>
    );
}

export {CreateAuction};
