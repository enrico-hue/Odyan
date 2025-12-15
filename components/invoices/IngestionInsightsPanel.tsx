"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* TYPES */

type Severity = "High" | "Medium" | "Low";

/* MOCK DATA (EL&N-aligned, fully reversible) */

const coverageMock = [
  { day: "Mon", coverage: 74 },
  { day: "Tue", coverage: 77 },
  { day: "Wed", coverage: 82 },
  { day: "Thu", coverage: 85 },
  { day: "Fri", coverage: 87 },
  { day: "Sat", coverage: 84 },
  { day: "Sun", coverage: 89 },
];

const sourceMixMock = [
  { name: "Supplier PDF email", value: 52 },
  { name: "CSV upload", value: 18 },
  { name: "Photo capture", value: 16 },
  { name: "Portal/API", value: 14 },
];

const sourceColours = ["#22d3ee", "#22c55e", "#6366f1", "#eab308"];

const alertsMock: {
  type: string;
  detail: string;
  age: string;
  severity: Severity;
}[] = [
  {
    type: "Supplier mapping",
    detail:
      "3 invoices could not match supplier codes for dairy and berries. Map to keep EL&N GP accurate.",
    age: "12 min ago",
    severity: "High",
  },
  {
    type: "VAT check",
    detail:
      "VAT field missing in 1 CSV upload. Defaulting to 20 percent for UK venues until confirmed.",
    age: "25 min ago",
    severity: "Medium",
  },
  {
    type: "Photo quality",
    detail:
      "2 invoice photos had low contrast. Some line items may be missing for Hans Crescent and Wardour Street.",
    age: "1 hour ago",
    severity: "Low",
  },
];

/* MAIN PANEL */

export function IngestionInsightsPanel() {
  return (
    <section className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
      {/* Coverage + mix */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Coverage chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                Coverage trend
              </p>
              <p className="text-sm text-slate-300">
                Percent of EL&amp;N purchases linked to categories and venues.
              </p>
            </div>
            <span className="text-sm text-slate-500">Last 7 days</span>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={coverageMock}
                margin={{ left: -18, right: 0, top: 6 }}
              >
                <defs>
                  <linearGradient
                    id="coverageGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#22d3ee"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#22d3ee"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[60, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    fontSize: 13,
                  }}
                  labelStyle={{ color: "#e5e7eb", fontSize: 13 }}
                />
                <Area
                  type="monotone"
                  dataKey="coverage"
                  stroke="#22d3ee"
                  fill="url(#coverageGradient)"
                  strokeWidth={2.5}
                  name="Coverage"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source mix pie */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                Source mix
              </p>
              <p className="text-sm text-slate-300">
                Where today&apos;s EL&amp;N invoices came from.
              </p>
            </div>
            <span className="text-sm text-slate-500">Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-36 w-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceMixMock}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={68}
                    paddingAngle={3}
                  >
                    {sourceMixMock.map((entry, index) => (
                      <Cell key={entry.name} fill={sourceColours[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 text-sm">
              {sourceMixMock.map((src, index) => (
                <div
                  key={src.name}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: sourceColours[index] }}
                    />
                    <span className="text-slate-200">{src.name}</span>
                  </div>
                  <span className="text-slate-400">{src.value} percent</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
              Ingestion alerts
            </p>
            <p className="text-sm text-slate-300">
              Fixing these improves EL&amp;N accuracy on GP and forecasting.
            </p>
          </div>
          <button className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition">
            Open in tasks
          </button>
        </div>

        <ul className="space-y-3 text-sm">
          {alertsMock.map((a, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200">
                    {a.type}
                  </span>
                  <SeverityPill severity={a.severity} />
                </div>
                <p className="text-slate-100 leading-relaxed">{a.detail}</p>
              </div>
              <p className="whitespace-nowrap text-xs text-slate-500">
                {a.age}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* SEVERITY PILL */

function SeverityPill({ severity }: { severity: Severity }) {
  if (severity === "High") {
    return (
      <span className="inline-flex rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300 border border-rose-500/60">
        High
      </span>
    );
  }

  if (severity === "Medium") {
    return (
      <span className="inline-flex rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-400/60">
        Medium
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/60">
        Low
      </span>
  );
}
