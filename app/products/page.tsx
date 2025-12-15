"use client";

import type React from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Search,
  SlidersHorizontal,
  Brain,
  ArrowRight,
  Layers,
  LineChart as LineChartIcon,
  Factory,
  Forklift,
  Sparkles,
  Filter,
  Tag,
  Target,
  Info,
  Upload,
  FileSpreadsheet,
  PieChart,
  Clock,
} from "lucide-react";

/* =========================
   TYPES
   ========================= */

type PriceHistoryPoint = {
  day: string;
  price: number;
  bandLow: number;
  bandHigh: number;
};

type ProductCriticality = "low" | "medium" | "high";

type ProductRecord = {
  id: string;
  name: string;
  internalCode: string;
  supplierName: string;
  category: string;
  subcategory: string;
  packSize: string;
  unit: string;
  lastPrice: number;
  lastPriceChangePercent: number;
  bandStatus: "in_band" | "above_band" | "below_band";
  criticality: ProductCriticality;
  mapped: boolean;
  menuItemsCount: number;
  venuesCount: number;
  allergens: string[];
  countryOfOrigin: string;
  sustainabilityScore: number; // 0-100
  lastSeenOnInvoice: string;
};

type ProductUniverseStats = {
  totalSkus: number;
  mappedSkus: number;
  criticalSkus: number;
  unmappedSkus: number;
};

type MappingBacklogItem = {
  id: string;
  rawName: string;
  supplierName: string;
  suggestedCategory: string;
  suggestedInternalSku: string | null;
  confidencePercent: number;
};

type MappingRule = {
  id: string;
  pattern: string;
  targetCategory: string;
  notes: string;
};

type AlternativeProduct = {
  id: string;
  supplierName: string;
  name: string;
  lastPrice: number;
  priceDiffPercent: number;
  sustainabilityScore: number;
  matchQualityScore: number;
};

type AiInsightBlock = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

type RecipeCoverageStats = {
  totalMenuItems: number;
  confirmedRecipes: number;
  aiDraftRecipes: number;
  noRecipe: number;
  lastSyncSource: string;
  lastSyncTime: string;
};

type RecipeImportJobStatus = "processing" | "needs_review" | "applied";

type RecipeImportJob = {
  id: string;
  sourceName: string;
  fileType: "excel" | "pdf" | "csv" | "erp_export";
  detectedRows: number;
  templateName: string | null;
  status: RecipeImportJobStatus;
  columnMappingConfidence: number;
  ingredientMatchConfidence: number;
};

/* =========================
   MOCK DATA
   ========================= */

const universeStats: ProductUniverseStats = {
  totalSkus: 1243,
  mappedSkus: 1120,
  criticalSkus: 178,
  unmappedSkus: 123,
};

const mockProducts: ProductRecord[] = [
  {
    id: "p1",
    name: "Burrata 125 g",
    internalCode: "DAIRY_BURRATA_125",
    supplierName: "Elysian Dairy",
    category: "Dairy",
    subcategory: "Cheese",
    packSize: "8 x 125 g",
    unit: "kg",
    lastPrice: 11.4,
    lastPriceChangePercent: 7.9,
    bandStatus: "above_band",
    criticality: "high",
    mapped: true,
    menuItemsCount: 9,
    venuesCount: 5,
    allergens: ["Milk"],
    countryOfOrigin: "Italy",
    sustainabilityScore: 62,
    lastSeenOnInvoice: "2025-02-03",
  },
  {
    id: "p2",
    name: "Free-range eggs medium",
    internalCode: "EGG_MED_FREE",
    supplierName: "Elysian Dairy",
    category: "Eggs",
    subcategory: "Shell eggs",
    packSize: "6 x 30",
    unit: "each",
    lastPrice: 0.27,
    lastPriceChangePercent: 3.1,
    bandStatus: "in_band",
    criticality: "high",
    mapped: true,
    menuItemsCount: 21,
    venuesCount: 7,
    allergens: ["Egg"],
    countryOfOrigin: "UK",
    sustainabilityScore: 78,
    lastSeenOnInvoice: "2025-02-02",
  },
  {
    id: "p3",
    name: "Beef striploin 2.5 kg",
    internalCode: "MEAT_BEEF_STRIP_25",
    supplierName: "Prime Meats",
    category: "Meat",
    subcategory: "Beef",
    packSize: "2 x 2.5 kg",
    unit: "kg",
    lastPrice: 14.9,
    lastPriceChangePercent: 5.4,
    bandStatus: "above_band",
    criticality: "high",
    mapped: true,
    menuItemsCount: 6,
    venuesCount: 4,
    allergens: [],
    countryOfOrigin: "Ireland",
    sustainabilityScore: 48,
    lastSeenOnInvoice: "2025-02-01",
  },
  {
    id: "p4",
    name: "Avocado ripe and ready",
    internalCode: "PROD_AVOCADO_RTE",
    supplierName: "FreshPoint Produce",
    category: "Fruit and veg",
    subcategory: "Prepared veg",
    packSize: "6 kg",
    unit: "kg",
    lastPrice: 7.1,
    lastPriceChangePercent: -1.3,
    bandStatus: "in_band",
    criticality: "medium",
    mapped: true,
    menuItemsCount: 11,
    venuesCount: 5,
    allergens: [],
    countryOfOrigin: "Peru",
    sustainabilityScore: 55,
    lastSeenOnInvoice: "2025-02-04",
  },
  {
    id: "p5",
    name: "Brunch granola mix",
    internalCode: "DRY_GRANOLA_BRUNCH",
    supplierName: "Central Dry Store",
    category: "Dry and ambient",
    subcategory: "Cereals",
    packSize: "10 kg",
    unit: "kg",
    lastPrice: 3.45,
    lastPriceChangePercent: 0.0,
    bandStatus: "in_band",
    criticality: "medium",
    mapped: true,
    menuItemsCount: 4,
    venuesCount: 3,
    allergens: ["Gluten", "Nuts"],
    countryOfOrigin: "UK",
    sustainabilityScore: 71,
    lastSeenOnInvoice: "2025-02-01",
  },
  {
    id: "p6",
    name: "Mascarpone 2 kg",
    internalCode: "DAIRY_MASCARPONE_2",
    supplierName: "Elysian Dairy",
    category: "Dairy",
    subcategory: "Cheese",
    packSize: "6 x 2 kg",
    unit: "kg",
    lastPrice: 9.6,
    lastPriceChangePercent: 6.2,
    bandStatus: "above_band",
    criticality: "high",
    mapped: true,
    menuItemsCount: 5,
    venuesCount: 4,
    allergens: ["Milk"],
    countryOfOrigin: "Italy",
    sustainabilityScore: 60,
    lastSeenOnInvoice: "2025-02-03",
  },
  {
    id: "p7",
    name: "Frozen berries mix",
    internalCode: "FROZEN_BERRIES_MIX",
    supplierName: "FreshPoint Produce",
    category: "Frozen",
    subcategory: "Fruit",
    packSize: "5 x 2.5 kg",
    unit: "kg",
    lastPrice: 4.25,
    lastPriceChangePercent: 2.4,
    bandStatus: "in_band",
    criticality: "medium",
    mapped: true,
    menuItemsCount: 8,
    venuesCount: 6,
    allergens: [],
    countryOfOrigin: "Poland",
    sustainabilityScore: 69,
    lastSeenOnInvoice: "2025-02-02",
  },
  {
    id: "p8",
    name: "House blend espresso beans",
    internalCode: "COFFEE_HOUSE_BLEND",
    supplierName: "Central Dry Store",
    category: "Coffee and drinks",
    subcategory: "Coffee beans",
    packSize: "6 x 1 kg",
    unit: "kg",
    lastPrice: 8.75,
    lastPriceChangePercent: 1.2,
    bandStatus: "below_band",
    criticality: "high",
    mapped: true,
    menuItemsCount: 13,
    venuesCount: 7,
    allergens: [],
    countryOfOrigin: "Brazil / Colombia",
    sustainabilityScore: 82,
    lastSeenOnInvoice: "2025-02-04",
  },
  {
    id: "p9",
    name: "Organic oat drink barista",
    internalCode: "DRINK_OAT_BARISTA",
    supplierName: "Elysian Dairy",
    category: "Alternatives",
    subcategory: "Plant-based milk",
    packSize: "12 x 1 L",
    unit: "L",
    lastPrice: 1.45,
    lastPriceChangePercent: 4.3,
    bandStatus: "above_band",
    criticality: "medium",
    mapped: true,
    menuItemsCount: 10,
    venuesCount: 7,
    allergens: ["Oats (Gluten)"],
    countryOfOrigin: "Sweden",
    sustainabilityScore: 88,
    lastSeenOnInvoice: "2025-02-03",
  },
  {
    id: "p10",
    name: "Burrata 100 g (alt supplier)",
    internalCode: "DAIRY_BURRATA_100_B",
    supplierName: "NewDairy Co.",
    category: "Dairy",
    subcategory: "Cheese",
    packSize: "12 x 100 g",
    unit: "kg",
    lastPrice: 10.8,
    lastPriceChangePercent: 1.4,
    bandStatus: "in_band",
    criticality: "high",
    mapped: true,
    menuItemsCount: 0,
    venuesCount: 0,
    allergens: ["Milk"],
    countryOfOrigin: "Italy",
    sustainabilityScore: 64,
    lastSeenOnInvoice: "2025-01-29",
  },
];

const priceHistoryByProduct: Record<string, PriceHistoryPoint[]> = {
  p1: [
    { day: "Day 1", price: 10.8, bandLow: 10.2, bandHigh: 11.0 },
    { day: "2", price: 10.9, bandLow: 10.2, bandHigh: 11.0 },
    { day: "3", price: 10.9, bandLow: 10.2, bandHigh: 11.0 },
    { day: "4", price: 11.0, bandLow: 10.2, bandHigh: 11.1 },
    { day: "5", price: 11.1, bandLow: 10.3, bandHigh: 11.2 },
    { day: "6", price: 11.2, bandLow: 10.3, bandHigh: 11.3 },
    { day: "7", price: 11.4, bandLow: 10.3, bandHigh: 11.4 },
  ],
  p3: [
    { day: "Day 1", price: 13.8, bandLow: 13.0, bandHigh: 14.2 },
    { day: "2", price: 14.1, bandLow: 13.0, bandHigh: 14.2 },
    { day: "3", price: 14.2, bandLow: 13.1, bandHigh: 14.3 },
    { day: "4", price: 14.3, bandLow: 13.1, bandHigh: 14.4 },
    { day: "5", price: 14.5, bandLow: 13.2, bandHigh: 14.5 },
    { day: "6", price: 14.7, bandLow: 13.2, bandHigh: 14.6 },
    { day: "7", price: 14.9, bandLow: 13.3, bandHigh: 14.7 },
  ],
};

const mappingBacklog: MappingBacklogItem[] = [
  {
    id: "m1",
    rawName: "BURRATA ELITE 125G",
    supplierName: "Elysian Dairy",
    suggestedCategory: "Dairy / Cheese",
    suggestedInternalSku: "DAIRY_BURRATA_125",
    confidencePercent: 93,
  },
  {
    id: "m2",
    rawName: "BRUNCH GRANOLA DELUXE",
    supplierName: "Central Dry Store",
    suggestedCategory: "Dry / Cereals",
    suggestedInternalSku: "DRY_GRANOLA_BRUNCH",
    confidencePercent: 88,
  },
  {
    id: "m3",
    rawName: "OAT DRINK FOAMY BARISTA",
    supplierName: "Elysian Dairy",
    suggestedCategory: "Alternatives / Plant-based milk",
    suggestedInternalSku: null,
    confidencePercent: 76,
  },
];

const mappingRules: MappingRule[] = [
  {
    id: "r1",
    pattern: "BURRATA*125*",
    targetCategory: "Dairy / Cheese",
    notes: "Map all 125 g burrata variants into the standard burrata SKU group.",
  },
  {
    id: "r2",
    pattern: "*GRANOLA*BRUNCH*",
    targetCategory: "Dry / Cereals",
    notes: "Treat brunch granola as one family for GP modelling.",
  },
  {
    id: "r3",
    pattern: "*BARISTA*OAT*",
    targetCategory: "Alternatives / Plant-based milk",
    notes: "Standardise barista oat drinks into one internal SKU set.",
  },
];

const alternativesForProduct: Record<string, AlternativeProduct[]> = {
  p1: [
    {
      id: "a1",
      supplierName: "NewDairy Co.",
      name: "Burrata 100 g",
      lastPrice: 10.8,
      priceDiffPercent: -5.3,
      sustainabilityScore: 64,
      matchQualityScore: 92,
    },
    {
      id: "a2",
      supplierName: "Metro Dairy",
      name: "Premium burrata 125 g",
      lastPrice: 11.0,
      priceDiffPercent: -3.5,
      sustainabilityScore: 58,
      matchQualityScore: 88,
    },
  ],
  p3: [
    {
      id: "a3",
      supplierName: "Metro Meats",
      name: "Beef striploin 2.3 kg trimmed",
      lastPrice: 14.3,
      priceDiffPercent: -3.9,
      sustainabilityScore: 51,
      matchQualityScore: 86,
    },
  ],
};

const aiInsightBlocks: AiInsightBlock[] = [
  {
    id: "ai1",
    title: "High impact cluster: brunch dairy",
    description:
      "A small set of premium dairy SKUs is driving a large share of GP volatility across brunch and dessert menus.",
    bullets: [
      "Burrata, mascarpone and oat barista are all drifting above band.",
      "These SKUs sit on hero dishes with high review visibility.",
      "Negotiating these 3 ingredients yields more impact than chasing 40 low-volume SKUs.",
    ],
  },
  {
    id: "ai2",
    title: "Variant compression opportunity",
    description:
      "You have multiple variants of the same idea across suppliers and pack sizes.",
    bullets: [
      "Burrata appears in at least 3 SKUs across 2 suppliers.",
      "Compressing into 1 or 2 strategic variants simplifies GP, waste and training.",
      "Use ODYAN rules to enforce future mapping into the chosen master SKUs.",
    ],
  },
  {
    id: "ai3",
    title: "Sustainability leverage",
    description:
      "Some suppliers deliver better sustainability scores at comparable prices.",
    bullets: [
      "Coffee and oat drink lines show strong sustainability scores with only minor price premiums.",
      "These can be highlighted in marketing while keeping GP safe.",
      "Later, ODYAN can auto-select the best balance of GP and footprint per category.",
    ],
  },
];

const recipeCoverageStats: RecipeCoverageStats = {
  totalMenuItems: 186,
  confirmedRecipes: 74,
  aiDraftRecipes: 68,
  noRecipe: 44,
  lastSyncSource: "POS + KitchenCut export",
  lastSyncTime: "Today · 09:42",
};

const recipeImportJobs: RecipeImportJob[] = [
  {
    id: "job1",
    sourceName: "KitchenCut_Export_Feb.xlsx",
    fileType: "excel",
    detectedRows: 212,
    templateName: "KitchenCut v3.4",
    status: "applied",
    columnMappingConfidence: 99,
    ingredientMatchConfidence: 94,
  },
  {
    id: "job2",
    sourceName: "Central_Bistro360_Recipes.csv",
    fileType: "csv",
    detectedRows: 147,
    templateName: "Bistro360 generic CSV",
    status: "needs_review",
    columnMappingConfidence: 86,
    ingredientMatchConfidence: 78,
  },
  {
    id: "job3",
    sourceName: "Brunch_Recipes_Manual.xlsx",
    fileType: "excel",
    detectedRows: 39,
    templateName: null,
    status: "processing",
    columnMappingConfidence: 71,
    ingredientMatchConfidence: 0,
  },
];

/* =========================
   PAGE
   ========================= */

export default function ProductUniversePage() {
  const [search, setSearch] = useState("");
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [onlyMapped, setOnlyMapped] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>("p1");

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) => {
      if (showCriticalOnly && p.criticality !== "high") {
        return false;
      }
      if (onlyMapped && !p.mapped) {
        return false;
      }
      if (!search.trim()) {
        return true;
      }
      const query = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.supplierName.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.internalCode.toLowerCase().includes(query)
      );
    });
  }, [search, showCriticalOnly, onlyMapped]);

  const selectedProduct =
    filteredProducts.find((p) => p.id === selectedProductId) ??
    filteredProducts[0] ??
    mockProducts[0];

  const priceHistory = priceHistoryByProduct[selectedProduct.id] ?? [];
  const alternatives = alternativesForProduct[selectedProduct.id] ?? [];

  return (
    <div className="space-y-8 text-slate-100">
      {/* HEADER */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Suppliers and products
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Product universe
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">
            ODYAN keeps one clean, intelligent list of every ingredient from
            every supplier, linked to menu, GP, competitors and reputation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <KpiPill
            icon={<Package className="h-3.5 w-3.5" />}
            label="Total SKUs"
            value={universeStats.totalSkus.toString()}
            helper="All suppliers and venues combined"
          />
          <KpiPill
            icon={<PieChart className="h-3.5 w-3.5" />}
            label="Critical GP SKUs"
            value={universeStats.criticalSkus.toString()}
            helper="Drive most of your GP swings"
            tone="warn"
          />
          <KpiPill
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            label="Unmapped backlog"
            value={universeStats.unmappedSkus.toString()}
            helper="Need mapping or rules"
            tone="critical"
          />
        </div>
      </header>

      {/* MAIN GRID: TABLE + DETAIL */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1.5fr)] gap-4">
        {/* PRODUCT TABLE */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-3 text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-cyan-300" />
                All ingredients in use
              </p>
              <p className="text-xs text-slate-300">
                Filter by supplier, category, criticality and mapping status.
                Every row is backed by invoices and price lists.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Link
                href="/suppliers"
                className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-cyan-300 hover:text-cyan-100 transition"
              >
                Suppliers view
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                href="/invoices"
                className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-200"
              >
                Go to ingestion
              </Link>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-2">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product, supplier, category or code"
                className="w-full bg-transparent text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1">
                <Filter className="h-3 w-3 text-slate-400" />
                Filters
              </span>
              <label className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCriticalOnly}
                  onChange={(e) => setShowCriticalOnly(e.target.checked)}
                  className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-cyan-400"
                />
                <span>Critical only</span>
              </label>
              <label className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyMapped}
                  onChange={(e) => setOnlyMapped(e.target.checked)}
                  className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-cyan-400"
                />
                <span>Mapped only</span>
              </label>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto custom-scroll">
            <table className="min-w-full text-left text-[11px] text-slate-300 border-separate border-spacing-y-2">
              <thead className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-3 py-1.5">Product</th>
                  <th className="px-3 py-1.5">Supplier</th>
                  <th className="px-3 py-1.5">Category</th>
                  <th className="px-3 py-1.5">Pack</th>
                  <th className="px-3 py-1.5">Last price</th>
                  <th className="px-3 py-1.5">Band</th>
                  <th className="px-3 py-1.5">Criticality</th>
                  <th className="px-3 py-1.5">Menu items</th>
                  <th className="px-3 py-1.5">Venues</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className={`rounded-2xl border border-slate-800 bg-slate-900/90 cursor-pointer transition-colors ${
                      p.id === selectedProduct.id
                        ? "border-cyan-400 bg-slate-900"
                        : "hover:border-slate-600"
                    }`}
                    onClick={() => setSelectedProductId(p.id)}
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-100 flex items-center gap-1">
                          {p.name}
                          {!p.mapped && (
                            <span className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-100">
                              Unmapped
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Code: {p.internalCode}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <p className="text-xs text-slate-200">
                        {p.supplierName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Last invoice: {p.lastSeenOnInvoice}
                      </p>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <p className="text-xs text-slate-200">
                        {p.category}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {p.subcategory}
                      </p>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <p className="text-xs text-slate-200">{p.packSize}</p>
                      <p className="text-[10px] text-slate-500">
                        Unit: {p.unit}
                      </p>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <p className="text-xs text-slate-200">
                        £{p.lastPrice.toFixed(2)}
                      </p>
                      <p
                        className={`text-[10px] ${
                          p.lastPriceChangePercent > 0
                            ? "text-amber-300"
                            : p.lastPriceChangePercent < 0
                            ? "text-emerald-300"
                            : "text-slate-500"
                        }`}
                      >
                        {p.lastPriceChangePercent > 0 ? "+" : ""}
                        {p.lastPriceChangePercent.toFixed(1)} percent
                      </p>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <BandStatusPill status={p.bandStatus} />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <CriticalityPill level={p.criticality} />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <p className="text-xs text-slate-200">
                        {p.menuItemsCount}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Dishes linked
                      </p>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <p className="text-xs text-slate-200">
                        {p.venuesCount}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Venues using
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-4 text-center text-[11px] text-slate-400">
                No products match this view. Clear filters or search in a wider
                way.
              </div>
            )}
          </div>
        </motion.div>

        {/* PRODUCT DETAIL PANEL */}
        <motion.div
          className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-3 text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <ProductDetailHeader product={selectedProduct} />

          {/* PRICE HISTORY */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1">
                <LineChartIcon className="h-3.5 w-3.5 text-cyan-300" />
                Price vs band
              </p>
              <p className="text-[10px] text-slate-500">
                Source: invoice and price list history
              </p>
            </div>
            <div className="h-40">
              {priceHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={priceHistory}
                    margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="priceLine" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#22d3ee"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22d3ee"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="#1f2937"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
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
                    <Area
                      type="monotone"
                      dataKey="price"
                      name="Price"
                      stroke="#22d3ee"
                      fill="url(#priceLine)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="bandHigh"
                      name="Upper band"
                      stroke="#f97316"
                      fillOpacity={0}
                      strokeWidth={1}
                      strokeDasharray="4 3"
                    />
                    <Area
                      type="monotone"
                      dataKey="bandLow"
                      name="Lower band"
                      stroke="#22c55e"
                      fillOpacity={0}
                      strokeWidth={1}
                      strokeDasharray="4 3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                  No price history loaded yet for this product.
                </div>
              )}
            </div>
          </div>

          {/* GP IMPACT AND ALTERNATIVES */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] gap-3">
            <ProductGpImpactCard product={selectedProduct} />
            <AlternativesCard alternatives={alternatives} />
          </div>

          {/* ALLERGENS AND TAGS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-cyan-300" />
              Allergens, origin and tags
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
              {selectedProduct.allergens.length > 0 ? (
                selectedProduct.allergens.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center rounded-full border border-rose-400/60 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-100"
                  >
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">
                  No allergens recorded for this product.
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
                Origin: {selectedProduct.countryOfOrigin}
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-emerald-100">
                Sustainability: {selectedProduct.sustainabilityScore} / 100
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MAPPING COCKPIT */}
      <MappingCockpitSection />

      {/* RECIPE COVERAGE & IMPORTS */}
      <RecipeCoverageSection />

      {/* AI PRODUCT ANALYST */}
      <AiProductAnalystSection />
    </div>
  );
}

/* =========================
   SMALL UI PIECES
   ========================= */

type Tone = "default" | "warn" | "critical";

function KpiPill({
  icon,
  label,
  value,
  helper,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
  tone?: Tone;
}) {
  const colour =
    tone === "critical"
      ? "text-rose-300"
      : tone === "warn"
      ? "text-amber-300"
      : "text-emerald-300";

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950/90 px-3 py-2 shadow-[0_16px_55px_rgba(0,0,0,0.7)]">
      <div className="h-7 w-7 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-200">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-50">{value}</p>
        <p className={`text-[10px] ${colour}`}>{helper}</p>
      </div>
    </div>
  );
}

function BandStatusPill({
  status,
}: {
  status: ProductRecord["bandStatus"];
}) {
  if (status === "above_band") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100">
        Above band
      </span>
    );
  }
  if (status === "below_band") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100">
        Below band
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
      In band
    </span>
  );
}

function CriticalityPill({ level }: { level: ProductCriticality }) {
  const map = {
    low: {
      label: "Low",
      className: "border-slate-600 bg-slate-800 text-slate-200",
    },
    medium: {
      label: "Medium",
      className: "border-sky-400/60 bg-sky-500/10 text-sky-100",
    },
    high: {
      label: "High",
      className: "border-rose-500/60 bg-rose-500/15 text-rose-100",
    },
  } as const;

  const cfg = map[level];

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] " +
        cfg.className
      }
    >
      <Target className="h-3 w-3 mr-1" />
      {cfg.label}
    </span>
  );
}

/* =========================
   PRODUCT DETAIL SUBCOMPONENTS
   ========================= */

function ProductDetailHeader({ product }: { product: ProductRecord }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-100 flex items-center gap-1">
          {product.name}
          {product.criticality === "high" && (
            <span className="inline-flex items-center rounded-full border border-rose-500/60 bg-rose-500/15 px-1.5 py-0.5 text-[9px] text-rose-100">
              High GP impact
            </span>
          )}
        </p>
        <p className="text-[11px] text-slate-400">
          Code: {product.internalCode} · {product.category} /{" "}
          {product.subcategory}
        </p>
        <p className="text-[11px] text-slate-400">
          Supplier:{" "}
          <span className="text-slate-100">{product.supplierName}</span>
        </p>
      </div>
      <div className="text-right space-y-1 text-[11px]">
        <p className="text-slate-400">
          Last price:{" "}
          <span className="text-slate-100">
            £{product.lastPrice.toFixed(2)}
          </span>
        </p>
        <p
          className={
            "text-[11px] " +
            (product.lastPriceChangePercent > 0
              ? "text-amber-300"
              : product.lastPriceChangePercent < 0
              ? "text-emerald-300"
              : "text-slate-400")
          }
        >
          {product.lastPriceChangePercent > 0 ? "+" : ""}
          {product.lastPriceChangePercent.toFixed(1)} percent vs last month
        </p>
        <p className="text-[10px] text-slate-500">
          Last seen on invoice: {product.lastSeenOnInvoice}
        </p>
      </div>
    </div>
  );
}

function ProductGpImpactCard({ product }: { product: ProductRecord }) {
  const avgGpPercent =
    product.criticality === "high"
      ? 68
      : product.criticality === "medium"
      ? 72
      : 75;
  const forecastDrop =
    product.bandStatus === "above_band"
      ? 2.4
      : product.bandStatus === "below_band"
      ? -1.1
      : 0.0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1">
        <Factory className="h-3.5 w-3.5 text-emerald-300" />
        GP and menu impact
      </p>
      <div className="grid grid-cols-3 gap-3 text-[11px]">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
            Linked dishes
          </p>
          <p className="text-xs font-semibold text-slate-50">
            {product.menuItemsCount}
          </p>
          <p className="text-[10px] text-slate-400">
            Across {product.venuesCount} venues
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
            Average GP
          </p>
          <p className="text-xs font-semibold text-slate-50">
            {avgGpPercent} percent
          </p>
          <p className="text-[10px] text-slate-400">
            On dishes using this SKU
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
            Forecast GP change
          </p>
          <p
            className={
              "text-xs font-semibold " +
              (forecastDrop > 0
                ? "text-amber-300"
                : forecastDrop < 0
                ? "text-emerald-300"
                : "text-slate-50")
            }
          >
            {forecastDrop > 0 ? "-" : ""}
            {Math.abs(forecastDrop).toFixed(1)} pp
          </p>
          <p className="text-[10px] text-slate-400">
            If current drift continues
          </p>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-slate-300">
        In the full ODYAN product, this card links to the GP forecast, delivery
        menu view and competitor benchmarking so you can decide whether to
        renegotiate, reprice, or redesign dishes that depend on this ingredient.
      </p>
    </div>
  );
}

function AlternativesCard({
  alternatives,
}: {
  alternatives: AlternativeProduct[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1">
        <Forklift className="h-3.5 w-3.5 text-cyan-300" />
        Alternative suppliers and SKUs
      </p>
      {alternatives.length === 0 ? (
        <p className="text-[11px] text-slate-500">
          ODYAN has not identified alternatives for this SKU yet. Once multiple
          suppliers and catalogs are loaded, potential switches will appear
          here.
        </p>
      ) : (
        <ul className="space-y-1.5 text-[11px] text-slate-300">
          {alternatives.map((alt) => (
            <li
              key={alt.id}
              className="rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 flex items-start justify-between gap-2"
            >
              <div className="space-y-0.5">
                <p className="text-xs text-slate-100">
                  {alt.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  Supplier: {alt.supplierName}
                </p>
                <p className="text-[10px] text-slate-400">
                  Match quality: {alt.matchQualityScore} / 100
                </p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-xs text-slate-100">
                  £{alt.lastPrice.toFixed(2)}
                </p>
                <p
                  className={
                    "text-[10px] " +
                    (alt.priceDiffPercent < 0
                      ? "text-emerald-300"
                      : alt.priceDiffPercent > 0
                      ? "text-amber-300"
                      : "text-slate-400")
                  }
                >
                  {alt.priceDiffPercent > 0 ? "+" : ""}
                  {alt.priceDiffPercent.toFixed(1)} percent vs current
                </p>
                <p className="text-[10px] text-emerald-200">
                  Sustainability: {alt.sustainabilityScore} / 100
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-[10px] text-slate-500">
        Later, this list will feed directly into negotiation packs and
        supplier-switch scenarios on the main suppliers page.
      </p>
    </div>
  );
}

/* =========================
   MAPPING COCKPIT
   ========================= */

function MappingCockpitSection() {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1.5fr)] gap-4">
      {/* BACKLOG */}
      <motion.div
        className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-3 text-xs"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-300" />
              Mapping backlog
            </p>
            <p className="text-xs text-slate-300">
              ODYAN proposes mappings for new or unclean SKUs based on your
              existing rules and history.
            </p>
          </div>
          <p className="text-[10px] text-slate-500">
            In production, this becomes a fast daily task for a data or ops
            lead.
          </p>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scroll">
          {mappingBacklog.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-100">{item.rawName}</p>
                  <p className="text-[10px] text-slate-500">
                    Supplier: {item.supplierName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Suggested category: {item.suggestedCategory}
                  </p>
                </div>
                <div className="text-right text-[10px]">
                  <p
                    className={
                      item.confidencePercent >= 90
                        ? "text-emerald-300"
                        : item.confidencePercent >= 80
                        ? "text-sky-300"
                        : "text-amber-300"
                    }
                  >
                    {item.confidencePercent} percent confidence
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex flex-wrap gap-1">
                  {item.suggestedInternalSku ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-emerald-100">
                      Map to: {item.suggestedInternalSku}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 text-amber-100">
                      Needs new master SKU
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100">
                    <CheckCircle className="h-3 w-3" />
                    Accept
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
                    <AlertTriangle className="h-3 w-3 text-amber-300" />
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* RULES */}
      <motion.div
        className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-3 text-xs"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
              <Brain className="h-3.5 w-3.5 text-emerald-300" />
              Mapping rules and pattern learning
            </p>
            <p className="text-xs text-slate-300">
              Short rules teach ODYAN how to treat new SKUs that look like old
              ones, so your product universe stays clean automatically.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] text-slate-300">
            <Info className="h-3 w-3" />
            Future: rule suggestions from AI
          </span>
        </div>

        <div className="space-y-2">
          {mappingRules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3"
            >
              <p className="text-[11px] text-slate-200 flex items-center gap-1">
                <code className="rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] text-cyan-200">
                  {rule.pattern}
                </code>
                <span className="text-slate-400">
                  → {rule.targetCategory}
                </span>
              </p>
              <p className="mt-1 text-[10px] text-slate-400">{rule.notes}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-1.5 text-[11px] text-slate-300">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
            How this scales
          </p>
          <p>
            As you accept or correct mappings, ODYAN learns new patterns and
            proposes rules automatically. Over time, most new SKUs land in the
            right place without manual work.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================
   RECIPE COVERAGE & IMPORTS
   ========================= */

function RecipeCoverageSection() {
  const confirmedPercent =
    (recipeCoverageStats.confirmedRecipes /
      recipeCoverageStats.totalMenuItems) *
    100;
  const aiDraftPercent =
    (recipeCoverageStats.aiDraftRecipes /
      recipeCoverageStats.totalMenuItems) *
    100;
  const noRecipePercent =
    (recipeCoverageStats.noRecipe / recipeCoverageStats.totalMenuItems) * 100;

  return (
    <section className="mt-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.6fr)] gap-4">
      {/* COVERAGE SUMMARY */}
      <motion.div
        className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-3 text-xs"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
              <PieChart className="h-3.5 w-3.5 text-cyan-300" />
              Recipe coverage and confidence
            </p>
            <p className="text-xs text-slate-300">
              ODYAN blends existing recipe files, POS menu and AI drafts so you
              don&apos;t have to build every dish manually.
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            <p>Last sync: {recipeCoverageStats.lastSyncTime}</p>
            <p className="flex items-center justify-end gap-1">
              <Clock className="h-3 w-3" />
              Source: {recipeCoverageStats.lastSyncSource}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-[11px]">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Menu items
            </p>
            <p className="text-sm font-semibold text-slate-50">
              {recipeCoverageStats.totalMenuItems}
            </p>
            <p className="text-[10px] text-slate-400">
              All dishes across venues
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Confirmed recipes
            </p>
            <p className="text-sm font-semibold text-emerald-300">
              {recipeCoverageStats.confirmedRecipes} (
              {confirmedPercent.toFixed(0)} percent)
            </p>
            <p className="text-[10px] text-slate-400">
              Fully human-reviewed
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              AI-draft recipes
            </p>
            <p className="text-sm font-semibold text-sky-300">
              {recipeCoverageStats.aiDraftRecipes} (
              {aiDraftPercent.toFixed(0)} percent)
            </p>
            <p className="text-[10px] text-slate-400">
              Based on imports + AI
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              No recipe yet
            </p>
            <p className="text-sm font-semibold text-amber-300">
              {recipeCoverageStats.noRecipe} (
              {noRecipePercent.toFixed(0)} percent)
            </p>
            <p className="text-[10px] text-slate-400">
              Only rough GP approximations
            </p>
          </div>
        </div>

        {/* BAR VISUAL */}
        <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2 text-[10px]">
            <p className="text-slate-400">
              Coverage bar · ODYAN uses confirmed recipes first, AI drafts next,
              and category-level estimates last.
            </p>
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-900">
            <div
              className="h-full bg-emerald-400/80"
              style={{ width: `${confirmedPercent}%` }}
            />
            <div
              className="h-full bg-sky-400/80"
              style={{ width: `${aiDraftPercent}%` }}
            />
            <div
              className="h-full bg-amber-400/80"
              style={{ width: `${noRecipePercent}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
            <div className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-full bg-emerald-400/80" />
              Confirmed
            </div>
            <div className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-full bg-sky-400/80" />
              AI drafts
            </div>
            <div className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-full bg-amber-400/80" />
              No recipes yet
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            In the full product you can click on each segment to open a recipe
            review inbox, starting with the dishes that move the most GP.
          </p>
        </div>
      </motion.div>

      {/* IMPORT JOBS */}
      <motion.div
        className="rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-3 text-xs"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
              <Upload className="h-3.5 w-3.5 text-cyan-300" />
              Recipe imports and templates
            </p>
            <p className="text-xs text-slate-300">
              Drop Excel, CSV, PDF or ERP exports here. ODYAN detects the
              structure, learns the template and converts everything into live
              recipes.
            </p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] text-slate-200 hover:border-cyan-300 hover:text-cyan-100 transition">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Upload file
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scroll">
          {recipeImportJobs.map((job) => (
            <RecipeImportJobRow key={job.id} job={job} />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-1.5 text-[11px] text-slate-300">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
            How ODYAN makes this safe
          </p>
          <p>
            Each import gets a template profile. Columns, units and ingredient
            patterns are learned once and reused. Low-confidence mappings stay
            in review and never touch live GP until you approve them.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function RecipeImportJobRow({ job }: { job: RecipeImportJob }) {
  const statusConfig: Record<
    RecipeImportJobStatus,
    { label: string; className: string }
  > = {
    processing: {
      label: "Processing",
      className:
        "border-sky-400/60 bg-sky-500/10 text-sky-100",
    },
    needs_review: {
      label: "Needs review",
      className:
        "border-amber-400/60 bg-amber-500/10 text-amber-100",
    },
    applied: {
      label: "Applied",
      className:
        "border-emerald-400/60 bg-emerald-500/10 text-emerald-100",
    },
  };

  const status = statusConfig[job.status];

  const fileTypeLabel =
    job.fileType === "excel"
      ? "Excel"
      : job.fileType === "pdf"
      ? "PDF"
      : job.fileType === "csv"
      ? "CSV"
      : "ERP export";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-xs text-slate-100">
            {job.sourceName}
          </p>
          <p className="text-[10px] text-slate-500">
            Type: {fileTypeLabel} · Rows detected: {job.detectedRows}
          </p>
          <p className="text-[10px] text-slate-400">
            Template:{" "}
            {job.templateName ? job.templateName : "New template (learning)"}
          </p>
        </div>
        <span
          className={
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] " +
            status.className
          }
        >
          {status.label}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
            Column mapping:{" "}
            <span className="text-slate-100">
              {job.columnMappingConfidence} percent
            </span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
            Ingredient matches:{" "}
            <span className="text-slate-100">
              {job.ingredientMatchConfidence} percent
            </span>
          </span>
        </div>
        <div className="flex gap-1">
          {job.status === "needs_review" && (
            <button className="inline-flex items-center gap-1 rounded-full border border-amber-400/60 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100">
              <AlertTriangle className="h-3 w-3" />
              Open review
            </button>
          )}
          {job.status === "applied" && (
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
              <CheckCircle className="h-3 w-3 text-emerald-300" />
              View changes
            </button>
          )}
          {job.status === "processing" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
              Analysing structure...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   AI PRODUCT ANALYST
   ========================= */

function AiProductAnalystSection() {
  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.85)] space-y-4 text-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
            <Brain className="h-3.5 w-3.5 text-cyan-300" />
            AI product analyst
          </p>
          <p className="text-sm text-slate-300">
            A high-level view of how ODYAN would brief you on the product
            universe today: where you overpay, where variants explode, and how
            to simplify.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-[10px] text-slate-500">
          <p>
            In the full product this section is generated live from data, not
            static text.
          </p>
          <p>
            It will fuel the morning brief, negotiation prep and GM guidance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {aiInsightBlocks.map((block) => (
          <div
            key={block.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-3 space-y-2"
          >
            <p className="text-[11px] font-semibold text-slate-100 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              {block.title}
            </p>
            <p className="text-[11px] text-slate-300">
              {block.description}
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {block.bullets.map((b, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-[6px] h-1 w-4 rounded-full bg-cyan-300/70" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <p className="text-slate-300">
          Later, this block will be driven by real-time AI prompts like
          “Explain where my product universe is messy and what to standardise
          this month.”
        </p>
        <Link
          href="/control-room"
          className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-200 hover:border-cyan-300 hover:text-cyan-100 transition"
        >
          Back to control room
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
