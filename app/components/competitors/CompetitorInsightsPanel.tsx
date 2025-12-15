// app/components/competitors/CompetitorInsightsPanel.tsx

import {
  type Competitor,
  type CompetitorSummaryMeta,
  type CompetitorChange,
} from "@/types/competitors";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  MapPin,
  TrendingUp,
} from "lucide-react";

interface Props {
  meta: CompetitorSummaryMeta;
  competitors: Competitor[];
  selected: Competitor | null;
  allRecentChanges: CompetitorChange[];
  hottestArea: string;
}

export function CompetitorInsightsPanel({
  meta,
  competitors,
  selected,
  allRecentChanges,
  hottestArea,
}: Props) {
  const active = selected ?? competitors[0];

  const priceSample = (active?.priceSample ?? []).slice(0, 5);

  const undercuts = priceSample.filter(
    (p) => p.competitorPrice < p.yourPrice
  );
  const overcuts = priceSample.filter(
    (p) => p.competitorPrice > p.yourPrice
  );

  const avgDelta =
    priceSample.length > 0
      ? priceSample.reduce((sum, p) => {
          const delta =
            ((p.competitorPrice - p.yourPrice) / p.yourPrice) * 100;
          return sum + delta;
        }, 0) / priceSample.length
      : 0;

  const priceIndexBadge =
    active && active.avgPriceIndex
      ? active.avgPriceIndex > 103
        ? "Premium vs you"
        : active.avgPriceIndex < 97
        ? "Undercutting you"
        : "Similar to you"
      : null;

  const priceIndexBadgeClass =
    active && active.avgPriceIndex
      ? active.avgPriceIndex > 103
        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
        : active.avgPriceIndex < 97
        ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
        : "border-slate-600 bg-slate-900/80 text-slate-200"
      : "border-slate-600 bg-slate-900/80 text-slate-200";

  const ratingRiskHint =
    active && active.rating
      ? active.rating >= 4.6
        ? "Very strong guest love. Harder to attack on experience alone."
        : active.rating >= 4.3
        ? "Solid reputation. You can compete with targeted moves."
        : "Their reputation leaves some space for you to win with consistency."
      : "";

  return (
    <section className="space-y-3">
      {/* Focus competitor card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Focus competitor
            </p>
            <div className="flex items-center gap-2">
              <div
                className="h-7 w-7 rounded-lg border border-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-50"
                style={{
                  background: active?.brandColor ?? "#0f172a",
                }}
              >
                {active?.name
                  ?.split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-50">
                  {active?.name ?? "No competitor"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {active?.cuisines.join(" · ")}
                </p>
              </div>
            </div>
          </div>
          {active && (
            <div className="flex flex-col items-end gap-1">
              <div className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                <MapPin className="h-3 w-3 text-sky-400" />
                <span>{active.location.area}</span>
                <span className="text-slate-500">
                  · {active.location.distanceKm.toFixed(1)} km
                </span>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                <span className="text-slate-400">Price index</span>
                <span className="text-sky-200">
                  {active.avgPriceIndex.toFixed(1)}
                </span>
              </div>
              {priceIndexBadge && (
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                    priceIndexBadgeClass,
                  ].join(" ")}
                >
                  {priceIndexBadge}
                </span>
              )}
            </div>
          )}
        </div>

        {active && (
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Delivery performance
              </p>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">
                  {active.deliveryEtaMinutes} min
                </span>
                <span className="text-slate-500">
                  rating {active.rating.toFixed(1)} from{" "}
                  {active.reviewVolume.toLocaleString("en-GB")} reviews
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                If your average dispatch time is slower, consider a clear
                service promise or “on-time” guarantee on key channels.
              </p>
              {ratingRiskHint && (
                <p className="text-[10px] text-slate-400 mt-1">
                  {ratingRiskHint}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                ODYAN suggestion
              </p>
              <p className="text-[11px] text-slate-200">
                {avgDelta > 0
                  ? "You can support a slight premium by anchoring value on hero dishes, presentation and reviews. Use bundle value instead of blanket discounts."
                  : avgDelta < 0
                  ? "You are cheaper on several lines. Decide if this is a deliberate “volume play” or if you can lift prices on the top sellers."
                  : "Your pricing roughly matches them. To win, tilt the game on experience, speed, and signature dishes they cannot copy."}
              </p>
              <p className="text-[10px] text-slate-500">
                Venue: {meta.venueName} · {meta.venueCity}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Price comparison */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Menu price comparison
            </p>
            <p className="text-xs text-slate-400">
              Sample of tracked dishes vs your current menu
            </p>
          </div>
          {priceSample.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 border border-slate-700">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
                <span className="text-[10px] text-slate-200">
                  Avg delta {avgDelta >= 0 ? "+" : ""}
                  {avgDelta.toFixed(1)} percent
                </span>
              </div>
              {(undercuts.length > 0 || overcuts.length > 0) && (
                <div className="inline-flex flex-wrap gap-1 text-[10px]">
                  {overcuts.length > 0 && (
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-200 px-2 py-0.5">
                      {overcuts.length} lines where competitor is more
                      expensive
                    </span>
                  )}
                  {undercuts.length > 0 && (
                    <span className="rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-200 px-2 py-0.5">
                      {undercuts.length} lines where they undercut you
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {priceSample.length === 0 ? (
          <p className="text-[11px] text-slate-400">
            No sample items yet for this competitor. Once ODYAN ingests their
            full menu, key items will appear here.
          </p>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
            <table className="w-full border-collapse text-[11px]">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-3 py-2 text-left font-normal text-slate-400">
                    Item
                  </th>
                  <th className="px-3 py-2 text-left font-normal text-slate-400">
                    Category
                  </th>
                  <th className="px-3 py-2 text-right font-normal text-slate-400">
                    Your price
                  </th>
                  <th className="px-3 py-2 text-right font-normal text-slate-400">
                    Competitor
                  </th>
                  <th className="px-3 py-2 text-right font-normal text-slate-400">
                    Delta
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceSample.map((p) => {
                  const diff = p.competitorPrice - p.yourPrice;
                  const diffPercent = (diff / p.yourPrice) * 100;
                  const isHigher = diff > 0;

                  const Icon = isHigher ? ArrowUpRight : ArrowDownRight;
                  const colorClass =
                    diff === 0
                      ? "text-slate-300"
                      : isHigher
                      ? "text-emerald-300"
                      : "text-rose-300";

                  return (
                    <tr
                      key={p.id}
                      className="border-t border-slate-800/80"
                    >
                      <td className="px-3 py-2 text-slate-100">
                        {p.itemName}
                      </td>
                      <td className="px-3 py-2 text-slate-400">
                        {p.category}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-100">
                        {p.currency} {p.yourPrice.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-100">
                        {p.currency}{" "}
                        {p.competitorPrice.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {diff === 0 ? (
                          <span className="text-slate-300">
                            Same price
                          </span>
                        ) : (
                          <span
                            className={[
                              "inline-flex items-center justify-end gap-1",
                              colorClass,
                            ].join(" ")}
                          >
                            <Icon className="h-3 w-3" />
                            <span>
                              {diff > 0 ? "+" : ""}
                              {diffPercent.toFixed(1)} percent
                            </span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Heat map and change log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Light map */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Heat map
              </p>
              <p className="text-xs text-slate-400">
                Where your competitors cluster
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 border border-slate-700">
                <MapPin className="h-3.5 w-3.5 text-sky-300" />
                <span className="text-[10px] text-slate-200">
                  Hot zone: {hottestArea || "n/a"}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                {competitors.length} competitors mapped
              </span>
            </div>
          </div>

          <div className="relative mt-1 h-40 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="grid h-full w-full grid-cols-6 grid-rows-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="border-[0.5px] border-slate-800"
                  />
                ))}
              </div>
            </div>

            <div className="relative h-full w-full">
              {competitors.map((c, index) => {
                const x = (index * 79) % 100;
                const y = (index * 47) % 100;
                return (
                  <div
                    key={c.id}
                    className="absolute h-3 w-3 rounded-full border border-slate-900 shadow-sm"
                    style={{
                      background: c.brandColor,
                      left: `${10 + x * 0.7}%`,
                      top: `${15 + y * 0.6}%`,
                    }}
                    title={`${c.name} · ${c.location.area}`}
                  />
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-slate-500">
            This is a lightweight visual density preview. In later phases we
            can attach this to a real map layer and postcode-level data.
          </p>
        </div>

        {/* Change log */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Change log
              </p>
              <p className="text-xs text-slate-400">
                Most recent moves across all competitors
              </p>
            </div>
            <AlertTriangle className="h-4 w-4 text-amber-300" />
          </div>

          {allRecentChanges.length === 0 ? (
            <p className="text-[11px] text-slate-400">
              No menu or price moves detected yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 custom-scroll">
              {allRecentChanges.map((ch) => {
                const comp = competitors.find(
                  (c) => c.id === ch.competitorId
                );
                const impactColor =
                  ch.impact === "positive"
                    ? "text-emerald-300"
                    : ch.impact === "negative"
                    ? "text-rose-300"
                    : "text-amber-200";

                const impactBgClass =
                  ch.impact === "positive"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : ch.impact === "negative"
                    ? "border-rose-500/40 bg-rose-500/10"
                    : "border-amber-400/40 bg-amber-500/10";

                const formattedTime = formatChangeTime(ch.date);
                const impactLabel =
                  ch.impact === "positive"
                    ? "Good for you"
                    : ch.impact === "negative"
                    ? "Risk for you"
                    : "Neutral move";

                const gpImpact =
                  typeof ch.estimatedGpImpactBps === "number"
                    ? `${ch.estimatedGpImpactBps > 0 ? "+" : ""}${
                        ch.estimatedGpImpactBps
                      } bps`
                    : null;

                return (
                  <div
                    key={ch.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-[11px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="text-slate-100">
                          {ch.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {ch.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px] text-slate-400">
                          {formattedTime}
                        </span>
                        {comp && (
                          <span className="text-[10px] text-slate-300">
                            {comp.name}
                          </span>
                        )}
                        <span
                          className={[
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                            impactBgClass,
                            impactColor,
                          ].join(" ")}
                        >
                          {impactLabel}
                          {gpImpact && (
                            <span className="text-[10px] opacity-80">
                              · {gpImpact}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function formatChangeTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso.slice(0, 10).replace(/-/g, " ");
  }

  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();

  const timePart = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameDay) {
    return `Today · ${timePart}`;
  }
  if (isYesterday) {
    return `Yesterday · ${timePart}`;
  }

  const datePart = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${datePart} · ${timePart}`;
}
