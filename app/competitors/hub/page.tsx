"use client";

import Link from "next/link";
import CompetitorsClient from "../../components/competitors/CompetitorsClient";

export default function CompetitorsHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="max-w-7xl mx-auto px-4 pb-10 pt-6 space-y-6">
        {/* Page header */}
        <header className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                ODYAN Competitors
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Competitor Intelligence Hub
              </h1>
              <p className="mt-1 text-sm md:text-base text-slate-300 max-w-2xl">
                This is the ODYAN competitors brain: a generic module that can work
                for any client, market, and dataset. It gives you a structured view
                of local brands, pricing and menu moves, independent of any single
                brand like EL&amp;N.
              </p>
            </div>

            {/* Simple pill showing where the advanced demo map lives */}
            <div className="flex flex-col items-start md:items-end gap-2 text-xs">
              <Link
                href="/competitors"
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300 hover:border-emerald-400 hover:text-emerald-200 transition"
              >
                <span>Open advanced map demo</span>
                <span className="ml-2 font-mono text-slate-100">
                  /competitors
                </span>
              </Link>
              <p className="text-[11px] text-slate-500 max-w-xs text-right md:text-right">
                That view is currently wired to a sample client dataset
                (EL&amp;N London), with a richer tactical map and battle-style
                widgets. This hub stays neutral and reusable for any brand that
                connects into ODYAN.
              </p>
            </div>
          </div>
        </header>

        {/* Main layout shell around the client */}
        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)] gap-4 md:gap-5">
          {/* Left side: main ODYAN competitors experience */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-3 md:p-4 shadow-[0_20px_80px_rgba(15,23,42,0.8)]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Live intelligence
                  </p>
                  <p className="text-sm text-slate-300">
                    Explore competitors, prices, and positioning across your estate.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                  ODYAN brain online
                </span>
              </div>

              {/* Shared competitors client module */}
              <CompetitorsClient />
            </div>
          </div>

          {/* Right side: context, roadmap, and future widgets */}
          <aside className="space-y-4">
            {/* Context card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  How this hub fits
                </p>
                <span className="text-[10px] rounded-full border border-slate-700 px-2 py-0.5 text-slate-400">
                  v0.1 skeleton
                </span>
              </div>
              <p className="text-sm text-slate-300">
                This hub is the generic ODYAN competitors module, built to work for
                any brand, country, and data source. The map-heavy demo at{" "}
                <span className="font-mono text-slate-100">/competitors</span>{" "}
                is a specialised advanced view using one example client dataset,
                which we can swap later without changing the core product.
              </p>
              <p className="text-[11px] text-slate-500">
                In the future this hub will power maps, menu diffs, price ladders,
                and AI playbooks for any restaurant that connects invoices, menus
                and delivery platforms into ODYAN.
              </p>
            </div>

            {/* Roadmap for this module */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 text-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Roadmap for competitors module
              </p>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>
                    Connect to the invoice engine so that every rival can be linked
                    to real cost and GP impact, not only mock numbers.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>
                    Add a map view and catchment bubble for each venue, with heat
                    layers that show pressure, GP risk, and review scores.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span>
                    AI menu diff engine that compares hero plates, price ladders,
                    and portion strategy against each rival.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>
                    AI playbook suggestions: clear actions the GM can take this week
                    to defend GP or grab market share from specific competitors.
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick links between the two views */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 text-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Views in this area
              </p>
              <div className="space-y-1.5 text-slate-300 text-[13px]">
                <div className="flex items-center justify-between gap-2">
                  <span>ODYAN Competitor Hub</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    /competitors/hub
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Advanced map demo (sample client)</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    /competitors
                  </span>
                </div>
              </div>
              <p className="pt-1 text-[11px] text-slate-500">
                Later we can expose these as separate entries or deep links in the
                main ODYAN navigation, while keeping client-specific logic and copy
                inside the demo view only.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
