"use client";

const actions = [
  { label: "Upload invoices", desc: "Keep ODYAN’s GP live." },
  { label: "Open alerts", desc: "See critical issues." },
  { label: "Today forecast", desc: "Profit & cash focus." },
  { label: "Supplier moves", desc: "Price changes & risk." },
  { label: "GM brief", desc: "Daily talking points." },
];

export function ActionRibbonV3() {
  return (
    <section className="mt-10 rounded-2xl bg-[#020617] border border-white/5 shadow-[0_0_40px_rgba(15,23,42,0.9)] px-5 py-4 flex flex-wrap gap-3 items-center justify-between">
      {actions.map((action) => (
        <button
          key={action.label}
          className="group relative px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-sky-400 hover:bg-slate-900/90 text-left transition flex flex-col min-w-[140px]"
        >
          <span className="text-[0.8rem] font-medium text-slate-50 group-hover:text-sky-200">
            {action.label}
          </span>
          <span className="text-[0.7rem] text-slate-400 group-hover:text-slate-300">
            {action.desc}
          </span>
          <span className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 opacity-0 group-hover:opacity-100 blur-[2px] transition" />
        </button>
      ))}
    </section>
  );
}
