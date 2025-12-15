"use client";

import React from "react";

const kpis = [
  {
    label: "Group GP today",
    value: "67.4%",
    change: "+1.8 pts vs last week",
    bar: 0.67,
  },
  {
    label: "Net supplier spend (WTD)",
    value: "£28.9k",
    change: "£3.2k above plan",
    bar: 0.58,
  },
  {
    label: "Guest rating (7 days)",
    value: "4.5 ★",
    change: "126 new reviews",
    bar: 0.9,
  },
  {
    label: "Operational heat",
    value: "73 / 100",
    change: "2 venues above risk band",
    bar: 0.73,
  },
];

export default function KpiStack() {
  return (
    <section className="flex h-full flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
        Core status
      </p>
      <div className="flex flex-col gap-3">
        {kpis.map((kpi) => (
          <article
            key={kpi.label}
            className="group rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 px-4 py-3 transition hover:border-cyan-400/60 hover:shadow-[0_0_24px_rgba(34,211,238,0.4)]"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {kpi.label}
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="text-lg font-semibold">{kpi.value}</span>
              <span className="text-[10px] text-cyan-300">{kpi.change}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${kpi.bar * 100}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
