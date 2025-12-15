// components/dashboard/IntelligenceStrip.tsx

export default function IntelligenceStrip() {
  const items = [
    {
      label: "Top risk",
      text: "Cashflow tension expected next Tuesday if all current POs are confirmed.",
      accent: "text-red-300",
      dot: "bg-red-400",
    },
    {
      label: "Biggest opportunity",
      text: "Menu-engineering suggests +4 percent GP if you push two high margin dishes at lunch.",
      accent: "text-emerald-300",
      dot: "bg-emerald-400",
    },
    {
      label: "AI note",
      text: "Delivery complaints correlate with 19.00 to 20.00 on Fridays. Consider a tighter batching rule.",
      accent: "text-sky-300",
      dot: "bg-sky-400",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 shadow-md shadow-black/40">
      <header className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Intelligence strip
        </h2>
        <span className="text-[11px] text-slate-500">
          Snapshot of what matters most today
        </span>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-xl bg-slate-900/60 px-3 py-2"
          >
            <span
              className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${item.dot}`}
            />
            <div>
              <p className={`text-xs font-semibold uppercase ${item.accent}`}>
                {item.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-300">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
