"use client";

import React, { useState } from "react";

type InsightCategory =
  | "GP"
  | "COGS"
  | "Labour"
  | "Menu"
  | "Competitors"
  | "Reputation"
  | "Operations";

interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  impact: "high" | "medium" | "low";
  horizon: "today" | "7d" | "30d";
  summary: string;
  action: string;
  projectedImpact: string;
  confidence: number;
}

const insights: Insight[] = [
  {
    id: "gp_loss_combo",
    category: "GP",
    title: "Combo menu is leaking GP by 3.1 points",
    impact: "high",
    horizon: "7d",
    summary:
      "Current lunch combo is underpriced relative to ingredient and labour cost. Delivery channel makes this more visible.",
    action:
      "Increase combo price by 3 percent or remove the second side during weekdays while monitoring reviews for 7 days.",
    projectedImpact:
      "Expected to recover around 1.4 points of GP on weekday lunches without visible demand loss.",
    confidence: 0.82,
  },
  {
    id: "cogs_dairy_spike",
    category: "COGS",
    title: "Dairy price spike risk for next week",
    impact: "medium",
    horizon: "30d",
    summary:
      "Suppliers flagged an expected 6 to 8 percent increase in dairy purchasing costs across two key vendors.",
    action:
      "Lock next 10 days volume with best supplier and reduce usage on low margin dishes before the increase becomes effective.",
    projectedImpact:
      "Protects around 0.9 points of GP across brunch and dessert lines in the next month.",
    confidence: 0.78,
  },
  {
    id: "labour_saturday_brunch",
    category: "Labour",
    title: "Saturday brunch under staffed in front of house",
    impact: "high",
    horizon: "today",
    summary:
      "Booking pattern for this Saturday is 18 percent above usual, with same number of front of house hours scheduled.",
    action:
      "Add one extra runner and one section waiter on brunch peak. Move one team member from quieter evening shift if needed.",
    projectedImpact:
      "Expected to reduce wait time complaints and protect review score in a high volume period.",
    confidence: 0.87,
  },
  {
    id: "menu_hidden_starters",
    category: "Menu",
    title: "Two starters could carry more volume at better GP",
    impact: "medium",
    horizon: "30d",
    summary:
      "Guests who try these two starters leave higher review scores and both items have GP above 72 percent.",
    action:
      "Highlight these items verbally and visually for 30 days and suggest them as sharing starters instead of discounting.",
    projectedImpact:
      "Up to 1.6 points GP improvement on starter category with better guest experience.",
    confidence: 0.8,
  },
  {
    id: "competitor_new_lunch",
    category: "Competitors",
    title: "Nearby brand is undercutting lunch set by 7 percent",
    impact: "medium",
    horizon: "7d",
    summary:
      "Competitor launched a new lunch menu at a visible price point below your current one, focused on speed and perceived value.",
    action:
      "Keep your price, but redesign the bundle framing with speed promise and one high perceived value item instead of discounting.",
    projectedImpact:
      "Defends GP and improves conversion from local workers comparing options.",
    confidence: 0.76,
  },
  {
    id: "reputation_temp_issues",
    category: "Reputation",
    title: "Temperature complaints cluster on delivery mains",
    impact: "medium",
    horizon: "7d",
    summary:
      "Reviews mentioning cold food are mostly linked to two delivery heavy main courses, especially on rainy days.",
    action:
      "Improve packaging and hold time on these dishes and test a slightly different delivery only recipe with better heat retention.",
    projectedImpact:
      "Could reduce temperature related complaints by around 40 percent in the next week.",
    confidence: 0.81,
  },
  {
    id: "operations_waste_prepping",
    category: "Operations",
    title: "Prep waste spike on Friday afternoon",
    impact: "low",
    horizon: "7d",
    summary:
      "Vegetable prep offcuts and unsold prepped items are higher on Fridays due to over prepping before dinner trade.",
    action:
      "Shift part of the prep to Saturday morning and use previous Friday data to set a tighter prep par sheet.",
    projectedImpact:
      "Can reduce vegetable and garnishes waste by 12 to 18 percent on weekends.",
    confidence: 0.74,
  },
];

export default function IntelligenceHub() {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(
    insights[0]
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[2.2fr,2.8fr]">
      {/* Left: daily decision summary + insight grid */}
      <div className="space-y-4">
        <DailyDecisionSummary />
        <InsightGrid
          insights={insights}
          selectedId={selectedInsight?.id ?? null}
          onSelect={setSelectedInsight}
        />
      </div>

      {/* Right: detail view */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800/80 p-4 flex flex-col">
        <DetailHeader insight={selectedInsight} />
        <DetailBody insight={selectedInsight} />
      </div>
    </div>
  );
}

function DailyDecisionSummary() {
  return (
    <section className="rounded-3xl bg-slate-950/80 border border-slate-800/80 p-4 space-y-2 text-xs text-slate-200">
      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-500">
        Daily decision paragraph
      </p>
      <p className="text-[0.8rem] text-slate-50">
        Today Odyan recommends focusing on three moves. Protect GP on lunch
        combos, adjust staffing on a single peak service and prepare for next
        week dairy price shifts. These actions together defend around 2 points
        of GP while reducing review risk on your busiest services.
      </p>
    </section>
  );
}

interface InsightGridProps {
  insights: Insight[];
  selectedId: string | null;
  onSelect: (insight: Insight) => void;
}

function InsightGrid({ insights, selectedId, onSelect }: InsightGridProps) {
  return (
    <section className="rounded-3xl bg-slate-950/80 border border-slate-800/80 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-500">
          Insight clusters
        </p>
        <div className="flex gap-2 text-[0.6rem] text-slate-300">
          <span className="px-2 py-1 rounded-full bg-slate-900/80 border border-slate-700">
            High impact
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-900/80 border border-slate-700">
            7 and 30 day horizon
          </span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            selected={insight.id === selectedId}
            onClick={() => onSelect(insight)}
          />
        ))}
      </div>
    </section>
  );
}

function InsightCard({
  insight,
  selected,
  onClick,
}: {
  insight: Insight;
  selected: boolean;
  onClick: () => void;
}) {
  const impactColors: Record<
    Insight["impact"],
    { border: string; badge: string }
  > = {
    high: {
      border: "border-rose-500/50",
      badge: "bg-rose-900/40 text-rose-200",
    },
    medium: {
      border: "border-amber-500/50",
      badge: "bg-amber-900/40 text-amber-200",
    },
    low: {
      border: "border-slate-600",
      badge: "bg-slate-900/80 text-slate-200",
    },
  };

  const impact = impactColors[insight.impact];

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "text-left rounded-2xl border p-3 text-xs transition-colors",
        "bg-slate-950/90 hover:bg-slate-900/90",
        selected ? `${impact.border}` : "border-slate-800/80",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-500">
          {insight.category}
        </span>
        <span className={`text-[0.6rem] px-2 py-0.5 rounded-full ${impact.badge}`}>
          {insight.impact === "high"
            ? "High impact"
            : insight.impact === "medium"
            ? "Medium impact"
            : "Low impact"}
        </span>
      </div>
      <p className="mt-1 text-[0.75rem] font-semibold text-slate-50 line-clamp-2">
        {insight.title}
      </p>
      <p className="mt-1 text-[0.7rem] text-slate-400 line-clamp-2">
        {insight.summary}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2 text-[0.65rem] text-slate-400">
        <span className="px-1.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700">
          {insight.horizon === "today"
            ? "Today"
            : insight.horizon === "7d"
            ? "Next 7 days"
            : "Next 30 days"}
        </span>
        <span className="text-slate-400">
          Confidence {Math.round(insight.confidence * 100)}%
        </span>
      </div>
    </button>
  );
}

function DetailHeader({ insight }: { insight: Insight | null }) {
  if (!insight) {
    return (
      <div className="pb-3 mb-3 border-b border-slate-800/80">
        <p className="text-xs text-slate-400">
          Select an insight on the left to see full explanation, root causes and
          recommended actions.
        </p>
      </div>
    );
  }

  const horizonLabel =
    insight.horizon === "today"
      ? "Today"
      : insight.horizon === "7d"
      ? "Next 7 days"
      : "Next 30 days";

  return (
    <header className="pb-3 mb-3 border-b border-slate-800/80 space-y-2">
      <div className="flex items-center justify-between gap-2 text-[0.65rem]">
        <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
          {insight.category} insight
        </span>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
            {horizonLabel}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
            Confidence {Math.round(insight.confidence * 100)}%
          </span>
        </div>
      </div>
      <h2 className="text-sm sm:text-base font-semibold text-slate-50">
        {insight.title}
      </h2>
    </header>
  );
}

function DetailBody({ insight }: { insight: Insight | null }) {
  if (!insight) return null;

  return (
    <div className="flex-1 flex flex-col gap-3 text-xs text-slate-200">
      <section className="space-y-1">
        <p className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-500">
          Why Odyan sees this
        </p>
        <p className="text-[0.8rem] text-slate-200">{insight.summary}</p>
      </section>

      <section className="space-y-1">
        <p className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-500">
          Recommended action
        </p>
        <p className="text-[0.8rem] text-slate-200">{insight.action}</p>
      </section>

      <section className="space-y-1">
        <p className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-500">
          Projected impact
        </p>
        <p className="text-[0.8rem] text-slate-200">
          {insight.projectedImpact}
        </p>
      </section>

      <section className="mt-1">
        <p className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-500 mb-1">
          Impact simulation
        </p>
        <div className="rounded-2xl bg-slate-950/90 border border-slate-800/90 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[0.7rem] text-slate-300">
            <span>GP and risk effect</span>
            <span>Illustrative only</span>
          </div>
          <div className="h-2 rounded-full bg-slate-900/90 overflow-hidden">
            <div className="h-full w-4/5 bg-gradient-to-r from-emerald-500/60 via-sky-400/50 to-violet-500/40" />
          </div>
          <p className="text-[0.7rem] text-slate-400">
            This visual represents the estimated contribution of this action to
            your GP and risk profile, assuming current demand and supplier
            behaviour.
          </p>
        </div>
      </section>
    </div>
  );
}
