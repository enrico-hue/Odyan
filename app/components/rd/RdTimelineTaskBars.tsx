// app/components/rd/RdTimelineTaskBars.tsx
"use client";

import {
  InitiativeGroup,
  SelectedItem,
  TimeScale,
  Task,
} from "./rdTypes";
import {
  RdTimelineTaskBar,
  RdTimelineMarketingOverlay,
} from "./RdTimelineTaskBar";

interface Props {
  groups: InitiativeGroup[];
  timeScale: TimeScale;
  selected: SelectedItem | null;
  onSelectTask: (task: Task) => void;
  height: number;
}

export function RdTimelineTaskBars({
  groups,
  timeScale,
  onSelectTask,
  height,
}: Props) {
  const rowHeight = 40;

  const rows: {
    groupId: string;
    task: Task;
    rowIndex: number;
  }[] = [];

  let rowIndex = 0;
  groups.forEach((g) => {
    g.tasks.forEach((t) => {
      rows.push({ groupId: g.id, task: t, rowIndex });
      rowIndex += 1;
    });
  });

  return (
    <div
      className="relative"
      style={{ height }}
    >
      {rows.map((row) => {
        const group = groups.find((g) => g.id === row.groupId);
        return (
          <div key={row.task.id}>
            {group && (
              <RdTimelineMarketingOverlay
                campaigns={group.marketingCampaigns}
                timeScale={timeScale}
                rowIndex={row.rowIndex}
                rowHeight={rowHeight}
              />
            )}
            <RdTimelineTaskBar
              task={row.task}
              timeScale={timeScale}
              rowIndex={row.rowIndex}
              rowHeight={rowHeight}
              onClick={() => onSelectTask(row.task)}
            />
          </div>
        );
      })}
    </div>
  );
}
