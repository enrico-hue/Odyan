"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  elanVenues,
  elanCompetitors,
  elanMenuItems,
  elanReputationSnapshots,
  elanDeliveryStats,
  type ElanVenue,
  type ElanCompetitor
} from "../data/elan";

const ElanMap = dynamic(() => import("../components/ElanMap"), {
  ssr: false
});

type ChannelFilter = "all" | "dine_in" | "delivery" | "mixed";
type TypeFilter =
  | "all"
  | "brunch_cafe"
  | "coffee_chain"
  | "dessert_cafe"
  | "restaurant"
  | "hotel_cafe"
  | "bakery";

type SortKey = "risk" | "distance" | "overlap" | "rating" | "price";
type ScenarioCategory = "brunch" | "dessert" | "drinks";
type ScenarioMove = "discount" | "valueAdd" | "ignore";
type RivalsViewMode = "all" | "priority";

type CompetitorRow = ElanCompetitor & {
  distanceKm: number;
  overlapScore: number;
  priceIndexVsYou: number;
  rating: number;
  gpRiskPerWeek: number;
};

const MIN_COMPETITORS_PER_VENUE = 24;

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const x = sinDLat * sinDLat + sinDLng * sinDLng * Math.cos(la1) * Math.cos(la2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

function mapPriceLevelToIndex(level: ElanCompetitor["priceLevel"]): number {
  if (level === "£") return 90;
  if (level === "££") return 100;
  return 115;
}

function mapTypeToBaseOverlap(type: ElanCompetitor["type"]): number {
  switch (type) {
    case "brunch_cafe":
      return 90;
    case "dessert_cafe":
      return 80;
    case "coffee_chain":
      return 65;
    case "bakery":
      return 60;
    case "hotel_cafe":
      return 70;
    case "restaurant":
      return 55;
    default:
      return 60;
  }
}

function mapTypeToCategoryWeights(type: ElanCompetitor["type"]) {
  if (type === "brunch_cafe") {
    return { brunch: 1, cakes: 0.7, drinks: 0.8 };
  }
  if (type === "dessert_cafe") {
    return { brunch: 0.4, cakes: 1, drinks: 0.9 };
  }
  if (type === "coffee_chain") {
    return { brunch: 0.4, cakes: 0.6, drinks: 1 };
  }
  if (type === "bakery") {
    return { brunch: 0.3, cakes: 0.8, drinks: 0.5 };
  }
  if (type === "restaurant") {
    return { brunch: 0.7, cakes: 0.4, drinks: 0.6 };
  }
  return { brunch: 0.6, cakes: 0.6, drinks: 0.6 };
}

function mapTypeToRating(type: ElanCompetitor["type"]): number {
  switch (type) {
    case "brunch_cafe":
      return 4.5;
    case "dessert_cafe":
      return 4.4;
    case "coffee_chain":
      return 4.2;
    case "restaurant":
      return 4.3;
    case "hotel_cafe":
      return 4.4;
    case "bakery":
      return 4.3;
    default:
      return 4.2;
  }
}

function FilterChip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const base = "rounded-full border px-4 py-2 text-sm font-medium transition";
  const activeClass =
    "border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]";
  const inactiveClass =
    "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500";
  return (
    <button
      type="button"
      onClick={onClick}
      className={base + " " + (active ? activeClass : inactiveClass)}
    >
      {children}
    </button>
  );
}

function KpiCard({
  label,
  value,
  helper,
  tone
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "good" | "warn" | "bad";
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warn"
      ? "text-amber-300"
      : tone === "bad"
      ? "text-rose-300"
      : "text-slate-50";

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-slate-950/85 border border-slate-800 px-5 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.7)]">
      <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className={"mt-2 text-3xl font-semibold " + toneClass}>{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}

function PressurePill({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "low" | "medium" | "high";
}) {
  const toneClass =
    tone === "high"
      ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
      : tone === "medium"
      ? "border-amber-400/60 bg-amber-500/10 text-amber-200"
      : "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm">
      <div>
        <p className="font-semibold text-slate-100">{label}</p>
        <p className="text-xs text-slate-400">Relative to your other venues.</p>
      </div>
      <span className={"rounded-full px-3 py-1 text-sm font-semibold " + toneClass}>
        {value}
      </span>
    </div>
  );
}

const londonVenues = elanVenues.filter((v) => v.countryCode === "UK");

export default function CompetitorsPage() {
  const [selectedVenueId, setSelectedVenueId] = React.useState<string>(
    londonVenues[1]?.id ?? londonVenues[0]?.id
  );
  const [radiusKm, setRadiusKm] = React.useState<number>(1);
  const [channelFilter, setChannelFilter] = React.useState<ChannelFilter>("all");
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("risk");

  const [scenarioCategory, setScenarioCategory] =
    React.useState<ScenarioCategory>("brunch");
  const [scenarioMove, setScenarioMove] =
    React.useState<ScenarioMove>("discount");
  const [scenarioDelta, setScenarioDelta] = React.useState<number>(10);

  const [viewMode, setViewMode] = React.useState<RivalsViewMode>("all");
  const [favouritesByVenue, setFavouritesByVenue] = React.useState<Record<string, string[]>>({});

  const selectedVenue = londonVenues.find((v) => v.id === selectedVenueId) as ElanVenue;

  const favouriteIds = favouritesByVenue[selectedVenueId] ?? [];

  const toggleFavourite = React.useCallback(
    (id: string) => {
      setFavouritesByVenue((prev) => {
        const current = prev[selectedVenueId] ?? [];
        const exists = current.includes(id);
        const next = exists ? current.filter((x) => x !== id) : [...current, id];
        return { ...prev, [selectedVenueId]: next };
      });
    },
    [selectedVenueId]
  );

  const brunchItems = elanMenuItems.filter((i) =>
    ["cat_breakfast", "cat_brunch_classics"].includes(i.categoryId)
  );
  const dessertItems = elanMenuItems.filter((i) =>
    ["cat_cakes", "cat_pastry"].includes(i.categoryId)
  );
  const drinksItems = elanMenuItems.filter((i) =>
    ["cat_coffee", "cat_house_drinks", "cat_hot_chocolate"].includes(i.categoryId)
  );

  const enrichedCompetitors: CompetitorRow[] = React.useMemo(() => {
    let base: ElanCompetitor[] = elanCompetitors.filter(
      (c) => c.venueId === selectedVenueId
    );

    if (base.length === 0) {
      const byVenue = new Map<string, ElanCompetitor[]>();

      for (const c of elanCompetitors) {
        const existing = byVenue.get(c.venueId) ?? [];
        existing.push(c);
        byVenue.set(c.venueId, existing);
      }

      let templateVenueId = "";
      let templateGroup: ElanCompetitor[] = [];

      for (const [venueId, group] of byVenue.entries()) {
        if (group.length > templateGroup.length) {
          templateVenueId = venueId;
          templateGroup = group;
        }
      }

      if (templateGroup.length > 0) {
        const templateVenue =
          londonVenues.find((v) => v.id === templateVenueId) ?? selectedVenue;

        base = templateGroup.map((c, idx) => {
          const dLat = c.lat - templateVenue.lat;
          const dLng = c.lng - templateVenue.lng;

          return {
            ...c,
            id: `${selectedVenueId}-synthetic-${idx}`,
            venueId: selectedVenueId,
            lat: selectedVenue.lat + dLat,
            lng: selectedVenue.lng + dLng
          };
        });
      }
    }

    if (base.length > 0 && base.length < MIN_COMPETITORS_PER_VENUE) {
      const extended: ElanCompetitor[] = [...base];
      const needed = MIN_COMPETITORS_PER_VENUE - base.length;

      for (let i = 0; i < needed; i++) {
        const source = base[i % base.length];
        const angle = ((i + 1) * 35 * Math.PI) / 180;
        const radiusDeg = 0.002 + (i % 4) * 0.001;

        const lat = selectedVenue.lat + radiusDeg * Math.cos(angle);
        const lng = selectedVenue.lng + radiusDeg * Math.sin(angle);

        extended.push({
          ...source,
          id: `${selectedVenueId}-extra-${i}`,
          venueId: selectedVenueId,
          lat,
          lng
        });
      }

      base = extended;
    }

    return base.map((c, idx) => {
      const distance = haversineKm(selectedVenue, c);
      const baseOverlap = mapTypeToBaseOverlap(c.type);
      const typeWeights = mapTypeToCategoryWeights(c.type);

      const brunchWeight =
        (brunchItems.length / elanMenuItems.length) * typeWeights.brunch * 100;
      const dessertWeight =
        (dessertItems.length / elanMenuItems.length) * typeWeights.cakes * 100;
      const drinksWeight =
        (drinksItems.length / elanMenuItems.length) * typeWeights.drinks * 100;

      let overlapScore =
        (baseOverlap + brunchWeight + dessertWeight + drinksWeight) / 4;
      overlapScore = Math.min(98, Math.max(40, overlapScore + idx * 2));

      const priceIndex = mapPriceLevelToIndex(c.priceLevel);
      const rating = mapTypeToRating(c.type) + (idx % 2 === 0 ? 0.05 : -0.03);

      const distFactor = Math.min(1.3, Math.max(0.6, 1.2 - distance * 0.15));
      const ratingFactor = rating / 4.3;
      const priceFactor = priceIndex / 100;

      let gpRisk =
        overlapScore * 18 * distFactor * ratingFactor * priceFactor +
        idx * 90;

      if (distance > 2.5) gpRisk *= 0.6;
      if (distance > 3.5) gpRisk *= 0.4;

      gpRisk = Math.round(gpRisk / 10) * 10;

      return {
        ...c,
        distanceKm: distance,
        overlapScore,
        priceIndexVsYou: priceIndex,
        rating,
        gpRiskPerWeek: gpRisk
      };
    });
  }, [
    selectedVenueId,
    selectedVenue,
    brunchItems.length,
    dessertItems.length,
    drinksItems.length
  ]);

  const filteredCompetitors: CompetitorRow[] = React.useMemo(() => {
    let rows = enrichedCompetitors.filter((r) => r.distanceKm <= radiusKm);

    if (channelFilter !== "all") {
      rows = rows.filter((r) => r.mainChannel === channelFilter);
    }

    if (typeFilter !== "all") {
      rows = rows.filter((r) => r.type === typeFilter);
    }

    const sorted = [...rows].sort((a, b) => {
      if (sortKey === "risk") return b.gpRiskPerWeek - a.gpRiskPerWeek;
      if (sortKey === "distance") return a.distanceKm - b.distanceKm;
      if (sortKey === "overlap") return b.overlapScore - a.overlapScore;
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "price") return a.priceIndexVsYou - b.priceIndexVsYou;
      return 0;
    });

    return sorted;
  }, [enrichedCompetitors, radiusKm, channelFilter, typeFilter, sortKey]);

  const rivalsForMapAndTable: CompetitorRow[] = React.useMemo(() => {
    if (viewMode === "priority" && favouriteIds.length > 0) {
      return filteredCompetitors.filter((c) => favouriteIds.includes(c.id));
    }
    return filteredCompetitors;
  }, [filteredCompetitors, viewMode, favouriteIds]);

  const totalWeeklyRisk = filteredCompetitors.reduce(
    (sum, c) => sum + c.gpRiskPerWeek,
    0
  );

  const competitorCount = filteredCompetitors.length;
  const maxOverlap = filteredCompetitors.reduce(
    (max, c) => (c.overlapScore > max ? c.overlapScore : max),
    0
  );

  const brunchPressure = Math.min(100, Math.round((maxOverlap + competitorCount * 4) / 1.5));
  const dessertPressure = Math.min(100, Math.round((dessertItems.length * 3 + competitorCount * 6) / 2));
  const drinksPressure = Math.min(100, Math.round((drinksItems.length * 2 + competitorCount * 4) / 1.8));

  const brunchTone = brunchPressure > 75 ? "high" : brunchPressure > 55 ? "medium" : "low";
  const dessertTone = dessertPressure > 75 ? "high" : dessertPressure > 55 ? "medium" : "low";
  const drinksTone = drinksPressure > 75 ? "high" : drinksPressure > 55 ? "medium" : "low";

  const venueReps = elanReputationSnapshots.filter(
    (s) => s.venueId === selectedVenueId
  );
  const avgVenueRating =
    venueReps.length > 0
      ? venueReps.reduce((sum, s) => sum + s.rating, 0) / venueReps.length
      : 4.4;

  const deliveryVenueStats = elanDeliveryStats.filter(
    (d) => d.venueId === selectedVenueId && d.enabled
  );
  const deliveryOrders30d = deliveryVenueStats.reduce(
    (sum, d) => sum + d.last30dOrders,
    0
  );

  const topCompetitor = filteredCompetitors[0];

  const kpiCards = [
    {
      label: "Active rivals in this bubble",
      value: competitorCount ? String(competitorCount) : "0",
      helper: `Within ${radiusKm.toFixed(1)} km around ${selectedVenue.shortName}.`,
      tone: competitorCount >= 5 ? "bad" : competitorCount >= 3 ? "warn" : "good"
    },
    {
      label: "Estimated GP at risk",
      value:
        "£" +
        (totalWeeklyRisk || 1840).toLocaleString("en-GB", {
          maximumFractionDigits: 0
        }),
      helper: "Predicted weekly GP threatened by current competition.",
      tone: totalWeeklyRisk >= 3000 ? "bad" : totalWeeklyRisk >= 2000 ? "warn" : "good"
    },
    {
      label: "Your rating shield",
      value: avgVenueRating.toFixed(1) + " ★",
      helper: "Average rating for this venue across main platforms.",
      tone: avgVenueRating >= 4.4 ? "good" : avgVenueRating >= 4 ? "warn" : "bad"
    },
    {
      label: "Delivery volume last 30 days",
      value: deliveryOrders30d ? String(deliveryOrders30d) : "0",
      helper: "Helps decide dine in vs delivery focus for this battle.",
      tone: deliveryOrders30d >= 1500 ? "good" : undefined
    }
  ] as const;

  const pricePositionHint =
    topCompetitor && topCompetitor.priceIndexVsYou < 95
      ? "Local rivals are undercutting your average ticket. Consider value plays or hero dishes."
      : topCompetitor && topCompetitor.priceIndexVsYou > 110
      ? "You are below some premium competitors. You can probably push pricing on key signatures."
      : "You sit roughly in the middle of the price ladder. Defend value through signatures and experience.";

  const scenarioBaseRisk = totalWeeklyRisk || 2200;
  const scenarioCategoryWeight =
    scenarioCategory === "brunch"
      ? brunchPressure / 100
      : scenarioCategory === "dessert"
      ? dessertPressure / 100
      : drinksPressure / 100;

  const absDelta = Math.abs(scenarioDelta);
  let scenarioProtectedGp = 0;
  let scenarioCoversSaved = 0;
  let scenarioNote = "";

  if (scenarioMove === "discount") {
    scenarioProtectedGp = Math.round(
      scenarioBaseRisk * 0.55 * scenarioCategoryWeight * (absDelta / 15)
    );
    scenarioCoversSaved = Math.round(40 * scenarioCategoryWeight * (absDelta / 10));
    scenarioNote =
      "Short tactical discount. Protects demand but erodes some GP, use as a 1 to 2 week move.";
  } else if (scenarioMove === "valueAdd") {
    scenarioProtectedGp = Math.round(
      scenarioBaseRisk * 0.45 * scenarioCategoryWeight * (absDelta / 20)
    );
    scenarioCoversSaved = Math.round(30 * scenarioCategoryWeight * (absDelta / 12));
    scenarioNote =
      "Increase perceived value with portion, plating or hero extras. Slower build, but GP friendly.";
  } else {
    scenarioProtectedGp = Math.round(
      scenarioBaseRisk * 0.15 * scenarioCategoryWeight
    );
    scenarioCoversSaved = Math.round(12 * scenarioCategoryWeight);
    scenarioNote =
      "Holding position keeps simplicity but assumes rating and experience are strong enough to carry the gap.";
  }

  const venueRiskRanking = React.useMemo(() => {
    const results = londonVenues.map((v) => {
      const comps = elanCompetitors.filter((c) => c.venueId === v.id);
      const riskScore = comps.reduce((sum, c, idx) => {
        const dist = haversineKm(v, c);
        const baseOverlap = mapTypeToBaseOverlap(c.type);
        const distFactor = dist <= 1 ? 1.2 : dist <= 2 ? 1 : 0.7;
        const priceIndex = mapPriceLevelToIndex(c.priceLevel);
        const priceFactor = priceIndex / 100;
        const localScore = baseOverlap * distFactor * priceFactor + idx * 30;
        return sum + localScore;
      }, 0);
      return {
        venue: v,
        risk: Math.round(riskScore)
      };
    });

    return results.sort((a, b) => b.risk - a.risk).slice(0, 3);
  }, []);

  const promoEvents = filteredCompetitors.slice(0, 4).map((c, idx) => {
    const baseMinutesAgo = (idx + 1) * 25;
    const effect =
      c.priceIndexVsYou < 95
        ? "undercutting your ticket"
        : c.priceIndexVsYou > 110
        ? "testing a more premium price point"
        : "aligning with your pricing";

    const type =
      idx === 0
        ? "Promotion"
        : idx === 1
        ? "Price move"
        : idx === 2
        ? "New item"
        : "Delivery boost";

    const label =
      type === "Promotion"
        ? "Weekday offer around brunch"
        : type === "Price move"
        ? "Ticket adjustment"
        : type === "New item"
        ? "New hero product"
        : "Delivery platform feature";

    const impact =
      c.gpRiskPerWeek > 3000 ? "High impact" : c.gpRiskPerWeek > 2000 ? "Medium impact" : "Low impact";

    return {
      id: c.id,
      rival: c.name,
      type,
      label,
      minutesAgo: baseMinutesAgo,
      effect,
      impact
    };
  });

  const usingPriorityView = viewMode === "priority";

  return (
    <div className="space-y-6 text-slate-100">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Competitors
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Live competitive battlefield
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">
            ODYAN reads maps, menus, delivery platforms and ratings around each EL&amp;N
            site. This screen shows where you are under pressure and which moves will
            protect your GP and demand.
          </p>
        </div>

        <div className="space-y-2 text-sm text-slate-400">
          <p className="font-semibold text-slate-200">Focus venue</p>
          <select
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
          >
            {londonVenues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.shortName} ({v.city})
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">
            Later this dropdown will include all markets with a global search box and tags.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            helper={k.helper}
            tone={k.tone}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,2.3fr)_minmax(0,1.7fr)] gap-4">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.75)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-3">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  Territory map
                </p>
                <p className="text-sm md:text-base text-slate-300">
                  Competitive bubble around the selected venue. Adjust radius and filters to see where the heat is.
                </p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <span className="text-slate-400">Radius around venue</span>
                <div className="flex flex-wrap gap-2">
                  <FilterChip active={radiusKm === 0.5} onClick={() => setRadiusKm(0.5)}>
                    0.5 km
                  </FilterChip>
                  <FilterChip active={radiusKm === 1} onClick={() => setRadiusKm(1)}>
                    1 km
                  </FilterChip>
                  <FilterChip active={radiusKm === 2} onClick={() => setRadiusKm(2)}>
                    2 km
                  </FilterChip>
                  <FilterChip active={radiusKm === 3} onClick={() => setRadiusKm(3)}>
                    3 km
                  </FilterChip>
                </div>
              </div>
            </div>

            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-400">Channel focus:</span>
                <FilterChip active={channelFilter === "all"} onClick={() => setChannelFilter("all")}>
                  All
                </FilterChip>
                <FilterChip active={channelFilter === "dine_in"} onClick={() => setChannelFilter("dine_in")}>
                  Dine in
                </FilterChip>
                <FilterChip active={channelFilter === "delivery"} onClick={() => setChannelFilter("delivery")}>
                  Delivery
                </FilterChip>
                <FilterChip active={channelFilter === "mixed"} onClick={() => setChannelFilter("mixed")}>
                  Mixed
                </FilterChip>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-400">Competitor type:</span>
                <FilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
                  All
                </FilterChip>
                <FilterChip active={typeFilter === "brunch_cafe"} onClick={() => setTypeFilter("brunch_cafe")}>
                  Brunch
                </FilterChip>
                <FilterChip active={typeFilter === "dessert_cafe"} onClick={() => setTypeFilter("dessert_cafe")}>
                  Dessert
                </FilterChip>
                <FilterChip active={typeFilter === "coffee_chain"} onClick={() => setTypeFilter("coffee_chain")}>
                  Coffee
                </FilterChip>
                <FilterChip active={typeFilter === "bakery"} onClick={() => setTypeFilter("bakery")}>
                  Bakery
                </FilterChip>
              </div>
            </div>

            <ElanMap
              centerVenue={selectedVenue}
              competitors={rivalsForMapAndTable}
              radiusKm={radiusKm}
            />

            <p className="mt-3 text-xs text-slate-500">
              Map tiles are a placeholder. You can plug in Google Maps or Mapbox later without changing this logic.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  Rivals and GP risk
                </p>
                <p className="text-sm md:text-base text-slate-300">
                  Ordered by risk, overlap, distance or rating. This is the list of who can hurt you this week.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 text-sm md:items-end">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">View:</span>
                  <FilterChip active={viewMode === "all"} onClick={() => setViewMode("all")}>
                    All rivals
                  </FilterChip>
                  <FilterChip active={viewMode === "priority"} onClick={() => setViewMode("priority")}>
                    Priority rivals
                  </FilterChip>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">Sort by:</span>
                  <FilterChip active={sortKey === "risk"} onClick={() => setSortKey("risk")}>
                    GP risk
                  </FilterChip>
                  <FilterChip active={sortKey === "overlap"} onClick={() => setSortKey("overlap")}>
                    Overlap
                  </FilterChip>
                  <FilterChip active={sortKey === "distance"} onClick={() => setSortKey("distance")}>
                    Distance
                  </FilterChip>
                  <FilterChip active={sortKey === "rating"} onClick={() => setSortKey("rating")}>
                    Rating
                  </FilterChip>
                  <FilterChip active={sortKey === "price"} onClick={() => setSortKey("price")}>
                    Price index
                  </FilterChip>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-900/90 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3 w-12">Fav</th>
                    <th className="px-4 py-3">Rival</th>
                    <th className="px-4 py-3">Distance</th>
                    <th className="px-4 py-3">Price vs you</th>
                    <th className="px-4 py-3">Overlap</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">GP risk</th>
                  </tr>
                </thead>

                <tbody>
                  {rivalsForMapAndTable.map((c, idx) => {
                    const isTop = idx === 0;
                    const isFavourite = favouriteIds.includes(c.id);

                    return (
                      <tr
                        key={c.id}
                        className={
                          "border-t border-slate-800/70 " +
                          (isTop
                            ? "bg-rose-500/5 hover:bg-rose-500/10"
                            : "bg-slate-950/40 hover:bg-slate-900/80")
                        }
                      >
                        <td className="px-4 py-3 align-top">
                          <button
                            type="button"
                            onClick={() => toggleFavourite(c.id)}
                            className={
                              "text-xl leading-none " +
                              (isFavourite ? "text-amber-300" : "text-slate-500 hover:text-slate-300")
                            }
                            aria-label={isFavourite ? "Remove priority rival" : "Add priority rival"}
                          >
                            {isFavourite ? "★" : "☆"}
                          </button>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <p className="text-base font-semibold text-slate-50">{c.name}</p>
                          <p className="text-sm text-slate-400">{c.type.replace("_", " ")}</p>
                        </td>

                        <td className="px-4 py-3 align-top text-slate-100">
                          {c.distanceKm.toFixed(2)} km
                        </td>

                        <td className="px-4 py-3 align-top">
                          <p className="text-slate-100">{c.priceIndexVsYou.toFixed(0)} %</p>
                          <p className="text-xs text-slate-500">100 % equals your level</p>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-emerald-400"
                                style={{ width: `${Math.min(c.overlapScore, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-300">
                              {c.overlapScore.toFixed(0)} %
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top text-slate-100">
                          {c.rating.toFixed(1)} ★
                        </td>

                        <td className="px-4 py-3 align-top text-slate-300">
                          {c.mainChannel === "dine_in"
                            ? "Dine in"
                            : c.mainChannel === "delivery"
                            ? "Delivery"
                            : "Mixed"}
                        </td>

                        <td className="px-4 py-3 align-top">
                          <p className="text-base font-semibold text-rose-300">
                            £{c.gpRiskPerWeek.toLocaleString("en-GB", { maximumFractionDigits: 0 })} / week
                          </p>
                        </td>
                      </tr>
                    );
                  })}

                  {rivalsForMapAndTable.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-400">
                        {usingPriorityView
                          ? "No priority rivals yet for this venue. Click the stars in All rivals to pick key rivals."
                          : "No competitors match this radius and filter for now."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Later, clicking a rival row will open a full comparison: menu items, price ladders, delivery setup and review patterns.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
              Category pressure
            </p>
            <p className="mt-1 text-sm md:text-base text-slate-300">
              ODYAN roughly scores how hard your brunch, desserts and drinks are attacked in this bubble.
            </p>

            <div className="mt-4 space-y-3">
              <PressurePill label="Brunch and breakfast" value={`${brunchPressure} % pressure`} tone={brunchTone} />
              <PressurePill label="Desserts and cakes" value={`${dessertPressure} % pressure`} tone={dessertTone} />
              <PressurePill label="Coffee and drinks" value={`${drinksPressure} % pressure`} tone={drinksTone} />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Later this widget can connect directly to menu engineering and show which dishes are losing share.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
              Promo and price radar
            </p>
            <p className="mt-1 text-sm md:text-base text-slate-300">
              Snapshot of what your closest rivals appear to be doing right now.
            </p>

            <div className="mt-4 space-y-3">
              {promoEvents.length === 0 && (
                <p className="text-sm text-slate-500">
                  No visible moves from rivals in this bubble for now.
                </p>
              )}

              {promoEvents.map((e) => (
                <div
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      {e.type}
                    </p>
                    <p className="text-base font-semibold text-slate-100">{e.rival}</p>
                    <p className="text-sm text-slate-300">
                      {e.label}: {e.effect}.
                    </p>
                    <p className="text-xs text-slate-500">
                      About {e.minutesAgo} minutes ago (demo timing).
                    </p>
                  </div>

                  <span
                    className={
                      "rounded-full px-3 py-1 text-sm font-semibold " +
                      (e.impact === "High impact"
                        ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
                        : e.impact === "Medium impact"
                        ? "border-amber-400/60 bg-amber-500/10 text-amber-200"
                        : "border-emerald-500/50 bg-emerald-500/10 text-emerald-200")
                    }
                  >
                    {e.impact}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              In production this feed is driven by real menu, app and social scraping with exact timestamps.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
              Price ladder insight
            </p>
            <p className="mt-2 text-sm md:text-base text-slate-200">
              {pricePositionHint}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Protect at least one hero item per category where you sit above the cluster.</li>
              <li>Keep one or two entry price points per category to avoid losing price-sensitive guests.</li>
              <li>For delivery, split dine in vs app pricing strategy based on prep time and packaging costs.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-500/40 bg-slate-950/95 px-5 py-5 shadow-[0_24px_80px_rgba(16,185,129,0.35)]">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-300">
              Scenario simulator
            </p>
            <p className="mt-1 text-sm md:text-base text-slate-200">
              Quick what if for this venue. Directional, but useful for a GM and head of food.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 text-sm">Category:</span>
                <FilterChip active={scenarioCategory === "brunch"} onClick={() => setScenarioCategory("brunch")}>
                  Brunch
                </FilterChip>
                <FilterChip active={scenarioCategory === "dessert"} onClick={() => setScenarioCategory("dessert")}>
                  Desserts
                </FilterChip>
                <FilterChip active={scenarioCategory === "drinks"} onClick={() => setScenarioCategory("drinks")}>
                  Drinks
                </FilterChip>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 text-sm">Move:</span>
                <FilterChip active={scenarioMove === "discount"} onClick={() => setScenarioMove("discount")}>
                  Discount
                </FilterChip>
                <FilterChip active={scenarioMove === "valueAdd"} onClick={() => setScenarioMove("valueAdd")}>
                  Add value
                </FilterChip>
                <FilterChip active={scenarioMove === "ignore"} onClick={() => setScenarioMove("ignore")}>
                  Hold position
                </FilterChip>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">Intensity:</span>
                <input
                  type="range"
                  min={5}
                  max={25}
                  value={scenarioDelta}
                  onChange={(e) => setScenarioDelta(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-14 text-right text-sm text-slate-300">
                  {scenarioDelta} %
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">
                Estimated effect (demo)
              </p>
              <p className="mt-2 text-sm md:text-base text-emerald-100">
                Protects roughly{" "}
                <span className="font-semibold">
                  £{scenarioProtectedGp.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                </span>{" "}
                GP per week and{" "}
                <span className="font-semibold">{scenarioCoversSaved}</span>{" "}
                covers in this category if executed cleanly.
              </p>
              <p className="mt-2 text-sm text-emerald-200/90">
                {scenarioNote}
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_22px_70px_rgba(0,0,0,0.7)]">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
              Network risk ranking
            </p>
            <p className="mt-1 text-sm md:text-base text-slate-300">
              Where ODYAN thinks competitive pressure is highest across London EL&amp;N.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Later this becomes a full city heatmap with exportable lists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {venueRiskRanking.map(({ venue, risk }, idx) => (
            <div
              key={venue.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                #{idx + 1} priority
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-100">
                {venue.shortName}
              </p>
              <p className="text-sm text-slate-400">{venue.city}</p>
              <p className="mt-3 text-sm text-slate-300">
                Relative risk score:{" "}
                <span className="font-semibold text-rose-300">{risk}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Use this to decide where to focus menu experiments and promo budget first.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
