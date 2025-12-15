"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const rivals = [
  { name: "Brunch Hub", x: 1, y: 4, size: 26 },
  { name: "Neighbour Café", x: 2.5, y: 2, size: 18 },
  { name: "New All-day Diner", x: 3.5, y: 3.2, size: 32 },
  { name: "Delivery-only Brand", x: 4.5, y: 1.3, size: 22 },
];

export function CompetitiveBubbleV3() {
  return (
    <section className="rounded-3xl bg-[#050814] border border-white/5 shadow-2xl shadow-black/50 p-6 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
            Competitive bubble
          </p>
          <h3 className="text-sm font-medium text-slate-50">
            Price · experience · promo pressure
          </h3>
        </div>
        <button className="text-[0.7rem] text-slate-400 hover:text-slate-100 transition">
          Open battlefield →
        </button>
      </div>

      <div className="h-72 rounded-2xl bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] border border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_0%_0%,_#22C55E0a,_transparent_55%),_radial-gradient(circle_at_100%_100%,_#6366F10d,_transparent_55%)]" />
        <Plot
          data={[
            {
              x: rivals.map((r) => r.x),
              y: rivals.map((r) => r.y),
              text: rivals.map((r) => r.name),
              mode: "markers+text",
              textposition: "top center",
              marker: {
                size: rivals.map((r) => r.size),
                color: ["#22C55E", "#38BDF8", "#F97316", "#A855F7"],
                opacity: 0.9,
              },
            } as any,
          ]}
          layout={{
            autosize: true,
            margin: { l: 30, r: 10, t: 10, b: 30 },
            paper_bgcolor: "rgba(2,6,23,0)",
            plot_bgcolor: "rgba(2,6,23,0)",
            xaxis: {
              title: "Price pressure",
              color: "#64748B",
              gridcolor: "#111827",
              zeroline: false,
            },
            yaxis: {
              title: "Guest appeal",
              color: "#64748B",
              gridcolor: "#111827",
              zeroline: false,
            },
            showlegend: false,
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <p className="text-[0.7rem] text-slate-400">
        ODYAN flags <span className="text-rose-300 font-medium">3 live promos</span> in this battle-field and suggests{" "}
        <span className="text-sky-300">2 counter-moves</span> on brunch and delivery.
      </p>
    </section>
  );
}
