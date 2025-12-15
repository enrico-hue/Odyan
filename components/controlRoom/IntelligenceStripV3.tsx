"use client";

const cards = [
  {
    label: "GROUP GP TODAY",
    value: "67.4%",
    delta: "+1.8 pts vs last week",
    tone: "from-[#12C2E9] via-[#42E695] to-[#3BB2B8]",
  },
  {
    label: "NET SUPPLIER SPEND (WTD)",
    value: "£28.9k",
    delta: "£3.2k above plan",
    tone: "from-[#F7971E] via-[#FFD200] to-[#F37335]",
  },
  {
    label: "GUEST RATING (7 DAYS)",
    value: "4.5 ★",
    delta: "126 new reviews",
    tone: "from-[#8E2DE2] via-[#4A00E0] to-[#6A5BFF]",
  },
  {
    label: "OPERATIONAL HEAT",
    value: "73 / 100",
    delta: "2 venues above risk band",
    tone: "from-[#FF416C] via-[#FF4B2B] to-[#F27121]",
  },
];

export function IntelligenceStripV3() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Home · Control room
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
            Your ODYAN control room
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Core profit, cash, guests and competition in one live strip.
          </p>
        </div>

        <button className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium bg-gradient-to-r from-[#6A5BFF] to-[#1AD6FF] text-slate-950 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition">
          Ask ODYAN: <span className="font-semibold">“Where am I losing GP this week?”</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl bg-[#050814] border border-white/5 shadow-lg shadow-black/40 px-4 py-4 flex flex-col justify-between group"
          >
            <div className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${card.tone} mix-blend-screen blur-xl transition-opacity duration-500`} />

            <div className="relative flex items-center justify-between">
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
                {card.label}
              </p>
            </div>

            <div className="relative mt-3 flex items-end justify-between">
              <p className="text-2xl font-semibold text-slate-50">{card.value}</p>
              <p className="text-[0.7rem] text-emerald-300/80">{card.delta}</p>
            </div>

            <div className="relative mt-3 h-1.5 rounded-full bg-slate-800/70 overflow-hidden">
              <div className="w-4/5 h-full bg-gradient-to-r from-slate-50/90 via-white to-transparent group-hover:translate-x-2 transition-transform duration-700" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
