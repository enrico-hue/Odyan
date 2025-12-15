"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { Brain, Sparkles, ArrowRight } from "lucide-react";

/* -------- EL&N-ALIGNED MOCK DATA (WORKING WIDGETS, REVERSIBLE) -------- */

const trend7d = [
  { day: "Mon", gp: 65.2, labour: 32.4, sales: 24.1 },
  { day: "Tue", gp: 66.1, labour: 31.7, sales: 25.3 },
  { day: "Wed", gp: 67.4, labour: 31.2, sales: 26.8 },
  { day: "Thu", gp: 68.2, labour: 30.9, sales: 27.4 },
  { day: "Fri", gp: 67.9, labour: 31.8, sales: 29.6 },
  { day: "Sat", gp: 66.7, labour: 32.9, sales: 31.1 },
  { day: "Sun", gp: 67.4, labour: 31.2, sales: 30.4 },
];

const trend30d = Array.from({ length: 30 }).map((_, i) => ({
  day: `${i + 1}`,
  gp: 64 + Math.sin(i / 4) * 2.2 + (i > 20 ? 1.5 : 0),
  labour: 32 + Math.cos(i / 5) * 1.4,
  sales: 20 + i * 0.4 + (i > 18 ? 2 : 0),
}));

const categoryPerf = [
  { name: "Brunch", gp: 65, change: -1.2 },
  { name: "Desserts", gp: 69, change: 0.4 },
  { name: "Coffee & drinks", gp: 72, change: 1.1 },
  { name: "Delivery basket", gp: 63, change: -0.6 },
];

const reputationGauge = [{ name: "Sentiment", value: 78, fill: "#22c55e" }];

const competitorBubble = [
  { name: "L'ETO", risk: 86, distance: 0.2 },
  { name: "Rival B", risk: 72, distance: 0.4 },
  { name: "Rival C", risk: 64, distance: 0.6 },
  { name: "Rival D", risk: 55, distance: 0.8 },
];

const liveFeed = [
  {
    type: "Invoice",
    label: "Brakes delivery landed. Cream, berries and packaging updated across two venues.",
    time: "6 min ago",
  },
  {
    type: "Competitor",
    label: "New brunch promo spotted near Oxford Circus. L'ETO increased visibility on platforms.",
    time: "18 min ago",
  },
  {
    type: "Reputation",
    label: "3 reviews mention queue time and service speed during peak brunch.",
    time: "42 min ago",
  },
  {
    type: "Menu",
    label: "Brunch GP down 1.2 pts week on week, driven by dairy and berries costs.",
    time: "Today",
  },
];

const brainSuggestions = [
  "Where is EL&N losing the most GP this week?",
  "Which EL&N venue has the biggest labour problem today?",
  "What is the impact of new competitor brunch promos?",
  "Which suppliers moved prices outside agreed bands?",
];

export default function HomePage() {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [chatInput, setChatInput] = useState("");
  const [chatQuestion, setChatQuestion] = useState(
    "Where is EL&N losing the most GP this week?"
  );
  const [chatAnswer, setChatAnswer] = useState(
    "GP softness is concentrated in brunch across two venues, driven by dairy and berries. Protect GP by adjusting prep batches, portion controls and item-level pricing on three high volume dishes first."
  );

  const activeTrend = range === "7d" ? trend7d : trend30d;

  function handleAsk() {
    if (!chatInput.trim()) return;
    setChatQuestion(chatInput.trim());
    setChatAnswer(
      "Based on current invoices, sales mix and competitor moves, ODYAN would show the 3 highest impact actions for this question and open a filtered view by venue, category and supplier."
    );
    setChatInput("");
  }

  function handleSuggestionClick(text: string) {
    setChatQuestion(text);
    setChatAnswer(
      "ODYAN ranks venues, categories, dishes and suppliers behind this question. In the real system this opens a focused view filtered to EL&N data."
    );
  }

  return (
    <div className="space-y-8 text-slate-100">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Home
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            EL&amp;N control room
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            Profit, guests, cash and competition in one glance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <KpiPill label="GP today" value="67.4%" trend="+1.8 pts" tone="good" />
          <KpiPill
            label="Net spend this week"
            value="£28.9k"
            trend="£3.1k above plan"
            tone="warn"
          />
          <KpiPill
            label="Operational heat"
            value="73 / 100"
            trend="2 venues above alert band"
            tone="critical"
          />
        </div>
      </div>

      {/* BIG BRAIN STRIP */}
      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)] gap-4">
        {/* LEFT: CHAT AREA */}
        <motion.div
          className="rounded-3xl border border-cyan-400/60 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.35),transparent_60%),radial-gradient(circle_at_120%_120%,rgba(16,185,129,0.25),transparent_55%),linear-gradient(to_bottom,#020617,#020617)] px-6 py-6 shadow-[0_36px_110px_rgba(34,211,238,0.65)] flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-cyan-300/70"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34,211,238,0.6)",
                      "0 0 40px 0 rgba(34,211,238,0.9)",
                    ],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Brain className="h-5 w-5 text-cyan-300" />
                </motion.div>
                <motion.div
                  className="pointer-events-none absolute inset-[-6px] rounded-3xl border border-cyan-400/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                  ODYAN brain
                </p>
                <p className="text-sm md:text-base text-slate-100">
                  Ask anything about EL&amp;N. ODYAN answers from your own data.
                </p>
              </div>
            </div>

            <Link
              href="/overview"
              className="inline-flex items-center gap-1 rounded-full border border-cyan-300/50 bg-slate-950/40 px-4 py-2 text-sm text-cyan-200 hover:bg-slate-900/70 transition"
            >
              <Sparkles className="h-4 w-4" />
              Open full AI console
            </Link>
          </div>

          {/* Chat bubbles */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 px-4 py-4 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 mb-1">
                You asked
              </p>
              <p className="text-base md:text-lg text-slate-50">
                {chatQuestion}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300 mb-1">
                ODYAN
              </p>
              <p className="text-base md:text-lg text-slate-100 leading-relaxed">
                {chatAnswer}
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                className="flex-1 rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Example: Which categories are pulling GP down this week?"
              />
              <button
                onClick={handleAsk}
                className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm md:text-base font-semibold text-slate-950 shadow-[0_18px_55px_rgba(34,211,238,0.7)] hover:opacity-90 transition"
              >
                Ask ODYAN
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              {brainSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="rounded-full border border-cyan-300/40 bg-slate-950/70 px-4 py-2 text-cyan-200 hover:border-cyan-300 hover:bg-slate-900 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: NEURAL VISUAL + LIVE FEED */}
        <motion.div
          className="relative rounded-3xl border border-slate-800 bg-slate-950/95 px-5 py-5 shadow-[0_32px_100px_rgba(0,0,0,0.95)] overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <NeuralBackground />
          </div>

          <div className="relative flex flex-col h-full gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  ODYAN network
                </p>
                <p className="text-sm text-slate-300">
                  Invoices, sales, labour, reviews and competitors pulsing together.
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                Live mock data
              </span>
            </div>

            <div className="relative mt-1 rounded-2xl bg-slate-950/85 border border-slate-800 px-4 py-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">
                  Live events
                </p>
                <p className="text-sm text-slate-500">
                  Demo: latest signals ODYAN is watching.
                </p>
              </div>

              <ul className="space-y-3 text-sm">
                {liveFeed.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-3 rounded-2xl bg-slate-900/80 px-3 py-3"
                  >
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs text-slate-200">
                      {item.type}
                    </span>
                    <p className="flex-1 text-slate-100 leading-relaxed">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 whitespace-nowrap">
                      {item.time}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TREND + CATEGORY CHARTS */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-4">
        {/* MAIN TREND */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                Trend view
              </p>
              <p className="text-sm text-slate-300">
                GP, labour and sales over time.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setRange("7d")}
                className={`px-4 py-2 rounded-full border font-semibold ${
                  range === "7d"
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                    : "border-slate-700 bg-slate-900 text-slate-200"
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setRange("30d")}
                className={`px-4 py-2 rounded-full border font-semibold ${
                  range === "30d"
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                    : "border-slate-700 bg-slate-900 text-slate-200"
                }`}
              >
                30 days
              </button>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrend} margin={{ left: -18, right: 10 }}>
                <defs>
                  <linearGradient id="gpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="labourGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
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
                  dataKey="gp"
                  stroke="#22d3ee"
                  fillOpacity={1}
                  fill="url(#gpGradient)"
                  strokeWidth={2.5}
                  name="GP"
                />
                <Area
                  type="monotone"
                  dataKey="labour"
                  stroke="#f97316"
                  fillOpacity={0.7}
                  fill="url(#labourGradient)"
                  strokeWidth={2.5}
                  name="Labour"
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={false}
                  name="Sales index"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <MiniStat label="GP avg" value="67.4%" helper="+1.8 pts vs last week" />
            <MiniStat label="Labour avg" value="31.2%" helper="2 venues heavy" />
            <MiniStat label="Sales index" value="124" helper="Stronger Fri to Sun" />
          </div>
        </motion.div>

        {/* CATEGORY PERFORMANCE */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                Category performance
              </p>
              <p className="text-sm text-slate-300">
                GP by category with change vs last week.
              </p>
            </div>
            <Link
              href="/overview"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              View menu impact →
            </Link>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryPerf}
                margin={{ left: -18, right: 10, top: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    fontSize: 13,
                  }}
                  labelStyle={{ color: "#e5e7eb", fontSize: 13 }}
                />
                <Bar dataKey="gp" radius={[8, 8, 0, 0]} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <MiniStat label="Weakest" value="Brunch" helper="-1.2 pts" />
            <MiniStat label="Strongest" value="Coffee & drinks" helper="+1.1 pts" />
          </div>
        </motion.div>
      </section>

      {/* REPUTATION + COMPETITIVE PREVIEWS */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] gap-4">
        {/* Reputation */}
        <motion.div
          className="rounded-3xl border border-emerald-500/50 bg-slate-950/95 px-5 py-5 shadow-[0_24px_80px_rgba(16,185,129,0.55)] flex flex-col md:flex-row gap-5 items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="w-full md:w-1/2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={reputationGauge}
                innerRadius="60%"
                outerRadius="100%"
                startAngle={220}
                endAngle={-40}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  dataKey="value"
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={18}
                  fill="#22c55e"
                  background={{ fill: "#0f172a" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2 text-slate-200">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">
              Reputation pulse
            </p>
            <p className="text-lg font-semibold text-slate-50">
              78 sentiment score
            </p>
            <p className="text-sm md:text-base text-slate-200">
              4.5 average rating across platforms
            </p>
            <p className="text-sm md:text-base text-slate-200">
              126 new reviews in the last 7 days
            </p>
            <p className="text-sm md:text-base text-slate-300">
              Main themes: service speed, value perception and brunch visuals.
            </p>
            <Link
              href="/reputation"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Open reputation →
            </Link>
          </div>
        </motion.div>

        {/* Competitor preview */}
        <motion.div
          className="rounded-3xl border border-violet-500/50 bg-slate-950/95 px-5 py-5 shadow-[0_24px_80px_rgba(139,92,246,0.55)] space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.18em] text-violet-200">
                Competitive bubble
              </p>
              <p className="text-sm text-slate-300">
                Risk vs distance for key rivals around one of your venues.
              </p>
            </div>
            <Link
              href="/competitors/hub"
              className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Open competitors →
            </Link>
          </div>

          <div className="h-48 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-2 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={competitorBubble}
                margin={{ left: -10, right: 10, top: 10, bottom: 5 }}
              >
                <CartesianGrid stroke="#1f2937" />
                <XAxis
                  dataKey="distance"
                  tickFormatter={(v) => `${Math.round(v * 10) / 10} km`}
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="risk"
                  tick={{ fill: "#64748b", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    fontSize: 13,
                  }}
                  labelFormatter={(v) => `Distance: ${v} km`}
                  formatter={(value: any, name: any) =>
                    name === "risk" ? [`${value} risk`, "Risk index"] : value
                  }
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
            <MiniStat label="Rivals in bubble" value="18" helper="Within 1 km" />
            <MiniStat label="High risk" value="3" helper="Need attention" />
            <MiniStat label="Promos this week" value="4" helper="Brunch heavy" />
          </div>
        </motion.div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 text-sm">
        <QuickAction href="/invoices" title="Upload invoices" subtitle="Keep ingestion live." />
        <QuickAction href="/overview" title="Open alerts" subtitle="See critical issues." />
        <QuickAction href="/overview" title="Today forecast" subtitle="GP and cash view." />
        <QuickAction href="/invoices" title="Supplier moves" subtitle="Track price shifts." />
        <QuickAction href="/competitors/hub" title="Competitors" subtitle="Market and price map." />
        <QuickAction href="/overview" title="GM brief" subtitle="Daily talking points." />
      </section>
    </div>
  );
}

/* -------- NEURAL BACKGROUND VISUAL -------- */

function NeuralBackground() {
  const nodes = [
    { top: "15%", left: "18%", delay: 0 },
    { top: "35%", left: "70%", delay: 0.4 },
    { top: "65%", left: "30%", delay: 0.8 },
    { top: "75%", left: "80%", delay: 1.2 },
    { top: "45%", left: "48%", delay: 1.6 },
  ];

  return (
    <>
      <motion.div
        className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      {nodes.map((node, idx) => (
        <motion.div
          key={idx}
          className="absolute h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]"
          style={{ top: node.top, left: node.left }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3.2,
            delay: node.delay,
            repeat: Infinity,
          }}
        />
      ))}
      <div className="absolute inset-10 border border-slate-800/60 rounded-[2rem]" />
      <div className="absolute left-[20%] top-[20%] right-[15%] bottom-[25%] border border-slate-800/40 rounded-[2rem]" />
    </>
  );
}

/* -------- SMALL HELPERS -------- */

type Tone = "good" | "warn" | "critical";

function KpiPill({
  label,
  value,
  trend,
  tone,
}: {
  label: string;
  value: string;
  trend: string;
  tone: Tone;
}) {
  const colour =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warn"
      ? "text-amber-300"
      : "text-rose-300";

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-3 shadow-[0_16px_55px_rgba(0,0,0,0.7)]">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <div className="flex items-baseline gap-3 mt-2">
        <p className="text-xl font-semibold text-slate-50">{value}</p>
        <p className={`text-sm font-semibold ${colour}`}>{trend}</p>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="text-base font-semibold text-slate-50">{value}</p>
      <p className="text-sm text-slate-400">{helper}</p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="h-full rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_16px_55px_rgba(0,0,0,0.7)] hover:border-cyan-400/70 hover:bg-slate-900/95 transition">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-base font-semibold text-slate-100">{title}</p>
          <span className="text-base text-cyan-300 group-hover:translate-x-0.5 transition">
            →
          </span>
        </div>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </Link>
  );
}
