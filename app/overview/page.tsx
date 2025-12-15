import Link from "next/link";
import CompetitorsSnapshot from "../components/dashboard/CompetitorsSnapshot";

export default function OverviewPage() {
  return (
    <div className="space-y-8 text-slate-100">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2.5">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Home
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Operational overview
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed">
            ODYAN is reading your invoices, sales, labour, competitor menus and
            guest sentiment signals to tell you what is really happening in your
            EL&N operation today.
          </p>
        </div>

        {/* Ask ODYAN widget */}
        <div className="w-full md:w-[420px] rounded-3xl border border-slate-700 bg-slate-950/90 px-5 py-4 shadow-[0_18px_55px_rgba(0,0,0,0.7)]">
          <p className="text-sm text-slate-300 mb-3">Ask ODYAN about today</p>
          <div className="flex items-center gap-2.5">
            <input
              className="flex-1 rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm md:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder="Example: Which items are pulling margin down this week across Hans Crescent and Wardour Street?"
            />
            <button className="shrink-0 rounded-2xl bg-cyan-400 px-4 py-3 text-sm md:text-base font-semibold text-slate-950 hover:bg-cyan-300 transition shadow-[0_12px_35px_rgba(34,211,238,0.45)]">
              Ask
            </button>
          </div>
        </div>
      </header>

      {/* HERO + BUSINESS PULSE */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1.6fr)] gap-4">
        {/* AI narrative hero */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(15,23,42,0.98),_#020617)] px-7 py-7 sm:px-8 sm:py-8 shadow-[0_32px_90px_rgba(0,0,0,0.8)]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">
              Today&apos;s intelligence
            </p>
            <h2 className="text-xl md:text-2xl font-semibold leading-snug">
              ODYAN has detected three shifts that will move your GP, labour and
              cashflow over the next 72 hours.
            </h2>
            <ul className="space-y-2.5 text-base md:text-lg text-slate-100 list-disc list-inside leading-relaxed">
              <li>
                Margin softness on brunch and patisserie after cost moves on
                butter, cream and berries from two core suppliers.
              </li>
              <li>
                Afternoon labour above target for three consecutive days at one
                high volume London venue.
              </li>
              <li>
                Variance spike on premium garnish and syrups suggesting waste,
                over portioning or untracked comps.
              </li>
            </ul>
            <p className="text-sm md:text-base text-slate-300 pt-1 leading-relaxed">
              Start with the critical alerts and the immediate actions below.
              As new invoices, sales and staffing data arrive, ODYAN keeps this
              picture up to date.
            </p>
          </div>
        </div>

        {/* Business pulse widget */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-950/90 border border-slate-700 px-6 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.75)]">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">
                  Business pulse
                </p>
                <p className="text-base text-slate-300">
                  Health and risk across all venues today.
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-400/50 px-3.5 py-1.5 text-sm font-semibold text-emerald-200">
                Stable
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative h-28 w-28 shrink-0">
                <div className="absolute inset-0 rounded-full border border-slate-700" />
                <div className="absolute inset-2 rounded-full border border-emerald-400/80" />
                <div className="absolute inset-4 rounded-full border border-cyan-400/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-base font-semibold text-emerald-300">
                    78
                    <span className="text-sm text-slate-400"> /100</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm md:text-base flex-1">
                <MiniStat label="Venues tracked" value="4" />
                <MiniStat label="Open alerts" value="6" />
                <MiniStat label="Critical issues" value="2" tone="critical" />
                <MiniStat
                  label="Data confidence"
                  value="90 / 100"
                  tone="good"
                />
              </div>
            </div>
          </div>

          {/* Micro forecast widgets */}
          <div className="grid grid-cols-2 gap-3">
            <MiniWidget
              label="Today forecast GP"
              value="66.8%"
              helper="If no corrective action is taken."
            />
            <MiniWidget
              label="Peak load today"
              value="High"
              helper="Two venues above 85 percent capacity at peak."
            />
          </div>
        </div>
      </section>

      {/* INTELLIGENCE STRIP */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-base md:text-lg font-semibold">
            ODYAN focus for the next 24 hours
          </p>
          <p className="text-sm text-slate-400">
            Ranked by impact on GP, cash and risk.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InsightChip
            title="Protect GP"
            body="Three hero items are pulling margin down more than 1.2 points versus last week."
            tag="View menu impact"
          />
          <InsightChip
            title="Supplier pressure"
            body="Two suppliers moved core dairy and berries above your agreed bands."
            tag="Review invoices"
          />
          <InsightChip
            title="Labour balance"
            body="One venue is running heavy on afternoons, another is light during breakfast."
            tag="Rebalance shifts"
          />
        </div>
      </section>

      {/* LIVE COMPETITOR SNAPSHOT FROM ODYAN BRAIN */}
      <section>
        <CompetitorsSnapshot />
      </section>

      {/* COMPETITOR + REPUTATION INTELLIGENCE (TWIN SUPERPOWERS) */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Competitor radar -> link to /competitors */}
        <Link
          href="/competitors"
          className="rounded-3xl border border-violet-500/40 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(15,23,42,0.98),_#020617)] px-6 py-6 shadow-[0_28px_80px_rgba(88,28,135,0.6)] hover:border-violet-300/70 hover:shadow-[0_32px_90px_rgba(88,28,135,0.9)] transition-colors"
        >
          <p className="text-sm uppercase tracking-[0.18em] text-violet-300">
            Competitor radar
          </p>
          <p className="mt-2 text-base text-slate-200 leading-relaxed">
            ODYAN is watching live menus, delivery platforms and pricing for
            your key competitors and comparing them with your performance.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <MiniStat label="Tracked competitors" value="14" tone="good" />
            <MiniStat label="Menu changes this week" value="31" />
            <MiniStat label="New promos spotted" value="8" tone="warn" />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <CompetitorScoreRow
              name="Premium patisserie set (incl. L&apos;ETO)"
              price="103 percent of you"
              rating="4.6 vs your 4.5"
              delivery="Slightly higher dessert mix"
            />
            <CompetitorScoreRow
              name="High footfall cafe set"
              price="90 percent of you"
              rating="4.2 vs your 4.5"
              delivery="Heavier on weekday bundles"
            />
          </div>

          <div className="mt-5 space-y-3">
            <MarketEventRow
              time="Today 11:08"
              text="Competitor launched a weekday brunch bundle targeting lunch conversion."
              tag="Check lunch impact"
            />
            <MarketEventRow
              time="Today 09:41"
              text="L&apos;ETO increased price on a signature cake slice by 6 percent."
              tag="Compare pricing"
            />
          </div>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed">
            Click to open the full competitor and market radar with filters,
            overlap scores and ODYAN observations.
          </p>
        </Link>

        {/* Reputation radar -> link to /reputation */}
        <Link
          href="/reputation"
          className="rounded-3xl border border-emerald-500/40 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(15,23,42,0.98),_#020617)] px-6 py-6 shadow-[0_28px_80px_rgba(22,163,74,0.6)] hover:border-emerald-300/70 hover:shadow-[0_32px_90px_rgba(22,163,74,0.9)] transition-colors"
        >
          <p className="text-sm uppercase tracking-[0.18em] text-emerald-300">
            Reputation radar
          </p>
          <p className="mt-2 text-base text-slate-200 leading-relaxed">
            ODYAN is reading reviews, social mentions and rankings to show how
            your brand is performing without a full marketing team.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <MiniStat label="Global rating (avg)" value="4.5 / 5" tone="good" />
            <MiniStat label="New reviews (7 days)" value="142" />
            <MiniStat label="Brand sentiment" value="80 / 100" tone="good" />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <ReputationScoreRow
              name="Google & Maps"
              rating="4.6 avg"
              trend="+0.1 vs last month"
              note="Strong on ambience and product, slightly lower on speed at peak."
            />
            <ReputationScoreRow
              name="Delivery & platforms"
              rating="4.3 avg"
              trend="-0.1 vs last month"
              note="Comments mention packaging consistency and delivery time windows."
            />
          </div>

          <div className="mt-5 space-y-3">
            <ReputationEventRow
              time="Today 10:32"
              text="Three reviews mention slow queue movement at peak in the last 48 hours."
              tag="Open service issues"
            />
            <ReputationEventRow
              time="Yesterday 21:04"
              text="Viral social post with 2.1k likes featuring a cake slice and latte."
              tag="Amplify opportunity"
            />
          </div>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed">
            Click to open the full reputation view with filters, themes,
            sentiment breakdown and suggested replies.
          </p>
        </Link>
      </section>

      {/* KPI STRIP */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Group GP forecast"
          value="66.8%"
          helper="Projected based on current input costs and sales mix."
        />
        <KpiCard
          label="Net spend this week"
          value="£31,280"
          helper="All suppliers, all venues with active ingestion."
        />
        <KpiCard
          label="Labour as percent of sales"
          value="30.6%"
          helper="Rolling 7 days across all operational shifts."
        />
        <KpiCard
          label="Items needing review"
          value="4"
          helper="Data or price anomalies impacting accuracy."
        />
      </section>

      {/* MAIN GRID: OPERATIONS, ACTIONS, VALUE */}
      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)] gap-4">
        {/* Left column: alerts + 4 horizon planner */}
        <div className="space-y-4">
          {/* Alerts */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="space-y-1">
                <p className="text-base md:text-lg font-semibold">
                  Real time alerts
                </p>
                <p className="text-sm text-slate-400">
                  Prioritised by financial impact and operational risk.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-700 px-3.5 py-1.5 text-sm text-slate-200">
                6 open
              </span>
            </div>
            <div className="space-y-3">
              <AlertRow
                severity="critical"
                title="GP drop on brunch category at Hans Crescent"
                detail="Cost moves on butter and cream reduce realised GP by 2.1 points versus last week."
                tag="See impact"
              />
              <AlertRow
                severity="critical"
                title="Stock variance anomaly on premium garnish and syrups"
                detail="Recorded usage does not match expected sales and waste. Investigate over portioning, comps and training."
                tag="Investigate stock"
              />
              <AlertRow
                severity="medium"
                title="Supplier price spike on berries and dairy"
                detail="Core supplier increased three SKUs by 6 to 9 percent on the last invoice."
                tag="Review invoices"
              />
              <AlertRow
                severity="medium"
                title="Labour trending above target at Wardour Street afternoons"
                detail="Afternoon shifts running at 34 percent of sales versus target 30."
                tag="Open labour view"
              />
            </div>
          </div>

          {/* 4 horizon action planner */}
          <ActionPlanner />
        </div>

        {/* Right column: menu, suppliers, labour, data confidence, value from ODYAN */}
        <div className="space-y-4">
          {/* Menu GP killers */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-400">
              Menu GP focus
            </p>
            <p className="mt-2 text-base text-slate-200 leading-relaxed">
              Items pulling group GP down this week.
            </p>
            <div className="mt-4 space-y-3">
              <MenuRow
                name="Dutch Baby Pancakes"
                venue="Hans Crescent"
                change="-1.6 pts GP"
              />
              <MenuRow
                name="Açai Bowl"
                venue="Wardour Street"
                change="-1.2 pts GP"
              />
              <MenuRow
                name="Pistachio Spanish Latte"
                venue="St Pancras"
                change="-0.9 pts GP"
              />
            </div>
          </div>

          {/* Supplier pressure and labour */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.7)]">
              <p className="text-sm uppercase tracking-[0.16em] text-slate-400">
                Supplier pressure
              </p>
              <div className="mt-4 space-y-3">
                <SupplierRow
                  name="Dairy & Cream Supplier"
                  detail="+8.0 percent avg on butter and cream"
                  level="high"
                />
                <SupplierRow
                  name="Fresh Produce Supplier"
                  detail="+6.1 percent on berries"
                  level="medium"
                />
                <SupplierRow
                  name="Coffee & Packaging Supplier"
                  detail="Stable pricing"
                  level="low"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.7)]">
              <p className="text-sm uppercase tracking-[0.16em] text-slate-400">
                Labour and staffing
              </p>
              <div className="mt-4 space-y-3">
                <LabourRow
                  label="Wardour Street afternoons"
                  detail="34 percent of sales versus 30 target."
                  level="high"
                />
                <LabourRow
                  label="Hans Crescent breakfast"
                  detail="Light by 0.5 FTE against forecast."
                  level="medium"
                />
                <LabourRow
                  label="St Pancras peak service"
                  detail="On plan."
                  level="low"
                />
              </div>
            </div>
          </div>

          {/* Data confidence */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.7)]">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-400">
              Data confidence and next steps
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <MiniStat label="Confidence score" value="90 / 100" tone="good" />
              <MiniStat label="Invoices missing" value="2" tone="warn" />
              <MiniStat label="Venues fully synced" value="4 / 4" />
              <MiniStat label="Alternate data paths" value="Enabled" />
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              To raise confidence: upload missing invoices for yesterday, clear
              mapping backlog, or let ODYAN estimate from POS-only data with a
              lower confidence band.
            </p>
          </div>

          {/* Value from ODYAN */}
          <div className="rounded-3xl border border-emerald-500/40 bg-slate-950/95 px-5 py-5 shadow-[0_24px_80px_rgba(16,185,129,0.35)]">
            <p className="text-sm uppercase tracking-[0.16em] text-emerald-300">
              Value from ODYAN this month
            </p>
            <p className="mt-2 text-base text-slate-200 leading-relaxed">
              Estimated impact versus running the same operation without ODYAN.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <MiniStat label="GP protected" value="+£3,980" tone="good" />
              <MiniStat label="Waste portions avoided" value="168" tone="good" />
              <MiniStat
                label="Labour hours redeployed"
                value="61"
                tone="good"
              />
              <MiniStat
                label="Time saved versus Excel"
                value="10 h / week"
                tone="good"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Types and helper components */

type Tone = "default" | "good" | "critical" | "warn";

function MiniStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  const valueClass =
    tone === "good"
      ? "text-emerald-300"
      : tone === "critical"
      ? "text-rose-300"
      : tone === "warn"
      ? "text-amber-300"
      : "text-slate-100";
  return (
    <div className="space-y-1">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={"text-base font-semibold " + valueClass}>{value}</p>
    </div>
  );
}

function MiniWidget({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-950/85 border border-slate-800 px-5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.6)]">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}

function InsightChip({
  title,
  body,
  tag,
}: {
  title: string;
  body: string;
  tag: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/85 px-5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.6)]">
      <p className="text-base font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
        {body}
      </p>
      <p className="mt-3 text-sm text-cyan-300 cursor-pointer hover:text-cyan-200">
        {tag}
      </p>
    </div>
  );
}

function KpiCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-950/85 border border-slate-800 px-5 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.7)]">
      <p className="text-sm uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-slate-50">{value}</p>
      <p className="mt-3 text-sm md:text-base text-slate-400 leading-relaxed">
        {helper}
      </p>
    </div>
  );
}

type AlertSeverity = "medium" | "critical";

function AlertRow({
  severity,
  title,
  detail,
  tag,
}: {
  severity: AlertSeverity;
  title: string;
  detail: string;
  tag?: string;
}) {
  const severityClasses =
    severity === "critical"
      ? "bg-rose-900/25 border-rose-500/40 text-rose-100"
      : "bg-amber-900/25 border-amber-400/35 text-amber-100";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/85 px-4 py-4 hover:border-cyan-400/50 hover:bg-slate-900 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-base md:text-lg font-semibold text-slate-100">
            {title}
          </p>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            {detail}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={
              "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold " +
              severityClasses
            }
          >
            {severity === "critical" ? "Critical" : "Medium"}
          </span>
          {tag && (
            <span className="text-sm text-cyan-300 hover:text-cyan-200 cursor-pointer">
              {tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* 4 horizon action planner */

function ActionPlanner() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-base md:text-lg font-semibold">ODYAN action planner</p>
        <p className="text-sm text-slate-400">
          Structured by what you can do today, this week and longer term.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ActionHorizon
          title="Immediate actions"
          subtitle="Today and next 24 hours"
          items={[
            "Reduce prep batch for high waste toppings by 15 percent. Last 3 days you threw away 12 portions at peak.",
            "Move 1 barista from afternoon to breakfast at Hans Crescent tomorrow to match forecasted cover mix.",
            "Upload 2 missing invoices so that GP for dairy and berries is not under reported.",
          ]}
        />
        <ActionHorizon
          title="This week"
          subtitle="Next 3 to 7 days"
          items={[
            "Run a mini cost check on top 10 SKUs with biggest price moves and confirm mappings.",
            "Adjust prep guides for creams, fruit cuts and garnish to match new demand pattern and reduce waste.",
            "Brief venue leads on comps and discount codes after this week’s variance report.",
          ]}
        />
        <ActionHorizon
          title="Next 30 days"
          subtitle="Medium term improvements"
          items={[
            "Review recipe weights for Dutch Baby and Açai to protect GP without changing price perception.",
            "Plan rota changes for next month so peak queues and quieter windows are balanced across venues.",
            "Prepare a comparison report for dairy and produce suppliers to bring to the next purchasing meeting.",
          ]}
        />
        <ActionHorizon
          title="Strategic moves"
          subtitle="6 to 12 week horizon"
          items={[
            "Optimise the top 20 hero items by volume using ODYAN margin and waste analysis.",
            "Plan a phased pricing review by venue to test customer response without a full menu reset.",
            "Use ODYAN evidence to renegotiate supplier bands where drift is above target.",
          ]}
        />
      </div>
    </div>
  );
}

function ActionHorizon({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-slate-900/85 border border-slate-800 px-4 py-4 space-y-3">
      <div>
        <p className="text-base font-semibold text-slate-100">{title}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-2 h-2 w-2 rounded-full bg-cyan-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Competitor helpers */

function CompetitorScoreRow({
  name,
  price,
  rating,
  delivery,
}: {
  name: string;
  price: string;
  rating: string;
  delivery: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/85 border border-slate-800 px-4 py-4">
      <p className="text-base font-semibold text-slate-100">{name}</p>
      <p className="mt-2 text-sm text-slate-300">Price index: {price}</p>
      <p className="text-sm text-slate-300">Ratings: {rating}</p>
      <p className="text-sm text-slate-300">Delivery behaviour: {delivery}</p>
    </div>
  );
}

function MarketEventRow({
  time,
  text,
  tag,
}: {
  time: string;
  text: string;
  tag: string;
}) {
  return (
    <div className="flex gap-3 text-sm rounded-2xl bg-slate-900/85 border border-slate-800 px-4 py-3">
      <div className="mt-2 h-2.5 w-2.5 rounded-full bg-violet-400" />
      <div className="flex-1">
        <p className="text-slate-100 leading-relaxed">{text}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-slate-400">{time}</p>
          <button className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            {tag}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reputation helpers */

function ReputationScoreRow({
  name,
  rating,
  trend,
  note,
}: {
  name: string;
  rating: string;
  trend: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/85 border border-slate-800 px-4 py-4">
      <p className="text-base font-semibold text-slate-100">{name}</p>
      <p className="mt-2 text-sm text-slate-300">Rating: {rating}</p>
      <p className="text-sm text-emerald-300">{trend}</p>
      <p className="text-sm text-slate-300 mt-2 leading-relaxed">{note}</p>
    </div>
  );
}

function ReputationEventRow({
  time,
  text,
  tag,
}: {
  time: string;
  text: string;
  tag: string;
}) {
  return (
    <div className="flex gap-3 text-sm rounded-2xl bg-slate-900/85 border border-slate-800 px-4 py-3">
      <div className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-400" />
      <div className="flex-1">
        <p className="text-slate-100 leading-relaxed">{text}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-slate-400">{time}</p>
          <button className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            {tag}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Other widgets */

function MenuRow({
  name,
  venue,
  change,
}: {
  name: string;
  venue: string;
  change: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-900/85 border border-slate-800 px-4 py-3">
      <div>
        <p className="text-base font-semibold text-slate-100">{name}</p>
        <p className="text-sm text-slate-400">{venue}</p>
      </div>
      <p className="text-base font-semibold text-amber-300">{change}</p>
    </div>
  );
}

function SupplierRow({
  name,
  detail,
  level,
}: {
  name: string;
  detail: string;
  level: "low" | "medium" | "high";
}) {
  const tone =
    level === "high"
      ? "text-rose-300"
      : level === "medium"
      ? "text-amber-300"
      : "text-emerald-300";
  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-slate-100">{name}</p>
        <span className={"text-sm font-semibold " + tone}>
          {level === "high" ? "High" : level === "medium" ? "Medium" : "Low"}
        </span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{detail}</p>
    </div>
  );
}

function LabourRow({
  label,
  detail,
  level,
}: {
  label: string;
  detail: string;
  level: "low" | "medium" | "high";
}) {
  const tone =
    level === "high"
      ? "text-rose-300"
      : level === "medium"
      ? "text-amber-300"
      : "text-emerald-300";
  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-slate-100">{label}</p>
        <span className={"text-sm font-semibold " + tone}>
          {level === "high" ? "High" : level === "medium" ? "Medium" : "Low"}
        </span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{detail}</p>
    </div>
  );
}
