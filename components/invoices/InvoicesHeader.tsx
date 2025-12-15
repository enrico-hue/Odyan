"use client";

type InvoicesHeaderProps = {
  coverage: number;
  lastSync: string;
  pendingCount: number;
  failedCount: number;
};

export function InvoicesHeader({
  coverage,
  lastSync,
  pendingCount,
  failedCount,
}: InvoicesHeaderProps) {
  return (
    <section className="mb-7 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            EL&amp;N invoices
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-50">
            Ingestion and invoice control
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            Keep ODYAN fed with clean supplier invoices and uploads. This is the
            engine behind EL&amp;N GP accuracy, cashflow visibility and supplier
            intelligence by venue.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 md:min-w-[380px]">
          <HeaderChip
            label="Coverage this month"
            value={`${coverage.toFixed(0)} %`}
            helper="Invoices linked to venues"
            tone={coverage >= 85 ? "good" : coverage >= 70 ? "warn" : "bad"}
          />
          <HeaderChip
            label="Last sync"
            value={lastSync}
            helper="Email, portal, SFTP"
            tone="neutral"
          />
          <HeaderChip
            label="Files in queue"
            value={pendingCount.toString()}
            helper="Waiting to be processed"
            tone={pendingCount > 0 ? "warn" : "neutral"}
          />
          <HeaderChip
            label="Failed this week"
            value={failedCount.toString()}
            helper="Needs a quick fix"
            tone={failedCount > 0 ? "bad" : "neutral"}
          />
        </div>
      </div>
    </section>
  );
}

type Tone = "good" | "warn" | "bad" | "neutral";

function HeaderChip({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  tone: Tone;
}) {
  let border = "border-slate-800";
  let text = "text-slate-200";
  let pill = "bg-slate-900/80";

  if (tone === "good") {
    border = "border-emerald-500/60";
    text = "text-emerald-300";
    pill = "bg-emerald-500/10";
  } else if (tone === "warn") {
    border = "border-amber-400/60";
    text = "text-amber-300";
    pill = "bg-amber-400/10";
  } else if (tone === "bad") {
    border = "border-rose-500/60";
    text = "text-rose-300";
    pill = "bg-rose-500/10";
  }

  return (
    <div
      className={`rounded-2xl border ${border} bg-slate-950/90 px-4 py-3 shadow-[0_16px_55px_rgba(0,0,0,0.7)]`}
    >
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${pill} ${text}`}
        >
          {value}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">{helper}</p>
    </div>
  );
}
