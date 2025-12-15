"use client";

const categories = [
  { label: "Brunch", impact: 65, load: "High GP, medium volume", colour: "from-[#FB7185] to-[#F97316]" },
  { label: "Desserts", impact: 48, load: "Medium GP, rising checks", colour: "from-[#34D399] to-[#22C55E]" },
  { label: "Coffee & drinks", impact: 72, load: "High margin, stable", colour: "from-[#38BDF8] to-[#6366F1]" },
  { label: "Delivery basket", impact: 39, load: "Lower GP, high volume", colour: "from-[#FBBF24] to-[#F97316]" },
];

export function CategoryPerformanceV3() {
  return (
    <section className="rounded-3xl bg-[#050814] border border-white/5 shadow-2xl shadow-black/50 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
            Category performance
          </p>
          <h3 className="text-sm font-medium text-slate-50">
            GP impact by key areas
          </h3>
        </div>
        <button className="text-[0.7rem] text-slate-400 hover:text-slate-100 transition">
          View menu impact →
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.label} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-200">{cat.label}</span>
              <span className="text-slate-400">{cat.impact}% GP impact</span>
            </div>
            <div className="relative h-2.5 rounded-full bg-slate-900 overflow-hidden">
              <div
                className={`h-full w-[${cat.impact}%] bg-gradient-to-r ${cat.colour} rounded-full shadow-[0_0_20px_rgba(56,189,248,0.4)]`}
                style={{ width: `${cat.impact}%` }}
              />
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_0%_0%,_white,_transparent_55%)] mix-blend-screen" />
            </div>
            <p className="text-[0.7rem] text-slate-500">{cat.load}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
