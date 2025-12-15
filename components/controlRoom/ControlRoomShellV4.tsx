// components/controlRoom/ControlRoomShellV4.tsx
import React from "react";

import { OdyanBrainPanel } from "./OdyanBrainPanel";
import { ReputationPulseV3 } from "./ReputationPulseV3";
import { CompetitiveBubbleV3 } from "./CompetitiveBubbleV3";
import { WeeklyTimelineV3 } from "./WeeklyTimelineV3";
import { ActionRibbonV3 } from "./ActionRibbonV3";

import BusinessPulse from "../dashboard/BusinessPulse";
import IntelligenceStrip from "../dashboard/IntelligenceStrip";
import TodaysBrief from "../dashboard/TodaysBrief";
import { RecentInvoicesPanel } from "../invoices/RecentInvoicesPanel";

import AlertsFeed from "../ui/AlertsFeed";
// components/controlRoom/ControlRoomShellV4.tsx
import QuickActionBar from "../ui/QuickActionBar";



export default function ControlRoomShellV4() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top row: brain + quick actions */}
        <div className="grid gap-4 lg:grid-cols-[2fr,1.1fr]">
          <OdyanBrainPanel />

          <div className="space-y-4">
            <QuickActionBar />
            <IntelligenceStrip />
          </div>
        </div>

        {/* Middle row: core KPIs + reputation + competitors */}
        <div className="grid gap-4 lg:grid-cols-[1.5fr,1fr,1.1fr]">
          <BusinessPulse />
          <ReputationPulseV3 />
          <CompetitiveBubbleV3 />
        </div>

        {/* Bottom row: timeline + invoices + today’s brief + alerts */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr,1.1fr]">
          <WeeklyTimelineV3 />

          <div className="space-y-4">
            {/* Recent invoices – we’ll let it render with its own fallback data */}
            <RecentInvoicesPanel />

            <TodaysBrief />
          </div>
        </div>

        <AlertsFeed />
      </div>
    </div>
  );
}
