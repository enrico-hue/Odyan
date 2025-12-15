// app/components/rd/RdTimelineHeader.tsx
"use client";

import { motion } from "framer-motion";
import { headerVariants } from "./useTimelineAnimations";
import { ZoomLevel } from "./rdTypes";

interface Props {
  zoomLevel: ZoomLevel;
  rangeLabel: string;
  onZoomChange: (z: ZoomLevel) => void;
  totalInitiatives: number;
  totalTasks: number;
}

export function RdTimelineHeader(props: Props) {
  const { zoomLevel, rangeLabel, onZoomChange, totalInitiatives, totalTasks } =
    props;

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/60 backdrop-blur sticky top-0 z-20"
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-white/50 uppercase tracking-wide">
            R&D Pipeline
          </span>
          <span className="text-sm text-white/80">
            7 initiatives, {totalTasks} tasks
          </span>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase">
            Time window
          </span>
          <span className="text-xs text-white/70">
            {rangeLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-white/10 bg-white/5">
          <button
            onClick={() => onZoomChange("quarter")}
            className={`px-3 py-1 text-xs rounded-full transition ${
              zoomLevel === "quarter"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            120 days
          </button>
          <button
            onClick={() => onZoomChange("year")}
            className={`px-3 py-1 text-xs rounded-full transition ${
              zoomLevel === "year"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Year
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/50">
          <span className="h-2 w-4 rounded bg-emerald-400/70" />
          <span>Critical path</span>
          <span className="h-2 w-4 rounded bg-fuchsia-400/70" />
          <span>Marketing overlay</span>
        </div>
      </div>
    </motion.div>
  );
}
