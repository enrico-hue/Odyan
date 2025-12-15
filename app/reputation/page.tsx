"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  MessageCircle,
  Globe2,
  Instagram,
  ThumbsUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Sparkles,
  Star,
  Activity,
  ArrowRight,
} from "lucide-react";

/* ---------------- MOCK DATA (REPUTATION BRAIN) ---------------- */

type ChannelKey = "google" | "maps" | "delivery" | "social";

type ChannelPerformance = {
  id: ChannelKey;
  name: string;
  rating: number;
  sentiment: number; // 0–100
  reviews30d: number;
  changeRating: number; // vs previous period
  mainTheme: string;
};

const channelData: ChannelPerformance[] = [
  {
    id: "google",
    name: "Google Reviews",
    rating: 4.6,
    sentiment: 82,
    reviews30d: 310,
    changeRating: 0.1,
    mainTheme: "Strong food quality, price sensitive.",
  },
  {
    id: "maps",
    name: "Maps & Local Guides",
    rating: 4.5,
    sentiment: 79,
    reviews30d: 140,
    changeRating: -0.1,
    mainTheme: "Queues and waiting times mentioned.",
  },
  {
    id: "delivery",
    name: "Delivery Platforms",
    rating: 4.3,
    sentiment: 71,
    reviews30d: 220,
    changeRating: -0.2,
    mainTheme: "Packaging and temperature frequently cited.",
  },
  {
    id: "social",
    name: "Social & UGC",
    rating: 4.7,
    sentiment: 88,
    reviews30d: 560,
    changeRating: 0.2,
    mainTheme: "Highly visual brunch and desserts driving posts.",
  },
];

type SegmentKey =
  | "families"
  | "office"
  | "tourists"
  | "brunch"
  | "locals"
  | "deliveryFans";

type Segment = {
  id: SegmentKey;
  label: string;
  share: number; // % of total interactions
  sentiment: number; // 0–100
  spendIndex: number; // 100 = avg
  keyNeeds: string;
  keyRisk: string;
};

const segments: Segment[] = [
  {
    id: "families",
    label: "Families",
    share: 14,
    sentiment: 76,
    spendIndex: 104,
    keyNeeds: "Space, speed at peak, kid-friendly options.",
    keyRisk: "Complaints focus on long waits and noise.",
  },
  {
    id: "office",
    label: "Office workers",
    share: 22,
    sentiment: 81,
    spendIndex: 97,
    keyNeeds: "Fast service at lunch, split bills, loyalty.",
    keyRisk: "Negative reviews when orders delay 10+ minutes.",
  },
  {
    id: "tourists",
    label: "Tourists",
    share: 19,
    sentiment: 79,
    spendIndex: 113,
    keyNeeds: "Clear menus, photos, easy language, card payments.",
    keyRisk: "Reviews mention confusion with service charge.",
  },
  {
    id: "brunch",
    label: "Brunch & influencer crowd",
    share: 21,
    sentiment: 89,
    spendIndex: 118,
    keyNeeds: "Visual dishes, atmosphere, music, Instagram spots.",
    keyRisk: "Highly sensitive to staff attitude and queue handling.",
  },
  {
    id: "locals",
    label: "Local regulars",
    share: 16,
    sentiment: 84,
    spendIndex: 101,
    keyNeeds: "Consistency, recognition, simple perks.",
    keyRisk: "Drop in quality immediately appears in reviews.",
  },
  {
    id: "deliveryFans",
    label: "Delivery loyalists",
    share: 8,
    sentiment: 69,
    spendIndex: 95,
    keyNeeds: "Reliable ETA, hot food, safe packaging.",
    keyRisk: "Main source of 1–2 star reviews when things go wrong.",
  },
];

type EmotionKey =
  | "aesthetics"
  | "speed"
  | "value"
  | "staff"
  | "comfort"
  | "consistency";

type EmotionDriver = {
  id: EmotionKey;
  label: string;
  strength: number; // 0–100
  risk: number; // 0–100
  summary: string;
  action: string;
};

const emotionDrivers: EmotionDriver[] = [
  {
    id: "aesthetics",
    label: "Visual impact & aesthetics",
    strength: 91,
    risk: 18,
    summary: "Dishes and interiors are heavily photographed and praised.",
    action: "Lean into visual hero items, use as growth engine.",
  },
  {
    id: "speed",
    label: "Speed & waiting time",
    strength: 62,
    risk: 71,
    summary: "Mixed: great speed off-peak, queues at brunch and dinner.",
    action: "Add queue comms and staff redeployment in peak windows.",
  },
  {
    id: "value",
    label: "Perceived value for money",
    strength: 74,
    risk: 34,
    summary: "Guests accept premium if experience matches price.",
    action: "Protect perceived value on core brunch dishes.",
  },
  {
    id: "staff",
    label: "Staff warmth & attitude",
    strength: 86,
    risk: 27,
    summary: "Named staff appear often in positive reviews.",
    action: "Design recognition program and cross-train strongest people.",
  },
  {
    id: "comfort",
    label: "Comfort & atmosphere",
    strength: 79,
    risk: 29,
    summary: "Lighting, music and seating widely appreciated.",
    action: "Replicate best atmosphere learnings in weaker venues.",
  },
  {
    id: "consistency",
    label: "Consistency & reliability",
    strength: 67,
    risk: 55,
    summary: "Some venues show variance in brunch quality and coffee.",
    action: "Use ODYAN to target recipe checks and QC to outlier sites.",
  },
];

type EventImpact = "risk" | "opportunity";

type ReputationEvent = {
  id: string;
  time: string;
  type: string;
  impact: EventImpact;
  text: string;
};

const latestEvents: ReputationEvent[] = [
  {
    id: "e1",
    time: "Today 10:32",
    type: "Service",
    impact: "risk",
    text: "Three reviews mention slow service at dinner in the last 48 hours.",
  },
  {
    id: "e2",
    time: "Today 09:05",
    type: "Social",
    impact: "opportunity",
    text: "A brunch reel reached 24k views on TikTok with strong comments.",
  },
  {
    id: "e3",
    time: "Yesterday 21:14",
    type: "Delivery",
    impact: "risk",
    text: "Two 1-star delivery reviews highlight cold food and messy packaging.",
  },
  {
    id: "e4",
    time: "Yesterday 15:47",
    type: "Staff",
    impact: "opportunity",
    text: "Six reviews name-check the same barista for exceptional service.",
  },
];

type OpportunityGap = {
  id: string;
  label: string;
  description: string;
  estimatedLift: string; // money or rating
  priority: "high" | "medium" | "low";
};

const opportunityGaps: OpportunityGap[] = [
  {
    id: "g1",
    label: "Families under-served at weekends",
    description:
      "Low share of family reviews vs catchment potential, and sentiment is lower than average due to waiting time and table allocation.",
    estimatedLift: "+£6.5k / month if improved",
    priority: "high",
  },
  {
    id: "g2",
    label: "Delivery packaging and temperature",
    description:
      "Most 1–2 star reviews are delivery-related. An upgrade in packaging and dispatch logic has a disproportionate impact on rating.",
    estimatedLift: "+0.18 rating in 60 days",
    priority: "high",
  },
  {
    id: "g3",
    label: "No structured TikTok presence",
    description:
      "Viral content is organic and uncoordinated. A simple posting rhythm around hero dishes could significantly grow reach.",
    estimatedLift: "+12–18 percent organic reach",
    priority: "medium",
  },
];

type Influencer = {
  id: string;
  handle: string;
  platform: string;
  followers: string;
  posts: number;
  tone: "advocate" | "neutral" | "critical";
  note: string;
};

const influencers: Influencer[] = [
  {
    id: "i1",
    handle: "@brunchwithsara",
    platform: "Instagram",
    followers: "48k",
    posts: 7,
    tone: "advocate",
    note: "Consistently positive, high engagement on brunch content.",
  },
  {
    id: "i2",
    handle: "@londonfoodoffice",
    platform: "TikTok",
    followers: "32k",
    posts: 3,
    tone: "advocate",
    note: "Focus on weekday lunch, strong office worker audience.",
  },
  {
    id: "i3",
    handle: "@fairvalueeats",
    platform: "Google Local Guide",
    followers: "Top 3 percent",
    posts: 5,
    tone: "critical",
    note: "Honest reviews, sensitive to perceived value and queue handling.",
  },
];

type TopMove = {
  id: string;
  title: string;
  horizon: "Now" | "This month" | "Next quarter";
  impactRating: string;
  impactRevenue: string;
  description: string;
};

const topMoves: TopMove[] = [
  {
    id: "m1",
    title: "Fix delivery packaging and dispatch rules at two core venues",
    horizon: "Now",
    impactRating: "+0.18 global rating",
    impactRevenue: "+£9,400 / month protected",
    description:
      "Most low-star reviews originate from two locations. ODYAN suggests one packaging upgrade and dispatch support at peak times.",
  },
  {
    id: "m2",
    title: "Use hero brunch dishes as the centre of a social content routine",
    horizon: "This month",
    impactRating: "+0.08 sentiment",
    impactRevenue: "+8–12 percent incremental covers at weekends",
    description:
      "Systematic posting of 3–4 core visual dishes across channels, timed with peak search and weather conditions.",
  },
  {
    id: "m3",
    title: "Targeted service training on dinner shifts at one specific venue",
    horizon: "This month",
    impactRating: "+0.12 rating at that site",
    impactRevenue: "+£3,100 / month",
    description:
      "Reviews repeatedly name slow or inattentive service at the same venue. ODYAN flags the pattern and frames a micro-training module.",
  },
];

/* ---------------- PAGE COMPONENT ---------------- */

export default function ReputationPage() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelKey>("google");

  const overallSentiment = 78;
  const overallRating = 4.5;
  const reviewsLast30 = 796;
  const changeSentiment = +3; // vs previous period

  const activeChannel = channelData.find(
    (c) => c.id === selectedChannel
  ) as ChannelPerformance;

  return (
    <div className="space-y-8 text-slate-100">
      {/* HEADER */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Reputation & Audience
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Brand sentiment & guest intelligence
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">
            ODYAN is reading reviews, social content and customer behaviour to
            show how your guests really feel, who they are, and what you should
            do next to grow revenue and reputation.
          </p>
        </div>

        {/* QUICK KPIs */}
        <div className="grid grid-cols-3 gap-3 text-xs md:text-sm w-full md:w-auto">
          <MiniKpi
            label="Global rating"
            value={`${overallRating.toFixed(1)} / 5`}
            helper="Weighted across all channels."
          />
          <MiniKpi
            label="Sentiment score"
            value={`${overallSentiment} / 100`}
            helper={
              changeSentiment >= 0
                ? `+${changeSentiment} pts vs last month`
                : `${changeSentiment} pts vs last month`
            }
            tone={changeSentiment >= 0 ? "good" : "bad"}
          />
          <MiniKpi
            label="New reviews (30 days)"
            value={`${reviewsLast30}`}
            helper="Across all tracked channels."
          />
        </div>
      </header>

      {/* SENTIMENT HERO + TOP MOVES */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.7fr)] gap-4">
        {/* Left: sentiment gauge & summary */}
        <div className="rounded-3xl border border-emerald-500/40 bg-slate-950/95 px-5 py-4 shadow-[0_28px_90px_rgba(16,185,129,0.5)] grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] gap-4 items-center">
          <div className="h-40 sm:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={[{ name: "Sentiment", value: overallSentiment }]}
                innerRadius="60%"
                outerRadius="100%"
                startAngle={220}
                endAngle={-40}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  dataKey="value"
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={16}
                  fill="#22c55e"
                  background={{ fill: "#020617" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">
              Today&apos;s reputation pulse
            </p>
            <p className="text-sm md:text-base text-slate-100">
              Guests are broadly positive. The strongest emotion is{" "}
              <span className="text-emerald-300 font-medium">
                visual impact
              </span>{" "}
              and staff warmth. The main structural risk is{" "}
              <span className="text-amber-300 font-medium">
                speed and delivery experience.
              </span>
            </p>
            <p className="text-xs md:text-sm text-slate-300">
              If you fix the top delivery and speed issues ODYAN has flagged,
              projected rating moves from{" "}
              <span className="font-semibold">4.5 → 4.7</span> within 60–90
              days, with a strong uplift in repeat visits.
            </p>
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              <TagChip icon={Globe2} label="Web & reviews scanned" />
              <TagChip icon={Instagram} label="Social content patterns" />
              <TagChip icon={Users} label="Guest segments identified" />
            </div>
          </div>
        </div>

        {/* Right: top ODYAN moves */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/95 px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Top moves from reputation data
              </p>
              <p className="text-sm text-slate-300">
                Highest impact steps to increase rating and revenue.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">
              <Sparkles className="h-3 w-3" />
              ODYAN playbook
            </div>
          </div>
          <div className="space-y-2">
            {topMoves.map((move) => (
              <TopMoveRow key={move.id} move={move} />
            ))}
          </div>
        </div>
      </section>

      {/* CHANNEL PERFORMANCE STRIP */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.8)] space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Channels ODYAN is tracking
            </p>
            <p className="text-xs md:text-sm text-slate-300">
              Rating, sentiment and volume per platform.
            </p>
          </div>
          <Link
            href="/overview"
            className="text-[11px] text-cyan-300 hover:text-cyan-200"
          >
            Open full operations view →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {channelData.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setSelectedChannel(ch.id)}
              className={`text-left rounded-2xl border px-3 py-3 text-xs transition-all ${
                selectedChannel === ch.id
                  ? "border-cyan-400 bg-slate-900/95 shadow-[0_16px_55px_rgba(8,47,73,0.8)]"
                  : "border-slate-800 bg-slate-950/90 hover:border-slate-600"
              }`}
            >
              <ChannelCard channel={ch} active={selectedChannel === ch.id} />
            </button>
          ))}
        </div>

        {/* Small bar chart for the active channel compared to others */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-4 items-center">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={channelData}
                margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[4, 5]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Bar
                  dataKey="rating"
                  radius={[6, 6, 0, 0]}
                  fill="#22c55e"
                  name="Rating"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-xs md:text-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Focus: {activeChannel.name}
            </p>
            <p className="text-slate-200">
              Rating {activeChannel.rating.toFixed(1)} with sentiment{" "}
              {activeChannel.sentiment} / 100 and{" "}
              {activeChannel.reviews30d} new reviews in the last 30 days.
            </p>
            <p className="text-slate-300">
              {activeChannel.mainTheme}
            </p>
            <p className="text-[11px] text-slate-400">
              ODYAN uses this channel to predict future traffic and repeat
              visits and connects it to your GP, labour and capacity
              constraints.
            </p>
          </div>
        </div>
      </section>

      {/* SEGMENTS + EMOTION DRIVERS */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1.5fr)] gap-4">
        {/* Guest segments */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.8)] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Guest tribes detected
              </p>
              <p className="text-xs md:text-sm text-slate-300">
                Who is really talking about you and how they feel.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
              <Users className="h-3 w-3" />
              {segments.length} segments
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
            {segments.map((seg) => (
              <SegmentCard key={seg.id} segment={seg} />
            ))}
          </div>
        </div>

        {/* Emotion drivers */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.8)] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Emotion drivers
              </p>
              <p className="text-xs md:text-sm text-slate-300">
                Why guests love or hate the experience.
              </p>
            </div>
            <Link
              href="/overview"
              className="text-[11px] text-cyan-300 hover:text-cyan-200"
            >
              Open service view →
            </Link>
          </div>
          <div className="space-y-2 text-xs md:text-sm max-h-[330px] overflow-y-auto pr-1 custom-scroll">
            {emotionDrivers.map((driver) => (
              <EmotionCard key={driver.id} driver={driver} />
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS + OPPORTUNITIES + INFLUENCERS */}
      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1.5fr)] gap-4">
        {/* Events + opportunities */}
        <div className="space-y-4">
          {/* Events feed */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Latest reputation signals
                </p>
                <p className="text-xs md:text-sm text-slate-300">
                  Real events ODYAN thinks you must know about.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
                <Activity className="h-3 w-3" />
                Real time feed
              </span>
            </div>
            <div className="space-y-2 text-xs md:text-sm max-h-56 overflow-y-auto pr-1 custom-scroll">
              {latestEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Opportunity gaps */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.8)] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Untapped opportunities
                </p>
                <p className="text-xs md:text-sm text-slate-300">
                  Where reputation data says you can still grow.
                </p>
              </div>
              <ThumbsUp className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="space-y-2 text-xs md:text-sm">
              {opportunityGaps.map((gap) => (
                <OpportunityCard key={gap.id} gap={gap} />
              ))}
            </div>
          </div>
        </div>

        {/* Influencers + quick actions */}
        <div className="space-y-4">
          {/* Influencers */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.8)] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Influencers & superfans
                </p>
                <p className="text-xs md:text-sm text-slate-300">
                  People who move perception more than average guests.
                </p>
              </div>
              <Star className="h-4 w-4 text-amber-300" />
            </div>
            <div className="space-y-2 text-xs md:text-sm">
              {influencers.map((inf) => (
                <InfluencerRow key={inf.id} influencer={inf} />
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.8)] text-xs md:text-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400 mb-2">
              Quick actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              <QuickAction
                href="#"
                title="Reply to critical reviews"
                subtitle="Start with delivery and dinner issues."
              />
              <QuickAction
                href="/competitors"
                title="Compare public rating vs rivals"
                subtitle="Use ODYAN competitor view."
              />
              <QuickAction
                href="/overview"
                title="Open service & labour view"
                subtitle="Link perception to staffing."
              />
              <QuickAction
                href="/invoices"
                title="Connect pricing to sentiment"
                subtitle="Check value complaints vs cost."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

type MiniTone = "default" | "good" | "bad";

function MiniKpi({
  label,
  value,
  helper,
  tone = "default",
}: {
  label: string;
  value: string;
  helper: string;
  tone?: MiniTone;
}) {
  const colour =
    tone === "good"
      ? "text-emerald-300"
      : tone === "bad"
      ? "text-rose-300"
      : "text-slate-50";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-3 shadow-[0_16px_55px_rgba(0,0,0,0.7)]">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-sm md:text-base font-semibold ${colour}`}>
        {value}
      </p>
      <p className="mt-1 text-[11px] text-slate-400">{helper}</p>
    </div>
  );
}

function TagChip({
  icon: Icon,
  label,
}: {
  icon: typeof Globe2;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-slate-950/80 px-2.5 py-1 text-[10px] text-emerald-200">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function ChannelCard({
  channel,
  active,
}: {
  channel: ChannelPerformance;
  active: boolean;
}) {
  const ChangeIcon =
    channel.changeRating >= 0 ? ArrowUpRight : ArrowDownRight;
  const changeColour =
    channel.changeRating >= 0 ? "text-emerald-300" : "text-rose-300";

  const IconComponent =
    channel.id === "social"
      ? Instagram
      : channel.id === "google" || channel.id === "maps"
      ? Globe2
      : MessageCircle;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 border border-slate-700">
            <IconComponent className="h-3.5 w-3.5 text-slate-200" />
          </span>
          <p className="text-xs font-semibold text-slate-100">
            {channel.name}
          </p>
        </div>
        {active && (
          <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-200 border border-cyan-400/60">
            Focus
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <div>
          <p className="text-slate-400">Rating</p>
          <p className="text-slate-100">
            {channel.rating.toFixed(1)} / 5
          </p>
        </div>
        <div>
          <p className="text-slate-400">Sentiment</p>
          <p className="text-slate-100">
            {channel.sentiment} / 100
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400">Trend</p>
          <p className={`${changeColour} inline-flex items-center gap-1`}>
            <ChangeIcon className="h-3 w-3" />
            {channel.changeRating >= 0 ? "+" : ""}
            {channel.changeRating.toFixed(1)}
          </p>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-1.5">
        {channel.mainTheme}
      </p>
    </div>
  );
}


function SegmentCard({ segment }: { segment: Segment }) {
  const tone =
    segment.sentiment >= 85
      ? "text-emerald-300"
      : segment.sentiment >= 75
      ? "text-cyan-300"
      : "text-amber-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-3 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] font-semibold">
            {segment.label
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-100">
              {segment.label}
            </p>
            <p className="text-[11px] text-slate-400">
              {segment.share}% of mentions, spend index {segment.spendIndex}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400">Sentiment</p>
          <p className={`text-xs font-semibold ${tone}`}>
            {segment.sentiment} / 100
          </p>
        </div>
      </div>
      <p className="text-[11px] text-slate-300">{segment.keyNeeds}</p>
      <p className="text-[11px] text-amber-300">
        Risk: {segment.keyRisk}
      </p>
    </div>
  );
}

function EmotionCard({ driver }: { driver: EmotionDriver }) {
  const riskTone =
    driver.risk >= 70
      ? "text-rose-300"
      : driver.risk >= 40
      ? "text-amber-300"
      : "text-emerald-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-100">
            {driver.label}
          </p>
          <p className="text-[11px] text-slate-400">
            Strength {driver.strength} / 100
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400">Risk</p>
          <p className={`text-xs font-semibold ${riskTone}`}>
            {driver.risk} / 100
          </p>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-slate-300">
        {driver.summary}
      </p>
      <p className="mt-1 text-[11px] text-cyan-300">
        ODYAN suggests: {driver.action}
      </p>
    </div>
  );
}

function EventRow({ event }: { event: ReputationEvent }) {
  const color =
    event.impact === "risk" ? "text-rose-300" : "text-emerald-300";
  const Icon = event.impact === "risk" ? AlertTriangle : ThumbsUp;

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-2">
      <div className="mt-1">
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="flex-1 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-400">
            {event.type}
          </p>
          <p className="text-[11px] text-slate-500">{event.time}</p>
        </div>
        <p className="text-xs md:text-sm text-slate-100">
          {event.text}
        </p>
      </div>
    </div>
  );
}

function OpportunityCard({ gap }: { gap: OpportunityGap }) {
  const tone =
    gap.priority === "high"
      ? "text-rose-300"
      : gap.priority === "medium"
      ? "text-amber-300"
      : "text-emerald-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-100">
          {gap.label}
        </p>
        <span className={`text-[11px] font-medium ${tone}`}>
          {gap.priority === "high"
            ? "High priority"
            : gap.priority === "medium"
            ? "Medium priority"
            : "Low priority"}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-slate-300">
        {gap.description}
      </p>
      <p className="mt-1 text-[11px] text-emerald-300">
        Estimated uplift: {gap.estimatedLift}
      </p>
    </div>
  );
}

function InfluencerRow({ influencer }: { influencer: Influencer }) {
  const toneColour =
    influencer.tone === "advocate"
      ? "text-emerald-300"
      : influencer.tone === "critical"
      ? "text-rose-300"
      : "text-slate-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-3 flex items-start gap-3">
      <div className="h-7 w-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[11px] font-semibold">
        {influencer.handle.replace("@", "").slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 space-y-0.5 text-[11px] md:text-xs">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-slate-100">
            {influencer.handle}
          </p>
          <p className={toneColour}>
            {influencer.tone === "advocate"
              ? "Advocate"
              : influencer.tone === "critical"
              ? "Critical voice"
              : "Neutral"}
          </p>
        </div>
        <p className="text-slate-400">
          {influencer.platform} · {influencer.followers} followers ·{" "}
          {influencer.posts} recent posts
        </p>
        <p className="text-slate-300">{influencer.note}</p>
      </div>
    </div>
  );
}

function TopMoveRow({ move }: { move: TopMove }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-3 text-xs md:text-sm flex gap-3 items-start">
      <div className="mt-1">
        <ArrowRight className="h-4 w-4 text-emerald-300" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-slate-100">{move.title}</p>
          <span className="rounded-full bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
            {move.horizon}
          </span>
        </div>
        <p className="text-[11px] text-slate-300">
          {move.description}
        </p>
        <p className="text-[11px] text-emerald-300">
          Impact: {move.impactRating} · {move.impactRevenue}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="h-full rounded-2xl border border-slate-800 bg-slate-950/95 px-3 py-3 shadow-[0_16px_55px_rgba(0,0,0,0.7)] hover:border-cyan-400/70 hover:bg-slate-900/95 transition">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="font-medium text-slate-100">{title}</p>
          <span className="text-xs text-cyan-300 group-hover:translate-x-0.5 transition">
            →
          </span>
        </div>
        <p className="text-[10px] text-slate-400">{subtitle}</p>
      </div>
    </Link>
  );
}
