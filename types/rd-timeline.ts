// app/types/rd-timeline.ts

// Zoom levels for the Gantt
export type TimelineZoomLevel =
  | "day"
  | "week"
  | "twoWeeks"
  | "month"
  | "quarter";

// Simple brand and geography helpers
export interface BrandRef {
  id: string;
  name: string;               // "EL&N"
  code?: string;              // "ELN"
}

export interface GeographyRef {
  region?: string;            // "GCC"
  countryCode?: string;       // "UK", "SA", "SAU"
  city?: string;              // "London", "Riyadh"
}

// Group of tasks, like "Winter Menu 24/25 – Global"
export interface InitiativeGroup {
  id: string;
  name: string;               // "Winter Menu 24/25 – Core Range"
  description?: string;

  brand: BrandRef;

  geography?: {
    regions?: string[];
    countryCodes?: string[];
    cities?: string[];
  };

  category:
    | "menu"
    | "marketing"
    | "operations"
    | "fitout"
    | "training"
    | "other";

  priority: "low" | "medium" | "high" | "critical";

  // Overall planned window for this group
  startDate: string;          // ISO string "2025-01-10"
  endDate: string;            // ISO string

  // Visual settings for the Gantt
  colorHint?: string;         // e.g. "#34d399" if you want to override default
  orderIndex: number;         // for ordering groups in the table

  // Flags
  archived?: boolean;
  isTemplate?: boolean;       // for future "copy as template" feature

  // Meta
  createdAt: string;
  updatedAt: string;
}

// Owner / person responsible
export interface TimelineOwner {
  id: string;
  name: string;
  role?: string;              // "Global Culinary Director"
  avatarUrl?: string;
}

// Task types and status for the rows
export type TimelineTaskType =
  | "menu"
  | "campaign"
  | "operations"
  | "fitout"
  | "training"
  | "analysis"
  | "other";

export type TimelineTaskStatus =
  | "notStarted"
  | "inProgress"
  | "done"
  | "atRisk"
  | "blocked"
  | "onHold"
  | "cancelled";

export type TimelineRiskLevel = "low" | "medium" | "high" | "critical";

// Single row on the timeline
export interface TimelineTask {
  id: string;
  groupId: string;                 // link to InitiativeGroup.id

  name: string;                    // "Recipe testing – London lab"
  description?: string;

  type: TimelineTaskType;
  brand: BrandRef;
  geography?: GeographyRef;

  // Channels or dimensions impacted
  channels?: string[];             // ["Retail", "Delivery", "Airport"]

  startDate: string;               // ISO date
  endDate: string;                 // ISO date

  status: TimelineTaskStatus;
  riskLevel?: TimelineRiskLevel;
  riskReason?: string;

  // Progress and effort
  progressPct?: number;            // 0 to 100
  estimatedEffortHours?: number;
  actualEffortHours?: number;

  owner: TimelineOwner;
  supportOwners?: TimelineOwner[];

  // Links to other tasks and campaigns
  dependencyIds?: string[];        // tasks that must finish first
  blockedByIds?: string[];         // tasks that are currently blocking this
  marketingCampaignIds?: string[];
  linkedMenuItems?: string[];      // ["Rose Pistachio Latte", "Saffron Cake"]
  linkedRecipeIds?: string[];      // if you later link to recipe entities
  linkedVenueIds?: string[];       // store / site ids

  // Visual / behavioural flags
  isMilestone?: boolean;
  isAutoScheduled?: boolean;       // later for auto scheduling logic
  isPinned?: boolean;              // always visible at the top of group
  rowOrderIndex: number;           // stable ordering inside group

  // Meta
  createdAt: string;
  updatedAt: string;
}

// Marketing overlay items that sit on top of tasks
export type CampaignChannel =
  | "social"
  | "influencer"
  | "digitalAds"
  | "ooh"
  | "pr"
  | "event"
  | "instore"
  | "deliveryApp"
  | "email";

export type CampaignPrimaryKpi =
  | "revenue"
  | "transactions"
  | "traffic"
  | "awareness"
  | "engagement"
  | "conversion"
  | "margin";

export interface MarketingCampaign {
  id: string;
  title: string;                   // "Winter in Pink – Global Social"
  description?: string;

  brand: BrandRef;

  geographyScope: {
    scope: "global" | "multiRegion" | "singleRegion" | "country" | "city";
    regions?: string[];            // ["GCC"]
    countryCodes?: string[];       // ["SA", "QA", "AE"]
    cities?: string[];             // ["Riyadh", "Doha"]
  };

  channel: CampaignChannel;
  primaryKpi: CampaignPrimaryKpi;

  startDate: string;
  endDate: string;

  expectedImpactPct?: number;      // +12 revenue, +20 traffic etc
  budgetCurrency?: string;         // "GBP", "SAR"
  budgetValue?: number;

  linkedGroupIds?: string[];
  linkedTaskIds?: string[];

  colorHint?: string;              // if you want a special magenta etc
  intensityLevel?: 1 | 2 | 3 | 4 | 5; // used to draw thicker/thinner overlays

  createdAt: string;
  updatedAt: string;
}
