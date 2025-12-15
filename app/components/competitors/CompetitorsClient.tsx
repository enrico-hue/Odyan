// app/components/competitors/CompetitorsClient.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Competitor,
  CompetitorSummaryResponse,
  CompetitorChannel,
  CompetitorChange,
} from "@/types/competitors";
import { CompetitorList } from "./CompetitorList";
import { CompetitorInsightsPanel } from "./CompetitorInsightsPanel";

import {
  AlertTriangle,
  Filter,
  MapPin,
  TrendingUp,
  Clock,
  ArrowUpDown,
} from "lucide-react";

type ActiveChannelFilter = CompetitorChannel | "all";

type SortKey =
  | "relevance"
  | "distance"
  | "rating"
  | "price_above"
  | "price_below"
  | "changes";

interface FetchState {
  data: CompetitorSummaryResponse | null;
  loading: boolean;
  error: string | null;
}

export default function CompetitorsClient() {
  const [fetchState, setFetchState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  });

  const [search, setSearch] = useState("");
  const [activeChannel, setActiveChannel] =
    useState<ActiveChannelFilter>("all");
  const [selectedCompetitorId, setSelectedCompetitorId] =
    useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("relevance");
  const [showRecentChangesOnly, setShowRecentChangesOnly] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setFetchState((prev) => ({ ...prev, loading: true }));
        const res = await fetch("/api/competitors", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load competitors");
        }

        const json =
          (await res.json()) as CompetitorSummaryResponse;

        if (!cancelled) {
          setFetchState({
            data: json,
            loading: false,
            error: null,
          });
          if (json.competitors.length > 0) {
            setSelectedCompetitorId(json.competitors[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setFetchState({
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

  const competitors = fetchState.data?.competitors ?? [];

  const now = useMemo(() => new Date(), []);
  const msInDay = 24 * 60 * 60 * 1000;

  const globalStats = useMemo(() => {
    if (competitors.length === 0) {
      return {
        avgPriceIndex: 0,
        aboveYouCount: 0,
        belowYouCount: 0,
        totalChanges24h: 0,
        hottestArea: "",
        channelCounts: {
          dine_in: 0,
          delivery: 0,
          takeaway: 0,
        } as Record<CompetitorChannel, number>,
      };
    }

    const avgPriceIndex =
      competitors.reduce(
        (sum, c) => sum + c.avgPriceIndex,
        0
      ) / competitors.length;

    let aboveYouCount = 0;
    let belowYouCount = 0;
    let totalChanges24h = 0;

    const areaCounts = new Map<string, number>();
    const channelCounts: Record<CompetitorChannel, number> = {
      dine_in: 0,
      delivery: 0,
      takeaway: 0,
    };

    competitors.forEach((c) => {
      if (c.avgPriceIndex > 100) aboveYouCount += 1;
      if (c.avgPriceIndex < 100) belowYouCount += 1;

      const count = areaCounts.get(c.location.area) ?? 0;
      areaCounts.set(c.location.area, count + 1);

      c.channels.forEach((ch) => {
        channelCounts[ch] = (channelCounts[ch] ?? 0) + 1;
      });

      c.changes.forEach((ch) => {
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

    return {
      avgPriceIndex,
      aboveYouCount,
      belowYouCount,
      totalChanges24h,
      hottestArea,
      channelCounts,
    };
  }, [competitors, now, msInDay]);

  const allRecentChanges = useMemo<CompetitorChange[]>(() => {
    const all = competitors.flatMap((c) => c.changes);
    const sorted = [...all].sort((a, b) => {
      if (a.date === b.date) return 0;
      return a.date > b.date ? -1 : 1;
    });
    return sorted.slice(0, 8);
  }, [competitors]);

  const filteredCompetitors = useMemo(() => {
    let list = competitors;

    if (activeChannel !== "all") {
      list = list.filter((c) =>
        c.channels.includes(activeChannel)
      );
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(term);
        const cuisineMatch = c.cuisines.some((cu) =>
          cu.toLowerCase().includes(term)
        );
        const areaMatch = c.location.area
          .toLowerCase()
          .includes(term);
        return nameMatch || cuisineMatch || areaMatch;
      });
    }

    if (showRecentChangesOnly) {
      list = list.filter((c) =>
        c.changes.some((ch) => {
          const d = new Date(ch.date);
          return now.getTime() - d.getTime() <= msInDay;
        })
      );
    }

    const sorted = [...list];

    sorted.sort((a, b) => {
      if (sortKey === "distance") {
        return (
          a.location.distanceKm - b.location.distanceKm
        );
      }
      if (sortKey === "rating") {
        return b.rating - a.rating;
      }
      if (sortKey === "price_above") {
        const da = a.avgPriceIndex - 100;
        const db = b.avgPriceIndex - 100;
        return db - da;
      }
      if (sortKey === "price_below") {
        const da = 100 - a.avgPriceIndex;
        const db = 100 - b.avgPriceIndex;
        return db - da;
      }
      if (sortKey === "changes") {
        const ca = a.changes.length;
        const cb = b.changes.length;
        return cb - ca;
      }
      return a.location.distanceKm - b.location.distanceKm;
    });

    return sorted;
  }, [
    competitors,
    activeChannel,
    search,
    sortKey,
    showRecentChangesOnly,
    now,
    msInDay,
  ]);

  const selectedCompetitor = useMemo(() => {
    if (!selectedCompetitorId) return null;
    return (
      competitors.find((c) => c.id === selectedCompetitorId) ??
      null
    );
  }, [selectedCompetitorId, competitors]);

  if (fetchState.loading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-10 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full border border-slate-700 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-300">
            ODYAN is scanning your competitive landscape
          </p>
        </div>
      </div>
    );
  }

  if (fetchState.error) {
    return (
      <div className="w-full max-w-6xl mx-auto py-10">
        <div className="rounded-2xl border border-rose-700/60 bg-rose-950/40 px-6 py-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-rose-100">
              There was a problem loading competitors
            </p>
            <p className="text-xs text-rose-200/80 mt-1">
              {fetchState.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!fetchState.data || competitors.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto py-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-10 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-slate-200">
            No competitors are configured yet
          </p>
          <p className="text-xs text-slate-400">
            As soon as ODYAN ingests your local market, this page will show
            live price and menu intelligence.
          </p>
        </div>
      </div>
    );
  }

  const { meta } = fetchState.data;

  const lastSyncLabel = (() => {
    if (!meta.lastGlobalSync) return null;
    const d = new Date(meta.lastGlobalSync);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });
  })();

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      {/* Header and global stats */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Competitive radar
            </p>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              Competitor Intelligence
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl">
              Live view of local competitors, price positioning, and changes
              that matter for your GP and demand.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-3 justify-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5">
                <MapPin className="h-4 w-4 text-sky-400" />
                <p className="text-xs text-slate-200">
                  {meta.venueName} · {meta.venueCity}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <p className="text-xs text-slate-200">
                  {competitors.length} active competitors tracked
                </p>
              </div>
            </div>
            {lastSyncLabel && (
              <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>Data as of {lastSyncLabel}</span>
              </div>
            )}
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Average price index
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">
              {globalStats.avgPriceIndex.toFixed(1)}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              100 is equal to your menu. Above 100 means more expensive.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Above you
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">
              {globalStats.aboveYouCount}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Competitors pricing higher than you on average.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Below you
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">
              {globalStats.belowYouCount}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Competitors undercutting your prices.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Changes last 24 hours
            </p>
            <p className="mt-2 text-lg font-semibold text-amber-300">
              {globalStats.totalChanges24h}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Menu, price, or promotion moves that ODYAN caught.
            </p>
          </div>
        </div>

        {/* Channel distribution pill */}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
          <span className="text-slate-400">
            Channel coverage:
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-0.5">
            Dine in:{" "}
            {globalStats.channelCounts.dine_in}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-0.5">
            Delivery:{" "}
            {globalStats.channelCounts.delivery}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-0.5">
            Takeaway:{" "}
            {globalStats.channelCounts.takeaway}
          </span>
          {globalStats.hottestArea && (
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-0.5">
              Hottest area: {globalStats.hottestArea}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 text-xs text-slate-300">
          <Filter className="h-4 w-4 text-slate-400" />
          <span>Filter by channel</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "dine_in", "delivery", "takeaway"] as const).map(
            (ch) => {
              const labelMap: Record<
                ActiveChannelFilter,
                string
              > = {
                all: "All",
                dine_in: "Dine in",
                delivery: "Delivery",
                takeaway: "Takeaway",
              };
              const isActive = activeChannel === ch;
              return (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  className={[
                    "px-3 py-1.5 rounded-full border text-xs transition-colors",
                    isActive
                      ? "border-sky-400 bg-sky-500/15 text-sky-100"
                      : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500",
                  ].join(" ")}
                  type="button"
                >
                  {labelMap[ch]}
                </button>
              );
            }
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <span>Sort by</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "relevance", label: "Relevance" },
            { key: "distance", label: "Distance" },
            { key: "rating", label: "Rating" },
            { key: "price_above", label: "Price above you" },
            { key: "price_below", label: "Price below you" },
            { key: "changes", label: "Recent changes" },
          ].map((opt) => {
            const isActive = sortKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() =>
                  setSortKey(opt.key as SortKey)
                }
                className={[
                  "px-3 py-1.5 rounded-full border text-xs transition-colors",
                  isActive
                    ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
                    : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500",
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            setShowRecentChangesOnly((v) => !v)
          }
          className={[
            "ml-0 md:ml-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
            showRecentChangesOnly
              ? "border-amber-400 bg-amber-500/15 text-amber-100"
              : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500",
          ].join(" ")}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />
          Only with recent moves
        </button>

        <div className="ml-auto flex-1 min-w-[160px] max-w-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, cuisine, area"
            className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-4 lg:gap-5 items-start">
        <CompetitorList
          competitors={filteredCompetitors}
          allCompetitors={competitors}
          selectedId={selectedCompetitorId}
          onSelect={setSelectedCompetitorId}
        />

        <CompetitorInsightsPanel
          meta={meta}
          competitors={competitors}
          selected={selectedCompetitor}
          allRecentChanges={allRecentChanges}
          hottestArea={globalStats.hottestArea}
        />
      </div>
    </div>
  );
}
