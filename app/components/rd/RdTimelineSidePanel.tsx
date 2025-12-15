// app/components/rd/RdTimelineSidePanel.tsx
"use client";

import { SelectedItem } from "./rdTypes";
import { format } from "date-fns";

interface Props {
  selected: SelectedItem | null;
  onClose: () => void;
}

export function RdTimelineSidePanel({ selected, onClose }: Props) {
  if (!selected) return null;

  if (selected.type === "task" && selected.task) {
    const t = selected.task;
    return (
      <div className="absolute top-0 right-0 h-full w-80 border-l border-white/10 bg-black/90 z-30 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-xs text-white/60 uppercase tracking-wide">
            Task details
          </span>
          <button
            onClick={onClose}
            className="text-[10px] text-white/50 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-3 text-xs text-white/80">
          <div className="mb-3">
            <div className="text-[10px] text-white/40 uppercase">
              Name
            </div>
            <div className="text-sm font-medium">
              {t.name}
            </div>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <Field label="Owner" value={t.owner} />
            <Field
              label="Status"
              value={t.status.replace("-", " ")}
            />
            <Field
              label="Country"
              value={t.country}
            />
            <Field label="City" value={t.city} />
            <Field
              label="Type"
              value={t.type.replace("-", " ")}
            />
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <Field
              label="Start"
              value={format(t.start, "dd MMM yyyy")}
            />
            <Field
              label="End"
              value={format(t.end, "dd MMM yyyy")}
            />
          </div>
          <div className="mt-4 text-[10px] text-white/40 uppercase mb-2">
            ODYAN notes
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Link GP engine here with live margin vs
              target.
            </li>
            <li>
              Surface prep pressure, station load and
              complexity.
            </li>
            <li>
              Show risk score if supplier chain is unstable.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (selected.type === "campaign" && selected.campaign) {
    const c = selected.campaign;
    return (
      <div className="absolute top-0 right-0 h-full w-80 border-l border-white/10 bg-black/90 z-30 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-xs text-white/60 uppercase tracking-wide">
            Campaign details
          </span>
          <button
            onClick={onClose}
            className="text-[10px] text-white/50 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-3 text-xs text-white/80">
          <div className="mb-3">
            <div className="text-[10px] text-white/40 uppercase">
              Name
            </div>
            <div className="text-sm font-medium">
              {c.name}
            </div>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <Field label="Channel" value={c.channel} />
            <Field
              label="Intensity"
              value={String(c.intensity)}
            />
            <Field
              label="Start"
              value={format(c.start, "dd MMM yyyy")}
            />
            <Field
              label="End"
              value={format(c.end, "dd MMM yyyy")}
            />
          </div>
          <div className="mt-4 text-[10px] text-white/40 uppercase mb-2">
            ODYAN ideas
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Connect this to reputation screen to see review
              uplift.
            </li>
            <li>
              Show sales delta vs previous year during this
              window.
            </li>
            <li>
              Link to per-channel CAC and ROAS from marketing
              data.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[10px] text-white/40 uppercase">
        {label}
      </div>
      <div className="text-xs text-white/80">
        {value}
      </div>
    </div>
  );
}
