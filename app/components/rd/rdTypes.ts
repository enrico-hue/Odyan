// app/components/rd/rdTypes.ts

export type ZoomLevel = "week" | "month" | "quarter" | "halfYear" | "year";

export type TaskStatus =
  | "idea"
  | "planning"
  | "in-progress"
  | "blocked"
  | "done";

export interface Task {
  id: string;
  initiativeId: string;
  name: string;
  start: string; // ISO date string "2025-01-10"
  end: string;   // ISO date string
  owner: string;
  status: TaskStatus;
  type: "task" | "milestone";
  progress: number; // 0–100
  isCritical?: boolean;
  marketingLinked?: boolean;
}

export interface MarketingCampaign {
  id: string;
  initiativeId: string;
  title: string;
  start: string; // ISO date
  end: string;   // ISO date
  channel: "social" | "paid" | "in-store" | "pr" | "influencers";
  intensity: 1 | 2 | 3; // 3 = very intense
  colorClass: string;   // Tailwind class for background
}

export interface InitiativeGroup {
  id: string;
  name: string;
  type:
    | "menu"
    | "opening"
    | "seasonal"
    | "regional-campaign"
    | "ops-improvement";
  brand: string; // "EL&N"
  region: string; // "UK & Ireland", "Middle East", etc.
  country: string;
  city: string;
  owner: string;
  status: TaskStatus;
  colorClass: string; // Tailwind base color e.g. "emerald", "sky"
  sortOrder: number;

  start: string; // overall initiative window
  end: string;

  tasks: Task[];
  marketingCampaigns: MarketingCampaign[];
}

export type TimeTick = {
  left: number;
  label: string;
  // Optional extras if you ever want them
  date?: string;
  isWeekStart?: boolean;
  isMonthStart?: boolean;
};

export type TimeScale = {
  startDate: Date;
  endDate: Date;
  totalWidth: number;

  // resolution
  pixelsPerDay: number;

  // for compatibility with other components
  zoomLevel: ZoomLevel;
  totalDays: number;
  pxPerDay: number;

  rangeLabel: string;
  ticks: TimeTick[];
  todayX: number | null;
  dateToX: (date: string | Date) => number;
};

export type SelectedItem =
  | { type: "initiative"; initiative: InitiativeGroup }
  | { type: "task"; task: Task }
  | { type: "campaign"; campaign: MarketingCampaign };
