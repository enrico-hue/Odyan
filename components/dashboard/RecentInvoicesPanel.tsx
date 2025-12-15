// components/dashboard/RecentInvoicesPanel.tsx

import type { PurchaseInvoiceSummary } from "@/types/procurement";

type RecentInvoicesPanelProps = {
  invoices: PurchaseInvoiceSummary[];
};

function statusBadge(status: PurchaseInvoiceSummary["status"]) {
  if (status === "paid") {
    return "bg-emerald-500/10 text-emerald-200 border-emerald-500/40";
  }
  if (status === "overdue") {
    return "bg-red-500/10 text-red-200 border-red-500/40";
  }
  return "bg-amber-500/10 text-amber-200 border-amber-500/40";
}

export default function RecentInvoicesPanel({
  invoices,
}: RecentInvoicesPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-md shadow-black/40">
      <header className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Recent invoices
          </h2>
          <p className="text-xs text-slate-500">
            Last supplier invoices that affect your GP and cashflow.
          </p>
        </div>
        <span className="text-[11px] text-slate-400">
          Showing {invoices.length} most recent
        </span>
      </header>

      {invoices.length === 0 ? (
        <p className="text-xs text-slate-400">
          No invoices recorded yet. Start by uploading your first supplier
          invoice.
        </p>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2"
            >
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-100">
                  {inv.supplierName}
                </p>
                <p className="text-[11px] text-slate-400">
                  {inv.invoiceNumber} · Issued {inv.issueDate}
                </p>
                <p className="text-[11px] text-slate-500">
                  Due {inv.dueDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-50">
                  {inv.currency} {inv.totalGross.toFixed(2)}
                </p>
                <span
                  className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${statusBadge(
                    inv.status
                  )}`}
                >
                  {inv.status === "open"
                    ? "Open"
                    : inv.status === "paid"
                    ? "Paid"
                    : "Overdue"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
