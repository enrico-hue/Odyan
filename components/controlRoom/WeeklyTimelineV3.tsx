"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const data = [
  { day: "Mon", gp: 66, labour: 31, cashflow: 48 },
  { day: "Tue", gp: 67, labour: 31.2, cashflow: 51 },
  { day: "Wed", gp: 64, labour: 32, cashflow: 49 },
  { day: "Thu", gp: 69, labour: 31.1, cashflow: 55 },
  { day: "Fri", gp: 71, labour: 30.8, cashflow: 59 },
  { day: "Sat", gp: 70, labour: 32.4, cashflow: 61 },
  { day: "Sun", gp: 68, labour: 32.1, cashflow: 57 },
];

export function WeeklyTimelineV3() {
  return (
    <section className="rounded-3xl bg-[#050814] border border-white/5 shadow-2xl shadow-black/50 overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
            Last 7 days
          </p>
          <h3 className="text-sm font-medium text-slate-50">
            GP, labour and cashflow trend
          </h3>
        </div>
        <button className="text-[0.7rem] text-slate-400 hover:text-slate-200 transition">
          Open full timeline →
        </button>
      </div>

      <div className="h-64 px-4 pb-4">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top,_#1AD6FF0d,_transparent_55%),_radial-gradient(circle_at_bottom,_#6A5BFF14,_transparent_60%)]" />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid
              stroke="#1E293B"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              tickFormatter={(v) => `£${v}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.3)",
                padding: "10px 12px",
              }}
              labelStyle={{ color: "#E2E8F0" }}
            />
            <ReferenceLine
              yAxisId="left"
              y={68}
              stroke="#22C55E"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="gp"
              stroke="#22C55E"
              strokeWidth={2.3}
              dot={{ r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="labour"
              stroke="#38BDF8"
              strokeWidth={1.6}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cashflow"
              stroke="#F97316"
              strokeWidth={1.8}
              strokeDasharray="5 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center px-6 pb-5 text-[0.7rem] text-slate-400 border-t border-white/5">
        <p>GP under pressure on Wed · cashflow peak Fri–Sat.</p>
        <p className="text-emerald-300/80">ODYAN: build plan around Thu–Sat strength.</p>
      </div>
    </section>
  );
}
