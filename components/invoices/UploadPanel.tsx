"use client";

import { useState } from "react";

type UploadStatus = "idle" | "uploading" | "success";

export function UploadPanel() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState(
    "Drag EL&N supplier invoices here, or choose a method below."
  );

  function simulateUpload(kind: string) {
    setStatus("uploading");
    setMessage(`Ingesting sample ${kind} batch for EL&N venues...`);

    setTimeout(() => {
      setStatus("success");
      setMessage(`Sample ${kind} batch processed. 9 invoices ingested.`);
      setTimeout(() => {
        setStatus("idle");
        setMessage("Drag EL&N supplier invoices here, or choose a method below.");
      }, 2600);
    }, 1400);
  }

  return (
    <section className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Ingestion entry
          </p>
          <p className="text-sm text-slate-300">
            Choose how ODYAN should receive EL&amp;N invoices by venue.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
          Demo only
        </span>
      </div>

      {/* Drop zone */}
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-cyan-400/40 bg-slate-950/80 px-5 py-8 text-center">
        <div className="space-y-3">
          <p className="text-sm md:text-base text-slate-300">{message}</p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm">
            <button
              onClick={() => simulateUpload("Supplier PDF email")}
              className="rounded-full border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 font-semibold text-cyan-200 hover:bg-cyan-400/20 transition"
            >
              Simulate PDF upload
            </button>
            <button
              onClick={() => simulateUpload("CSV export")}
              className="rounded-full border border-emerald-400/60 bg-emerald-400/10 px-4 py-2 font-semibold text-emerald-200 hover:bg-emerald-400/20 transition"
            >
              Simulate CSV upload
            </button>
            <button
              onClick={() => simulateUpload("photo capture")}
              className="rounded-full border border-violet-400/60 bg-violet-400/10 px-4 py-2 font-semibold text-violet-200 hover:bg-violet-400/20 transition"
            >
              Simulate photo upload
            </button>
          </div>

          {status === "uploading" && (
            <p className="text-sm text-cyan-300">
              Parsing lines, mapping SKUs, checking VAT, assigning venue cost centres...
            </p>
          )}
          {status === "success" && (
            <p className="text-sm text-emerald-300">
              ODYAN linked items to EL&amp;N categories, suppliers and venues for this demo batch.
            </p>
          )}
        </div>
      </div>

      {/* Methods list */}
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <IngestionMethod
          label="Email bridge"
          helper="Forward supplier PDFs into your unique ODYAN inbox."
          status="Best for day-to-day supplier invoicing."
        />
        <IngestionMethod
          label="CSV / Excel"
          helper="Upload exports from ordering portals and vendor marketplaces."
          status="Best for high line-count suppliers."
        />
        <IngestionMethod
          label="Photo & portal/API"
          helper="Capture hard-copy invoices, or connect ordering portals for automated pulls."
          status="Best for exceptions and live feeds."
        />
      </div>
    </section>
  );
}

function IngestionMethod({
  label,
  helper,
  status,
}: {
  label: string;
  helper: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-4">
      <p className="text-base font-semibold text-slate-100">{label}</p>
      <p className="mt-2 text-sm text-slate-300 leading-relaxed">{helper}</p>
      <p className="mt-2 text-sm font-semibold text-cyan-300">{status}</p>
    </div>
  );
}
