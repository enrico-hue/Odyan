"use client";

export function ReputationPulseV3() {
  return (
    <section className="rounded-3xl bg-[#050814] border border-white/5 shadow-2xl shadow-black/50 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Orb */}
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,_#22C55E,_#38BDF8,_#8B5CF6,_#22C55E)] opacity-70 blur-sm" />
          <div className="absolute inset-3 rounded-full bg-[#020617] border border-white/10 flex flex-col items-center justify-center text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400 mb-1">
              Sentiment score
            </p>
            <p className="text-4xl font-semibold text-slate-50">78</p>
            <p className="text-[0.7rem] text-emerald-300/80 mt-1">
              Positive & rising
            </p>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[0.7rem] text-slate-500">
            Last 30 days
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 text-xs text-slate-300">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
          Reputation pulse
        </p>
        <p>
          ODYAN compresses thousands of reviews across Google, delivery apps and
          socials into one score you can actually act on.
        </p>
        <ul className="space-y-1.5">
          <li className="flex justify-between">
            <span className="text-slate-400">Average rating</span>
            <span className="text-slate-100 font-medium">4.5 ★</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-400">New reviews · 7 days</span>
            <span className="text-slate-100 font-medium">126</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-400">Positive share</span>
            <span className="text-emerald-300 font-medium">82%</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-400">Response time (median)</span>
            <span className="text-sky-300 font-medium">47 mins</span>
          </li>
        </ul>
      </div>

      {/* Topics */}
      <div className="space-y-3 text-xs text-slate-300">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
          Hot topics
        </p>
        <div className="space-y-2">
          <TopicPill label="Service" score={88} trend="+3 pts" />
          <TopicPill label="Food quality" score={84} trend="+1 pt" />
          <TopicPill label="Value for money" score={79} trend="–2 pts" />
          <TopicPill label="Delivery experience" score={71} trend="flat" />
        </div>
      </div>
    </section>
  );
}

function TopicPill(props: { label: string; score: number; trend: string }) {
  const intensity = props.score >= 80 ? "bg-emerald-500/70" : props.score >= 75 ? "bg-sky-500/70" : "bg-amber-500/70";
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-900/70 border border-white/5 px-3 py-2">
      <div>
        <p className="text-[0.75rem] text-slate-200">{props.label}</p>
        <div className="mt-1 h-1.5 w-32 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full ${intensity}`}
            style={{ width: `${props.score}%` }}
          />
        </div>
      </div>
      <div className="text-right text-[0.7rem]">
        <p className="text-slate-100 font-semibold">{props.score} / 100</p>
        <p className="text-emerald-300/80">{props.trend}</p>
      </div>
    </div>
  );
}
