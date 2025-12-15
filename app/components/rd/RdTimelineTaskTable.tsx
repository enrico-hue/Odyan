// app/components/rd/RdTimelineTaskTable.tsx
"use client";

import React from "react";
import {
  InitiativeGroup,
  SelectedItem,
  Task,
  TaskStatus,
} from "./rdTypes";

interface Props {
  groups: InitiativeGroup[];
  selected: SelectedItem | null;
  onSelectTask: (task: Task) => void;
  tableWidth: number;
  height: number;
}

type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_STYLES: Record<TaskStatus, StatusConfig> = {
  idea: {
    label: "Idea",
    className:
      "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40",
  },
  planning: {
    label: "Planning",
    className:
      "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40",
  },
  "in-progress": {
    label: "In progress",
    className:
      "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40",
  },
  blocked: {
    label: "Blocked",
    className:
      "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/40",
  },
  done: {
    label: "Done",
    className:
      "bg-slate-500/10 text-slate-200 ring-1 ring-slate-500/40",
  },
};

function StatusPill({
  status,
  size = "md",
}: {
  status: TaskStatus | string | undefined;
  size?: "sm" | "md";
}) {
  // Guard: if status not in our map, fall back to a neutral pill
  const safeStatus =
    (status as TaskStatus) || "idea";

  const config: StatusConfig =
    STATUS_STYLES[safeStatus] ||
    ({
      label: status || "Unknown",
      className:
        "bg-slate-500/20 text-slate-100 ring-1 ring-slate-500/40",
    } as StatusConfig);

  const base =
    "inline-flex items-center rounded-full px-2 " +
    "whitespace-nowrap " +
    (size === "sm" ? "text-[11px] h-5" : "text-xs h-6");

  return (
    <span className={`${base} ${config.className}`}>
      {config.label}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-emerald-400/80"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function RdTimelineTaskTable({
  groups,
  selected,
  onSelectTask,
  tableWidth,
  height,
}: Props) {
  return (
    <div
      className="border-r border-slate-800 bg-slate-950/95"
      style={{ width: tableWidth, height }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wide bg-slate-950 border-b border-slate-800 text-slate-400">
        <div className="w-6" />
        <div className="flex-1">Initiative / Task</div>
        <div className="w-24">Region</div>
        <div className="w-24">Owner</div>
        <div className="w-24">Status</div>
        <div className="w-20 pr-2">Progress</div>
      </div>

      {/* Body */}
      <div className="overflow-auto" style={{ height: height - 32 }}>
        {groups
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((group) => {
            const isGroupSelected =
              selected?.type === "initiative" &&
              selected.initiative.id === group.id;

            return (
              <div key={group.id} className="border-b border-slate-900/60">
                {/* Initiative row */}
                <div
                  className={
                    "flex items-center gap-2 px-3 py-2 cursor-default " +
                    (isGroupSelected
                      ? "bg-slate-900/80"
                      : "bg-slate-950")
                  }
                >
                  <div className="w-6 text-[10px] text-slate-500">
                    {group.type === "opening" ? "🏬" : "🍽️"}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-slate-100">
                      {group.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {group.city} · {group.country}
                    </div>
                  </div>
                  <div className="w-24 text-[11px] text-slate-400">
                    {group.region}
                  </div>
                  <div className="w-24 text-[11px] text-slate-300">
                    {group.owner}
                  </div>
                  <div className="w-24">
                    <StatusPill status={group.status} size="sm" />
                  </div>
                  <div className="w-20 pr-2">
                    {/* Initiative-level progress: simple average */}
                    <ProgressBar
                      value={
                        group.tasks.length
                          ? group.tasks.reduce(
                              (acc, t) => acc + (t.progress || 0),
                              0
                            ) / group.tasks.length
                          : 0
                      }
                    />
                  </div>
                </div>

                {/* Task rows */}
                {group.tasks.map((task) => {
                  const isSelected =
                    selected?.type === "task" &&
                    selected.task.id === task.id;
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => onSelectTask(task)}
                      className={
                        "flex w-full items-center gap-2 px-3 py-1.5 text-left " +
                        "border-t border-slate-900/40 " +
                        (isSelected
                          ? "bg-slate-900/80"
                          : "bg-slate-950/60 hover:bg-slate-900/60")
                      }
                    >
                      <div className="w-6 text-[10px] text-slate-600">
                        •
                      </div>
                      <div className="flex-1">
                        <div className="text-[12px] text-slate-100">
                          {task.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {task.start} → {task.end}
                        </div>
                      </div>
                      <div className="w-24 text-[11px] text-slate-500">
                        {group.region}
                      </div>
                      <div className="w-24 text-[11px] text-slate-300">
                        {task.owner}
                      </div>
                      <div className="w-24">
                        <StatusPill status={task.status} size="sm" />
                      </div>
                      <div className="w-20 pr-2">
                        <ProgressBar value={task.progress} />
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
