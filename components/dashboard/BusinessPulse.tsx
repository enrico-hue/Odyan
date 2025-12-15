// components/dashboard/BusinessPulse.tsx

import type { BusinessPulseMetric } from "@/types/dashboard";

type BusinessPulseProps = {
  metrics?: BusinessPulseMetric[];  // ← make it optional
};

function changeColor(direction: BusinessPulseMetric["direction"]) {
  if (direction === "up") return "text-amber-300";
  if (direction === "down") return "text-emerald-300";
  return "text-slate-300";
}

export default function BusinessPulse({ metrics = [] }: BusinessPulseProps) {
  //                     ^^^^^^^^^^^^^^^ default to empty array

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-md shadow-black/40">
      <header className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Business pulse
          </h2>
          <p className="text-xs text-slate-500">
            Live view of GP, labour and waste vs your targets.
          </p>
        </div>
        <span className="text-[11px] text-slate-400">
          Range: last 7 days compared with previous 7
        </span>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {metric.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-50">
              {metric.value}
            </p>
            <p className="text-[11px] text-slate-400">{metric.sublabel}</p>
            <p className={`mt-1 text-xs ${changeColor(metric.direction)}`}>
              {metric.change}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
