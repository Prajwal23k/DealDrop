import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/axios.js";

function CreateAuction() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        startingPrice: "",
        startTime: "",
        endTime: "",
        category: "",
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [recommendation, setRecommendation] = useState(null);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setRecommendation(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // 🔥 Validation
        if (!form.title || !form.startingPrice || !form.startTime || !form.endTime) {
            return alert("Please fill all required fields");
        }

        if (!form.image) {
            return alert("Please upload an image");
        }

        try {
            const data = new FormData();
            form.title = form.title.charAt(0).toUpperCase() + form.title.slice(1);
            data.append("title", form.title);
            data.append("description", form.description);
            data.append("startingPrice", form.startingPrice);
            data.append("startTime", form.startTime);
            data.append("endTime", form.endTime);
            data.append("category", form.category);
            data.append("image", form.image);

            await API.post("/createAuction", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Auction Created Successfully 🎉");

            navigate("/dashboard/auctions");

        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || "Failed to create auction");
        }
    }

    async function getRecommendation() {
        console.log("Calling recommendation API...");
        if (!form.title || !form.category) return;

        try {
            console.log("Calling API with:", form.title, form.category);

            const res = await API.get(
                `/recommend-price?title=${form.title}&category=${form.category}`
            );

            console.log("Response:", res.data);

            setRecommendation(res.data);

        } catch (e) {
            console.error("Recommendation error:", e);
        }
    }

    async function generateAI() {

        if (!form.title || !form.category) {
            return alert("Enter title and category first");
        }

        try {

            const res = await API.post(
                "/generate-description",
                {
                    title: form.title,
                    category: form.category
                }
            );

            console.log(res.data)

            setForm({
                ...form,
                description: res.data.description
            });
        } catch (e) {
            console.error(e);
        }
    }

    // 🔥 Cleanup preview memory
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <section className="mx-auto max-w-4xl space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-emerald-950 to-cyan-950 p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)] md:p-10">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
                        Seller Tools
                    </p>
                    <h2 className="mt-2 text-4xl font-black tracking-tight">Create Auction</h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        Add compelling details, set your pricing rules, and upload high-quality images to attract bidders.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-10"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Category */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-300">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                        >
                            <option value="" className="bg-slate-900">Select Category</option>
                            {["Electronics", "Fashion", "Home", "Sports", "Jewellery", "Paintings", "Others"].map(c => (
                                <option key={c} value={c} className="bg-slate-900">{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-300">Title</label>
                        <input
                            name="title"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                            placeholder="E.g., Vintage Rolex Submariner"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <label className="block text-sm font-semibold text-slate-300">Detailed Description</label>
                            <button
                                type="button"
                                onClick={generateAI}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20"
                            >
                                🤖 Generate AI Description
                            </button>
                        </div>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full min-h-[140px] rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                            placeholder="Describe the condition, features, and history of the item..."
                        />
                    </div>

                    {/* Price recommendation */}
                    <div className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">AI Pricing</p>
                                <p className="mt-1 text-sm text-slate-300">Get a smart starting price suggestion.</p>
                            </div>
                            <button
                                type="button"
                                onClick={getRecommendation}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.02]"
                            >
                                💡 Suggest Price
                            </button>
                        </div>

                        <div className="mt-4">
                            {!form.title || !form.category ? (
                                <p className="text-sm text-slate-500">Enter title and category to get a price suggestion.</p>
                            ) : recommendation ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                                        <p className="text-xs uppercase tracking-wider text-emerald-300">Suggested Start</p>
                                        <p className="mt-1 text-xl font-black text-white">₹{recommendation.suggestedStartingPrice}</p>
                                    </div>
                                    <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                                        <p className="text-xs uppercase tracking-wider text-cyan-300">Expected Final</p>
                                        <p className="mt-1 text-xl font-black text-white">₹{recommendation.expectedFinalPrice}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">Click the button to get a suggestion.</p>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">Starting Price (₹)</label>
                        <input
                            type="number"
                            name="startingPrice"
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm font-black text-white placeholder:text-slate-500 placeholder:font-normal focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
                        />
                    </div>

                    <div className="hidden md:block" />

                    {/* Start Time */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">Start Time</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition [color-scheme:dark]"
                        />
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">End Time</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition [color-scheme:dark]"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2 border-t border-white/10 pt-8 mt-2">
                        <label className="mb-3 block text-sm font-semibold text-slate-300">Product Image</label>

                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/15 rounded-3xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/60 hover:border-emerald-400/50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-10 h-10 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-emerald-400">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setForm({ ...form, image: file });
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {form.image && (
                            <div className="mt-4 flex items-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                Selected: {form.image.name}
                            </div>
                        )}

                        {preview && (
                            <div className="mt-6 rounded-3xl overflow-hidden border border-white/10 shadow-lg group">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                        Publish Auction
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            </form>
        </section>
    );

}

export { CreateAuction };