// components/ui/AlertsFeed.tsx
import React from "react";

export default function AlertsFeed() {
  return (
    <section className="w-full max-w-5xl mx-auto rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Live alerts
          </p>
          <p className="text-xs text-slate-300">
            Most important anomalies ODYAN has detected across your operation.
          </p>
        </div>
        <button className="rounded-full border border-slate-600 px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-800">
          View alert log
        </button>
      </div>

      <ul className="space-y-2 text-xs text-slate-200">
        <li>• Supplier Brakes increased veg prices +7.4% vs last week.</li>
        <li>• Hyde Park kiosk labour forecast is 9% above target for today.</li>
        <li>• Deliveroo rating for EL&N Oxford Circus dropped from 4.9 → 4.6.</li>
      </ul>
    </section>
  );
}
