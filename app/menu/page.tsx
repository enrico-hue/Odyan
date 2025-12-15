"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  UtensilsCrossed,
  BrainCircuit,
  BarChart3,
  LineChart,
  Sparkles,
  Filter,
  Search,
  FileText,
  FileSpreadsheet,
  FileInput,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  Wand2,
  ChefHat,
  Beaker,
  Gauge,
  ListChecks,
  Activity,
  ArrowUpRight,
  Settings2,
  Info,
  Target,
  TrendingUp,
  Lightbulb,
  Layers,
  CalendarClock,
  Globe2,
  Factory,
  Scale,
} from "lucide-react";

/* TYPES */

type Channel = "dineIn" | "delivery" | "clickCollect";

type RecipeStatus = "confirmed" | "aiDraft" | "missing";

type Confidence = "high" | "medium" | "low";

type MenuConfig = {
  id: string;
  name: string;
  itemsCount: number;
  coveragePercent: number;
};

type Venue = {
  id: string;
  name: string;
  city: string;
  brand: string;
};

type Dish = {
  id: string;
  name: string;
  section: string;
  channels: Channel[];
  coversPerWeek: number;
  gpPercent: number;
  gpTarget: number;
  status: RecipeStatus;
  confidence: Confidence;
  hero: boolean;
};

type DishDetail = {
  id: string;
  plateCost: number;
  dineInPrice: number;
  dineInGp: number;
  recordedGp: number;
  deliveryGp: number;
  keySkus: {
    name: string;
    supplier: string;
    unitDescription: string;
    cost: number;
    shareOfCostPercent: number;
    confidencePercent: number;
  }[];
};

type CoverageSummary = {
  menuItems: number;
  confirmed: number;
  aiDraft: number;
  missing: number;
};

type FileStatus = "applied" | "needsReview" | "learning";

type RecipeFile = {
  id: string;
  name: string;
  type: "Excel" | "CSV" | "PDF";
  rows: number;
  templateLabel: string;
  lastUsed: string;
  status: FileStatus;
  columnMappingScore: number;
  ingredientMatchScore: number;
};

type TemplateProfile = {
  id: string;
  name: string;
  source: string;
  status: FileStatus;
  lastUsed: string;
  columnMappingScore: number;
  ingredientMatchScore: number;
};

type PrepItem = {
  id: string;
  name: string;
  category: string;
  yieldKg: number;
  shrinkPercent: number;
  usedInDishes: number;
  coreSkus: string[];
};

type CoachInsight = {
  id: string;
  title: string;
  body: string;
};

type RecipeStatusFilter = "any" | "confirmed" | "aiDraft" | "missing";

/* Hero 1 - Menu Playbook Engine */

type PlaybookMove = {
  id: string;
  title: string;
  area: "pricing" | "complexity" | "waste" | "mix" | "supplier";
  impactMoneyPerMonth: number;
  impactGpPoints: number;
  effortLevel: "low" | "medium" | "high";
  riskLevel: "low" | "medium" | "high";
  summary: string;
  linkedDishes: string[];
};

/* Hero 2 - Full Menu Simulation Engine */

type SimulationScenario = "normal" | "busySaturday" | "shortStaffed" | "deliveryHeavy";

type SimulationActionCategory =
  | "price"
  | "portion"
  | "visibility"
  | "supplier"
  | "waste"
  | "rd";

type SimulationAction = {
  id: string;
  label: string;
  category: SimulationActionCategory;
  description: string;
  active: boolean;
};

/* Hero 3 - Automated Menu Architect */

type MenuArchitectureProposal = {
  id: string;
  headline: string;
  gpDeltaPoints: number;
  profitDeltaPerMonth: number;
  complexityDeltaPercent: number;
  labourDeltaPercent: number;
  summary: string;
  sections: {
    name: string;
    currentItems: number;
    proposedItems: number;
    comment: string;
  }[];
};

/* AI R&D Portfolio summary */

type RdPortfolioSummary = {
  activeIdeas: number;
  safeBoosters: number;
  braveBets: number;
  avgExpectedGpDelta: number;
};

/* Group Upside Radar summary */

type GroupUpsideSummary = {
  potentialPerMonth: number;
  venuesBehindCount: number;
  bestPracticeVenueName: string;
};

/* Supplier Arbitrage Brain summary */

type SupplierArbitrageSummary = {
  monthlySavingPotential: number;
  skusFlagged: number;
  categoriesImpacted: string[];
};

/* MOCK DATA */

const menus: MenuConfig[] = [
  {
    id: "menu-core-all-day",
    name: "Core all day menu (32 items)",
    itemsCount: 32,
    coveragePercent: 83,
  },
  {
    id: "menu-breakfast",
    name: "Breakfast and brunch (18 items)",
    itemsCount: 18,
    coveragePercent: 71,
  },
  {
    id: "menu-delivery",
    name: "Delivery only menu (24 items)",
    itemsCount: 24,
    coveragePercent: 65,
  },
];

const venues: Venue[] = [
  {
    id: "venue-elan-hans",
    name: "EL&N Hans Crescent",
    city: "London",
    brand: "EL&N",
  },
  {
    id: "venue-elan-oxford",
    name: "EL&N Oxford Circus",
    city: "London",
    brand: "EL&N",
  },
  {
    id: "venue-elan-dubai",
    name: "EL&N Dubai Mall",
    city: "Dubai",
    brand: "EL&N",
  },
];

const coverageSummary: CoverageSummary = {
  menuItems: 32,
  confirmed: 13,
  aiDraft: 10,
  missing: 9,
};

const coverageRadarData = [
  {
    section: "Brunch",
    confirmed: 64,
    aiDrafts: 22,
    missing: 14,
  },
  {
    section: "Grill",
    confirmed: 78,
    aiDrafts: 18,
    missing: 4,
  },
  {
    section: "Dessert",
    confirmed: 39,
    aiDrafts: 33,
    missing: 28,
  },
  {
    section: "Tea & drinks",
    confirmed: 91,
    aiDrafts: 7,
    missing: 2,
  },
];

const gpByChannelData = [
  {
    dish: "Burrata toast",
    dineIn: 68,
    delivery: 64,
    clickCollect: 66,
  },
  {
    dish: "Avocado crush",
    dineIn: 67,
    delivery: 62,
    clickCollect: 65,
  },
  {
    dish: "Steak & eggs",
    dineIn: 61,
    delivery: 59,
    clickCollect: 60,
  },
  {
    dish: "Iced Spanish Latte",
    dineIn: 73,
    delivery: 72,
    clickCollect: 71,
  },
];

const dishes: Dish[] = [
  {
    id: "dish-steak-eggs",
    name: "Striploin Steak & Eggs",
    section: "Grill",
    channels: ["dineIn"],
    coversPerWeek: 96,
    gpPercent: 61,
    gpTarget: 65,
    status: "confirmed",
    confidence: "high",
    hero: true,
  },
  {
    id: "dish-berry-pancakes",
    name: "Berry Blast Pancakes",
    section: "Dessert",
    channels: ["dineIn", "delivery"],
    coversPerWeek: 128,
    gpPercent: 69,
    gpTarget: 72,
    status: "aiDraft",
    confidence: "medium",
    hero: false,
  },
  {
    id: "dish-burrata-toast",
    name: "EL&N Signature Burrata Toast",
    section: "Brunch",
    channels: ["dineIn", "delivery"],
    coversPerWeek: 420,
    gpPercent: 68,
    gpTarget: 70,
    status: "confirmed",
    confidence: "high",
    hero: true,
  },
  {
    id: "dish-avocado-crush",
    name: "Avocado Crush Sourdough",
    section: "Brunch",
    channels: ["dineIn"],
    coversPerWeek: 385,
    gpPercent: 66,
    gpTarget: 68,
    status: "aiDraft",
    confidence: "medium",
    hero: false,
  },
  {
    id: "dish-iced-spanish-latte",
    name: "Iced Spanish Latte",
    section: "Tea & drinks",
    channels: ["dineIn", "delivery", "clickCollect"],
    coversPerWeek: 610,
    gpPercent: 73,
    gpTarget: 72,
    status: "confirmed",
    confidence: "high",
    hero: true,
  },
];

const dishDetails: DishDetail[] = [
  {
    id: "dish-burrata-toast",
    plateCost: 3.13,
    dineInPrice: 13.5,
    dineInGp: 76.8,
    recordedGp: 68,
    deliveryGp: 74.1,
    keySkus: [
      {
        name: "Burrata 125 g",
        supplier: "Elysian Dairy",
        unitDescription: "125 g portion",
        cost: 1.32,
        shareOfCostPercent: 42,
        confidencePercent: 97,
      },
      {
        name: "Brunch sourdough slice",
        supplier: "Central Dry Store",
        unitDescription: "1 thick slice",
        cost: 0.64,
        shareOfCostPercent: 16,
        confidencePercent: 97,
      },
      {
        name: "Tomato heritage mix",
        supplier: "FreshPoint Produce",
        unitDescription: "80 g garnish",
        cost: 0.54,
        shareOfCostPercent: 14,
        confidencePercent: 94,
      },
    ],
  },
  {
    id: "dish-steak-eggs",
    plateCost: 6.82,
    dineInPrice: 24.0,
    dineInGp: 71.6,
    recordedGp: 61,
    deliveryGp: 0,
    keySkus: [
      {
        name: "Beef striploin 2.5 kg",
        supplier: "Prime Meats",
        unitDescription: "250 g portion",
        cost: 3.9,
        shareOfCostPercent: 57,
        confidencePercent: 92,
      },
      {
        name: "Free range eggs",
        supplier: "Elysian Dairy",
        unitDescription: "2 eggs",
        cost: 0.48,
        shareOfCostPercent: 7,
        confidencePercent: 96,
      },
    ],
  },
];

const recipeFiles: RecipeFile[] = [
  {
    id: "file-kitchencut",
    name: "KitchenCut_Export_Feb.xlsx",
    type: "Excel",
    rows: 212,
    templateLabel: "KitchenCut v3.4 export",
    lastUsed: "Today · 09:42",
    status: "applied",
    columnMappingScore: 99,
    ingredientMatchScore: 94,
  },
  {
    id: "file-bistro",
    name: "Central_Bistro360_Recipes.csv",
    type: "CSV",
    rows: 147,
    templateLabel: "Central Bistro360 recipes",
    lastUsed: "Yesterday · 17:08",
    status: "needsReview",
    columnMappingScore: 86,
    ingredientMatchScore: 78,
  },
  {
    id: "file-legacy",
    name: "Legacy_manual_sheet.xlsx",
    type: "Excel",
    rows: 89,
    templateLabel: "Manual Excel sheet",
    lastUsed: "3 days ago",
    status: "learning",
    columnMappingScore: 74,
    ingredientMatchScore: 0,
  },
];

const templateProfiles: TemplateProfile[] = [
  {
    id: "profile-bistro",
    name: "Central Bistro360 recipes",
    source: "Bistro360 · CSV",
    status: "needsReview",
    lastUsed: "Yesterday · 17:08",
    columnMappingScore: 86,
    ingredientMatchScore: 79,
  },
  {
    id: "profile-legacy",
    name: "Legacy Excel manual sheet",
    source: "Manual import · Excel",
    status: "learning",
    lastUsed: "3 days ago",
    columnMappingScore: 74,
    ingredientMatchScore: 0,
  },
];

const prepItems: PrepItem[] = [
  {
    id: "prep-pesto",
    name: "EL&N basil pesto batch",
    category: "Sauces",
    yieldKg: 11.2,
    shrinkPercent: 14,
    usedInDishes: 9,
    coreSkus: ["Basil fresh", "Pine nuts", "Parmesan grated", "Olive oil"],
  },
  {
    id: "prep-demi",
    name: "House demi glace",
    category: "Sauces",
    yieldKg: 18.4,
    shrinkPercent: 27,
    usedInDishes: 5,
    coreSkus: ["Beef bones", "Onion", "Carrot", "Tomato paste"],
  },
];

const coachInsights: CoachInsight[] = [
  {
    id: "ci-coverage",
    title: "Coverage vs effort",
    body:
      "Most missing recipes live in Dessert and Brunch, but only a subset moves GP. Focusing on the top 12 dishes by GP risk would unlock a reliable view of menu GP without documenting the full long tail.",
  },
  {
    id: "ci-channel",
    title: "Channel pricing misalignment",
    body:
      "Burrata toast and Avocado crush show GP drops of 3 to 5 points on delivery compared with dine in, while Iced Spanish Latte holds margin across channels and can be pushed in high-margin bundles.",
  },
  {
    id: "ci-batches",
    title: "Batch recipes and waste",
    body:
      "House demi glace and basil pesto show shrink above benchmark. Standardising batch sizes and cooling procedures could recover around 1.3 GP points across Grill and Dessert combined.",
  },
];

/* Hero mock data */

const playbookMoves: PlaybookMove[] = [
  {
    id: "pb-1",
    title: "Lift brunch GP by £1.9k with 2 price moves",
    area: "pricing",
    impactMoneyPerMonth: 1900,
    impactGpPoints: 1.2,
    effortLevel: "low",
    riskLevel: "low",
    summary:
      "Increase Iced Spanish Latte and Burrata toast prices by £0.40 while staying inside the local competitor band.",
    linkedDishes: ["dish-iced-spanish-latte", "dish-burrata-toast"],
  },
  {
    id: "pb-2",
    title: "Simplify Steak & Eggs only on weekends",
    area: "complexity",
    impactMoneyPerMonth: 720,
    impactGpPoints: 0.6,
    effortLevel: "medium",
    riskLevel: "medium",
    summary:
      "Remove one garnish and standardise egg style on busy services to protect Grill ticket times and reduce waste.",
    linkedDishes: ["dish-steak-eggs"],
  },
  {
    id: "pb-3",
    title: "Shrink pesto batch size to cut shrink",
    area: "waste",
    impactMoneyPerMonth: 430,
    impactGpPoints: 0.3,
    effortLevel: "low",
    riskLevel: "low",
    summary:
      "Adjust basil pesto batch yields to better match forecast. Converts waste into GP without touching guest experience.",
    linkedDishes: [],
  },
];

const simulationActionsBase: SimulationAction[] = [
  {
    id: "sim-1",
    label: "Increase coffee prices by £0.30",
    category: "price",
    description: "Applies to all hot and iced coffees except basic espresso.",
    active: true,
  },
  {
    id: "sim-2",
    label: "Remove 1 complex brunch dish on delivery",
    category: "visibility",
    description:
      "Hide lowest-margin complex brunch dish from delivery-only channels on weekends.",
    active: false,
  },
  {
    id: "sim-3",
    label: "Reduce steak portion by 10 g",
    category: "portion",
    description:
      "Small reduction in steak portion with no visible plate impact on most crockery.",
    active: false,
  },
  {
    id: "sim-4",
    label: "Switch dairy supplier for burrata",
    category: "supplier",
    description:
      "Move 60 percent of burrata volume to an alternative supplier with better net price.",
    active: false,
  },
];

const architectProposal: MenuArchitectureProposal = {
  id: "arch-1",
  headline: "Lean brunch and stronger drinks-led profile for Q2",
  gpDeltaPoints: 2.1,
  profitDeltaPerMonth: 4100,
  complexityDeltaPercent: -19,
  labourDeltaPercent: -9,
  summary:
    "Reduce brunch SKUs, protect signature plates, and push high-margin drinks. Grill complexity drops while brand identity stays intact.",
  sections: [
    {
      name: "Brunch",
      currentItems: 13,
      proposedItems: 9,
      comment: "Remove 3 slow sellers and merge 1 variant into a flexible base.",
    },
    {
      name: "Grill",
      currentItems: 7,
      proposedItems: 6,
      comment: "Keep hero mains, simplify sides on peak days only.",
    },
    {
      name: "Dessert",
      currentItems: 6,
      proposedItems: 5,
      comment: "Protect 2 visual signatures, retire 1 low-mix heavy prep item.",
    },
    {
      name: "Tea & drinks",
      currentItems: 9,
      proposedItems: 11,
      comment: "Add 2 GP-positive iced drinks to support summer campaigns.",
    },
  ],
};

const rdPortfolioSummary: RdPortfolioSummary = {
  activeIdeas: 7,
  safeBoosters: 3,
  braveBets: 2,
  avgExpectedGpDelta: 1.4,
};

const groupUpsideSummary: GroupUpsideSummary = {
  potentialPerMonth: 5600,
  venuesBehindCount: 5,
  bestPracticeVenueName: "EL&N Oxford Circus",
};

const supplierArbitrageSummary: SupplierArbitrageSummary = {
  monthlySavingPotential: 2300,
  skusFlagged: 9,
  categoriesImpacted: ["Dairy", "Bakery", "Dry store"],
};

/* PAGE */

export default function MenuPage() {
  const [activeMenuId, setActiveMenuId] = useState<string>("menu-core-all-day");
  const [activeVenueId, setActiveVenueId] = useState<string>("venue-elan-hans");
  const [selectedDishId, setSelectedDishId] = useState<string>("dish-burrata-toast");
  const [statusFilter, setStatusFilter] = useState<RecipeStatusFilter>("any");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>("normal");
  const [simulationActions, setSimulationActions] =
    useState<SimulationAction[]>(simulationActionsBase);
  const [activePlaybookId, setActivePlaybookId] = useState<string>("pb-1");

  const activeMenu = menus.find((m) => m.id === activeMenuId)!;
  const activeVenue = venues.find((v) => v.id === activeVenueId)!;
  const selectedDishDetail = dishDetails.find((d) => d.id === selectedDishId);
  const activePlaybook = playbookMoves.find((m) => m.id === activePlaybookId) ?? playbookMoves[0];

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (statusFilter !== "any" && dish.status !== statusFilter) {
        return false;
      }
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        dish.name.toLowerCase().includes(term) ||
        dish.section.toLowerCase().includes(term)
      );
    });
  }, [statusFilter, searchTerm]);

  const confirmedPercent =
    (coverageSummary.confirmed / coverageSummary.menuItems) * 100;
  const aiDraftPercent =
    (coverageSummary.aiDraft / coverageSummary.menuItems) * 100;
  const missingPercent =
    (coverageSummary.missing / coverageSummary.menuItems) * 100;

  const activeActions = simulationActions.filter((a) => a.active);

  // Very simple mock combination result, just to show the idea
  const simulatedGpDelta = 1.8;
  const simulatedProfitDelta = 3650;
  const simulatedWasteDeltaKg = -18;
  const simulatedChannelNote =
    activeScenario === "busySaturday"
      ? "Focus on Grill simplicity and high-GP iced drinks."
      : activeScenario === "shortStaffed"
      ? "Fewer complex brunch dishes and batch sauces early."
      : activeScenario === "deliveryHeavy"
      ? "Delivery GP and packaging choices matter most today."
      : "Balanced view across dine in and drinks.";

  return (
    <div className="space-y-7 text-slate-100">
      {/* HEADER & HIGH LEVEL BAR */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Menu intelligence
          </p>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Menu overview and strategy brain
          </h1>
          <p className="text-sm lg:text-base text-slate-300 max-w-2xl">
            ODYAN ingests recipes, POS, suppliers and competitors to build a single menu brain.
            This page is where it turns that brain into concrete moves, simulations and menu design.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <HeaderKpi
            label="Menu items tracked"
            value={String(coverageSummary.menuItems)}
            helper="Across all venues and channels"
          />
          <HeaderKpi
            label="Confirmed recipes"
            value={`${coverageSummary.confirmed} (${confirmedPercent.toFixed(0)} percent)`}
            helper="Fully human reviewed"
            tone="good"
          />
          <HeaderKpi
            label="AI drafted"
            value={`${coverageSummary.aiDraft} (${aiDraftPercent.toFixed(0)} percent)`}
            helper="Need review when time allows"
            tone="info"
          />
          <HeaderKpi
            label="Missing recipes"
            value={`${coverageSummary.missing} (${missingPercent.toFixed(0)} percent)`}
            helper="Using estimates only"
            tone="warn"
          />
        </div>
      </header>

      {/* MENU AND VENUE SELECTION BAR */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <SelectPill icon={<UtensilsCrossed className="h-3.5 w-3.5" />} label="Active menu">
            <select
              value={activeMenuId}
              onChange={(e) => setActiveMenuId(e.target.value)}
              className="bg-transparent text-xs text-slate-100 outline-none"
            >
              {menus.map((m) => (
                <option
                  key={m.id}
                  value={m.id}
                  className="bg-slate-900 text-slate-100"
                >
                  {m.name}
                </option>
              ))}
            </select>
          </SelectPill>

          <SelectPill icon={<LayoutGridIcon />} label="Venue or brand">
            <select
              value={activeVenueId}
              onChange={(e) => setActiveVenueId(e.target.value)}
              className="bg-transparent text-xs text-slate-100 outline-none"
            >
              {venues.map((v) => (
                <option
                  key={v.id}
                  value={v.id}
                  className="bg-slate-900 text-slate-100"
                >
                  {v.name} · {v.city}
                </option>
              ))}
            </select>
          </SelectPill>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-100">
            <Gauge className="h-3.5 w-3.5" />
            <span>
              Coverage {activeMenu.coveragePercent} percent for this menu and venue
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/suppliers"
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition"
          >
            <BrainCircuit className="h-3.5 w-3.5" />
            Open SKU brain
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <Link
            href="/overview"
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Open GP forecast
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* TOP HERO STRIP: PLAYBOOK + HIGH LEVEL MONEY / RISK */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1.3fr)] gap-4">
        {/* HERO 1 - MENU PLAYBOOK ENGINE */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Hero 1 · Menu playbook engine
              </p>
              <h2 className="text-base font-semibold text-slate-50">
                Top moves for this month
              </h2>
              <p className="text-sm text-slate-300 max-w-xl">
                ODYAN looks across GP, complexity, waste and competitors and ranks the 3 to 5
                smartest moves you can make now. Each move shows money, risk and effort.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
                <Activity className="h-3 w-3 text-cyan-300" />
                Updated Today · 09:42
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <Target className="h-3.5 w-3.5" />
                Designed to lift profit without breaking service.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)] gap-4 mt-2">
            {/* Moves list */}
            <div className="space-y-2">
              {playbookMoves.map((move) => (
                <PlaybookMoveCard
                  key={move.id}
                  move={move}
                  active={move.id === activePlaybookId}
                  onSelect={() => setActivePlaybookId(move.id)}
                />
              ))}
              <p className="text-[11px] text-slate-400 mt-1">
                In production, this list is generated from your real data. You can accept,
                edit or push each move into the R&D planner, experiments or marketing calendar.
              </p>
            </div>

            {/* Active move detail */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Selected move detail
                  </p>
                  <p className="text-sm font-semibold text-slate-50">
                    {activePlaybook.title}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-emerald-300">
                    <TrendingUp className="h-3 w-3" />
                    Approx +£{activePlaybook.impactMoneyPerMonth.toLocaleString()} per month
                  </span>
                  <span className="inline-flex items-center gap-1 text-cyan-300">
                    <Scale className="h-3 w-3" />
                    Around +{activePlaybook.impactGpPoints.toFixed(1)} GP pts
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-slate-200">{activePlaybook.summary}</p>

              <div className="grid grid-cols-2 gap-3 text-[11px] mt-2">
                <MiniLabelValue
                  label="Effort"
                  value={labelFromEffort(activePlaybook.effortLevel)}
                />
                <MiniLabelValue
                  label="Risk"
                  value={labelFromRisk(activePlaybook.riskLevel)}
                />
                <MiniLabelValue
                  label="Area"
                  value={labelFromArea(activePlaybook.area)}
                />
                <MiniLabelValue
                  label="Linked dishes"
                  value={
                    activePlaybook.linkedDishes.length
                      ? `${activePlaybook.linkedDishes.length} key dishes`
                      : "Menu level"
                  }
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 mt-2 text-[11px]">
                <button className="inline-flex items-center gap-1 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-emerald-100 hover:bg-emerald-500/20 transition">
                  <Wand2 className="h-3.5 w-3.5" />
                  Send to R&D planner
                </button>
                <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition">
                  <LineChart className="h-3.5 w-3.5" />
                  Preview full impact
                </button>
                <span className="text-slate-400">
                  These will become real workflows for Exec Chefs and Heads of Food.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HIGH LEVEL MONEY / RISK / DATA */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Money, risk and data
          </p>

          <div className="space-y-3">
            <BigNumberRow
              icon={TrendingUp}
              label="Money on the table from current playbook"
              value="+£3,050 / month"
              helper="If you apply the top 3 moves only, at current volume."
            />
            <BigNumberRow
              icon={Activity}
              label="Operational risk on this menu"
              value="Moderate"
              helper="Two Grill heavy dishes and one complex brunch plate push weekend services."
            />
            <BigNumberRow
              icon={BrainCircuit}
              label="Data confidence for this menu"
              value="87 percent"
              helper="Recipes, invoices and competitor mapping are strong enough for decisions."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-800 text-[11px]">
            <MiniInlineCard
              icon={Lightbulb}
              title="Lifetime menu roadmap"
              body="ODYAN builds a quarter and year view of how this menu should evolve. The next cycle suggests a leaner brunch and stronger drinks profile."
            />
            <MiniInlineCard
              icon={CalendarClock}
              title="Next change window"
              body="Best window for changes: week of 15 April. Avoid Easter weekend and major local events."
            />
          </div>
        </motion.div>
      </section>
      {/* MID HERO STRIP: SIMULATION ENGINE + MENU ARCHITECT */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)] gap-4">
        {/* HERO 2 - FULL MENU SIMULATION ENGINE */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.85)] space-y-3 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Hero 2 · Full menu simulation
              </p>
              <h2 className="text-base font-semibold text-slate-50">
                Try scenarios and see total impact
              </h2>
              <p className="text-sm text-slate-300 max-w-xl">
                Stack price, portion, visibility and supplier changes, then see GP, profit, waste
                and channel impact for the whole menu. This is your financial twin.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
                <Layers className="h-3 w-3 text-cyan-300" />
                Scenario:{" "}
                <span className="text-slate-100">
                  {activeScenario === "normal"
                    ? "Normal week"
                    : activeScenario === "busySaturday"
                    ? "Busy Saturday brunch"
                    : activeScenario === "shortStaffed"
                    ? "Short staffed"
                    : "Delivery heavy day"}
                </span>
              </span>
              <span className="text-[10px] text-slate-500">
                In future, this will be powered by your real forecasts and traffic patterns.
              </span>
            </div>
          </div>

          {/* Scenario tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
            <ScenarioTab
              label="Normal week"
              active={activeScenario === "normal"}
              onClick={() => setActiveScenario("normal")}
            />
            <ScenarioTab
              label="Busy Saturday brunch"
              active={activeScenario === "busySaturday"}
              onClick={() => setActiveScenario("busySaturday")}
            />
            <ScenarioTab
              label="Short staffed"
              active={activeScenario === "shortStaffed"}
              onClick={() => setActiveScenario("shortStaffed")}
            />
            <ScenarioTab
              label="Delivery heavy day"
              active={activeScenario === "deliveryHeavy"}
              onClick={() => setActiveScenario("deliveryHeavy")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] gap-4 mt-3">
            {/* Actions list */}
            <div className="space-y-2">
              <p className="text-[11px] text-slate-400">
                Stack the moves you want to test. In the full product you will be able to add your
                own actions, change sliders and save scenarios.
              </p>
              <div className="space-y-2">
                {simulationActions.map((action) => (
                  <SimulationActionRow
                    key={action.id}
                    action={action}
                    onToggle={() =>
                      setSimulationActions((prev) =>
                        prev.map((a) =>
                          a.id === action.id ? { ...a, active: !a.active } : a
                        )
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Result summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Simulation result
                  </p>
                  <p className="text-sm font-semibold text-slate-50">
                    Combined effect of selected moves
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-emerald-300">
                    <TrendingUp className="h-3 w-3" />
                    Approx +£{simulatedProfitDelta.toLocaleString()} per month
                  </span>
                  <span className="inline-flex items-center gap-1 text-cyan-300">
                    <BarChart3 className="h-3 w-3" />
                    About +{simulatedGpDelta.toFixed(1)} menu GP points
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <MiniLabelValue
                  label="Waste movement"
                  value={`${simulatedWasteDeltaKg} kg per month`}
                />
                <MiniLabelValue
                  label="Active moves in this scenario"
                  value={activeActions.length ? String(activeActions.length) : "None"}
                />
                <MiniLabelValue
                  label="Channel focus"
                  value={
                    activeScenario === "deliveryHeavy"
                      ? "Delivery and packaging"
                      : activeScenario === "busySaturday"
                      ? "On site brunch and Grill"
                      : activeScenario === "shortStaffed"
                      ? "Lower complexity, safe GP"
                      : "Balanced estate view"
                  }
                />
                <MiniLabelValue
                  label="Confidence band"
                  value="Medium high (subject to data quality)"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-[11px] space-y-1.5">
                <p className="text-slate-300">{simulatedChannelNote}</p>
                <p className="text-slate-400">
                  In the live system this panel will show how the scenario affects prep, station
                  load and labour, not just GP and profit.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-1 rounded-full border border-cyan-500/70 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-100 hover:bg-cyan-500/20 transition">
                  <Sparkles className="h-3.5 w-3.5" />
                  Save as scenario for this menu
                </button>
                <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition">
                  <FileText className="h-3.5 w-3.5" />
                  Export scenario summary
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HERO 3 - AUTOMATED MENU ARCHITECT */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.85)] space-y-3 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Hero 3 · Automated menu architect
              </p>
              <h2 className="text-base font-semibold text-slate-50">
                Proposed architecture for this menu
              </h2>
              <p className="text-sm text-slate-300">
                ODYAN uses GP, mix, complexity, waste and competitors to propose a leaner, more
                profitable menu structure. You control what to accept.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <TrendingUp className="h-3 w-3" />
                About +£{architectProposal.profitDeltaPerMonth.toLocaleString()} per month
              </span>
              <span className="inline-flex items-center gap-1 text-cyan-300">
                <Activity className="h-3 w-3" />
                Complexity {architectProposal.complexityDeltaPercent} percent
              </span>
              <span className="inline-flex items-center gap-1 text-amber-300">
                <Factory className="h-3 w-3" />
                Labour {architectProposal.labourDeltaPercent} percent
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
            <p className="text-sm font-medium text-slate-50">
              {architectProposal.headline}
            </p>
            <p className="text-[13px] text-slate-200">
              {architectProposal.summary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[11px]">
              {architectProposal.sections.map((section) => (
                <div
                  key={section.name}
                  className="rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium text-slate-100">
                      {section.name}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {section.currentItems} →{" "}
                      <span className="text-cyan-300">
                        {section.proposedItems}
                      </span>{" "}
                      items
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {section.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] pt-2 border-t border-slate-800 mt-2">
            <button className="inline-flex items-center gap-1 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-emerald-100 hover:bg-emerald-500/20 transition">
              <ChefHat className="h-3.5 w-3.5" />
              Open in menu architect view
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition">
              <CalendarClock className="h-3.5 w-3.5" />
              Add to lifetime roadmap
            </button>
            <span className="text-slate-400">
              In production, this panel will sync with the dedicated architect and R and D pages.
            </span>
          </div>
        </motion.div>
      </section>

      {/* STRATEGIC SUMMARIES: R&D, GROUP UPSIDE, SUPPLIER ARBITRAGE */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 text-sm">
        {/* R&D PORTFOLIO SUMMARY */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.8)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                R and D portfolio snapshot
              </p>
              <h2 className="text-sm font-semibold text-slate-50">
                AI R and D manager at a glance
              </h2>
            </div>
            <Lightbulb className="h-4 w-4 text-amber-300" />
          </div>
          <p className="text-[13px] text-slate-300">
            How many ideas are live, how risky they are and what they could do to menu GP.
            The full R and D page will manage this portfolio in depth.
          </p>
          <div className="grid grid-cols-2 gap-3 text-[11px] mt-2">
            <MiniLabelValue
              label="Active ideas"
              value={String(rdPortfolioSummary.activeIdeas)}
            />
            <MiniLabelValue
              label="Safe boosters"
              value={String(rdPortfolioSummary.safeBoosters)}
            />
            <MiniLabelValue
              label="Brave bets"
              value={String(rdPortfolioSummary.braveBets)}
            />
            <MiniLabelValue
              label="Average GP upside"
              value={`+${rdPortfolioSummary.avgExpectedGpDelta.toFixed(1)} pts`}
            />
          </div>
          <button className="mt-3 inline-flex items-center gap-1 rounded-full border border-cyan-500/70 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-100 hover:bg-cyan-500/20 transition">
            <Beaker className="h-3.5 w-3.5" />
            Go to R and D planner
          </button>
        </motion.div>

        {/* GROUP UPSIDE RADAR SUMMARY */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.8)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.17 }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Group upside radar
              </p>
              <h2 className="text-sm font-semibold text-slate-50">
                Money still hidden across venues
              </h2>
            </div>
            <Globe2 className="h-4 w-4 text-cyan-300" />
          </div>
          <p className="text-[13px] text-slate-300">
            Compares venues inside the same country, merges menu and sentiment data and highlights
            proven changes that some venues have not yet adopted.
          </p>
          <div className="grid grid-cols-2 gap-3 text-[11px] mt-2">
            <MiniLabelValue
              label="Monthly upside if copied"
              value={`+£${groupUpsideSummary.potentialPerMonth.toLocaleString()}`}
            />
            <MiniLabelValue
              label="Venues behind in this country"
              value={String(groupUpsideSummary.venuesBehindCount)}
            />
            <MiniLabelValue
              label="Best practice example"
              value={groupUpsideSummary.bestPracticeVenueName}
            />
            <MiniLabelValue
              label="Reputation cross check"
              value="Pulls from reputation and reviews"
            />
          </div>
          <button className="mt-3 inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Open group view for this country
          </button>
        </motion.div>

        {/* SUPPLIER ARBITRAGE SUMMARY */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.8)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Supplier arbitrage
              </p>
              <h2 className="text-sm font-semibold text-slate-50">
                Smarter supplier moves for this menu
              </h2>
            </div>
            <Scale className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="text-[13px] text-slate-300">
            Looks at your key SKUs in this menu, compares suppliers and flags simple moves that
            reduce cost without touching guests.
          </p>
          <div className="grid grid-cols-2 gap-3 text-[11px] mt-2">
            <MiniLabelValue
              label="Monthly saving potential"
              value={`+£${supplierArbitrageSummary.monthlySavingPotential.toLocaleString()}`}
            />
            <MiniLabelValue
              label="SKUs flagged"
              value={String(supplierArbitrageSummary.skusFlagged)}
            />
            <MiniLabelValue
              label="Categories touched"
              value={supplierArbitrageSummary.categoriesImpacted.join(", ")}
            />
            <MiniLabelValue
              label="Link to suppliers"
              value="Open in procurement brain"
            />
          </div>
          <button className="mt-3 inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition">
            <BrainCircuit className="h-3.5 w-3.5" />
            View supplier suggestions
          </button>
        </motion.div>
      </section>

      {/* COVERAGE AND GP BY CHANNEL */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1.5fr)] gap-4">
        {/* RECIPE COVERAGE RADAR */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.23 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Recipe coverage radar
              </p>
              <p className="text-sm text-slate-300">
                Shows which sections are safe, which rely on AI drafts and where you still have
                blind spots on GP.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-[11px] text-slate-400">
              <span>Confirmed first. AI second. Estimates last.</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
                <Activity className="h-3 w-3 text-cyan-300" />
                Sync: Today · 09:42
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)] gap-3 items-center mt-1">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={coverageRadarData}>
                  <PolarGrid stroke="#1f2937" />
                  <PolarAngleAxis
                    dataKey="section"
                    tick={{ fill: "#cbd5f5", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1f2937",
                      fontSize: 11,
                    }}
                    labelStyle={{ color: "#e5e7eb" }}
                  />
                  <Radar
                    name="Confirmed"
                    dataKey="confirmed"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="AI drafts"
                    dataKey="aiDrafts"
                    stroke="#38bdf8"
                    fill="#38bdf8"
                    fillOpacity={0.25}
                  />
                  <Radar
                    name="Missing"
                    dataKey="missing"
                    stroke="#fb7185"
                    fill="#fb7185"
                    fillOpacity={0.25}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 text-[11px]">
              <MiniCoverageStat
                label="Menu items"
                value={String(coverageSummary.menuItems)}
                helper="All PLUs and channels"
              />
              <MiniCoverageStat
                label="Confirmed"
                value={`${coverageSummary.confirmed} (${confirmedPercent.toFixed(
                  0
                )} percent)`}
                helper="Solid GP view"
                tone="good"
              />
              <MiniCoverageStat
                label="AI drafted"
                value={`${coverageSummary.aiDraft} (${aiDraftPercent.toFixed(
                  0
                )} percent)`}
                helper="To review when time allows"
                tone="info"
              />
              <MiniCoverageStat
                label="Missing"
                value={`${coverageSummary.missing} (${missingPercent.toFixed(
                  0
                )} percent)`}
                helper="Using estimates only"
                tone="warn"
              />
              <p className="text-[11px] text-slate-300">
                Clicking sections in the full product will open filtered inbox views, so you can
                attack coverage in a way that actually moves GP.
              </p>
            </div>
          </div>
        </motion.div>

        {/* GP BY CHANNEL */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                GP by channel
              </p>
              <p className="text-sm text-slate-300">
                Compare dine in, delivery and click and collect for key dishes. ODYAN highlights
                pricing gaps that hurt margin.
              </p>
            </div>
            <Link
              href="/overview"
              className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
            >
              Open GP forecast
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gpByChannelData}
                margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="dish"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
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
                  dataKey="clickCollect"
                  stackId="gp"
                  radius={[0, 0, 0, 0]}
                  fill="#6366f1"
                  name="Click and collect"
                />
                <Bar
                  dataKey="delivery"
                  stackId="gp"
                  radius={[0, 0, 0, 0]}
                  fill="#22d3ee"
                  name="Delivery"
                />
                <Bar
                  dataKey="dineIn"
                  stackId="gp"
                  radius={[6, 6, 0, 0]}
                  fill="#22c55e"
                  name="Dine in"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <MiniCoverageStat
              label="Biggest delivery drop"
              value="Burrata toast"
              helper="GP down 4 points on delivery"
              tone="warn"
            />
            <MiniCoverageStat
              label="Most stable across channels"
              value="Iced Spanish Latte"
              helper="Strong GP in all channels"
              tone="good"
            />
          </div>
        </motion.div>
      </section>
      {/* RECIPE REVIEW + DISH DETAIL */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)] gap-4">
        {/* RECIPE REVIEW INBOX */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.85)] space-y-3 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.29 }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Recipe review inbox
              </p>
              <p className="text-sm text-slate-300">
                ODYAN sorts dishes by impact and confidence so you always know what to fix first.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-[10px] text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition">
                <Filter className="h-3 w-3" />
                Filters
              </button>
              <span className="text-[10px] text-slate-400">
                Any confidence
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <Info className="h-3 w-3" />
              Sorted by GP impact first, then confidence.
            </div>
            <div className="flex items-center gap-2">
              <StatusFilterPill
                label="All"
                active={statusFilter === "any"}
                onClick={() => setStatusFilter("any")}
              />
              <StatusFilterPill
                label="Confirmed"
                status="confirmed"
                active={statusFilter === "confirmed"}
                onClick={() => setStatusFilter("confirmed")}
              />
              <StatusFilterPill
                label="AI drafted"
                status="aiDraft"
                active={statusFilter === "aiDraft"}
                onClick={() => setStatusFilter("aiDraft")}
              />
              <StatusFilterPill
                label="Missing"
                status="missing"
                active={statusFilter === "missing"}
                onClick={() => setStatusFilter("missing")}
              />
            </div>
          </div>

          <div className="relative mt-2">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
          </div>

          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
            {filteredDishes.map((dish) => (
              <DishRow
                key={dish.id}
                dish={dish}
                selected={dish.id === selectedDishId}
                onSelect={() => setSelectedDishId(dish.id)}
              />
            ))}
          </div>

          <p className="mt-2 text-[10px] text-slate-500">
            The full version supports bulk approvals, version history, allergen tracking and
            push-to-venue workflows.
          </p>
        </motion.div>

        {/* DISH DETAIL */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.85)] space-y-3 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.33 }}
        >
          <DishDetailPanel
            dish={dishes.find((d) => d.id === selectedDishId)!}
            detail={selectedDishDetail ?? null}
          />
        </motion.div>
      </section>

      {/* INGESTION + PREP + COACH */}
      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)] gap-4">
        {/* INGESTION WIZARD + TEMPLATES */}
        <div className="space-y-4">
          {/* INGESTION */}
          <motion.div
            className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-3 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.36 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Recipe ingestion wizard
                </p>
                <p className="text-sm text-slate-300">
                  Drag and drop recipe books or connect ERP. ODYAN classifies, learns and maps
                  automatically.
                </p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-full border border-cyan-400/70 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-100 hover:bg-cyan-500/20 transition">
                <UploadCloud className="h-3.5 w-3.5" />
                Upload
              </button>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/80 px-3 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-2">
                <FileInput className="h-4 w-4 text-cyan-300 mt-[2px]" />
                <div className="space-y-0.5 text-[11px]">
                  <p className="text-slate-200">
                    Drop files here or connect via ERP / SFTP.
                  </p>
                  <p className="text-slate-400">
                    ODYAN routes recipes, production sheets and menu exports to correct pipelines.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Wand2 className="h-3 w-3 text-emerald-300" /> Continuous learning per customer
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
              {recipeFiles.map((file) => (
                <RecipeFileCard key={file.id} file={file} />
              ))}
            </div>
          </motion.div>

          {/* TEMPLATE PROFILES */}
          <motion.div
            className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-3 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.39 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Template profiles
                </p>
                <p className="text-sm text-slate-300">
                  ODYAN recognises formats you upload and becomes faster every time.
                </p>
              </div>
              <Settings2 className="h-4 w-4 text-slate-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {templateProfiles.map((profile) => (
                <TemplateProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* PREP ITEMS + COACH */}
        <div className="space-y-4">
          {/* PREP ITEMS */}
          <motion.div
            className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-3 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.42 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Prep items and batches
                </p>
                <p className="text-sm text-slate-300">
                  Yields, shrink and multi-dish impact. These items carry hidden GP.
                </p>
              </div>
              <Link
                href="/product-universe"
                className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition"
              >
                <Beaker className="h-3 w-3" />
                Open product view
              </Link>
            </div>

            <div className="space-y-2">
              {prepItems.map((item) => (
                <PrepItemCard key={item.id} item={item} />
              ))}
            </div>
          </motion.div>

          {/* AI MENU COACH */}
          <motion.div
            className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-4 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  AI menu coach
                </p>
                <p className="text-sm text-slate-300">
                  Narrative summary of what matters this week: where to focus, what to fix, what to
                  protect.
                </p>
              </div>
              <Sparkles className="h-4 w-4 text-emerald-300" />
            </div>

            <div className="space-y-2">
              {coachInsights.map((insight) => (
                <CoachInsightCard key={insight.id} insight={insight} />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)] gap-3 pt-2 border-t border-slate-800">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-1.5 text-[11px]">
                <p className="uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
                  Account and confidence
                </p>
                <p className="text-slate-300">Account: Demo group · {activeVenue.brand} mock.</p>
                <p className="text-slate-400">
                  Data confidence: 87 percent based on recipes, invoices and mapping so far.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 text-[11px] space-y-2">
                <p className="uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
                  Ask ODYAN
                </p>
                <p className="text-slate-300">
                  In the real product you will ask natural questions and get direct answers linked
                  to the entire system.
                </p>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex gap-2">
                    <Circle className="h-2 w-2 mt-1 text-cyan-300" />
                    Which 10 dishes should we fix first to reduce GP volatility?
                  </li>
                  <li className="flex gap-2">
                    <Circle className="h-2 w-2 mt-1 text-cyan-300" />
                    How do I lift brunch GP by 2 points without hurting service?
                  </li>
                  <li className="flex gap-2">
                    <Circle className="h-2 w-2 mt-1 text-cyan-300" />
                    If dairy prices rise 3 percent, which venues get hit hardest?
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

/* SMALL COMPONENTS ========================================================= */

function BigNumberRow({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: any;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-slate-50">{value}</p>
        <p className="text-[11px] text-slate-400">{helper}</p>
      </div>
      <Icon className="h-5 w-5 text-cyan-300" />
    </div>
  );
}

function MiniInlineCard({
  icon: Icon,
  title,
  body,
}: {
  icon: any;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 flex items-start gap-3">
      <Icon className="h-4 w-4 text-cyan-300 mt-[2px]" />
      <div className="space-y-0.5">
        <p className="text-[11px] font-medium text-slate-100">{title}</p>
        <p className="text-[11px] text-slate-300">{body}</p>
      </div>
    </div>
  );
}

function MiniLabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-xs font-semibold text-cyan-300">{value}</p>
    </div>
  );
}

function ScenarioTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-[11px] transition ${
        active
          ? "border-cyan-400 bg-cyan-500/10 text-cyan-100"
          : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
      }`}
    >
      {label}
    </button>
  );
}

function PlaybookMoveCard({
  move,
  active,
  onSelect,
}: {
  move: any;
  active: boolean;
  onSelect: () => void;
}) {
  const colour =
    move.area === "pricing"
      ? "text-emerald-300"
      : move.area === "complexity"
      ? "text-amber-300"
      : move.area === "waste"
      ? "text-rose-300"
      : move.area === "supplier"
      ? "text-cyan-300"
      : "text-sky-300";

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border px-3 py-2.5 transition ${
        active
          ? "border-cyan-400 bg-slate-900"
          : "border-slate-800 bg-slate-950 hover:border-slate-600"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-50">{move.title}</p>
          <p className={`text-[11px] ${colour} capitalize`}>
            {move.area} · ~£{move.impactMoneyPerMonth.toLocaleString()} per month
          </p>
        </div>
      </div>
    </button>
  );
}

function SimulationActionRow({
  action,
  onToggle,
}: {
  action: any;
  onToggle: () => void;
}) {
  const colour =
    action.category === "price"
      ? "text-emerald-300"
      : action.category === "portion"
      ? "text-amber-300"
      : action.category === "visibility"
      ? "text-sky-300"
      : action.category === "supplier"
      ? "text-cyan-300"
      : "text-rose-300";

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-2 flex items-start justify-between gap-3 cursor-pointer hover:border-cyan-400 transition"
      onClick={onToggle}
    >
      <div className="space-y-0.5">
        <p className="text-[11px] text-slate-100">{action.label}</p>
        <p className="text-[10px] text-slate-400">{action.description}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-[11px] ${colour} capitalize`}>{action.category}</span>
        <span
          className={`flex h-3 w-3 rounded-full border ${
            action.active
              ? "bg-cyan-300 border-cyan-400"
              : "bg-slate-800 border-slate-700"
          }`}
        />
      </div>
    </div>
  );
}

function HeaderKpi({
  label,
  value,
  helper,
  tone = "default",
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "default" | "good" | "info" | "warn";
}) {
  const colour =
    tone === "good"
      ? "text-emerald-300"
      : tone === "info"
      ? "text-cyan-300"
      : tone === "warn"
      ? "text-amber-300"
      : "text-slate-200";

  const Icon =
    tone === "good"
      ? CheckCircle2
      : tone === "info"
      ? Sparkles
      : tone === "warn"
      ? AlertTriangle
      : Activity;

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950/90 px-3 py-2 shadow-[0_16px_55px_rgba(0,0,0,0.7)]">
      <div className="h-7 w-7 rounded-2xl bg-slate-900 flex items-center justify-center">
        <Icon className={`h-3.5 w-3.5 ${colour}`} />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-50">{value}</p>
        <p className={`text-[10px] ${colour}`}>{helper}</p>
      </div>
    </div>
  );
}

function SelectPill({
  icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children?: any;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
      <span className="text-slate-300 flex items-center gap-1 text-[11px]">
        <span className="text-slate-400">{icon}</span>
        {label}
      </span>
      <ChevronDown className="h-3 w-3 text-slate-500" />
      {children}
    </div>
  );
}

function LayoutGridIcon() {
  return (
    <div className="grid grid-cols-2 gap-[2px]">
      <span className="h-2 w-2 rounded-sm bg-slate-300" />
      <span className="h-2 w-2 rounded-sm bg-slate-500" />
      <span className="h-2 w-2 rounded-sm bg-slate-500" />
      <span className="h-2 w-2 rounded-sm bg-slate-700" />
    </div>
  );
}

function MiniCoverageStat({
  label,
  value,
  helper,
  tone = "default",
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "default" | "good" | "info" | "warn";
}) {
  const colour =
    tone === "good"
      ? "text-emerald-300"
      : tone === "info"
      ? "text-cyan-300"
      : tone === "warn"
      ? "text-amber-300"
      : "text-slate-50";

  return (
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`text-xs font-semibold ${colour}`}>{value}</p>
      <p className="text-[10px] text-slate-400">{helper}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "confirmed" | "aiDraft" | "missing" }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100">
        <CheckCircle2 className="h-3 w-3" />
        Confirmed
      </span>
    );
  }
  if (status === "aiDraft") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/60 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-100">
        <Sparkles className="h-3 w-3" />
        AI draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100">
      <AlertTriangle className="h-3 w-3" />
      Missing
    </span>
  );
}

function ConfidenceTag({ confidence }: { confidence: "high" | "medium" | "low" }) {
  const label =
    confidence === "high"
      ? "High"
      : confidence === "medium"
      ? "Medium"
      : "Low";

  const colour =
    confidence === "high"
      ? "text-emerald-300"
      : confidence === "medium"
      ? "text-amber-300"
      : "text-rose-300";

  return <span className={`text-[10px] ${colour}`}>{label} confidence</span>;
}

type MenuChannel = "dineIn" | "delivery" | "clickCollect";

function ChannelBadges({ channels }: { channels: MenuChannel[] }) {
  const map: Record<MenuChannel, string> = {
    dineIn: "Dine in",
    delivery: "Delivery",
    clickCollect: "Click & collect",
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {channels.map((ch: MenuChannel) => (
        <span
          key={ch}
          className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] text-slate-300"
        >
          {map[ch]}
        </span>
      ))}
    </div>
  );
}

function DishRow({
  dish,
  selected,
  onSelect,
}: {
  dish: any;
  selected: boolean;
  onSelect: () => void;
}) {
  const delta = dish.gpPercent - dish.gpTarget;
  const deltaColour = delta >= 0 ? "text-emerald-300" : "text-amber-300";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border px-3 py-2.5 transition-colors ${
        selected
          ? "border-cyan-400 bg-slate-900"
          : "border-slate-800 bg-slate-950 hover:border-slate-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-50">{dish.name}</p>
            {dish.hero && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-[2px] text-[10px] text-rose-200">
                <ChefHat className="h-3 w-3" />
                Hero
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {dish.section} · {dish.coversPerWeek} / week
          </p>
          <p className="text-[11px] text-slate-300">
            GP {dish.gpPercent} · Target {dish.gpTarget}{" "}
            <span className={deltaColour}>
              ({delta >= 0 ? "+" : ""}
              {delta.toFixed(1)} pts)
            </span>
          </p>
          <ChannelBadges channels={dish.channels as MenuChannel[]} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusPill status={dish.status} />
          <ConfidenceTag confidence={dish.confidence} />
        </div>
      </div>
    </button>
  );
}

function StatusFilterPill({
  label,
  active,
  status,
  onClick,
}: {
  label: string;
  active: boolean;
  status?: "confirmed" | "aiDraft" | "missing";
  onClick: () => void;
}) {
  const activeClasses = "border-cyan-400 bg-cyan-500/10 text-cyan-100";
  const inactiveClasses = "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] transition ${
        active ? activeClasses : inactiveClasses
      }`}
    >
      {label}
    </button>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder="Search dish or section"
        className="w-full rounded-full border border-slate-800 bg-slate-900/80 pl-7 pr-3 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400"
      />
    </div>
  );
}

function DishDetailPanel({
  dish,
  detail,
}: {
  dish: any;
  detail: any;
}) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            {dish.section} · {dish.coversPerWeek} covers / week
          </p>
          <h2 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
            {dish.name}
            {dish.hero && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-[2px] text-[10px] text-rose-200">
                <ChefHat className="h-3 w-3" />
                Hero dish
              </span>
            )}
          </h2>

          <p className="text-[11px] text-slate-400">
            Channels:{" "}
            {dish.channels
              .map((ch: MenuChannel) =>
                ch === "dineIn"
                  ? "dine in"
                  : ch === "delivery"
                  ? "delivery"
                  : "click & collect"
              )
              .join(", ")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <StatusPill status={dish.status} />
          <ConfidenceTag confidence={dish.confidence} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 text-[11px]">
        <MiniCoverageStat
          label="Plate cost"
          value={detail ? `£${detail.plateCost.toFixed(2)}` : "No data"}
          helper="Recipe & yields"
        />
        <MiniCoverageStat
          label="Price"
          value={detail ? `£${detail.dineInPrice.toFixed(2)}` : "No data"}
          helper="On-site price"
        />
        <MiniCoverageStat
          label="GP estimate"
          value={detail ? `${detail.dineInGp.toFixed(1)} percent` : "-"}
          helper={
            detail
              ? `Recorded: ${detail.recordedGp.toFixed(1)} percent`
              : "Recorded GP missing"
          }
        />
        <MiniCoverageStat
          label="Delivery GP"
          value={detail ? `${detail.deliveryGp.toFixed(1)} percent` : "-"}
          helper="Includes platform fees"
        />
      </div>

      {/* Cost breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
          <ListChecks className="h-3.5 w-3.5 text-emerald-300" />
          Cost breakdown
        </p>
        <p className="text-[11px] text-slate-300">
          Biggest cost drivers for the plate.
        </p>
        <div className="space-y-2">
          {detail ? (
            detail.keySkus.map((sku: any) => (
              <div
                key={sku.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
              >
                <div className="space-y-0.5">
                  <p className="text-[11px] text-slate-50">{sku.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {sku.supplier} · {sku.unitDescription}
                  </p>
                </div>
                <div className="text-right text-[10px] space-y-0.5">
                  <p className="text-slate-200">£{sku.cost.toFixed(2)}</p>
                  <p className="text-slate-400">
                    {sku.shareOfCostPercent} percent of cost
                  </p>
                  <p className="text-emerald-300">
                    {sku.confidencePercent} percent confidence
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[11px] text-slate-400">
              No breakdown yet. Upload or confirm recipe.
            </p>
          )}
        </div>
      </div>

      {/* Simulation sandbox (example only) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)] gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2 text-[11px]">
          <p className="uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
            <LineChart className="h-3.5 w-3.5 text-cyan-300" />
            Simulation sandbox (micro view)
          </p>
          <p className="text-slate-300">
            Test micro changes like price, portion and supplier shifts.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <SimulationTag>Lock GP, change price</SimulationTag>
            <SimulationTag>Hold price, swap SKUs</SimulationTag>
            <SimulationTag>Portion tuning</SimulationTag>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3 text-[10px]">
            <MockSliderLabel label="Price" value="£13.50 → £14.00" />
            <MockSliderLabel label="Burrata portion" value="100 percent → 90 percent" />
            <MockSliderLabel label="Supplier" value="Elysian → NewDairy" />
            <MockSliderLabel label="Delivery fee" value="Platform A → B" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 text-[11px] space-y-1.5">
          <p className="uppercase tracking-[0.18em] text-slate-400">
            Example output
          </p>
          <p className="text-slate-300">
            If dairy increases 3 percent, GP drops from 68 to 64 percent. Increasing price by £0.50
            protects margin.
          </p>
          <p className="text-slate-300">
            Switching suppliers recovers 0.18 plate cost and lifts GP to 69 percent.
          </p>
          <p className="text-[10px] text-slate-500">
            The full version connects with invoices and competitor pricing.
          </p>
        </div>
      </div>
    </div>
  );
}

/* More small components */

function SimulationTag({ children }: { children: any }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] text-slate-300">
      <Wand2 className="h-3 w-3 text-cyan-300" />
      {children}
    </span>
  );
}

function MockSliderLabel({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="h-1.5 w-full rounded-full bg-slate-800">
        <div className="h-1.5 w-2/3 rounded-full bg-cyan-400" />
      </div>
      <p className="text-[10px] text-slate-300">{value}</p>
    </div>
  );
}

function RecipeFileCard({ file }: { file: any }) {
  const IconComponent =
    file.type === "Excel"
      ? FileSpreadsheet
      : file.type === "CSV"
      ? FileText
      : FileInput;

  const statusLabel =
    file.status === "applied"
      ? "Applied"
      : file.status === "needsReview"
      ? "Needs review"
      : "Learning";

  const statusColour =
    file.status === "applied"
      ? "text-emerald-300 bg-emerald-500/10 border-emerald-400/60"
      : file.status === "needsReview"
      ? "text-amber-300 bg-amber-500/10 border-amber-400/60"
      : "text-cyan-300 bg-cyan-500/10 border-cyan-400/60";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-1.5 text-[11px]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconComponent className="h-3.5 w-3.5 text-cyan-300" />
          <p className="text-slate-100 truncate">{file.name}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[9px] ${statusColour}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-slate-400">Rows: {file.rows}</p>
      <p className="text-slate-400">Template: {file.templateLabel}</p>
      <p className="text-slate-300">
        Mapping: {file.columnMappingScore} percent · Ingredients:{" "}
        {file.ingredientMatchScore} percent
      </p>
      <button className="mt-1 inline-flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-200">
        View changes
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function TemplateProfileCard({ profile }: { profile: any }) {
  const statusLabel =
    profile.status === "needsReview"
      ? "Needs mapping"
      : profile.status === "learning"
      ? "Learning"
      : "Ready";

  const statusColour =
    profile.status === "needsReview"
      ? "text-amber-300 bg-amber-500/10 border-amber-400/60"
      : profile.status === "learning"
      ? "text-cyan-300 bg-cyan-500/10 border-cyan-400/60"
      : "text-emerald-300 bg-emerald-500/10 border-emerald-400/60";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-1.5 text-[11px]">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-slate-100">{profile.name}</p>
          <p className="text-slate-400">{profile.source}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-[9px] ${statusColour}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-slate-400">Last used: {profile.lastUsed}</p>
      <p className="text-slate-300">
        Mapping: {profile.columnMappingScore} percent · Ingredients:{" "}
        {profile.ingredientMatchScore} percent
      </p>
    </div>
  );
}

function PrepItemCard({ item }: { item: any }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 flex items-start justify-between gap-3 text-[11px]">
      <div className="space-y-1">
        <p className="text-slate-100">{item.name}</p>
        <p className="text-slate-400">
          {item.category} · Yield: {item.yieldKg.toFixed(1)} kg · Shrink:{" "}
          {item.shrinkPercent} percent
        </p>
        <p className="text-slate-400">Used in {item.usedInDishes} dishes</p>
        <p className="text-slate-300">Core SKUs: {item.coreSkus.join(", ")}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition">
          Tune batch
        </button>
        <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-slate-200 hover:border-emerald-400 hover:text-emerald-200 transition">
          See GP effect
        </button>
      </div>
    </div>
  );
}

function CoachInsightCard({ insight }: { insight: any }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-1.5 text-[11px]">
      <p className="font-medium text-slate-100">{insight.title}</p>
      <p className="text-slate-300">{insight.body}</p>
    </div>
  );
}

function labelFromEffort(e: "low" | "medium" | "high") {
  if (e === "low") return "Low";
  if (e === "medium") return "Medium";
  return "High";
}

function labelFromRisk(e: "low" | "medium" | "high") {
  if (e === "low") return "Low";
  if (e === "medium") return "Medium";
  return "High";
}

function labelFromArea(area: string) {
  return area.charAt(0).toUpperCase() + area.slice(1);
}

export {};
