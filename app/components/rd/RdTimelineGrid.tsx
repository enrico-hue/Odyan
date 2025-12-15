"use client";

import React from "react";

type RdTimelineGridProps = {
  width: number;
  height: number;
  // Relaxed type so TimeScale can be anything, with optional ticks/todayX.
  timeScale: any;
};

type TimelineTick = {
  left: number;
  label: string;
  isMonthStart?: boolean;
};

export const RdTimelineGrid: React.FC<RdTimelineGridProps> = ({
  width,
  height,
  timeScale,
}) => {
  const ticks: TimelineTick[] =
    timeScale && Array.isArray(timeScale.ticks)
      ? timeScale.ticks
      : [];

  const todayX: number | null =
    timeScale && typeof timeScale.todayX === "number"
      ? timeScale.todayX
      : null;

  return (
    <div
      className="relative overflow-hidden bg-slate-950"
      style={{ height, width }}
    >
      {/* Top date labels row */}
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-slate-800 bg-slate-950/95 text-[11px] text-slate-300">
        {ticks.map((tick, idx) => (
          <div
            key={idx}
            className="absolute bottom-0 -translate-x-1/2 px-1"
            style={{ left: tick.left }}
          >
            <span
              className={
                tick.isMonthStart
                  ? "font-semibold text-slate-50"
                  : "text-slate-400"
              }
            >
              {tick.label}
            </span>
          </div>
        ))}
      </div>

      {/* Grid body under labels */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: 32, bottom: 0 }}
      >
        {/* Vertical grid lines */}
        {ticks.map((tick, idx) => (
          <div
            key={idx}
            className={
              "absolute top-0 bottom-0 border-l " +
              (tick.isMonthStart
                ? "border-slate-700"
                : "border-slate-800/60")
            }
            style={{ left: tick.left }}
          />
        ))}

        {/* Today line */}
        {todayX !== null && (
          <div
            className="absolute top-0 bottom-0 border-l-2 border-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
            style={{ left: todayX }}
          />
        )}
      </div>
    </div>
  );
};
