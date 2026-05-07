function DashboardHome() {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black via-slate-950 to-indigo-950 px-5 py-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:rounded-[2rem] sm:px-8 sm:py-10">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-cyan-400/25 blur-3xl" />
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-400/25 blur-3xl" />
            <div className="absolute bottom-0 right-20 h-28 w-28 rounded-full bg-emerald-400/25 blur-3xl" />

            <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300 sm:text-xs">
                    Welcome Back
                </p>
                <h2 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-4xl md:text-5xl">
                    Welcome to your{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                        Dashboard
                    </span>
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                    Manage auctions, monitor bids, and keep your profile and selling activity organized
                    from one focused workspace.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { tag: "Auctions", title: "Browse live markets", desc: "Discover active listings and upcoming opportunities quickly.", color: "text-cyan-300", glow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]" },
                        { tag: "Bids", title: "Track your position", desc: "See whether you are winning, outbid, or have already closed the deal.", color: "text-emerald-300", glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]" },
                        { tag: "Profile", title: "Manage your account", desc: "Keep your account details and seller access request status in view.", color: "text-amber-300", glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]" },
                    ].map((card) => (
                        <div
                            key={card.tag}
                            className={`rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/[0.07] ${card.glow}`}
                        >
                            <p className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${card.color}`}>
                                {card.tag}
                            </p>
                            <p className="mt-3 text-lg font-bold sm:text-2xl">{card.title}</p>
                            <p className="mt-2 text-sm text-slate-300">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

}

export { DashboardHome };
