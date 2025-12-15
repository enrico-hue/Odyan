// components/ui/QuickActionsBar.tsx
import React from "react";

export default function QuickActionsBar() {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 flex flex-wrap gap-2">
      <button className="rounded-xl bg-emerald-600/90 px-3 py-1.5 text-xs font-medium text-emerald-50 hover:bg-emerald-500">
        New supplier negotiation
      </button>
      <button className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-700">
        Upload invoices batch
      </button>
      <button className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-700">
        Investigate GP drop
      </button>
      <button className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-700">
        View competitor changes
      </button>
    </section>
  );
}
