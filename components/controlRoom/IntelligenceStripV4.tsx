"use client";

import React from "react";

export default function IntelligenceStripV4() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-3 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_left,_rgba(34,211,238,0.3),transparent_55%)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_right,_rgba(147,51,234,0.25),transparent_55%)]" />
      </div>

      <div className="relative flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">
            Today&apos;s intelligence
          </p>
          <p className="mt-1 text-xs text-slate-100">
            GP is under pressure from{" "}
            <span className="text-cyan-300">dairy and poultry costs</span> and{" "}
            <span className="text-amber-300">evening labour</span> in two
            venues, while{" "}
            <span className="text-emerald-300">
              delivery basket and brunch GP
            </span>{" "}
            are your fastest upside.
          </p>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 lg:mt-0 lg:justify-end">
          {[
            { label: "Pressure", value: "Dairy + labour evenings" },
            { label: "Upside", value: "Delivery basket size" },
            { label: "Competitor", value: "Rival brunch promo" },
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-[10px]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              <span className="font-semibold text-slate-200">
                {chip.label}:
              </span>
              <span className="text-slate-300">{chip.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
