// components/invoices/RecentInvoicesPanel.tsx
import React from "react";

export type InvoiceRow = {
  id: string;
  venue: string;
  supplier: string;
  date: string;
  amount: number;
  status: "Processed" | "In queue" | "Failed";
  source: "Supplier PDF email" | "CSV upload" | "Photo capture" | "Portal/API";
};

type RecentInvoicesPanelProps = {
  // Optional – so ControlRoom can render without passing data
  invoices?: InvoiceRow[];
};

/* EL&N-aligned fallback (fully reversible) */
const fallbackInvoices: InvoiceRow[] = [
  {
    id: "INV-10241",
    venue: "EL&N Hans Crescent",
    supplier: "Brakes",
    date: "2025-12-04",
    amount: 2314.78,
    status: "Processed",
    source: "Supplier PDF email",
  },
  {
    id: "INV-10239",
    venue: "EL&N Oxford Circus",
    supplier: "Bidfood",
    date: "2025-12-04",
    amount: 1875.23,
    status: "Processed",
    source: "Portal/API",
  },
  {
    id: "INV-10233",
    venue: "EL&N Wardour Street",
    supplier: "Fresh Produce Supplier",
    date: "2025-12-03",
    amount: 942.11,
    status: "In queue",
    source: "CSV upload",
  },
  {
    id: "INV-10227",
    venue: "EL&N St Pancras",
    supplier: "Packaging & Consumables",
    date: "2025-12-02",
    amount: 3150.0,
    status: "Processed",
    source: "Photo capture",
  },
];

export function RecentInvoicesPanel({
  invoices = fallbackInvoices,
}: RecentInvoicesPanelProps) {
  return (
    <section className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Recent invoices
          </p>
          <p className="text-sm text-slate-300">
            Last invoices ODYAN ingested across EL&amp;N venues.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 border border-emerald-500/40">
          Auto-reconciled • 94%
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs uppercase tracking-[0.14em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((row) => (
              <tr
                key={row.id}
                className="border-t border-slate-800/70 last:border-b-0 hover:bg-slate-900/60"
              >
                <td className="px-4 py-3 font-semibold text-slate-100">
                  {row.id}
                </td>
                <td className="px-4 py-3 text-slate-200">{row.venue}</td>
                <td className="px-4 py-3 text-slate-200">{row.supplier}</td>
                <td className="px-4 py-3 text-slate-400">{row.date}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-100">
                  £
                  {row.amount.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold border " +
                      (row.status === "Processed"
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
                        : row.status === "In queue"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/40"
                        : "bg-rose-500/10 text-rose-300 border-rose-500/40")
                    }
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">
                  {row.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
