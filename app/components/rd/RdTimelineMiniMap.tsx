// app/components/rd/RdTimelineMiniMap.tsx
"use client";

import { InitiativeGroup, TimeScale } from "./rdTypes";

interface Props {
  groups: InitiativeGroup[];
  timeScale: TimeScale;
}

export function RdTimelineMiniMap({ groups, timeScale }: Props) {
  const { totalWidth, dateToX, pxPerDay } = timeScale;
  const height = 80;

  const allBars: {
    left: number;
    width: number;
    color: string;
    key: string;
  }[] = [];

  groups.forEach((g) => {
    g.tasks.forEach((t, index) => {
      const left = dateToX(t.start);
      const right = dateToX(t.end);
      const width = Math.max(right - left, pxPerDay * 0.5);
      const color =
        index % 2 === 0
          ? "bg-emerald-400/50"
          : "bg-sky-400/50";

      allBars.push({
        left,
        width,
        color,
        key: t.id,
      });
    });
  });

  return (
    <div className="w-full border-t border-white/10 bg-black/80 px-3 py-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-white/50 uppercase tracking-wide">
          Mini timeline
        </span>
        <span className="text-[10px] text-white/40">
          Quick overview of overlap
        </span>
      </div>
      <div className="relative w-full overflow-hidden rounded bg-white/5">
        <div
          className="relative"
          style={{ width: totalWidth, height }}
        >
          {allBars.map((bar) => (
            <div
              key={bar.key}
              className={`absolute h-4 rounded ${bar.color}`}
              style={{
                left: bar.left,
                top: 24,
                width: bar.width,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
