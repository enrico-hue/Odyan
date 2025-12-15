import { UploadPanel } from "@/components/invoices/UploadPanel";
import { IngestionInsightsPanel } from "@/components/invoices/IngestionInsightsPanel";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";

export default function InvoicesPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-7 px-4 pb-10 pt-7 lg:px-0">
      {/* Page header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            Invoice intake
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
            EL&amp;N invoices and purchase feeds
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            This is where ODYAN learns your costs. Supplier PDFs, CSV uploads,
            photo captures and integrations land here so EL&amp;N GP stays
            accurate by venue.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 font-medium text-emerald-200">
            Coverage demo: 85 percent
          </span>
          <span className="rounded-full border border-cyan-500/60 bg-cyan-500/10 px-4 py-2 font-medium text-cyan-200">
            4 ingestion alerts
          </span>
        </div>
      </header>

      {/* Top grid: upload + insights */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)]">
        <UploadPanel />
        <IngestionInsightsPanel />
      </section>

      {/* Bottom grid: table */}
      <section>
        <InvoicesTable />
      </section>
    </main>
  );
}

