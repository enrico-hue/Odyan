"use client";

import React from "react";

const nodes = [
  { label: "Sales", x: "18%", y: "32%" },
  { label: "Inventory", x: "70%", y: "28%" },
  { label: "Labour", x: "64%", y: "70%" },
  { label: "Suppliers", x: "30%", y: "72%" },
  { label: "Delivery", x: "48%", y: "18%" },
  { label: "Reputation", x: "52%", y: "84%" },
];

export default function BrainHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 shadow-[0_0_60px_rgba(56,189,248,0.15)]">
      {/* Glow layers */}
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-cyan-500 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-purple-500 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
              OdYAN brain
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Live data connections
            </h2>
            <p className="mt-1 max-w-md text-xs text-slate-300">
              ODYAN reads invoices, POS, stock, labour, delivery apps and
              reviews, then connects them into one live model of your business.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>
              Brain status: active
            </span>
            <span className="text-[10px] text-slate-400">
              Last full sync 9 minutes ago
            </span>
          </div>
        </div>

        {/* Brain node map + quick summary */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
          {/* Node map */}
          <div className="relative h-52 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 px-4 py-3">
            <div className="absolute inset-0 opacity-60">
              <div className="h-full w-full rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),transparent_55%),_radial-gradient(circle_at_bottom,_rgba(147,51,234,0.25),transparent_55%)]" />
            </div>

            {/* central core */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-cyan-400/70 bg-slate-950/80 shadow-[0_0_30px_rgba(56,189,248,0.45)]">
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[10px]">
                <span className="text-[9px] tracking-[0.22em] text-cyan-300/80 uppercase">
                  Core
                </span>
                <span className="text-xs font-semibold">Profit engine</span>
                <span className="text-[10px] text-cyan-200/80">67.4%</span>
              </div>
            </div>

            {/* Connection lines */}
            <svg
              className="pointer-events-none absolute inset-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.0" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="24"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="0.7"
                strokeDasharray="1.8 2.2"
                className="animate-[pulse_4s_ease-in-out_infinite]"
              />
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.label}
                className="pointer-events-auto absolute flex flex-col items-center"
                style={{ left: node.x, top: node.y }}
              >
                <div className="relative">
                  <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-cyan-400/50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                </div>
                <span className="mt-1 text-[10px] text-slate-200">
                  {node.label}
                </span>
              </div>
            ))}
          </div>

          {/* Quick narrative + chat */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-3 text-xs text-slate-200">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
                Today&apos;s brain view
              </p>
              <p>
                ODYAN sees{" "}
                <span className="text-cyan-300">
                  dairy costs and evening labour
                </span>{" "}
                putting pressure on GP in two venues, while{" "}
                <span className="text-emerald-300">delivery basket size</span>{" "}
                keeps rising.
              </p>
            </div>

            {/* Chat input */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Ask odyan
              </label>
              <div className="relative flex items-center gap-2 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs shadow-inner shadow-slate-950/80">
                <input
                  type="text"
                  placeholder='Example: "Where am I losing the most GP this week?"'
                  className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <button className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1 text-[11px] font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                  Ask
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Biggest GP risk today",
                  "Overstaffed hours",
                  "Supplier price shocks",
                ].map((t) => (
                  <button
                    key={t}
                    className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-[10px] text-slate-300 hover:border-cyan-400/60 hover:text-cyan-200 transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
