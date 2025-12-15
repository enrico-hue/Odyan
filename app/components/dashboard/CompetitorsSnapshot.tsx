// app/components/dashboard/CompetitorsSnapshot.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  MapPin,
  TrendingUp,
} from "lucide-react";
import {
  type CompetitorSummaryResponse,
  type CompetitorChange,
} from "@/types/competitors";

type FetchState = {
  data: CompetitorSummaryResponse | null;
  loading: boolean;
  error: string | null;
};

export default function CompetitorsSnapshot() {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const res = await fetch("/api/competitors", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load competitors snapshot");
        }

        const json = (await res.json()) as CompetitorSummaryResponse;
        if (!cancelled) {
          setState({
            data: json,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "Unknown error",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.loading) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Competitor snapshot
            </p>
            <p className="text-sm text-slate-300">
              ODYAN is loading your market intelligence
            </p>
          </div>
          <div className="h-8 w-8 rounded-full border border-slate-700 border-t-transparent animate-spin" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-3"
            >
              <div className="h-2 w-16 rounded bg-slate-800 mb-2" />
              <div className="h-4 w-10 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (state.error || !state.data) {
    return (
      <section className="rounded-3xl border border-rose-700/50 bg-rose-950/40 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-300 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-rose-300">
                Competitor snapshot
              </p>
              <p className="mt-1 text-sm text-rose-100">
                There was a problem loading competitor data.
              </p>
              {state.error && (
                <p className="mt-1 text-[11px] text-rose-200/80">
                  {state.error}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/competitors/hub"
            className="inline-flex items-center gap-1 rounded-full border border-rose-400/60 bg-rose-500/10 px-3 py-1 text-[11px] text-rose-100 hover:bg-rose-500/20"
          >
            Open competitors hub
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    );
  }

  const { meta, competitors } = state.data;
  const stats = computeStats(state.data);
  const lastChange = stats.recentChanges[0] ?? null;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Competitor snapshot
          </p>
          <p className="text-sm text-slate-300">
            Live view of your market around{" "}
            <span className="font-medium text-slate-100">
              {meta.venueName}
            </span>{" "}
            in {meta.venueCity}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-200">
            <MapPin className="h-3.5 w-3.5 text-sky-300" />
            <span>
              {competitors.length} competitors ·{" "}
              {stats.hottestArea || "no hot zone yet"}
            </span>
          </span>
          <Link
            href="/competitors/hub"
            className="inline-flex items-center gap-1 rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-100 hover:bg-sky-500/20"
          >
            Open competitor hub
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <SnapshotStat
          label="Tracked competitors"
          value={String(competitors.length)}
        />
        <SnapshotStat
          label="Pricing above you"
          value={String(stats.aboveYouCount)}
          tone="good"
          helper="Can support a premium if experience holds."
        />
        <SnapshotStat
          label="Pricing below you"
          value={String(stats.belowYouCount)}
          tone="warn"
          helper="Watch value perception and promotions."
        />
        <SnapshotStat
          label="Changes last 24 hours"
          value={String(stats.totalChanges24h)}
          tone={stats.totalChanges24h > 0 ? "alert" : "default"}
          helper={
            stats.totalChanges24h > 0
              ? "Menu, promo or price moves detected."
              : "Calm window, no visible moves."
          }
        />
      </div>

      {lastChange && (
        <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/85 px-3 py-2 text-[11px] flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-300 mt-0.5" />
          <div className="flex-1">
            <p className="text-slate-100">
              Latest move in your market
            </p>
            <p className="mt-0.5 text-slate-300">
              {lastChange.title}
            </p>
            <p className="mt-0.5 text-slate-500">
              ODYAN uses these changes to update forecasts and GP risk
              in the competitor hub view.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

type StatTone = "default" | "good" | "warn" | "alert";

function SnapshotStat({
  label,
  value,
  tone = "default",
  helper,
}: {
  label: string;
  value: string;
  tone?: StatTone;
  helper?: string;
}) {
  const color =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warn"
      ? "text-amber-300"
      : tone === "alert"
      ? "text-rose-300"
      : "text-slate-100";

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-3 space-y-1">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className={"text-base font-semibold " + color}>{value}</p>
      {helper && (
        <p className="text-[10px] text-slate-500">{helper}</p>
      )}
    </div>
  );
}

function computeStats(data: CompetitorSummaryResponse) {
  const { competitors } = data;

  if (competitors.length === 0) {
    return {
      avgPriceIndex: 0,
      aboveYouCount: 0,
      belowYouCount: 0,
      totalChanges24h: 0,
      hottestArea: "",
      recentChanges: [] as CompetitorChange[],
    };
  }

  let aboveYouCount = 0;
  let belowYouCount = 0;
  let totalChanges24h = 0;

  const areaCounts = new Map<string, number>();
  const now = new Date("2025-12-07T00:00:00.000Z");
  const msInDay = 24 * 60 * 60 * 1000;

  const allChanges: CompetitorChange[] = [];

  competitors.forEach((c) => {
    if (c.avgPriceIndex > 100) aboveYouCount += 1;
    if (c.avgPriceIndex < 100) belowYouCount += 1;

    const areaCount = areaCounts.get(c.location.area) ?? 0;
    areaCounts.set(c.location.area, areaCount + 1);

    c.changes.forEach((ch) => {
      allChanges.push(ch);
      const d = new Date(ch.date);
      if (now.getTime() - d.getTime() <= msInDay) {
        totalChanges24h += 1;
      }
    });
  });

  let hottestArea = "";
  let maxCount = 0;
  areaCounts.forEach((value, key) => {
    if (value > maxCount) {
      maxCount = value;
      hottestArea = key;
    }
  });

  const recentChanges = [...allChanges].sort((a, b) =>
    a.date === b.date ? 0 : a.date > b.date ? -1 : 1
  );

  return {
    avgPriceIndex: 0, // not needed in this card for now
    aboveYouCount,
    belowYouCount,
    totalChanges24h,
    hottestArea,
    recentChanges,
  };
}
