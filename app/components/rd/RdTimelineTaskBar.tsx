// app/components/rd/RdTimelineTaskBar.tsx
"use client";

import { Task, TimeScale, MarketingCampaign } from "./rdTypes";
import { motion } from "framer-motion";
import { barVariants } from "./useTimelineAnimations";

interface SingleBarProps {
  task: Task;
  timeScale: TimeScale;
  onClick: () => void;
  rowIndex: number;
  rowHeight: number;
}

export function RdTimelineTaskBar({
  task,
  timeScale,
  onClick,
  rowIndex,
  rowHeight,
}: SingleBarProps) {
  const { dateToX, pxPerDay } = timeScale;
  const left = dateToX(task.start);
  const right = dateToX(task.end);
  const width = Math.max(right - left, pxPerDay * 1.5);

  const top = rowIndex * rowHeight + 8;

  const color =
    task.isCritical
      ? "from-emerald-400 to-emerald-500"
      : "from-sky-400 to-sky-500";

  return (
    <motion.button
      type="button"
      variants={barVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      className="absolute rounded-full shadow-lg overflow-hidden border border-white/10"
      style={{
        left,
        top,
        width,
        height: rowHeight - 12,
      }}
    >
      <div
        className={`w-full h-full bg-gradient-to-r ${color} opacity-90 flex items-center justify-between px-3`}
      >
        <span className="text-[11px] text-black/90 font-medium truncate">
          {task.name}
        </span>
        <span className="text-[9px] text-black/70">
          {task.city}
        </span>
      </div>
    </motion.button>
  );
}

interface OverlayProps {
  campaigns: MarketingCampaign[];
  timeScale: TimeScale;
  rowIndex: number;
  rowHeight: number;
}

export function RdTimelineMarketingOverlay({
  campaigns,
  timeScale,
  rowIndex,
  rowHeight,
}: OverlayProps) {
  const { dateToX, pxPerDay } = timeScale;

  return (
    <>
      {campaigns.map((c) => {
        const left = dateToX(c.start);
        const right = dateToX(c.end);
        const width = Math.max(right - left, pxPerDay);
        const top = rowIndex * rowHeight + 4;

        return (
          <div
            key={c.id}
            className={`absolute rounded-full border border-fuchsia-300/50 ${c.colorClass}`}
            style={{
              left,
              top,
              width,
              height: (rowHeight - 16) / 2,
            }}
          >
            <span className="px-2 text-[9px] text-white/80">
              {c.channel} · {c.name}
            </span>
          </div>
        );
      })}
    </>
  );
}
