// types/competitors.ts

export type CompetitorChannel = "dine_in" | "delivery" | "takeaway";

export type CompetitorChangeImpact = "positive" | "negative" | "neutral";

export type CompetitorChangeMetric =
  | "price"
  | "menu"
  | "promotion"
  | "opening_hours"
  | "rating"
  | "other";

export interface CompetitorLocation {
  city: string;
  area: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

export interface CompetitorPricePoint {
  id: string;
  itemName: string;
  category: string;
  channel: CompetitorChannel;
  yourPrice: number;
  competitorPrice: number;
  currency: string;
}

export interface CompetitorChange {
  id: string;
  competitorId: string;
  date: string; // ISO string
  metric: CompetitorChangeMetric;
  impact: CompetitorChangeImpact;
  title: string;
  description: string;
  estimatedGpImpactBps?: number; // basis points
}

export interface Competitor {
  id: string;
  name: string;
  brandColor: string;
  isChain: boolean;
  cuisines: string[];
  location: CompetitorLocation;
  channels: CompetitorChannel[];
  avgPriceIndex: number; // 100 is same as you, 110 is 10 percent more expensive
  deliveryEtaMinutes: number;
  rating: number;
  reviewVolume: number;
  priceSample: CompetitorPricePoint[];
  changes: CompetitorChange[];
  lastMenuSync: string; // ISO string
  lastDeliveryScan: string; // ISO string
  notes?: string;
}

export interface CompetitorSummaryMeta {
  venueName: string;
  venueCity: string;
  currency: string;
  lastGlobalSync: string;
}

export interface CompetitorSummaryResponse {
  competitors: Competitor[];
  meta: CompetitorSummaryMeta;
}
