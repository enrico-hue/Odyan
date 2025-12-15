// lib/data/mockDashboard.ts

import type {
  OperationalAlert,
  QuickAction,
  BusinessPulseMetric,
  DashboardSnapshot,
} from "@/types/dashboard";

export const mockAlerts: OperationalAlert[] = [
  {
    id: "1",
    title: "Chicken breast supplier increased price by 12 percent vs last week",
    description:
      "This pushes theoretical dish GP for 3 menu items below your target of 72 percent. ODYAN suggests renegotiation or menu reprice.",
    severity: "critical",
    area: "Procurement",
    timeAgo: "12 min ago",
    confidence: "high",
  },
  {
    id: "2",
    title: "Weekend labour forecast is 18 percent above target",
    description:
      "Based on last 6 weekends, you can safely remove 32 labour hours without risking service quality.",
    severity: "warning",
    area: "Labour",
    timeAgo: "34 min ago",
    confidence: "medium",
  },
  {
    id: "3",
    title: "Google rating dropped from 4.6 to 4.4 in 7 days",
    description:
      "Three recent reviews mention slow service and cold fries. Likely linked to delivery batching pattern.",
    severity: "warning",
    area: "Reputation",
    timeAgo: "1 h ago",
    confidence: "high",
  },
  {
    id: "4",
    title: "High waste on fresh herbs this week",
    description:
      "Recorded waste is 3.2x higher than your 4 week average. Consider smaller delivery frequency or batch prep.",
    severity: "info",
    area: "Inventory",
    timeAgo: "3 h ago",
    confidence: "medium",
  },
  {
    id: "5",
    title: "Cashflow tension predicted for next Tuesday",
    description:
      "Supplier payments cluster and payroll coincide. Suggest delaying non essential orders or negotiating terms.",
    severity: "critical",
    area: "Cashflow",
    timeAgo: "6 h ago",
    confidence: "high",
  },
];

export const mockQuickActions: QuickAction[] = [
  {
    id: "uploadInvoice",
    label: "Upload supplier invoice",
    description: "Drag and drop PDF or photo",
    icon: "📄",
    hot: true,
  },
  {
    id: "captureStockPhoto",
    label: "Capture stockroom photo",
    description: "Use mobile to scan shelves",
    icon: "📷",
  },
  {
    id: "logWaste",
    label: "Log waste from last shift",
    description: "Fast entry for key items",
    icon: "♻️",
  },
  {
    id: "checkLivePrices",
    label: "Check live prices",
    description: "Compare top suppliers now",
    icon: "📊",
  },
  {
    id: "runForecast",
    label: "Run 7 day forecast",
    description: "Sales and labour needs",
    icon: "🔮",
  },
  {
    id: "openGMBrief",
    label: "Open today’s GM brief",
    description: "AI summary for the team",
    icon: "🧠",
    hot: true,
  },
];

export const mockBusinessPulseMetrics: BusinessPulseMetric[] = [
  {
    id: "gp",
    label: "Gross profit",
    value: "69.8%",
    sublabel: "Target 72 percent",
    change: "1.4 pts below last week",
    direction: "down",
  },
  {
    id: "labour",
    label: "Labour cost",
    value: "29.1%",
    sublabel: "Of net sales",
    change: "0.8 pts above target",
    direction: "up",
  },
  {
    id: "waste",
    label: "Recorded waste",
    value: "3.2%",
    sublabel: "Of food purchases",
    change: "1.1 pts above 4 week average",
    direction: "up",
  },
];

export async function getMockDashboard(): Promise<DashboardSnapshot> {
  // later this will hit the real DB; for now it's our backend stub
  return {
    alerts: mockAlerts,
    quickActions: mockQuickActions,
    businessPulseMetrics: mockBusinessPulseMetrics,
  };
}
