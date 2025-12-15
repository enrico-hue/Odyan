"use client";

import React, { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TYPES
 */

type ZoomLevel = "1w" | "2w" | "1m" | "4m" | "6m" | "1y";
type Status = "planning" | "in-progress" | "blocked" | "done";

interface Task {
  id: string;
  initiativeId: string;
  name: string;
  region: string;
  city?: string;
  owner: string;
  status: Status;
  startDate: string;
  endDate: string;
  progress: number;
  isCritical?: boolean;
  isMarketingLinked?: boolean;
  color: string;
}

interface Initiative {
  id: string;
  name: string;
  region: string;
  country: string;
  city?: string;
  owner: string;
  status: Status;
  startDate: string;
  endDate: string;
  type: "menu" | "launch" | "experience" | "campaign";
  tasks: Task[];
}

interface MarketingStrip {
  id: string;
  name: string;
  channel: string;
  color: string;
  startDate: string;
  endDate: string;
  region: string;
}

interface VirtualSuggestion {
  id: string;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  hint: string;
}

interface FlatTaskWithLayout extends Task {
  initiativeName: string;
  initiativeType: Initiative["type"];
  initiativeOwner: string;
  rowIndex: number;
  barX: number;
  barWidth: number;
}

interface TimeTick {
  x: number;
  label: string;
  isMonthStart?: boolean;
  isWeekStart?: boolean;
}

interface TimelineScale {
  start: Date;
  end: Date;
  totalDays: number;
  pxPerDay: number;
  width: number;
  ticks: TimeTick[];
  todayX: number | null;
  zoom: ZoomLevel;
}

/**
 * DATE HELPERS
 */

function parseDate(str: string): Date {
  return new Date(str + "T00:00:00");
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function diffInDays(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatShortDate(d: Date): string {
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short" });
  return `${day} ${month}`;
}

function formatRange(start: string, end: string): string {
  const s = parseDate(start);
  const e = parseDate(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const sMonth = s.toLocaleString("en-GB", { month: "short" });
  const eMonth = e.toLocaleString("en-GB", { month: "short" });
  const sDay = s.getDate();
  const eDay = e.getDate();
  if (sameMonth) {
    return `${sDay}–${eDay} ${sMonth} ${s.getFullYear()}`;
  }
  return `${sDay} ${sMonth} → ${eDay} ${eMonth} ${e.getFullYear()}`;
}

function statusLabel(status: Status): string {
  switch (status) {
    case "planning":
      return "Planning";
    case "in-progress":
      return "In progress";
    case "blocked":
      return "Blocked";
    case "done":
      return "Done";
    default:
      return status;
  }
}

function statusColors(status: Status): { bg: string; text: string; border: string } {
  switch (status) {
    case "planning":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-300",
        border: "border-amber-500/40",
      };
    case "in-progress":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-300",
        border: "border-emerald-500/40",
      };
    case "blocked":
      return {
        bg: "bg-rose-500/10",
        text: "text-rose-300",
        border: "border-rose-500/40",
      };
    case "done":
      return {
        bg: "bg-sky-500/10",
        text: "text-sky-300",
        border: "border-sky-500/40",
      };
    default:
      return {
        bg: "bg-slate-600/20",
        text: "text-slate-200",
        border: "border-slate-500/50",
      };
  }
}

/**
 * MOCK DATA – same initiatives/marketing, plus a couple of ODYAN suggestions
 */

const MOCK_INITIATIVES: Initiative[] = [
  {
    id: "wintersku-uk-2425",
    name: "Winter 24/25 Menu Refresh – UK",
    region: "UK & Ireland",
    country: "United Kingdom",
    city: "London",
    owner: "UK Head of Food",
    status: "in-progress",
    startDate: "2024-10-18",
    endDate: "2025-02-10",
    type: "menu",
    tasks: [
      {
        id: "t-uk-discovery",
        initiativeId: "wintersku-uk-2425",
        name: "Creative brief & customer insight review",
        region: "UK & Ireland",
        owner: "UK Head of Food",
        city: "London",
        status: "planning",
        startDate: "2024-11-01",
        endDate: "2024-11-08",
        progress: 35,
        isCritical: true,
        color: "bg-sky-500",
      },
      {
        id: "t-uk-rd-drinks",
        initiativeId: "wintersku-uk-2425",
        name: "R&D sprint – hot drinks & winter desserts",
        region: "UK & Ireland",
        owner: "Menu Innovation Lead",
        city: "London",
        status: "in-progress",
        startDate: "2024-11-08",
        endDate: "2024-11-29",
        progress: 55,
        isCritical: true,
        color: "bg-emerald-500",
      },
      {
        id: "t-uk-costing",
        initiativeId: "wintersku-uk-2425",
        name: "Costing, GP guardrails & supplier lock-in",
        region: "UK & Ireland",
        owner: "Central Kitchen Ops Lead",
        city: "London",
        status: "planning",
        startDate: "2024-11-18",
        endDate: "2024-11-29",
        progress: 20,
        color: "bg-amber-500",
      },
      {
        id: "t-uk-training",
        initiativeId: "wintersku-uk-2425",
        name: "Training content & video shoots",
        region: "UK & Ireland",
        owner: "Training & L&D",
        city: "London",
        status: "planning",
        startDate: "2024-12-05",
        endDate: "2024-12-20",
        progress: 10,
        color: "bg-fuchsia-500",
      },
      {
        id: "t-uk-launch",
        initiativeId: "wintersku-uk-2425",
        name: "Soft launch & feedback loop",
        region: "UK & Ireland",
        owner: "UK Head of Food",
        city: "London",
        status: "planning",
        startDate: "2025-01-05",
        endDate: "2025-01-25",
        progress: 0,
        color: "bg-sky-400",
      },
    ],
  },
  {
    id: "ramadan-gcc-25",
    name: "Ramadan 2025 Menu – GCC",
    region: "Middle East",
    country: "UAE",
    city: "Dubai",
    owner: "Regional Culinary Director – GCC",
    status: "planning",
    startDate: "2024-12-01",
    endDate: "2025-03-20",
    type: "menu",
    tasks: [
      {
        id: "t-gcc-concept",
        initiativeId: "ramadan-gcc-25",
        name: "Ramadan menu concept & line-up",
        region: "Middle East",
        owner: "Regional Culinary Director – GCC",
        city: "Dubai",
        status: "planning",
        startDate: "2024-12-01",
        endDate: "2024-12-15",
        progress: 35,
        isCritical: true,
        color: "bg-emerald-500",
      },
      {
        id: "t-gcc-suppliers",
        initiativeId: "ramadan-gcc-25",
        name: "Secure dates, pistachio & dairy allocations",
        region: "Middle East",
        owner: "Supply Chain Manager – GCC",
        city: "Dubai",
        status: "planning",
        startDate: "2024-12-10",
        endDate: "2024-12-29",
        progress: 10,
        color: "bg-amber-500",
      },
      {
        id: "t-gcc-layout",
        initiativeId: "ramadan-gcc-25",
        name: "Kitchen & bar layout sign-off for iftar peak",
        region: "Middle East",
        owner: "Ops Excellence Lead",
        city: "Dubai",
        status: "planning",
        startDate: "2025-01-10",
        endDate: "2025-01-20",
        progress: 0,
        color: "bg-sky-500",
      },
      {
        id: "t-gcc-regulations",
        initiativeId: "ramadan-gcc-25",
        name: "Menu adaptation to local regulations",
        region: "Middle East",
        owner: "Compliance Lead",
        city: "Dubai",
        status: "planning",
        startDate: "2025-01-15",
        endDate: "2025-01-31",
        progress: 0,
        color: "bg-purple-500",
      },
      {
        id: "t-gcc-rollout",
        initiativeId: "ramadan-gcc-25",
        name: "Rollout plan by city & mall ownership",
        region: "Middle East",
        owner: "Regional Ops Manager",
        city: "Riyadh",
        status: "planning",
        startDate: "2025-02-10",
        endDate: "2025-02-28",
        progress: 0,
        color: "bg-emerald-400",
      },
    ],
  },
  {
    id: "cn-ny-asia-25",
    name: "Chinese New Year Capsule – Asia",
    region: "Asia",
    country: "China",
    city: "Shanghai",
    owner: "APAC Head of Food",
    status: "planning",
    startDate: "2024-11-20",
    endDate: "2025-02-05",
    type: "menu",
    tasks: [
      {
        id: "t-cn-concept",
        initiativeId: "cn-ny-asia-25",
        name: "Creative concept & hero SKUs",
        region: "Asia",
        owner: "APAC Head of Food",
        city: "Shanghai",
        status: "planning",
        startDate: "2024-11-20",
        endDate: "2024-12-05",
        progress: 25,
        color: "bg-rose-400",
      },
      {
        id: "t-cn-photo",
        initiativeId: "cn-ny-asia-25",
        name: "Photography & content for WeChat + IG",
        region: "Asia",
        owner: "Brand Content Lead – APAC",
        city: "Shanghai",
        status: "planning",
        startDate: "2024-12-08",
        endDate: "2024-12-20",
        progress: 0,
        color: "bg-fuchsia-500",
      },
      {
        id: "t-cn-prep",
        initiativeId: "cn-ny-asia-25",
        name: "CPU readiness – mise en place and holding tests",
        region: "Asia",
        owner: "Central Production Manager – APAC",
        city: "Hong Kong",
        status: "planning",
        startDate: "2025-01-05",
        endDate: "2025-01-18",
        progress: 0,
        isCritical: true,
        color: "bg-emerald-500",
      },
      {
        id: "t-cn-launch",
        initiativeId: "cn-ny-asia-25",
        name: "Launch week QA visits and GP spot-checks",
        region: "Asia",
        owner: "APAC Head of Food",
        city: "Shanghai",
        status: "planning",
        startDate: "2025-01-28",
        endDate: "2025-02-05",
        progress: 0,
        color: "bg-sky-500",
      },
    ],
  },
  {
    id: "iran-opening-25",
    name: "New Flagship Opening – Tehran",
    region: "Middle East",
    country: "Iran",
    city: "Tehran",
    owner: "Global Openings Lead",
    status: "planning",
    startDate: "2025-01-10",
    endDate: "2025-05-30",
    type: "launch",
    tasks: [
      {
        id: "t-ir-feasibility",
        initiativeId: "iran-opening-25",
        name: "Feasibility & landlord negotiations",
        region: "Middle East",
        owner: "Global Openings Lead",
        city: "Tehran",
        status: "planning",
        startDate: "2025-01-10",
        endDate: "2025-02-05",
        progress: 15,
        color: "bg-emerald-400",
      },
      {
        id: "t-ir-layout",
        initiativeId: "iran-opening-25",
        name: "Kitchen design & bar workflow sign-off",
        region: "Middle East",
        owner: "Global Design Team",
        city: "Tehran",
        status: "planning",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        progress: 0,
        color: "bg-sky-400",
      },
      {
        id: "t-ir-menu",
        initiativeId: "iran-opening-25",
        name: "Localised menu adaptation & pricing",
        region: "Middle East",
        owner: "Regional Culinary Director – GCC",
        city: "Dubai",
        status: "planning",
        startDate: "2025-02-20",
        endDate: "2025-03-20",
        progress: 0,
        color: "bg-amber-500",
      },
      {
        id: "t-ir-training",
        initiativeId: "iran-opening-25",
        name: "Opening team recruitment & training",
        region: "Middle East",
        owner: "People & Culture",
        city: "Tehran",
        status: "planning",
        startDate: "2025-04-01",
        endDate: "2025-05-10",
        progress: 0,
        color: "bg-fuchsia-500",
      },
    ],
  },
  {
    id: "baghdad-opening-25",
    name: "Riverfront Opening – Baghdad",
    region: "Middle East",
    country: "Iraq",
    city: "Baghdad",
    owner: "Global Openings Lead",
    status: "planning",
    startDate: "2025-02-01",
    endDate: "2025-06-30",
    type: "launch",
    tasks: [
      {
        id: "t-bg-concept",
        initiativeId: "baghdad-opening-25",
        name: "Creative concept & hero dessert table",
        region: "Middle East",
        owner: "Global Brand Director",
        city: "Baghdad",
        status: "planning",
        startDate: "2025-02-01",
        endDate: "2025-02-20",
        progress: 0,
        color: "bg-rose-400",
      },
      {
        id: "t-bg-suppliers",
        initiativeId: "baghdad-opening-25",
        name: "Core supplier onboarding & QA",
        region: "Middle East",
        owner: "Supply Chain – New Markets",
        city: "Baghdad",
        status: "planning",
        startDate: "2025-03-01",
        endDate: "2025-03-25",
        progress: 0,
        color: "bg-emerald-500",
      },
      {
        id: "t-bg-menu",
        initiativeId: "baghdad-opening-25",
        name: "Hybrid menu engineering with CPU support",
        region: "Middle East",
        owner: "Global Menu Engineering",
        city: "Baghdad",
        status: "planning",
        startDate: "2025-03-20",
        endDate: "2025-04-25",
        progress: 0,
        color: "bg-sky-400",
      },
      {
        id: "t-bg-soft",
        initiativeId: "baghdad-opening-25",
        name: "Soft-opening, influencer events & GP checks",
        region: "Middle East",
        owner: "Global Openings Lead",
        city: "Baghdad",
        status: "planning",
        startDate: "2025-06-01",
        endDate: "2025-06-30",
        progress: 0,
        color: "bg-amber-500",
      },
    ],
  },
  {
    id: "summer-uk-25",
    name: "Summer 2025 Drinks Capsule – UK",
    region: "UK & Ireland",
    country: "United Kingdom",
    city: "Manchester",
    owner: "Menu Innovation Lead – UK",
    status: "planning",
    startDate: "2025-02-15",
    endDate: "2025-06-01",
    type: "menu",
    tasks: [
      {
        id: "t-sum-trends",
        initiativeId: "summer-uk-25",
        name: "Trend scan – iced, functional & low sugar",
        region: "UK & Ireland",
        owner: "Menu Innovation Lead – UK",
        city: "London",
        status: "planning",
        startDate: "2025-02-15",
        endDate: "2025-03-05",
        progress: 0,
        color: "bg-emerald-500",
      },
      {
        id: "t-sum-rd",
        initiativeId: "summer-uk-25",
        name: "R&D sprint – new iced signatures",
        region: "UK & Ireland",
        owner: "R&D Kitchen – UK",
        city: "London",
        status: "planning",
        startDate: "2025-03-05",
        endDate: "2025-03-25",
        progress: 0,
        color: "bg-sky-500",
      },
      {
        id: "t-sum-costing",
        initiativeId: "summer-uk-25",
        name: "Costing & supplier volume lock",
        region: "UK & Ireland",
        owner: "Central Kitchen Ops Lead",
        city: "London",
        status: "planning",
        startDate: "2025-04-01",
        endDate: "2025-04-20",
        progress: 0,
        color: "bg-amber-500",
      },
      {
        id: "t-sum-rollout",
        initiativeId: "summer-uk-25",
        name: "Campaign rollout briefing & launch",
        region: "UK & Ireland",
        owner: "Marketing – UK",
        city: "London",
        status: "planning",
        startDate: "2025-05-10",
        endDate: "2025-06-01",
        progress: 0,
        color: "bg-fuchsia-500",
      },
    ],
  },
  {
    id: "experience-uk-25",
    name: "Immersive Seasonal Experience – London Flagship",
    region: "UK & Ireland",
    country: "United Kingdom",
    city: "London",
    owner: "Experience Director",
    status: "planning",
    startDate: "2025-03-01",
    endDate: "2025-07-15",
    type: "experience",
    tasks: [
      {
        id: "t-exp-concept",
        initiativeId: "experience-uk-25",
        name: "Concept & storytelling arc",
        region: "UK & Ireland",
        owner: "Experience Director",
        city: "London",
        status: "planning",
        startDate: "2025-03-01",
        endDate: "2025-03-20",
        progress: 0,
        color: "bg-rose-400",
      },
      {
        id: "t-exp-menu-bridge",
        initiativeId: "experience-uk-25",
        name: "Menu bridge – hero dishes into experience",
        region: "UK & Ireland",
        owner: "UK Head of Food",
        city: "London",
        status: "planning",
        startDate: "2025-03-20",
        endDate: "2025-04-15",
        progress: 0,
        color: "bg-emerald-500",
      },
      {
        id: "t-exp-build",
        initiativeId: "experience-uk-25",
        name: "Set build, props & AV install",
        region: "UK & Ireland",
        owner: "Projects & Design",
        city: "London",
        status: "planning",
        startDate: "2025-05-01",
        endDate: "2025-06-20",
        progress: 0,
        color: "bg-sky-500",
      },
      {
        id: "t-exp-soft",
        initiativeId: "experience-uk-25",
        name: "Soft opening & influencer nights",
        region: "UK & Ireland",
        owner: "Marketing – UK",
        city: "London",
        status: "planning",
        startDate: "2025-07-01",
        endDate: "2025-07-15",
        progress: 0,
        color: "bg-amber-500",
      },
    ],
  },
];

const MOCK_MARKETING: MarketingStrip[] = [
  {
    id: "mkt-winter",
    name: "Winter 24/25 ATL + in-store",
    channel: "OOH + Social",
    color: "bg-pink-500",
    startDate: "2024-12-10",
    endDate: "2025-01-20",
    region: "UK & Ireland",
  },
  {
    id: "mkt-ramadan",
    name: "Ramadan awareness & pre-booking",
    channel: "Social + CRM",
    color: "bg-emerald-400",
    startDate: "2025-01-15",
    endDate: "2025-03-05",
    region: "Middle East",
  },
  {
    id: "mkt-cny",
    name: "Chinese New Year digital campaign",
    channel: "WeChat + IG",
    color: "bg-amber-400",
    startDate: "2025-01-20",
    endDate: "2025-02-10",
    region: "Asia",
  },
  {
    id: "mkt-openings",
    name: "Tehran & Baghdad pre-opening buzz",
    channel: "PR + Social",
    color: "bg-sky-400",
    startDate: "2025-04-01",
    endDate: "2025-06-15",
    region: "Middle East",
  },
];

const MOCK_SUGGESTIONS: VirtualSuggestion[] = [
  {
    id: "vs-bridge-ramadan-cny",
    name: "Cross-bridge between CNY & Ramadan menus",
    region: "Global",
    startDate: "2025-01-22",
    endDate: "2025-02-03",
    hint: "ODYAN: customer flow & GP data show a gap – consider a limited-time cross-over menu.",
  },
  {
    id: "vs-pre-summer-tests",
    name: "Pre-summer iced drinks test window",
    region: "UK & Ireland",
    startDate: "2025-03-26",
    endDate: "2025-04-05",
    hint: "ODYAN: weather + demand models suggest testing functional iced SKUs before main rollout.",
  },
];
/**
 * TIMELINE SCALE – build from initiatives/tasks
 */

function buildTimelineScale(initiatives: Initiative[], zoom: ZoomLevel): TimelineScale {
  const allTasks: Task[] = initiatives.flatMap((i) => i.tasks);
  if (allTasks.length === 0) {
    const today = startOfDay(new Date());
    return {
      start: today,
      end: today,
      totalDays: 1,
      pxPerDay: 24,
      width: 800,
      ticks: [],
      todayX: 0,
      zoom,
    };
  }

  let minDate = parseDate(allTasks[0].startDate);
  let maxDate = parseDate(allTasks[0].endDate);

  for (const t of allTasks) {
    const s = parseDate(t.startDate);
    const e = parseDate(t.endDate);
    if (s < minDate) minDate = s;
    if (e > maxDate) maxDate = e;
  }

  // Padding left/right
  minDate = addDays(minDate, -7);
  maxDate = addDays(maxDate, 7);

  const totalDays = Math.max(1, diffInDays(minDate, maxDate));

  let pxPerDay: number;
  switch (zoom) {
    case "1w":
      pxPerDay = 32;
      break;
    case "2w":
      pxPerDay = 26;
      break;
    case "1m":
      pxPerDay = 20;
      break;
    case "4m":
      pxPerDay = 12;
      break;
    case "6m":
      pxPerDay = 8;
      break;
    case "1y":
      pxPerDay = 5;
      break;
    default:
      pxPerDay = 16;
  }

  const width = Math.max(1400, Math.round(totalDays * pxPerDay));

  const ticks: TimeTick[] = [];
  const today = startOfDay(new Date());
  let todayX: number | null = null;

  for (let i = 0; i <= totalDays; i++) {
    const d = addDays(minDate, i);
    const x = i * pxPerDay;
    const isMonthStart = d.getDate() === 1;
    const isWeekStart = d.getDay() === 1;

    let label = "";
    if (isMonthStart) {
      label = d.toLocaleString("en-GB", { month: "short", year: "2-digit" });
    } else if ((zoom === "1w" || zoom === "2w" || zoom === "1m") && isWeekStart) {
      label = d.getDate().toString();
    }

    ticks.push({ x, label, isMonthStart, isWeekStart });

    if (todayX === null && d.getTime() === today.getTime()) todayX = x;
  }

  return {
    start: minDate,
    end: maxDate,
    totalDays,
    pxPerDay,
    width,
    ticks,
    todayX,
    zoom,
  };
}

function dateToX(d: Date, scale: TimelineScale): number {
  const daysFromStart = diffInDays(scale.start, d);
  return daysFromStart * scale.pxPerDay;
}

/**
 * Layout helpers – flatten tasks
 */

function buildFlatLayout(initiatives: Initiative[], scale: TimelineScale): FlatTaskWithLayout[] {
  const flat: FlatTaskWithLayout[] = [];
  let rowIndex = 0;

  for (const initiative of initiatives) {
    for (const task of initiative.tasks) {
      const s = parseDate(task.startDate);
      const e = parseDate(task.endDate);
      const startX = dateToX(s, scale);
      const endX = dateToX(e, scale);
      const barWidth = Math.max(32, endX - startX);

      flat.push({
        ...task,
        initiativeName: initiative.name,
        initiativeType: initiative.type,
        initiativeOwner: initiative.owner,
        rowIndex,
        barX: startX,
        barWidth,
      });

      rowIndex += 1;
    }
    rowIndex += 1; // spacing row
  }

  return flat;
}

/**
 * Small UI atoms
 */

function StatusPill({ status }: { status: Status }) {
  const { bg, text, border } = statusColors(status);
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        bg,
        text,
        border,
      ].join(" ")}
    >
      {statusLabel(status)}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const clamped = clamp(value, 0, 100);
  return (
    <div className="w-full h-1.5 rounded-full bg-slate-900/80 overflow-hidden">
      <div
        className="h-full rounded-full bg-emerald-400 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function LegendDot({ className }: { className: string }) {
  return (
    <span
      className={
        "inline-block h-2 w-2 rounded-full border border-black/40 shadow " +
        className
      }
    />
  );
}

function KpiCard(props: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/70 px-3 py-2 text-xs text-slate-200 shadow-[0_0_20px_rgba(15,23,42,0.9)]">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">
        {props.label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-slate-50">
        {props.value}
      </div>
      {props.hint && (
        <div className="mt-0.5 text-[10px] text-slate-500">{props.hint}</div>
      )}
    </div>
  );
}

/**
 * Top header strip + controls
 */

function TopStrip(props: {
  initiatives: Initiative[];
  tasks: FlatTaskWithLayout[];
  scale: TimelineScale;
}) {
  const totalInitiatives = props.initiatives.length;
  const totalTasks = props.tasks.length;
  const activeRegions = Array.from(new Set(props.initiatives.map((i) => i.region)));

  return (
    <div className="flex items-center justify-between border-b border-slate-900 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950 px-5 py-3">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            R&amp;D pipeline
          </div>
          <div className="text-sm font-semibold text-slate-50">
            {totalInitiatives} initiatives, {totalTasks} tasks
          </div>
        </motion.div>
        <motion.div
          className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
        >
          <span className="text-slate-500">Regions:</span>
          {activeRegions.map((r) => (
            <span
              key={r}
              className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[11px]"
            >
              {r}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <KpiCard
          label="Time window"
          value={formatRange(
            props.scale.start.toISOString().slice(0, 10),
            props.scale.end.toISOString().slice(0, 10)
          )}
          hint="Zoom with 1w → 1y presets"
        />
        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <LegendDot className="bg-emerald-400" />
            <span>Menu / product</span>
          </span>
          <span className="flex items-center gap-1">
            <LegendDot className="bg-sky-400" />
            <span>Openings / experiences</span>
          </span>
          <span className="flex items-center gap-1">
            <LegendDot className="bg-pink-500" />
            <span>Marketing overlay</span>
          </span>
          <span className="flex items-center gap-1">
            <LegendDot className="bg-emerald-300" />
            <span>Critical path</span>
          </span>
          <span className="flex items-center gap-1">
            <LegendDot className="bg-emerald-200" />
            <span>ODYAN suggestions</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ZoomControls(props: {
  zoom: ZoomLevel;
  onZoomChange: (z: ZoomLevel) => void;
}) {
  const items: { id: ZoomLevel; label: string }[] = [
    { id: "1w", label: "1 week" },
    { id: "2w", label: "2 weeks" },
    { id: "1m", label: "1 month" },
    { id: "4m", label: "4 months" },
    { id: "6m", label: "6 months" },
    { id: "1y", label: "1 year" },
  ];

  return (
    <div className="inline-flex items-center rounded-full border border-slate-800 bg-black/70 p-0.5 text-[11px]">
      {items.map((z) => {
        const active = props.zoom === z.id;
        return (
          <button
            key={z.id}
            type="button"
            onClick={() => props.onZoomChange(z.id)}
            className={
              "px-2.5 py-1 rounded-full transition-colors " +
              (active
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-100")
            }
          >
            {z.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Task table (left side) – top 2/3 R&D, bottom 1/3 marketing
 */

interface TableProps {
  initiatives: Initiative[];
  flatTasks: FlatTaskWithLayout[];
  selectedTaskId: string | null;
  onSelectTask: (task: FlatTaskWithLayout | null) => void;
}

function TaskTableColumn({
  initiatives,
  flatTasks,
  selectedTaskId,
  onSelectTask,
}: TableProps) {
  const byInitiative = useMemo(() => {
    const map: Record<string, FlatTaskWithLayout[]> = {};
    for (const t of flatTasks) {
      if (!map[t.initiativeId]) map[t.initiativeId] = [];
      map[t.initiativeId].push(t);
    }
    return map;
  }, [flatTasks]);

  return (
    <div className="flex h-full flex-col">
      {/* R&D list (2/3) */}
      <div className="basis-2/3 min-h-[260px] border-b border-slate-900 overflow-y-auto odyan-scroll">
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)] gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-500 sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
          <div>Initiative / Task</div>
          <div>Region</div>
          <div>Owner</div>
          <div>Status</div>
        </div>
        {initiatives.map((init) => {
          const tasks = byInitiative[init.id] || [];
          if (tasks.length === 0) return null;
          return (
            <div key={init.id} className="border-b border-slate-900/80">
              <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)] gap-2 px-3 py-2 bg-slate-900/80">
                <div className="flex flex-col">
                  <div className="text-[11px] font-semibold text-slate-50">
                    {init.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {init.type === "menu" && "Menu / product"}
                    {init.type === "launch" && "New opening"}
                    {init.type === "experience" && "Experience"}
                    {init.type === "campaign" && "Campaign"}
                    {" • "}
                    {formatRange(init.startDate, init.endDate)}
                  </div>
                </div>
                <div className="text-[11px] text-slate-300">
                  {init.region} · {init.country}
                </div>
                <div className="text-[11px] text-slate-300">
                  {init.owner}
                </div>
                <div className="flex items-center">
                  <StatusPill status={init.status} />
                </div>
              </div>

              {tasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTask(isSelected ? null : task);
                    }}
                    className={
                      "grid w-full grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)] gap-2 px-3 py-2 text-left text-[11px] transition-colors " +
                      (isSelected
                        ? "bg-emerald-500/10"
                        : "hover:bg-slate-900/70")
                    }
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-800 text-[9px] text-slate-400">
                          {task.rowIndex + 1}
                        </span>
                        <span className="text-slate-100 line-clamp-1">
                          {task.name}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500">
                        <span>{formatRange(task.startDate, task.endDate)}</span>
                        <span>•</span>
                        <span>{task.city || task.region}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {task.region}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {task.owner}
                    </div>
                    <div className="flex flex-col gap-1">
                      <StatusPill status={task.status} />
                      <ProgressBar value={task.progress} />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Marketing calendar (1/3) */}
      <div className="basis-1/3 min-h-[160px] bg-slate-950/95 overflow-y-auto odyan-scroll">
        <div className="flex items-center justify-between px-3 pt-2 pb-1 text-[11px] uppercase tracking-[0.16em] text-slate-500 sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
          <span>Marketing calendar</span>
          <span className="text-[10px] text-slate-600">Linked to R&amp;D window</span>
        </div>
        {MOCK_MARKETING.map((m) => (
          <div
            key={m.id}
            className="px-3 py-2 border-b border-slate-900/80 hover:bg-slate-900/80 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={
                    "inline-block h-2 w-2 rounded-full shadow " + m.color
                  }
                />
                <div className="text-[11px] font-medium text-slate-100">
                  {m.name}
                </div>
              </div>
              <div className="text-[10px] text-slate-500">
                {formatRange(m.startDate, m.endDate)}
              </div>
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500">
              {m.region} · {m.channel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Gantt grid & bars
 */

interface GanttProps {
  tasks: FlatTaskWithLayout[];
  scale: TimelineScale;
  marketing: MarketingStrip[];
  suggestions: VirtualSuggestion[];
  selectedTaskId: string | null;
  onSelectTask: (task: FlatTaskWithLayout | null) => void;
}

function GanttGrid({ scale, height }: { scale: TimelineScale; height: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ height }}>
      {scale.ticks.map((tick, idx) => {
        const strong =
          tick.isMonthStart ||
          ((scale.zoom === "1w" ||
            scale.zoom === "2w" ||
            scale.zoom === "1m") &&
            tick.isWeekStart);
        return (
          <div
            key={idx}
            className={
              "absolute top-0 bottom-0 border-l " +
              (strong ? "border-slate-800" : "border-slate-900/60")
            }
            style={{ left: tick.x }}
          />
        );
      })}

      {scale.todayX !== null && (
        <motion.div
          className="absolute top-0 bottom-0 border-l-2 border-emerald-400/80 shadow-[0_0_18px_rgba(52,211,153,0.9)]"
          style={{ left: scale.todayX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute top-4 -left-3 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse" />
        </motion.div>
      )}

      <div className="absolute left-0 right-0 top-0 flex h-8 items-end bg-gradient-to-b from-slate-950/95 to-slate-950/80 text-[11px] text-slate-300">
        {scale.ticks
          .filter((t) => t.label)
          .map((tick, idx) => (
            <div
              key={idx}
              className="absolute -translate-x-1/2 px-1"
              style={{ left: tick.x }}
            >
              <span
                className={
                  tick.isMonthStart
                    ? "font-semibold text-slate-50"
                    : "text-slate-400"
                }
              >
                {tick.label}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function GanttBars({
  tasks,
  scale,
  marketing,
  suggestions,
  selectedTaskId,
  onSelectTask,
}: GanttProps) {
  const rowHeight = 36;
  const verticalPadding = 40;
  const height = verticalPadding + (tasks.length + 5) * rowHeight;

  const maxRowIndex = tasks.reduce(
    (max, t) => (t.rowIndex > max ? t.rowIndex : max),
    0
  );
  const suggestionBaseRow = maxRowIndex + 3;

  return (
    <motion.div
      className="relative"
      style={{ width: scale.width, height }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GanttGrid scale={scale} height={height} />

      {/* Marketing overlays */}
      {marketing.map((m) => {
        const s = parseDate(m.startDate);
        const e = parseDate(m.endDate);
        const x1 = dateToX(s, scale);
        const x2 = dateToX(e, scale);
        const w = Math.max(32, x2 - x1);
        return (
          <div
            key={m.id}
            className="absolute top-8 bottom-4 rounded-xl bg-gradient-to-b from-pink-500/12 via-pink-500/3 to-transparent pointer-events-none"
            style={{ left: x1, width: w }}
          />
        );
      })}

      {/* ODYAN suggestions (ghost bars) */}
      {suggestions.map((sugg, index) => {
        const s = parseDate(sugg.startDate);
        const e = parseDate(sugg.endDate);
        const x1 = dateToX(s, scale);
        const x2 = dateToX(e, scale);
        const w = Math.max(40, x2 - x1);
        const top =
          verticalPadding + (suggestionBaseRow + index * 2) * rowHeight;

        return (
          <motion.div
            key={sugg.id}
            className="absolute flex flex-col items-start text-left"
            style={{ left: x1, top, width: w }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <div className="rounded-full border border-dashed border-emerald-200/80 bg-emerald-400/5 px-3 py-1 text-[10px] font-medium text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.45)]">
              <div className="uppercase tracking-[0.18em] text-[9px] text-emerald-200/85 mb-0.5">
                ODYAN suggestion
              </div>
              <div className="line-clamp-2">{sugg.name}</div>
            </div>
          </motion.div>
        );
      })}

      {/* Tasks */}
      {tasks.map((task) => {
        const top =
          verticalPadding + task.rowIndex * rowHeight;
        const isSelected = selectedTaskId === task.id;
        const isCritical = task.isCritical;
        const isInProgress = task.status === "in-progress";

        return (
          <motion.button
            key={task.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTask(isSelected ? null : task);
            }}
            className="absolute flex flex-col items-start text-left outline-none"
            style={{ left: task.barX, top, width: task.barWidth }}
            whileHover={{ scale: 1.03, translateY: -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div
              className={[
                "relative rounded-full px-3 py-1 text-[11px] font-medium shadow-lg transition-all",
                task.color || "bg-slate-500",
                isSelected
                  ? "ring-2 ring-emerald-300 ring-offset-2 ring-offset-slate-950"
                  : "ring-1 ring-black/40 hover:ring-emerald-300/60",
                isCritical ? "border border-emerald-200/90" : "",
              ].join(" ")}
            >
              {isInProgress && (
                <span className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400/15 blur-[6px] animate-[pulse_2.4s_ease-in-out_infinite]" />
              )}
              <span className="relative z-10 line-clamp-1">
                {task.name}
              </span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

/**
 * Mini openings timeline banner
 */

function OpeningsTimeline({
  scale,
  initiatives,
}: {
  scale: TimelineScale;
  initiatives: Initiative[];
}) {
  const openingInits = initiatives.filter((i) => i.type === "launch" || i.type === "experience");
  if (openingInits.length === 0) return null;

  return (
    <div className="h-16 border-t border-slate-900 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950 px-4 py-2">
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
        <span className="uppercase tracking-[0.18em] text-slate-500">
          Openings timeline
        </span>
        <span className="text-slate-500">Quick view of city launches & experiences</span>
      </div>
      <div className="relative h-7 rounded-full bg-slate-950/90 border border-slate-900 overflow-hidden odyan-scroll-x">
        {openingInits.map((init, idx) => {
          const s = parseDate(init.startDate);
          const e = parseDate(init.endDate);
          const x1 = dateToX(s, scale);
          const x2 = dateToX(e, scale);
          const w = Math.max(40, x2 - x1);

          const palette =
            init.type === "launch" ? "bg-rose-500" : "bg-sky-500";

          return (
            <div
              key={init.id}
              className={
                "absolute top-0.5 bottom-0.5 rounded-full opacity-85 shadow-md " +
                palette
              }
              style={{ left: x1, width: w }}
            >
              <span className="ml-3 mt-1 inline-block text-[10px] text-slate-950/90 font-semibold">
                {idx + 1}. {init.city || init.region}
              </span>
            </div>
          );
        })}

        {/* Today marker */}
        {scale.todayX !== null && (
          <div
            className="absolute top-0 bottom-0 border-l border-emerald-300/90 shadow-[0_0_14px_rgba(52,211,153,0.9)]"
            style={{ left: scale.todayX }}
          >
            <div className="absolute top-1 -left-[3px] h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
/**
 * Task drawer (overlay, does not steal Gantt width)
 */

function TaskDrawer({
  task,
  onClose,
}: {
  task: FlatTaskWithLayout | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {task && (
        <motion.div
          className="fixed inset-0 z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Click anywhere to close */}
          <div
            className="absolute inset-0 pointer-events-auto"
            onClick={onClose}
          />

          <motion.div
            className="pointer-events-auto absolute top-[90px] right-6 w-80 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-950/95 text-xs text-slate-300 shadow-[0_18px_45px_rgba(15,23,42,0.9)]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-900 px-4 py-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Task details
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-50">
                  {task.name}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  {task.initiativeName}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ml-2 rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-400 hover:text-slate-100 hover:border-slate-500"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 odyan-scroll">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">
                  Owner
                </div>
                <div className="text-[11px] text-slate-200">
                  {task.owner}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    Region
                  </div>
                  <div>{task.region}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    City
                  </div>
                  <div>{task.city || "n/a"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    Start
                  </div>
                  <div>{formatShortDate(parseDate(task.startDate))}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    End
                  </div>
                  <div>{formatShortDate(parseDate(task.endDate))}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">
                  Status & progress
                </div>
                <StatusPill status={task.status} />
                <ProgressBar value={task.progress} />
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">
                  ODYAN notes (mock)
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                  <li>
                    Cross-link GP engine here with live margin vs. target,
                    using supplier input costs.
                  </li>
                  <li>
                    Surface prep pressure, station load and{" "}
                    <span className="text-emerald-300">
                      complexity score
                    </span>{" "}
                    over this window.
                  </li>
                  <li>
                    Flag upstream risks if supplier volatility or menu overlaps
                    raise execution risk.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">
                  Quick actions (mock)
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                    Duplicate task
                  </button>
                  <button className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                    Link to campaign
                  </button>
                  <button className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] text-slate-200 hover:border-emerald-400 hover:text-emerald-200">
                    Mark as critical
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * MAIN PAGE
 */

export default function RdPage() {
  const [zoom, setZoom] = useState<ZoomLevel>("4m");
  const [regionFilter, setRegionFilter] = useState<string | "all">("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const initiativesFiltered = useMemo(() => {
    if (regionFilter === "all") return MOCK_INITIATIVES;
    return MOCK_INITIATIVES.filter((i) => i.region === regionFilter);
  }, [regionFilter]);

  const scale = useMemo(
    () => buildTimelineScale(initiativesFiltered, zoom),
    [initiativesFiltered, zoom]
  );

  const flatTasks = useMemo(
    () => buildFlatLayout(initiativesFiltered, scale),
    [initiativesFiltered, scale]
  );

  const selectedTask =
    flatTasks.find((t) => t.id === selectedTaskId) || null;

  const marketingFiltered = useMemo(
    () =>
      MOCK_MARKETING.filter(
        (m) => regionFilter === "all" || m.region === regionFilter
      ),
    [regionFilter]
  );

  const uniqueRegions = useMemo(
    () => Array.from(new Set(MOCK_INITIATIVES.map((i) => i.region))),
    []
  );

  const handleSelectTask = useCallback(
    (task: FlatTaskWithLayout | null) => {
      setSelectedTaskId(task ? task.id : null);
    },
    []
  );

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-slate-950 text-slate-50 flex flex-col">
      <TopStrip initiatives={initiativesFiltered} tasks={flatTasks} scale={scale} />

      {/* Controls row */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-slate-900 bg-black/80 text-[11px]">
        <div className="flex items-center gap-3">
          <ZoomControls zoom={zoom} onZoomChange={setZoom} />
          <div className="h-5 w-px bg-slate-800 mx-1" />
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[10px] uppercase tracking-[0.16em]">
              Region filter
            </span>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setRegionFilter("all")}
                className={
                  "rounded-full px-2 py-0.5 " +
                  (regionFilter === "all"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-100")
                }
              >
                All
              </button>
              {uniqueRegions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegionFilter(r)}
                  className={
                    "rounded-full px-2 py-0.5 " +
                    (regionFilter === r
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-400 hover:text-slate-100")
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <button
            type="button"
            className="rounded-full bg-emerald-500/90 px-3 py-1 font-medium text-slate-950 shadow-[0_0_16px_rgba(16,185,129,0.7)] hover:bg-emerald-400"
          >
            New initiative
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-700 px-3 py-1 font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-200"
          >
            New marketing activity
          </button>
        </div>
      </div>

      {/* Main body: left list + Gantt */}
      <div
        className="flex flex-1 overflow-hidden"
        onClick={() => setSelectedTaskId(null)}
      >
        {/* Left column – slimmer, flush to left */}
        <div className="w-[26%] min-w-[320px] max-w-[380px] border-r border-slate-900 bg-gradient-to-b from-slate-950 to-slate-950/95">
          <TaskTableColumn
            initiatives={initiativesFiltered}
            flatTasks={flatTasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={handleSelectTask}
          />
        </div>

        {/* Gantt – full remaining width, only this area scrolls */}
        <div className="flex-1 flex flex-col bg-black/95">
          <div className="relative flex-1 overflow-auto odyan-scroll" onClick={(e) => e.stopPropagation()}>
            <div className="relative" style={{ minWidth: scale.width + 80 }}>
              <GanttBars
                tasks={flatTasks}
                scale={scale}
                marketing={marketingFiltered}
                suggestions={MOCK_SUGGESTIONS}
                selectedTaskId={selectedTaskId}
                onSelectTask={handleSelectTask}
              />
            </div>
          </div>

          <OpeningsTimeline scale={scale} initiatives={initiativesFiltered} />
        </div>
      </div>

      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
      />

      {/* Global scrollbar styling + subtle animation tweak */}
      <style jsx global>{`
        .odyan-scroll::-webkit-scrollbar,
        .odyan-scroll-x::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .odyan-scroll::-webkit-scrollbar-track,
        .odyan-scroll-x::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.95);
        }
        .odyan-scroll::-webkit-scrollbar-thumb,
        .odyan-scroll-x::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgba(56, 189, 248, 0.85),
            rgba(16, 185, 129, 0.9)
          );
          border-radius: 999px;
        }
        .odyan-scroll {
          scrollbar-color: rgba(56, 189, 248, 0.85) rgba(15, 23, 42, 0.95);
          scrollbar-width: thin;
        }
        .odyan-scroll-x {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-color: rgba(244, 114, 182, 0.9) rgba(15, 23, 42, 0.95);
          scrollbar-width: thin;
        }
      `}</style>
    </div>
  );
}
