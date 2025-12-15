// app/components/rd/useTimelineScale.ts
"use client";

import { useMemo } from "react";
import { InitiativeGroup, Task, ZoomLevel } from "./rdTypes";

export type TimeScale = {
  startDate: Date;
  endDate: Date;
  totalWidth: number;

  // main resolution
  pixelsPerDay: number;

  // compatibility for other components
  zoomLevel: ZoomLevel;
  totalDays: number;
  pxPerDay: number;

  rangeLabel: string;
  ticks: {
    left: number;
    label: string;
    isMonthStart?: boolean;
  }[];
  todayX: number | null;
  dateToX: (date: string | Date) => number;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function normalizeDate(input: string | Date | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

function getAllTasks(groups: InitiativeGroup[]): Task[] {
  const list: Task[] = [];
  groups.forEach((g) => {
    g.tasks.forEach((t) => list.push(t));
  });
  return list;
}

export function useTimelineScale(
  groups: InitiativeGroup[],
  zoomLevel: ZoomLevel,
  timelineWidth: number
): TimeScale {
  return useMemo(() => {
    const tasks = getAllTasks(groups);
    const today = new Date();

    // Pixels per day for each zoom level
    const pixelsPerDayMap: Record<ZoomLevel, number> = {
      week: 40,      // very zoomed in
      month: 24,
      quarter: 12,
      halfYear: 8,
      year: 6,
    };

    const defaultPixelsPerDay = pixelsPerDayMap[zoomLevel];

    // No tasks: build a simple 90 day window around today
    if (!tasks.length) {
      const startDate = new Date(today);
      const endDate = new Date(today.getTime() + 90 * MS_PER_DAY);
      const totalDays = 90;
      const pixelsPerDay = defaultPixelsPerDay || 16;
      const totalWidth = Math.max(timelineWidth, totalDays * pixelsPerDay);

      const dateToX = (input: string | Date) => {
        const d = normalizeDate(input) || startDate;
        const clamped = Math.min(
          Math.max(d.getTime(), startDate.getTime()),
          endDate.getTime()
        );
        const daysFromStart =
          (clamped - startDate.getTime()) / MS_PER_DAY;
        return daysFromStart * pixelsPerDay;
      };

      const ticks = buildTicks(startDate, endDate, pixelsPerDay);
      const todayX = dateToX(today);
      const rangeLabel = buildRangeLabel(startDate, endDate);

      return {
        startDate,
        endDate,
        totalWidth,
        pixelsPerDay,
        zoomLevel,
        totalDays,
        pxPerDay: pixelsPerDay,
        rangeLabel,
        ticks,
        todayX,
        dateToX,
      };
    }

    // Find min / max dates from tasks
    let minStart: Date | null = null;
    let maxEnd: Date | null = null;

    tasks.forEach((t) => {
      const s = normalizeDate(t.start);
      const e = normalizeDate(t.end);

      if (s) {
        if (!minStart || s.getTime() < minStart.getTime()) {
          minStart = s;
        }
      }
      if (e) {
        if (!maxEnd || e.getTime() > maxEnd.getTime()) {
          maxEnd = e;
        }
      }
    });

    if (!minStart) minStart = new Date(today);
    if (!maxEnd) maxEnd = new Date(today.getTime() + 30 * MS_PER_DAY);

    // Padding by zoom
    const paddingDays =
      zoomLevel === "month"
        ? 3
        : zoomLevel === "quarter"
        ? 14
        : zoomLevel === "week"
        ? 1
        : zoomLevel === "halfYear"
        ? 30
        : 60; // year

    const startDate = new Date(
      minStart.getTime() - paddingDays * MS_PER_DAY
    );
    const endDate = new Date(
      maxEnd.getTime() + paddingDays * MS_PER_DAY
    );

    const totalDays = Math.max(
      1,
      Math.round(
        (endDate.getTime() - startDate.getTime()) / MS_PER_DAY
      )
    );

    const pixelsPerDay = defaultPixelsPerDay || 16;
    const totalWidth = Math.max(
      timelineWidth,
      totalDays * pixelsPerDay
    );

    const dateToX = (input: string | Date) => {
      const d = normalizeDate(input) || startDate;
      const clamped = Math.min(
        Math.max(d.getTime(), startDate.getTime()),
        endDate.getTime()
      );
      const daysFromStart =
        (clamped - startDate.getTime()) / MS_PER_DAY;
      return daysFromStart * pixelsPerDay;
    };

    const ticks = buildTicks(startDate, endDate, pixelsPerDay);

    const todayX =
      today >= startDate && today <= endDate
        ? dateToX(today)
        : null;

    const rangeLabel = buildRangeLabel(startDate, endDate);

    return {
      startDate,
      endDate,
      totalWidth,
      pixelsPerDay,
      zoomLevel,
      totalDays,
      pxPerDay: pixelsPerDay,
      rangeLabel,
      ticks,
      todayX,
      dateToX,
    };
  }, [groups, zoomLevel, timelineWidth]);
}

// Helpers

function buildRangeLabel(start: Date, end: Date): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${formatter.format(start)} → ${formatter.format(end)}`;
}

function buildTicks(
  startDate: Date,
  endDate: Date,
  pixelsPerDay: number
): TimeScale["ticks"] {
  const ticks: TimeScale["ticks"] = [];
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const totalDays = Math.round((endMs - startMs) / MS_PER_DAY);

  for (let i = 0; i <= totalDays; i++) {
    const ms = startMs + i * MS_PER_DAY;
    const d = new Date(ms);
    const left = i * pixelsPerDay;

    const isMonthStart = d.getDate() === 1;
    const label = isMonthStart
      ? d.toLocaleDateString("en-GB", {
          month: "short",
          year: "2-digit",
        })
      : d.getDate().toString();

    ticks.push({
      left,
      label,
      isMonthStart,
    });
  }

  return ticks;
}
