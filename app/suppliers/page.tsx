"use client";

import type React from "react";
import {
  CheckCircle,
  Package,
  Search,
  Target,
  Sparkles,
  Banknote,
  FileText,
  AlertTriangle,
  ArrowRight,
  Scale,
  Handshake,
  Truck,
  ShieldCheck,
  UploadCloud,
  Brain,
  Database,
  Clock,
} from "lucide-react";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* MOCK DATA */

type SupplierRiskLevel = "low" | "medium" | "high";

type Supplier = {
  id: string;
  name: string;
  category: string;
  spendThisMonth: number;
  spendChangePercent: number;
  priceMoveIndex: number;
  riskLevel: SupplierRiskLevel;
  contractEnd: string;
  contractStatus: "on_band" | "drifting" | "breached";
  reliability: number;
};

type PriceMovePoint = {
  day: string;
  dairy: number;
  meat: number;
  veg: number;
  dry: number;
};

const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "Elysian Dairy",
    category: "Dairy",
    spendThisMonth: 13450,
    spendChangePercent: 8.1,
    priceMoveIndex: 112,
    riskLevel: "high",
    contractEnd: "2026-03-31",
    contractStatus: "drifting",
    reliability: 92,
  },
  {
    id: "s2",
    name: "Prime Meats",
    category: "Meat and poultry",
    spendThisMonth: 18210,
    spendChangePercent: 5.6,
    priceMoveIndex: 107,
    riskLevel: "medium",
    contractEnd: "2026-11-30",
    contractStatus: "drifting",
    reliability: 88,
  },
  {
    id: "s3",
    name: "FreshPoint Produce",
    category: "Fruit and veg",
    spendThisMonth: 9720,
    spendChangePercent: 0.4,
    priceMoveIndex: 101,
    riskLevel: "low",
    contractEnd: "2025-12-31",
    contractStatus: "on_band",
    reliability: 95,
  },
  {
    id: "s4",
    name: "Central Dry Store",
    category: "Dry and ambient",
    spendThisMonth: 14380,
    spendChangePercent: -2.3,
    priceMoveIndex: 98,
    riskLevel: "low",
    contractEnd: "2027-01-15",
    contractStatus: "on_band",
    reliability: 97,
  },
];

const priceMoves14d: PriceMovePoint[] = [
  { day: "Day 1", dairy: 100, meat: 100, veg: 100, dry: 100 },
  { day: "2", dairy: 101, meat: 100, veg: 100, dry: 99 },
  { day: "3", dairy: 103, meat: 101, veg: 100, dry: 99 },
  { day: "4", dairy: 104, meat: 102, veg: 101, dry: 99 },
  { day: "5", dairy: 106, meat: 103, veg: 101, dry: 98 },
  { day: "6", dairy: 107, meat: 104, veg: 102, dry: 98 },
  { day: "7", dairy: 108, meat: 104, veg: 102, dry: 98 },
  { day: "8", dairy: 109, meat: 105, veg: 103, dry: 98 },
  { day: "9", dairy: 110, meat: 106, veg: 103, dry: 97 },
  { day: "10", dairy: 111, meat: 106, veg: 104, dry: 97 },
  { day: "11", dairy: 112, meat: 107, veg: 104, dry: 97 },
  { day: "12", dairy: 112, meat: 108, veg: 105, dry: 97 },
  { day: "13", dairy: 113, meat: 108, veg: 105, dry: 96 },
  { day: "14", dairy: 114, meat: 109, veg: 106, dry: 96 },
];

const negotiationSuggestions: string[] = [
  "Prepare a dairy negotiation pack: last 90 days of price drift versus agreed bands for cream, butter, burrata, mascarpone and hard cheese.",
  "Run a switch scenario for steaks and premium cuts: model what happens if you move 30 percent of volume to a second-line supplier.",
  "Lock promotional support rather than list price: ask for funded bundle deals on brunch and dessert SKUs instead of accepting a base increase.",
  "Use cross-category leverage: suppliers with stable pricing can stay as preferred partners, while drifters get a volume reallocation warning.",
];

type UpcomingEvent = {
  id: string;
  type: string;
  impact: "risk" | "opportunity";
  text: string;
  time: string;
};

const upcomingEvents: UpcomingEvent[] = [
  {
    id: "e1",
    type: "Contract",
    impact: "risk",
    text: "FreshPoint contract renews in 24 days. Prepare GP and service report before the meeting.",
    time: "24 days",
  },
  {
    id: "e2",
    type: "Price",
    impact: "risk",
    text: "Elysian Dairy has moved 3 SKUs more than 8 percent in the last two weeks.",
    time: "This week",
  },
  {
    id: "e3",
    type: "Opportunity",
    impact: "opportunity",
    text: "Central Dry Store has kept pricing below band and exceeded fill rate. Consolidate more lines here.",
    time: "This month",
  },
];

/* =========================
   CONTRACT HEALTH MATRIX
   ========================= */

type BreachRiskLevel = "low" | "medium" | "high";
type DependencyLevel = "low" | "medium" | "high";

type ContractHealthRow = {
  supplierId: string;
  annualSpend: number;
  monthsRemaining: number;
  bandCompliance: number; // 0-100
  breachRisk: BreachRiskLevel;
  dependencyLevel: DependencyLevel;
  indexation: "fixed" | "cpi" | "open";
};

const contractHealthMock: Record<string, ContractHealthRow> = {
  s1: {
    supplierId: "s1",
    annualSpend: 13450 * 12,
    monthsRemaining: 15,
    bandCompliance: 72,
    breachRisk: "high",
    dependencyLevel: "medium",
    indexation: "cpi",
  },
  s2: {
    supplierId: "s2",
    annualSpend: 18210 * 12,
    monthsRemaining: 22,
    bandCompliance: 78,
    breachRisk: "medium",
    dependencyLevel: "high",
    indexation: "open",
  },
  s3: {
    supplierId: "s3",
    annualSpend: 9720 * 12,
    monthsRemaining: 7,
    bandCompliance: 93,
    breachRisk: "low",
    dependencyLevel: "medium",
    indexation: "fixed",
  },
  s4: {
    supplierId: "s4",
    annualSpend: 14380 * 12,
    monthsRemaining: 25,
    bandCompliance: 96,
    breachRisk: "low",
    dependencyLevel: "low",
    indexation: "fixed",
  },
};

/* =========================
   PRODUCT UNIVERSE
   ========================= */

type ProductUniverseStats = {
  totalSkus: number;
  mappedSkus: number;
  criticalSkus: number;
  unmappedSkus: number;
  lastUploadSource: string;
  lastUploadTime: string;
};

const mockProductUniverse: ProductUniverseStats = {
  totalSkus: 1243,
  mappedSkus: 1120,
  criticalSkus: 178,
  unmappedSkus: 123,
  lastUploadSource: "Prime Meats + Elysian Dairy price lists",
  lastUploadTime: "3 hours ago",
};

/* =========================
   ALTERNATIVE SUPPLIERS
   ========================= */

type AltSupplierOpportunity = {
  id: string;
  supplierName: string;
  category: string;
  overlapSkus: number;
  avgSavingPercent: number;
  meetsMoq: boolean;
  cityArea: string;
  status: "knownPrices" | "needsPriceList";
};

const mockAltSuppliers: AltSupplierOpportunity[] = [
  {
    id: "alt1",
    supplierName: "NewDairy Co.",
    category: "Dairy and cheese",
    overlapSkus: 14,
    avgSavingPercent: 6.4,
    meetsMoq: true,
    cityArea: "West London",
    status: "knownPrices",
  },
  {
    id: "alt2",
    supplierName: "Urban Veg Collective",
    category: "Fruit and veg",
    overlapSkus: 22,
    avgSavingPercent: 4.1,
    meetsMoq: false,
    cityArea: "East London",
    status: "knownPrices",
  },
  {
    id: "alt3",
    supplierName: "Metro Meats",
    category: "Meat and poultry",
    overlapSkus: 0,
    avgSavingPercent: 0,
    meetsMoq: false,
    cityArea: "South London",
    status: "needsPriceList",
  },
];

/* =========================
   AI NEGOTIATION COACH
   ========================= */

type NegotiationScenario = {
  id: string;
  label: string;
  description: string;
  talkTrack: string;
  ownerTasks: string[];
  supplierSignals: string[];
};

const negotiationScenariosConfig: NegotiationScenario[] = [
  {
    id: "hold_increase",
    label: "Challenge a price increase",
    description:
      "Use ODYAN evidence to push back on an above-band increase on key SKUs.",
    talkTrack:
      "Open with appreciation for the partnership, then share your evidence: show the last 90 days of SKU-level price drift versus the agreed band, plus GP impact on your top dishes. Anchor the conversation around total category spend and your expectation that any increase must be backed by hard input-cost data or value-add (support, samples, marketing). Offer to trade volume commitments for keeping prices within a fair band.",
    ownerTasks: [
      "Export a 90-day price drift report for top 10 SKUs.",
      "Attach GP impact on 5 hero dishes using those SKUs.",
      "Prepare a volume projection for the next 6 months.",
    ],
    supplierSignals: [
      "They reference generic 'market volatility' without specifics.",
      "They refuse to discuss volume guarantees or promotions.",
      "They are unable to show their own input cost increases.",
    ],
  },
  {
    id: "split_volume",
    label: "Split volume across suppliers",
    description:
      "Introduce a credible second-line supplier to de-risk your main partner.",
    talkTrack:
      "Explain that your aim is not to punish the current supplier, but to protect GP and resilience. Present the overlap analysis with alternatives: show where another supplier is cheaper, similar quality, or more sustainable. Propose a phased split of volume (for example 70/30) tied to clear service and pricing KPIs, making it reversible if targets are hit or missed.",
    ownerTasks: [
      "Run an overlap report against at least one alternative supplier.",
      "Mark SKUs that are safety-critical or quality-sensitive.",
      "Define clear service, quality and price KPIs for a 3 month test.",
    ],
    supplierSignals: [
      "They dismiss competitors without engaging with the data.",
      "They insist on exclusivity but offer no improved terms.",
      "They avoid measurable KPIs around service or quality.",
    ],
  },
  {
    id: "rebuild_contract",
    label: "Rebuild a drifting contract",
    description:
      "When a contract has drifted above band, restructure it instead of fragmenting it.",
    talkTrack:
      "Start by sharing your contract health view: band compliance, GP impact and service performance. Make clear that fragmentation is more work for both sides. Suggest a reset meeting focused purely on structure: indexation rules, review cadence, support budget, and written triggers for renegotiation. Offer a longer commitment in exchange for predictable bands and a clear breach/escalation path.",
    ownerTasks: [
      "Bring band compliance scorecard for the last 12 months.",
      "List all undocumented exceptions that crept into the deal.",
      "Draft a simple 1-page contract addendum with new rules.",
    ],
    supplierSignals: [
      "They accept that the current structure is confusing.",
      "They volunteer to clarify indexation and review rules.",
      "They are open to documenting triggers for future resets.",
    ],
  },
];

/* PAGE */

export default function SuppliersPage() {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("s1");
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    negotiationScenariosConfig[0]?.id ?? "hold_increase"
  );

  const totalSpend = suppliers.reduce((sum, s) => sum + s.spendThisMonth, 0);
  const highRiskCount = suppliers.filter(
    (s) => s.riskLevel === "high"
  ).length;
  const driftingContracts = suppliers.filter(
    (s) => s.contractStatus !== "on_band"
  ).length;

  const selectedSupplier =
    suppliers.find((s) => s.id === selectedSupplierId) ?? suppliers[0];

  const activeScenario =
    negotiationScenariosConfig.find((s) => s.id === activeScenarioId) ??
    negotiationScenariosConfig[0];

  return (
    <div className="space-y-8 text-slate-100">
      {/* HEADER */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Procurement
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Suppliers and contracts
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">
            ODYAN tracks every invoice line, price move and contract clause so
            you can protect GP without fighting Excel all day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <KpiPill
            icon={<Banknote className="h-3.5 w-3.5" />}
            label="Net spend this month"
            value={`£${formatK(totalSpend)}`}
            helper="All suppliers with active ingestion"
          />
          <KpiPill
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            label="High risk suppliers"
            value={String(highRiskCount)}
            helper="Above band or unstable pricing"
            tone="critical"
          />
          <KpiPill
            icon={<FileText className="h-3.5 w-3.5" />}
            label="Contracts drifting"
            value={String(driftingContracts)}
            helper="Need review this quarter"
            tone="warn"
          />
        </div>
      </header>

      {/* TOP GRID: PRICE MOVES + SUPPLIER TABLE */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.6fr)] gap-4">
        {/* PRICE MOVES CHART */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Price drift by category
              </p>
              <p className="text-xs text-slate-300">
                Index of list price vs baseline over the last 14 days.
              </p>
            </div>
            <span className="text-[11px] text-slate-500">
              100 equals agreed band
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={priceMoves14d}
                margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dairy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="meat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="veg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Area
                  type="monotone"
                  dataKey="dairy"
                  name="Dairy"
                  stroke="#22d3ee"
                  fill="url(#dairy)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="meat"
                  name="Meat and poultry"
                  stroke="#f97316"
                  fill="url(#meat)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="veg"
                  name="Fruit and veg"
                  stroke="#22c55e"
                  fill="url(#veg)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[11px]">
            <MiniStat
              label="Dairy index"
              value="114"
              helper="Needs negotiation plan"
            />
            <MiniStat
              label="Meat index"
              value="109"
              helper="Within warning band"
            />
            <MiniStat
              label="Veg index"
              value="106"
              helper="Still controllable"
            />
          </div>
        </motion.div>

        {/* SUPPLIER SCORECARDS */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Supplier radar
              </p>
              <p className="text-xs text-slate-300">
                Spend, risk and contract status by supplier.
              </p>
            </div>
            <Link
              href="/invoices"
              className="text-[11px] text-cyan-300 hover:text-cyan-200"
            >
              Open invoices →
            </Link>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scroll">
            {suppliers.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSupplierId(s.id)}
                className={`w-full text-left rounded-2xl border px-3 py-3 text-xs transition-colors ${
                  s.id === selectedSupplierId
                    ? "border-cyan-400 bg-slate-900"
                    : "border-slate-800 bg-slate-950 hover:border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-50">
                      {s.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{s.category}</p>
                    <p className="text-[11px] text-slate-300">
                      Spend this month:{" "}
                      <span className="font-semibold">
                        £{formatK(s.spendThisMonth)}
                      </span>{" "}
                      <span
                        className={
                          s.spendChangePercent >= 0
                            ? "text-amber-300"
                            : "text-emerald-300"
                        }
                      >
                        ({s.spendChangePercent >= 0 ? "+" : ""}
                        {s.spendChangePercent.toFixed(1)} percent vs last month)
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RiskBadge level={s.riskLevel} />
                    <ContractBadge status={s.contractStatus} />
                    <p className="text-[10px] text-slate-400">
                      Reliability: {s.reliability} / 100
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* MIDDLE GRID: SELECTED SUPPLIER DEEP DIVE + UPCOMING EVENTS */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)] gap-4">
        {/* SELECTED SUPPLIER DEEP DIVE */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Supplier focus
              </p>
              <p className="text-xs text-slate-300">
                ODYAN view on this supplier across cost, reliability and risk.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-[11px]">
              <p className="text-slate-400">
                Contract end:{" "}
                <span className="text-slate-100">
                  {selectedSupplier.contractEnd}
                </span>
              </p>
              <p className="text-slate-400">
                Price index:{" "}
                <span className="text-slate-100">
                  {selectedSupplier.priceMoveIndex}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[11px]">
            <MiniStat
              label="Spend this month"
              value={`£${formatK(selectedSupplier.spendThisMonth)}`}
              helper={`${
                selectedSupplier.spendChangePercent >= 0 ? "+" : ""
              }${selectedSupplier.spendChangePercent.toFixed(
                1
              )} percent vs last month`}
            />
            <MiniStat
              label="Price drift index"
              value={String(selectedSupplier.priceMoveIndex)}
              helper="100 equals your agreed band"
            />
            <MiniStat
              label="Reliability"
              value={`${selectedSupplier.reliability} / 100`}
              helper="Fill rate and on time deliveries"
            />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 text-xs space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              ODYAN suggestion
            </p>
            <p className="text-slate-200">
              Start your next negotiation with concrete evidence: attach price
              drift on top 10 SKUs, GP impact on hero dishes and a comparison
              against at least one backup supplier. Ask for concessions on
              structure and support, not only list price.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1">
                <Scale className="h-3.5 w-3.5 text-emerald-300" />
                Leverage points
              </p>
              <ul className="space-y-1.5 text-slate-300">
                <li>Volume on hero SKUs is high and growing.</li>
                <li>
                  They are not your only option in this category in the market.
                </li>
                <li>
                  Service levels are good, so you can trade stability for
                  sharper pricing.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-cyan-300" />
                Operational impact
              </p>
              <ul className="space-y-1.5 text-slate-300">
                <li>Price moves hit brunch, dessert and grill dishes first.</li>
                <li>Variance risk increases when GP drops silently.</li>
                <li>
                  ODYAN can simulate GP, price or recipe changes before you sign
                  a new deal.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* UPCOMING EVENTS AND PLAYBOOKS */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Upcoming events
              </p>
              <p className="text-xs text-slate-300">
                Contracts, breaches and opportunities ODYAN wants you to see.
              </p>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[10px] text-slate-300">
              Procurement playbook
            </span>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1 custom-scroll text-xs">
            {upcomingEvents.map((e) => (
              <UpcomingEventRow key={e.id} event={e} />
            ))}
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-3 text-xs space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-200 flex items-center gap-1">
              <Handshake className="h-3.5 w-3.5" />
              Negotiation suggestions from ODYAN
            </p>
            <ul className="space-y-1.5 text-emerald-50">
              {negotiationSuggestions.map((s, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* BOTTOM GRID: CATEGORY EXPOSURE + QUICK ACTIONS */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)] gap-4">
        {/* CATEGORY EXPOSURE BAR CHART */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Category exposure
              </p>
              <p className="text-xs text-slate-300">
                Where supplier price moves hit your menu GP.
              </p>
            </div>
            <Link
              href="/overview"
              className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
            >
              View GP impact
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { category: "Brunch", exposure: 78 },
                  { category: "Desserts", exposure: 64 },
                  { category: "Grill and steaks", exposure: 85 },
                  { category: "Coffee and drinks", exposure: 52 },
                ]}
                margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Bar
                  dataKey="exposure"
                  radius={[6, 6, 0, 0]}
                  fill="#22c55e"
                  name="Exposure index"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <MiniStat
              label="Highest exposure"
              value="Grill and steaks"
              helper="Sensitive to meat and dairy"
            />
            <MiniStat
              label="Lower exposure"
              value="Coffee and drinks"
              helper="Stable cost per cover"
            />
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3 text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Quick actions
          </p>
          <p className="text-slate-300">
            Small moves you can make this week that protect GP without big menu
            changes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <QuickAction
              href="/invoices"
              title="Upload latest invoices"
              subtitle="Keep price moves live and accurate."
            />
            <QuickAction
              href="/overview"
              title="Open GP forecast"
              subtitle="See impact of current supplier drift."
            />
            <QuickAction
              href="/invoices"
              title="Check mapping backlog"
              subtitle="Clear any unmapped SKUs."
            />
            <QuickAction
              href="/overview"
              title="Brief GMs"
              subtitle="Share key supplier moves for this week."
            />
          </div>
        </motion.div>
      </section>

      {/* PRODUCT UNIVERSE + ALTERNATIVE SUPPLIERS */}
      <ProductUniverseSection />
      <AltSuppliersSection />

      {/* CONTRACT HEALTH MATRIX */}
      <ContractHealthSection suppliers={suppliers} />

      {/* AI NEGOTIATION COACH + UPLOAD CENTER */}
      <NegotiationAndUploadSection
        activeScenario={activeScenario}
        activeScenarioId={activeScenarioId}
        setActiveScenarioId={setActiveScenarioId}
      />

      {/* SUPPLIER OPS BRAIN / CROSS-INTELLIGENCE */}
      <SupplierOpsBrainSection />
    </div>
  );
}

/* SMALL COMPONENTS */

type Tone = "default" | "warn" | "critical";

function KpiPill({
  icon,
  label,
  value,
  helper,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
  tone?: Tone;
}) {
  const colour =
    tone === "critical"
      ? "text-rose-300"
      : tone === "warn"
      ? "text-amber-300"
      : "text-emerald-300";

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950/90 px-3 py-2 shadow-[0_16px_55px_rgba(0,0,0,0.7)]">
      <div className="h-7 w-7 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-200">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-50">{value}</p>
        <p className={`text-[10px] ${colour}`}>{helper}</p>
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
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="text-xs font-semibold text-slate-50">{value}</p>
      <p className="text-[10px] text-slate-400">{helper}</p>
    </div>
  );
}

function RiskBadge({ level }: { level: SupplierRiskLevel }) {
  if (level === "high") {
    return (
      <span className="inline-flex items-center rounded-full border border-rose-500/60 bg-rose-500/15 px-2 py-0.5 text-[10px] text-rose-100">
        High risk
      </span>
    );
  }
  if (level === "medium") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100">
        Medium risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100">
      Low risk
    </span>
  );
}

function ContractBadge({
  status,
}: {
  status: Supplier["contractStatus"];
}) {
  if (status === "breached") {
    return (
      <span className="inline-flex items-center rounded-full border border-rose-500/60 bg-rose-500/15 px-2 py-0.5 text-[10px] text-rose-100">
        Contract breached
      </span>
    );
  }
  if (status === "drifting") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100">
        Drifting above band
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100">
      On band
    </span>
  );
}

function UpcomingEventRow({ event }: { event: UpcomingEvent }) {
  const impactColour =
    event.impact === "risk" ? "text-rose-300" : "text-emerald-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-[11px] text-slate-300">{event.text}</p>
          <p className="text-[10px] text-slate-500">
            {event.type} · {event.time}
          </p>
        </div>
        <span className={`text-[10px] font-medium ${impactColour}`}>
          {event.impact === "risk" ? "Risk" : "Opportunity"}
        </span>
      </div>
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
      <div className="h-full rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-3 shadow-[0_16px_55px_rgba(0,0,0,0.7)] hover:border-cyan-400/70 hover:bg-slate-900/95 transition">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="font-medium text-slate-100">{title}</p>
          <span className="text-xs text-cyan-300 group-hover:translate-x-0.5 transition">
            →
          </span>
        </div>
        <p className="text-[10px] text-slate-400">{subtitle}</p>
      </div>
    </Link>
  );
}

/* UTIL */

function formatK(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toFixed(0);
}

/* =========================
   PRODUCT UNIVERSE SECTION
   ========================= */

function ProductUniverseSection() {
  const coverage =
    (mockProductUniverse.mappedSkus / mockProductUniverse.totalSkus) * 100;

  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Product universe
          </p>
          <p className="text-sm text-slate-300">
            ODYAN master list of every SKU from every supplier, kept live from
            price lists and invoices.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
          <Package className="h-3.5 w-3.5 text-cyan-300" />
          <span>Live mock data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <UniverseStatCard
          label="Total SKUs known"
          value={mockProductUniverse.totalSkus.toString()}
          helper="All suppliers and venues combined."
        />
        <UniverseStatCard
          label="Mapped to categories"
          value={`${mockProductUniverse.mappedSkus} (${coverage.toFixed(
            1
          )} percent)`}
          helper="Ready for GP and menu impact."
        />
        <UniverseStatCard
          label="Critical GP SKUs"
          value={mockProductUniverse.criticalSkus.toString()}
          helper="Items that move GP when prices change."
        />
        <UniverseStatCard
          label="Unmapped SKUs"
          value={mockProductUniverse.unmappedSkus.toString()}
          helper="Need checking or mapping rules."
          tone="warn"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] gap-4 text-xs">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Latest uploads
          </p>
          <p className="text-[11px] text-slate-300">
            Last source:{" "}
            <span className="text-slate-100">
              {mockProductUniverse.lastUploadSource}
            </span>
          </p>
          <p className="text-[11px] text-slate-400">
            Processed: {mockProductUniverse.lastUploadTime}
          </p>
          <p className="mt-2 text-[11px] text-slate-300">
            In the full product you can drag and drop price lists or export
            files from supplier portals. ODYAN merges them with invoices,
            deduplicates SKUs and keeps one clean product universe for GP
            analysis.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Next actions
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li className="flex gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-300 mt-[2px]" />
              <span>
                Upload current product lists for any supplier that is not yet in
                ODYAN to reach 100 percent coverage.
              </span>
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-300 mt-[2px]" />
              <span>
                Confirm mapping rules for the remaining unmapped SKUs so GP and
                menu analysis can use them safely.
              </span>
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-300 mt-[2px]" />
              <span>
                Later: open the dedicated product list page to search, filter
                and edit SKUs by category, supplier and GP impact.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function UniverseStatCard({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "default" | "warn";
}) {
  const colour = tone === "warn" ? "text-amber-300" : "text-slate-50";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-1">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className={"text-sm font-semibold " + colour}>{value}</p>
      <p className="text-[11px] text-slate-400">{helper}</p>
    </div>
  );
}

/* =========================
   ALTERNATIVE SUPPLIERS
   ========================= */

function AltSuppliersSection() {
  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Alternative suppliers
          </p>
          <p className="text-sm text-slate-300">
            ODYAN scans your city for suppliers you do not use yet and models
            where a second line would protect GP.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
          <Search className="h-3.5 w-3.5 text-cyan-300" />
          <span>Market radar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] gap-4 text-xs">
        <div className="space-y-2">
          {mockAltSuppliers.map((alt) => (
            <div
              key={alt.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-100">
                  {alt.supplierName}
                </p>
                <p className="text-[11px] text-slate-400">{alt.category}</p>
                <p className="text-[11px] text-slate-400">
                  Area:{" "}
                  <span className="text-slate-100">{alt.cityArea}</span>
                </p>
                {alt.status === "knownPrices" ? (
                  <p className="text-[11px] text-slate-300">
                    Overlap on{" "}
                    <span className="text-slate-100">
                      {alt.overlapSkus} SKUs
                    </span>{" "}
                    with an average saving of{" "}
                    <span className="text-emerald-300">
                      {alt.avgSavingPercent.toFixed(1)} percent
                    </span>
                    .
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-300">
                    ODYAN has identified this supplier as relevant in your
                    catchment, but no price list is loaded yet.
                  </p>
                )}
              </div>
              <div className="text-right space-y-2">
                <AltSupplierStatusPill status={alt.status} />
                <p className="text-[10px] text-slate-500">
                  MOQ fit:{" "}
                  <span
                    className={
                      "font-medium " +
                      (alt.meetsMoq ? "text-emerald-300" : "text-amber-300")
                    }
                  >
                    {alt.meetsMoq ? "Likely" : "Check volume"}
                  </span>
                </p>
                <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] text-cyan-300 hover:border-cyan-300 hover:bg-slate-900 transition">
                  <Target className="h-3 w-3" />
                  View switch scenario
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            How ODYAN uses this
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li className="flex gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 mt-[2px]" />
              <span>
                For suppliers with known prices, ODYAN builds overlap tables
                against your current product universe and calculates GP and cash
                impact of realistic switches.
              </span>
            </li>
            <li className="flex gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 mt-[2px]" />
              <span>
                For suppliers without prices yet, ODYAN keeps them in a city
                directory so you can request price lists, upload them and unlock
                comparisons in one click.
              </span>
            </li>
            <li className="flex gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 mt-[2px]" />
              <span>
                In later phases this section will link directly to negotiation
                packs and GP simulation, so you can walk into meetings with hard
                numbers.
              </span>
            </li>
          </ul>
          <p className="mt-2 text-[10px] text-slate-500">
            Future: a dedicated supplier discovery view where you can filter new
            suppliers by category, distance, sustainability profile and
            potential savings before contacting them.
          </p>
        </div>
      </div>
    </section>
  );
}

function AltSupplierStatusPill({
  status,
}: {
  status: AltSupplierOpportunity["status"];
}) {
  const label =
    status === "knownPrices" ? "Price comparison ready" : "Needs price list";
  const colour =
    status === "knownPrices"
      ? "text-emerald-300 border-emerald-400/50 bg-emerald-500/10"
      : "text-slate-300 border-slate-600 bg-slate-800";

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] " +
        colour
      }
    >
      <FileText className="h-3 w-3 mr-1" />
      {label}
    </span>
  );
}

/* =========================
   CONTRACT HEALTH SECTION
   ========================= */

function ContractHealthSection({ suppliers }: { suppliers: Supplier[] }) {
  const rows = suppliers.map((s) => {
    const base = contractHealthMock[s.id];
    const fallback: ContractHealthRow = {
      supplierId: s.id,
      annualSpend: s.spendThisMonth * 12,
      monthsRemaining: 12,
      bandCompliance: 85,
      breachRisk: "medium",
      dependencyLevel: "medium",
      indexation: "open",
    };
    return {
      supplier: s,
      health: base ?? fallback,
    };
  });

  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-4 text-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Contract health matrix
          </p>
          <p className="text-sm text-slate-300">
            One view of band compliance, breach risk and dependency level for
            each supplier.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            <span>Supplier risk spine</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Future: link every row to a full contract dossier.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto custom-scroll">
        <table className="min-w-full text-left text-[11px] text-slate-300 border-separate border-spacing-y-2">
          <thead className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-3 py-1.5">Supplier</th>
              <th className="px-3 py-1.5">Annual spend</th>
              <th className="px-3 py-1.5">Months left</th>
              <th className="px-3 py-1.5">Band compliance</th>
              <th className="px-3 py-1.5">Breach risk</th>
              <th className="px-3 py-1.5">Dependency</th>
              <th className="px-3 py-1.5">Indexation</th>
              <th className="px-3 py-1.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ supplier, health }) => (
              <tr
                key={supplier.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90"
              >
                <td className="px-3 py-2 align-top">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-100">
                      {supplier.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {supplier.category}
                    </p>
                  </div>
                </td>
                <td className="px-3 py-2 align-top">
                  <p className="text-xs font-semibold text-slate-50">
                    £{formatK(health.annualSpend)}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    £{formatK(supplier.spendThisMonth)} / month
                  </p>
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center gap-2">
                    <span>{health.monthsRemaining}</span>
                    <span className="text-[10px] text-slate-500">months</span>
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {health.monthsRemaining <= 6
                      ? "Renewal soon"
                      : "Comfortable runway"}
                  </p>
                </td>
                <td className="px-3 py-2 align-top">
                  <BandComplianceBar value={health.bandCompliance} />
                </td>
                <td className="px-3 py-2 align-top">
                  <BreachRiskPill level={health.breachRisk} />
                </td>
                <td className="px-3 py-2 align-top">
                  <DependencyPill level={health.dependencyLevel} />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Reliability {supplier.reliability}/100
                  </p>
                </td>
                <td className="px-3 py-2 align-top">
                  <IndexationPill type={health.indexation} />
                </td>
                <td className="px-3 py-2 align-top">
                  <ContractBadge status={supplier.contractStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            What ODYAN flags here
          </p>
          <p className="mt-1 text-slate-300">
            Suppliers with high annual spend, low band compliance and short
            months remaining surface as priority renegotiations. This is your
            shortlist for deep-dive meetings.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            GP and menu link
          </p>
          <p className="mt-1 text-slate-300">
            In the full product each row links to a GP impact view that shows
            which dishes and venues are most exposed if this contract drifts.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Future automation
          </p>
          <p className="mt-1 text-slate-300">
            Later, ODYAN will auto-generate renewal packs and suggested
            negotiation scripts directly from this matrix, and schedule alerts
            for you and your GMs.
          </p>
        </div>
      </div>
    </section>
  );
}

function BandComplianceBar({ value }: { value: number }) {
  const colour =
    value >= 90
      ? "bg-emerald-400"
      : value >= 80
      ? "bg-amber-300"
      : "bg-rose-400";

  return (
    <div className="space-y-1">
      <div className="h-2.5 w-28 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full ${colour}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-400">{value} percent in-band</p>
    </div>
  );
}

function BreachRiskPill({ level }: { level: BreachRiskLevel }) {
  const map = {
    low: {
      label: "Low",
      className:
        "border-emerald-400/60 bg-emerald-500/10 text-emerald-200",
    },
    medium: {
      label: "Medium",
      className: "border-amber-400/60 bg-amber-500/10 text-amber-100",
    },
    high: {
      label: "High",
      className: "border-rose-500/60 bg-rose-500/15 text-rose-100",
    },
  } as const;

  const cfg = map[level];

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] " +
        cfg.className
      }
    >
      <AlertTriangle className="h-3 w-3 mr-1" />
      Breach risk: {cfg.label}
    </span>
  );
}

function DependencyPill({ level }: { level: DependencyLevel }) {
  const map = {
    low: {
      label: "Low dependency",
      className:
        "border-emerald-400/60 bg-emerald-500/10 text-emerald-100",
    },
    medium: {
      label: "Medium dependency",
      className: "border-amber-400/60 bg-amber-500/10 text-amber-100",
    },
    high: {
      label: "High dependency",
      className: "border-sky-400/60 bg-sky-500/10 text-sky-100",
    },
  } as const;

  const cfg = map[level];

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] " +
        cfg.className
      }
    >
      <Database className="h-3 w-3 mr-1" />
      {cfg.label}
    </span>
  );
}

function IndexationPill({ type }: { type: ContractHealthRow["indexation"] }) {
  const map = {
    fixed: {
      label: "Fixed",
      className:
        "border-emerald-400/60 bg-emerald-500/10 text-emerald-100",
    },
    cpi: {
      label: "CPI-linked",
      className: "border-sky-400/60 bg-sky-500/10 text-sky-100",
    },
    open: {
      label: "Open-ended",
      className: "border-amber-400/60 bg-amber-500/10 text-amber-100",
    },
  } as const;

  const cfg = map[type];

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] " +
        cfg.className
      }
    >
      <Scale className="h-3 w-3 mr-1" />
      {cfg.label}
    </span>
  );
}

/* =========================
   AI NEGOTIATION + UPLOAD
   ========================= */

function NegotiationAndUploadSection({
  activeScenario,
  activeScenarioId,
  setActiveScenarioId,
}: {
  activeScenario: NegotiationScenario;
  activeScenarioId: string;
  setActiveScenarioId: (id: string) => void;
}) {
  return (
    <section className="mt-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)] gap-4">
      {/* AI NEGOTIATION COACH */}
      <motion.div
        className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-3 text-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
              <Brain className="h-3.5 w-3.5 text-cyan-300" />
              AI negotiation coach
            </p>
            <p className="text-xs text-slate-300">
              Choose a scenario and ODYAN outlines a talk-track, your tasks and
              what to watch for in the supplier&apos;s behaviour.
            </p>
          </div>
          <p className="text-[10px] text-slate-500 max-w-[190px] text-right">
            Future: this will be fully AI-driven using live data from invoices,
            contracts and competitor benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {negotiationScenariosConfig.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setActiveScenarioId(scenario.id)}
              className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                activeScenarioId === scenario.id
                  ? "border-cyan-400 bg-slate-900 text-cyan-100"
                  : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
              }`}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Scenario outline
            </p>
            <p className="text-[11px] text-slate-300">
              {activeScenario.description}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Suggested talk-track:
            </p>
            <p className="text-[11px] text-slate-200">
              {activeScenario.talkTrack}
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Your preparation checklist
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {activeScenario.ownerTasks.map((task, idx) => (
                  <li key={idx} className="flex gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-300 mt-[2px]" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Supplier signals to notice
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {activeScenario.supplierSignals.map((signal, idx) => (
                  <li key={idx} className="flex gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-300 mt-[2px]" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CATALOG & CONTRACT UPLOAD CENTER */}
      <motion.div
        className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-3 text-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
              <UploadCloud className="h-3.5 w-3.5 text-cyan-300" />
              Catalog and contract ingestion
            </p>
            <p className="text-xs text-slate-300">
              Drop in price lists, contracts and catalog exports. ODYAN turns
              them into one clean product universe.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
            <Brain className="h-3.5 w-3.5 text-emerald-300" />
            <span>Vision + OCR + AI</span>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-6 text-center space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Drag files here
          </p>
          <p className="text-xs text-slate-300">
            PDF price lists, CSV exports, XLSX, contract PDFs and invoice
            batches.
          </p>
          <p className="text-[10px] text-slate-500 max-w-md mx-auto">
            In the full product this drop-zone sends documents into the ingestion
            engine, where ODYAN detects suppliers, SKUs, units, pack sizes and
            net prices before merging into your master list.
          </p>
          <div className="mt-3 flex justify-center gap-2 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1">
              <Database className="h-3 w-3" />
              Invoices
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1">
              <FileText className="h-3 w-3" />
              Price lists
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-1">
              <ShieldCheck className="h-3 w-3" />
              Contracts
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Recent ingestion jobs
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center justify-between gap-2">
                <div>
                  <p>Elysian Dairy price list March</p>
                  <p className="text-[10px] text-slate-500">
                    142 SKUs · 2 formats merged
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
                  Completed
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <div>
                  <p>Prime Meats contract PDF</p>
                  <p className="text-[10px] text-slate-500">
                    Terms parsed · indexation detected
                  </p>
                </div>
                <span className="rounded-full border border-sky-400/60 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-100">
                  Needs review
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <div>
                  <p>Mixed venue invoices week 32</p>
                  <p className="text-[10px] text-slate-500">
                    486 lines · 17 unmapped SKUs
                  </p>
                </div>
                <span className="rounded-full border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100">
                  Mapping needed
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Where this flows
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex gap-2">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300 mt-[2px]" />
                <span>
                  First, ODYAN extracts text and numbers, then normalises units,
                  pack sizes and currencies to your internal structure.
                </span>
              </li>
              <li className="flex gap-2">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300 mt-[2px]" />
                <span>
                  Second, it links SKUs to menu items and GP models so that any
                  future price drift updates GP and category exposure in real
                  time.
                </span>
              </li>
              <li className="flex gap-2">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300 mt-[2px]" />
                <span>
                  Third, it feeds competitor and alternative-supplier
                  comparisons, so your negotiation view is always fuelled by
                  live data.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================
   SUPPLIER OPS BRAIN
   ========================= */

function SupplierOpsBrainSection() {
  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-4 text-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
            <Brain className="h-3.5 w-3.5 text-cyan-300" />
            Supplier ops brain
          </p>
          <p className="text-sm text-slate-300">
            How ODYAN joins suppliers, menu GP, competitors and reputation into
            one decision engine.
          </p>
        </div>
        <p className="max-w-xs text-[10px] text-slate-500 text-right">
          This section is here to show future investors and operators the depth
          of the intelligence layer. Later, it can open into full drill-down
          views.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Price protection engine
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li>
              Monitors every invoice line vs bands and contract clauses, then
              pushes anomalies into the dashboard alerts.
            </li>
            <li>
              Links each SKU to GP-sensitive dishes so you see cash impact per
              venue, not just abstract percentages.
            </li>
            <li>
              Feeds live data into the GP forecast, so supplier changes update
              your weekly and monthly risk view automatically.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Competitor and delivery link
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li>
              For exposed categories (for example brunch dairy or grill meats),
              ODYAN cross-checks delivery menu prices nearby.
            </li>
            <li>
              Suggests whether to pass through some increases, redesign dishes,
              or hold prices and negotiate harder with suppliers.
            </li>
            <li>
              Flags when you are underpriced versus competitors while also
              overpaying a supplier, so you can fix both sides at once.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Reputation and supply stability
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li>
              Correlates late deliveries or stock-outs with review comments
              about availability, wait times and quality drops.
            </li>
            <li>
              Highlights suppliers whose operational issues drive review slumps,
              even if their price is sharp on paper.
            </li>
            <li>
              Suggests which suppliers to reward with more volume when they
              protect both GP and guest happiness over time.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
