"use client";

type IngestionStatus = "Ready" | "Mapped" | "Attention";

type InvoiceRow = {
  id: string;
  supplier: string;
  venue: string;
  channel: string;
  total: string;
  status: IngestionStatus;
  age: string;
};

/* EL&N-aligned mock (fully reversible) */
const invoicesMock: InvoiceRow[] = [
  {
    id: "#INV-9482",
    supplier: "Dairy & Cream Supplier",
    venue: "EL&N Hans Crescent",
    channel: "Supplier PDF email",
    total: "£1,482",
    status: "Mapped",
    age: "7 min ago",
  },
  {
    id: "#INV-9479",
    supplier: "Fresh Produce Supplier",
    venue: "EL&N Wardour Street",
    channel: "CSV upload",
    total: "£3,214",
    status: "Attention",
    age: "24 min ago",
  },
  {
    id: "#INV-9477",
    supplier: "Coffee & Bakery Supplier",
    venue: "EL&N St Pancras",
    channel: "Photo capture",
    total: "£892",
    status: "Ready",
    age: "1 hour ago",
  },
  {
    id: "#INV-9474",
    supplier: "Packaging & Consumables",
    venue: "EL&N Oxford Circus",
    channel: "Portal/API",
    total: "£2,031",
    status: "Mapped",
    age: "2 hours ago",
  },
];

export function InvoicesTable() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Recent invoices
          </p>
          <p className="text-sm text-slate-300">
            What ODYAN has seen in the last few hours across EL&amp;N venues.
          </p>
        </div>
        <button className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition">
          View full ingestion log
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80">
              <Th>ID</Th>
              <Th>Supplier</Th>
              <Th>Venue</Th>
              <Th>Channel</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Seen</Th>
            </tr>
          </thead>
          <tbody>
            {invoicesMock.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-900/70 hover:bg-slate-900/70"
              >
                <Td className="font-semibold text-slate-100">{row.id}</Td>
                <Td>{row.supplier}</Td>
                <Td className="max-w-[240px] truncate">{row.venue}</Td>
                <Td>{row.channel}</Td>
                <Td className="font-semibold">{row.total}</Td>
                <Td>
                  <StatusPill status={row.status} />
                </Td>
                <Td className="text-slate-400">{row.age}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-sm text-slate-200 ${className}`}>
      {children}
    </td>
  );
}

function StatusPill({ status }: { status: IngestionStatus }) {
  if (status === "Ready") {
    return (
      <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 border border-slate-600">
        Ready
      </span>
    );
  }

  if (status === "Mapped") {
    return (
      <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/60">
        Mapped
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/60">
      Attention
    </span>
  );
}
