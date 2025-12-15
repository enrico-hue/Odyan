// types/dashboard.ts

export type AlertSeverity = "info" | "warning" | "critical";

export type OperationalAlert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  area: "Procurement" | "Labour" | "Inventory" | "Reputation" | "Cashflow" | "Other";
  timeAgo: string;
  confidence: "high" | "medium" | "low";
};

export type QuickActionId =
  | "uploadInvoice"
  | "captureStockPhoto"
  | "logWaste"
  | "checkLivePrices"
  | "runForecast"
  | "openGMBrief";

export type QuickAction = {
  id: QuickActionId;
  label: string;
  description: string;
  icon?: string;
  hot?: boolean;
};

export type BusinessPulseMetric = {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  change: string;
  direction: "up" | "down" | "flat";
};

export type DashboardSnapshot = {
  alerts: OperationalAlert[];
  quickActions: QuickAction[];
  businessPulseMetrics: BusinessPulseMetric[];
};
