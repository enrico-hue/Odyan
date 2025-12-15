// lib/ai/generateBrief.ts

import { OperationalAlert } from "@/types/dashboard";

export type GeneratedBrief = {
  issues: string[];
  actions: string[];
};

function buildIssuesFromAlerts(alerts: OperationalAlert[]): string[] {
  if (!alerts.length) {
    return [
      "No critical alerts detected. Focus on service consistency and guest experience today.",
    ];
  }

  return alerts.slice(0, 3).map((alert) => {
    return `${alert.area}: ${alert.title}`;
  });
}

function buildActionsFromAlerts(alerts: OperationalAlert[]): string[] {
  if (!alerts.length) {
    return [
      "Use the quieter time today to review GP by category and check rota for the coming weekend.",
    ];
  }

  const actions: string[] = [];

  const hasProcurement = alerts.some((a) => a.area === "Procurement");
  const hasLabour = alerts.some((a) => a.area === "Labour");
  const hasReputation = alerts.some((a) => a.area === "Reputation");
  const hasInventory = alerts.some((a) => a.area === "Inventory");
  const hasCashflow = alerts.some((a) => a.area === "Cashflow");

  if (hasProcurement) {
    actions.push(
      "Review affected dishes and either adjust menu price or negotiate with the supplier before next order."
    );
  }

  if (hasLabour) {
    actions.push(
      "Open the rota and trim low impact hours on the busiest days, keeping cover on peak slots only."
    );
  }

  if (hasReputation) {
    actions.push(
      "Reply to the last three reviews, then brief the team on the main complaint theme before service."
    );
  }

  if (hasInventory) {
    actions.push(
      "Walk the fridges today and tighten prep levels for slow moving items that are driving waste."
    );
  }

  if (hasCashflow) {
    actions.push(
      "Check the next seven days of outgoing payments and move any non critical orders by 24 to 48 hours."
    );
  }

  if (actions.length === 0) {
    actions.push(
      "Run a quick end of day huddle to review service, highlight a win, and call out one thing to fix tomorrow."
    );
  }

  return actions.slice(0, 3);
}

export async function generateBriefFromAlerts(
  alerts: OperationalAlert[]
): Promise<GeneratedBrief> {
  // Simulate an AI call delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  const issues = buildIssuesFromAlerts(alerts);
  const actions = buildActionsFromAlerts(alerts);

  return { issues, actions };
}
