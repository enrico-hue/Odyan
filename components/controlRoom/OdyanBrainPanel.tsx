"use client";

const nodes = [
  { label: "Sales", x: "15%", y: "22%" },
  { label: "Invoices", x: "70%", y: "18%" },
  { label: "Inventory", x: "20%", y: "70%" },
  { label: "Labour", x: "78%", y: "65%" },
  { label: "Reviews", x: "48%", y: "85%" },
  { label: "Competitors", x: "50%", y: "10%" },
];

export function OdyanBrainPanel() {
  return (
    <aside className="h-full rounded-3xl bg-[#020617] border border-sky-400/20 shadow-[0_0_40px_rgba(56,189,248,0.35)] p-4 flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
            ODYAN brain
          </p>
          <h3 className="text-sm font-medium text-slate-50">
            Live data connections
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[0.7rem] text-emerald-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          Active
        </div>
      </header>

      {/* Neural map */}
      <div className="relative flex-1 rounded-2xl bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] overflow-hidden border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_#22C55E15,_transparent_55%),_radial-gradient(circle_at_80%_100%,_#38BDF815,_transparent_55%)]" />

        {/* Core node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-28 h-28 rounded-3xl bg-slate-950/90 border border-sky-400/40 shadow-[0_0_35px_rgba(56,189,248,0.6)] flex flex-col items-center justify-center">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
              Core
            </p>
            <p className="text-sm text-slate-50 font-semibold">Profit engine</p>
            <p className="mt-1 text-[0.7rem] text-sky-300/90">GP 67.4%</p>
          </div>
        </div>

        {/* Connection lines (simple gradients) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[18%] top-[24%] right-1/2 bottom-1/2 border-t border-sky-500/30" />
          <div className="absolute left-1/2 top-1/2 right-[22%] bottom-[38%] border-t border-emerald-400/30" />
          <div className="absolute left-[24%] top-[68%] right-1/2 bottom-[30%] border-t border-amber-400/25" />
          <div className="absolute left-1/2 top-[58%] right-[18%] bottom-[30%] border-t border-rose-400/25" />
          <div className="absolute left-1/2 top-[40%] right-1/2 bottom-[8%] border-r border-sky-400/25" />
        </div>

        {/* Outer nodes */}
        {nodes.map((n) => (
          <div
            key={n.label}
            className="absolute flex flex-col items-center"
            style={{ left: n.x, top: n.y }}
          >
            <div className="w-8 h-8 rounded-2xl bg-slate-900/90 border border-white/20 flex items-center justify-center text-[0.65rem] text-slate-100 shadow-[0_0_12px_rgba(148,163,184,0.6)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
            </div>
            <p className="mt-1 text-[0.65rem] text-slate-300">{n.label}</p>
          </div>
        ))}
      </div>

      {/* Activity list */}
      <div className="space-y-2 text-[0.7rem] text-slate-300">
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
          Live signals
        </p>
        <ul className="space-y-1.5">
          <li className="flex gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-[0.35rem]" />
            <span>Invoices + sales + labour synced in the last 12 minutes.</span>
          </li>
          <li className="flex gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 mt-[0.35rem]" />
            <span>4 competitor menu changes ingested this morning.</span>
          </li>
          <li className="flex gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-[0.35rem]" />
            <span>Delivery reviews spike detected for tonight’s service.</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
