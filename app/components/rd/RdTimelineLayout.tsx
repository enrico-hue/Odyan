// app/components/rd/RdTimelineLayout.tsx
"use client";

import { useState, useRef } from "react";
import useMeasure from "react-use-measure";
import { InitiativeGroup, SelectedItem, ZoomLevel } from "./rdTypes";
import { useTimelineScale } from "./useTimelineScale";
import { RdTimelineHeader } from "./RdTimelineHeader";
import { RdTimelineGrid } from "./RdTimelineGrid";
import { RdTimelineTaskTable } from "./RdTimelineTaskTable";
import { RdTimelineTaskBars } from "./RdTimelineTaskBars";
import { RdTimelineMiniMap } from "./RdTimelineMiniMap";
import { RdTimelineSidePanel } from "./RdTimelineSidePanel";

interface Props {
  groups: InitiativeGroup[] | undefined;
}

export function RdTimelineLayout({ groups }: Props) {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("quarter");
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  // Normalize ALL groups so tasks is always a real array
  const safeGroups: InitiativeGroup[] = Array.isArray(groups)
    ? groups.map((g) => ({
        ...g,
        tasks: Array.isArray(g.tasks) ? g.tasks : [],
      }))
    : [];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [boundsRef, bounds] = useMeasure();

  const tableWidth = 360;
  const timelineWidth =
    bounds.width && bounds.width > tableWidth
      ? bounds.width - tableWidth
      : 1200;

  const timeScale = useTimelineScale(safeGroups, zoomLevel, timelineWidth);

  const totalTasks = safeGroups.reduce((acc, g) => acc + g.tasks.length, 0);

  const verticalHeight = bounds.height || 600;
  const ganttHeight = Math.max(200, verticalHeight - 90);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-black via-slate-950 to-black text-white overflow-hidden"
    >
      <RdTimelineHeader
        zoomLevel={zoomLevel}
        rangeLabel={timeScale.rangeLabel}
        onZoomChange={setZoomLevel}
        totalInitiatives={safeGroups.length}
        totalTasks={totalTasks}
      />

      <div
        ref={boundsRef}
        className="relative flex w-full"
        style={{ height: "80vh" }}
      >
        <RdTimelineTaskTable
          groups={safeGroups}
          selected={selected}
          onSelectTask={(task) => setSelected({ type: "task", task })}
          tableWidth={tableWidth}
          height={ganttHeight}
        />

        <div
          className="relative flex-1 overflow-auto bg-black/80"
          style={{ height: ganttHeight }}
        >
          <div
            className="relative"
            style={{
              width: timeScale.totalWidth,
              height: ganttHeight,
            }}
          >
            <RdTimelineGrid
              width={timeScale.totalWidth}
              timeScale={timeScale}
              height={ganttHeight}
            />

            <RdTimelineTaskBars
              groups={safeGroups}
              timeScale={timeScale}
              selected={selected}
              onSelectTask={(task) => setSelected({ type: "task", task })}
              height={ganttHeight}
            />
          </div>
        </div>

        <RdTimelineSidePanel
          selected={selected}
          onClose={() => setSelected(null)}
        />
      </div>

      <RdTimelineMiniMap groups={safeGroups} timeScale={timeScale} />
    </div>
  );
}
