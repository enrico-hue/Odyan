// app/components/competitors/CompetitorList.tsx

import { Competitor } from "@/types/competitors";
import { MapPin, Star, Timer } from "lucide-react";

interface Props {
  competitors: Competitor[];
  allCompetitors: Competitor[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CompetitorList({
  competitors,
  allCompetitors,
  selectedId,
  onSelect,
}: Props) {
  const total = allCompetitors.length;
  const visibleCount = competitors.length;
  const hiddenCount = Math.max(total - visibleCount, 0);

  const now = new Date();
  const msInHour = 60 * 60 * 1000;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Competitors
          </p>
          <p className="text-xs text-slate-400">
            {visibleCount} of {total} visible with current filters
            {hiddenCount > 0 && (
              <span className="text-[11px] text-slate-500">
                {" "}
                · {hiddenCount} filtered out
              </span>
            )}
          </p>
        </div>
      </div>

      {visibleCount === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-6 text-xs text-slate-300">
          <p className="font-medium text-slate-100 mb-1">
            No competitors match these filters
          </p>
          <p className="text-[11px] text-slate-400">
            Try widening the channel filter, clearing the search box, or removing the
            “recent changes only” focus in the controls above.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1 custom-scroll">
          {competitors.map((c) => {
            const isSelected = c.id === selectedId;
            const priceDelta = c.avgPriceIndex - 100;
            const priceColor =
              priceDelta > 3
                ? "text-emerald-300"
                : priceDelta < -3
                ? "text-rose-300"
                : "text-slate-200";

            const priceToneBadge =
              priceDelta > 3
                ? "Premium vs you"
                : priceDelta < -3
                ? "Undercutting you"
                : "Similar level";

            const priceToneClass =
              priceDelta > 3
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : priceDelta < -3
                ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                : "border-slate-600 bg-slate-900/80 text-slate-200";

            const lastChange = c.changes[0];
            let lastChangeLabel: string | null = null;
            let lastChangeImpactClass =
              "border-slate-700 bg-slate-900/80 text-slate-300";

            if (lastChange) {
              const changeDate = new Date(lastChange.date);
              const diffHours =
                (now.getTime() - changeDate.getTime()) / msInHour;

              if (diffHours <= 24) {
                lastChangeLabel = "New move <24h";
              } else if (diffHours <= 72) {
                lastChangeLabel = "Recent move";
              } else {
                lastChangeLabel = "Older move";
              }

              if (lastChange.impact === "positive") {
                // good for you
                lastChangeImpactClass =
                  "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
              } else if (lastChange.impact === "negative") {
                // risk for you
                lastChangeImpactClass =
                  "border-rose-500/40 bg-rose-500/10 text-rose-200";
              } else {
                lastChangeImpactClass =
                  "border-amber-400/40 bg-amber-500/10 text-amber-100";
              }
            }

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={[
                  "w-full text-left rounded-xl border px-3.5 py-3 text-xs transition-colors",
                  isSelected
                    ? "border-sky-500/70 bg-sky-500/10"
                    : "border-slate-800 bg-slate-900/70 hover:border-slate-600",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 h-7 w-7 shrink-0 rounded-lg border border-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-50"
                    style={{ background: c.brandColor }}
                  >
                    {c.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-medium text-slate-50">
                            {c.name}
                          </p>
                          {c.isChain && (
                            <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300">
                              Chain
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {c.cuisines.join(" · ")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-300" />
                          <span className="text-[11px] text-slate-100">
                            {c.rating.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({c.reviewVolume.toLocaleString("en-GB")})
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1">
                          <Timer className="h-3 w-3 text-slate-400" />
                          <span className="text-[10px] text-slate-300">
                            {c.deliveryEtaMinutes} min delivery
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <div className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                        <MapPin className="h-3 w-3 text-sky-400" />
                        <span>
                          {c.location.area} ·{" "}
                          {c.location.distanceKm.toFixed(1)} km
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px]">
                        <span className="text-slate-400">
                          Price index:
                        </span>
                        <span className={priceColor}>
                          {c.avgPriceIndex.toFixed(1)}
                        </span>
                        <span className="text-slate-500">
                          ({priceDelta >= 0 ? "+" : ""}
                          {priceDelta.toFixed(1)} vs you)
                        </span>
                      </div>
                      <span
                        className={[
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                          priceToneClass,
                        ].join(" ")}
                      >
                        {priceToneBadge}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex flex-wrap gap-1">
                        {c.channels.map((ch) => (
                          <span
                            key={ch}
                            className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-300 border border-slate-700"
                          >
                            {ch === "dine_in" && "Dine in"}
                            {ch === "delivery" && "Delivery"}
                            {ch === "takeaway" && "Takeaway"}
                          </span>
                        ))}
                      </div>
                      {lastChange && (
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          <span
                            className={[
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] shrink-0",
                              lastChangeImpactClass,
                            ].join(" ")}
                          >
                            {lastChange.impact === "positive" &&
                              "Good for you"}
                            {lastChange.impact === "negative" &&
                              "Risk for you"}
                            {lastChange.impact === "neutral" &&
                              "Neutral move"}
                            {lastChangeLabel &&
                              ` · ${lastChangeLabel}`}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            Last move: {lastChange.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
