"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  Invoice,
  InvoiceStatus,
  InvoicesResponse,
  InvoicesResponseSummary,
} from "@/types/invoices";

type IngestionAlert = {
  id: string;
  type: "info" | "warning" | "error";
  title: string;
  detail: string;
  impact: string;
  timeAgo: string;
};

type SupplierSummary = {
  supplier: string;
  totalThisWeek: number;
  venues: Set<string>;
};

type VenueConfidence = {
  venue: string;
  confidence: number;
  dataPaths: string[];
  missing: string[];
};

const demoAlerts: IngestionAlert[] = [
  {
    id: "AL-001",
    type: "warning",
    title: "New supplier detected: La Fromagerie Milano",
    detail:
      "ODYAN found a new Italian dairy supplier on EL&N Hans Crescent invoices. Lines are partially mapped against existing cheese categories.",
    impact:
      "If accepted, ODYAN will keep GP history consistent across both old and new suppliers.",
    timeAgo: "3 min ago",
  },
  {
    id: "AL-002",
    type: "info",
    title: "Auto-mapping success for Marr Premium",
    detail:
      "All line items from the last 5 Marr Premium invoices now use the same internal product IDs across all London venues.",
    impact:
      "This improves cross-site GP comparability and price variation detection.",
    timeAgo: "26 min ago",
  },
  {
    id: "AL-003",
    type: "warning",
    title: "Berries price spike on FreshPoint UK",
    detail:
      "Raspberry and blueberry prices are up 14 percent versus the last 4 weeks on Oxford Circus and Doha invoices.",
    impact:
      "ODYAN estimates an additional cost of about 420 GBP per month at current volumes.",
    timeAgo: "1 hr ago",
  },
  {
    id: "AL-004",
    type: "error",
    title: "Corrupted invoice file from FreshPoint UK",
    detail:
      "One uploaded PDF cannot be parsed. Totals do not match line items and tax calculation fails.",
    impact:
      "Manual confirmation is required before this invoice can enter GP and cashflow reports.",
    timeAgo: "3 hr ago",
  },
];

const venueConfidenceDemo: VenueConfidence[] = [
  {
    venue: "EL&N Hans Crescent",
    confidence: 96,
    dataPaths: ["Invoices", "POS sales", "Stock counts", "Photo uploads"],
    missing: [],
  },
  {
    venue: "EL&N Oxford Circus",
    confidence: 93,
    dataPaths: ["Invoices", "POS sales", "Stock counts"],
    missing: ["Photo uploads"],
  },
  {
    venue: "EL&N Knightsbridge",
    confidence: 89,
    dataPaths: ["Invoices", "POS sales"],
    missing: ["Stock counts", "Photo uploads"],
  },
  {
    venue: "EL&N Doha Place Vendôme",
    confidence: 86,
    dataPaths: ["Invoices"],
    missing: ["POS sales", "Stock counts"],
  },
];

function statusLabel(status: InvoiceStatus): string {
  switch (status) {
    case "ready":
      return "Ready for GP";
    case "needs_review":
      return "Needs review";
    case "error":
      return "Error";
    case "processing":
      return "Processing";
    default:
      return status;
  }
}

function statusBadgeClasses(status: InvoiceStatus): string {
  switch (status) {
    case "ready":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40";
    case "needs_review":
      return "bg-amber-500/10 text-amber-300 border border-amber-500/40";
    case "error":
      return "bg-rose-500/10 text-rose-300 border border-rose-500/40";
    case "processing":
      return "bg-sky-500/10 text-sky-300 border border-sky-500/40";
    default:
      return "bg-slate-700 text-slate-200 border border-slate-500";
  }
}

type ActionChipProps = {
  title: string;
  detail: string;
  label: string;
  tone?: "default" | "warning" | "critical";
};

function ActionChip({
  title,
  detail,
  label,
  tone = "default",
}: ActionChipProps) {
  const borderClass =
    tone === "critical"
      ? "border-rose-500/40"
      : tone === "warning"
      ? "border-amber-500/40"
      : "border-slate-700";
  const accentDotClass =
    tone === "critical"
      ? "bg-rose-400"
      : tone === "warning"
      ? "bg-amber-400"
      : "bg-emerald-400";

  return (
    <div className={`rounded-xl border ${borderClass} bg-slate-950/60 p-3`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${accentDotClass}`} />
          <p className="text-xs font-medium text-slate-100">{title}</p>
        </div>
        <span className="text-[10px] text-slate-400">{label}</span>
      </div>
      <p className="text-[11px] text-slate-300">{detail}</p>
    </div>
  );
}

function autoLinesDisplay(lines: number): string {
  if (lines >= 1000) {
    return `${(lines / 1000).toFixed(1)}k`;
  }
  return lines.toString();
}

function alertTypeClasses(type: IngestionAlert["type"]): string {
  if (type === "info") {
    return "border-sky-500/40 bg-sky-500/8 text-sky-200";
  }
  if (type === "warning") {
    return "border-amber-500/40 bg-amber-500/8 text-amber-200";
  }
  return "border-rose-500/40 bg-rose-500/8 text-rose-200";
}

type InvoiceSeverity = "low" | "medium" | "high";

function getInvoiceSeverity(inv: Invoice): InvoiceSeverity {
  if (inv.status === "error") return "high";
  if (inv.status === "needs_review" && inv.issues.length > 0) return "medium";
  return "low";
}

function getSeverityLabel(severity: InvoiceSeverity): string {
  if (severity === "high") return "High impact";
  if (severity === "medium") return "Medium impact";
  return "Low impact";
}

function getSeverityClasses(severity: InvoiceSeverity): string {
  if (severity === "high") {
    return "border-rose-500/40 bg-rose-500/10 text-rose-200";
  }
  if (severity === "medium") {
    return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  }
  return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
}

function buildInvoiceSummary(inv: Invoice): {
  headline: string;
  bullets: string[];
  actions: string[];
} {
  const severity = getInvoiceSeverity(inv);
  const bullets: string[] = [];
  const actions: string[] = [];

  bullets.push(
    `ODYAN parsed ${
      inv.linesCount > 0
        ? `${inv.linesCount} line items`
        : "all visible line items"
    } from ${inv.supplierName} for ${inv.venueName}.`
  );

  if (inv.issues.length === 0 && inv.status === "ready") {
    bullets.push(
      "No anomalies detected versus the last 4 to 12 weeks of prices for this supplier and venue."
    );
  }

  if (inv.issues.length > 0) {
    bullets.push(`Key issues detected: ${inv.issues.join(" · ")}.`);
  }

  if (
    typeof inv.estimatedMonthlyImpact === "number" &&
    inv.estimatedMonthlyImpact > 0
  ) {
    bullets.push(
      `ODYAN estimates this invoice contributes about GBP ${inv.estimatedMonthlyImpact.toLocaleString(
        "en-GB",
        { maximumFractionDigits: 0 }
      )} extra cost per month at current volume.`
    );
  }

  if (inv.status === "ready") {
    bullets.push(
      "This invoice is already included in GP, cashflow and supplier benchmarking for ODYAN."
    );
  } else if (inv.status === "needs_review") {
    bullets.push(
      "Until this invoice is reviewed, ODYAN treats its data as provisional in GP and risk calculations."
    );
  } else if (inv.status === "error") {
    bullets.push(
      "This invoice is currently excluded from GP and cashflow until the error is resolved."
    );
  } else if (inv.status === "processing") {
    bullets.push(
      "OCR and product mapping are in progress; once complete, this invoice will flow into GP and supplier dashboards."
    );
  }

  bullets.push(inv.impactSummary);

  if (severity === "high") {
    actions.push(
      "Fix the file or totals first so this invoice can be trusted inside GP and cashflow."
    );
  }
  if (inv.status === "needs_review" && inv.issues.length > 0) {
    actions.push(
      "Review and confirm the flagged lines so ODYAN can lock this invoice into GP history."
    );
  }
  if (
    inv.supplierName.includes("FreshPoint") &&
    inv.issues.join(" ").toLowerCase().includes("berry")
  ) {
    actions.push(
      "Decide whether to accept the berry price increase, re-negotiate with FreshPoint or adjust affected menu items."
    );
  }
  if (
    inv.supplierName.includes("Fromagerie") ||
    inv.supplierName.includes("La Fromagerie")
  ) {
    actions.push(
      "Confirm La Fromagerie Milano as a mapped supplier so cheese GP remains comparable to your previous supplier."
    );
  }
  if (actions.length === 0) {
    actions.push(
      "No urgent action required. Keep monitoring this supplier through ODYAN price and GP alerts."
    );
  }

  const headline =
    severity === "high"
      ? "This invoice is currently blocking clean GP for a small part of the business."
      : severity === "medium"
      ? "This invoice can move GP noticeably if you act on the flagged issues."
      : "This invoice is clean and quietly reinforcing ODYAN intelligence.";

  return { headline, bullets, actions };
}

// Frontend type matching invoice_uploads table
type InvoiceUploadRow = {
  id: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  source_file_url: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number | null;
  parsed_invoice_id: string | null;
  created_at: string;
  updated_at: string;
  error_message: string | null;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<InvoicesResponseSummary | null>(null);
  const [total, setTotal] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [venueFilter, setVenueFilter] = useState<string>("all");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [reloadFlag, setReloadFlag] = useState(0);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  // Upload pipeline state
  const [uploads, setUploads] = useState<InvoiceUploadRow[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProcessingId, setUploadProcessingId] = useState<string | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load invoices from API
  useEffect(() => {
    const controller = new AbortController();

    async function fetchInvoices() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));

        if (statusFilter && statusFilter !== "all") {
          params.set("status", statusFilter);
        }
        if (venueFilter && venueFilter !== "all") {
          params.set("venue", venueFilter);
        }
        if (search.trim().length > 0) {
          params.set("search", search.trim());
        }

        const res = await fetch(`/api/invoices?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch invoices");
        }

        const data: InvoicesResponse = await res.json();

        setInvoices(data.invoices);
        setSummary(data.summary);
        setTotal(data.total);

        if (!selectedInvoiceId && data.invoices.length > 0) {
          setSelectedInvoiceId(data.invoices[0].id);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();

    return () => controller.abort();
  }, [
    page,
    pageSize,
    statusFilter,
    venueFilter,
    search,
    selectedInvoiceId,
    reloadFlag,
  ]);

  // Load invoice uploads from API
  useEffect(() => {
    const controller = new AbortController();

    async function fetchUploads() {
      try {
        setUploadsLoading(true);
        setUploadError(null);

        const res = await fetch("/api/invoice-uploads", {
          signal: controller.signal,
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            data?.error || data?.detail || "Failed to load invoice uploads"
          );
        }

        setUploads((data?.uploads as InvoiceUploadRow[]) ?? []);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setUploadError(err.message ?? "Failed to load invoice uploads");
      } finally {
        setUploadsLoading(false);
      }
    }

    fetchUploads();

    return () => controller.abort();
  }, [reloadFlag]);

  async function handleSimulateBatch() {
    try {
      setSeeding(true);
      setSeedMessage(null);
      const res = await fetch("/api/invoices/seed-demo", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to seed demo data");
      }
      const msg =
        data?.message ||
        `Seeded ${data?.inserted ?? 0} demo invoices for EL&N.`;
      setSeedMessage(msg);
      setReloadFlag((x) => x + 1);
      setPage(1);
    } catch (err: any) {
      setSeedMessage(err.message ?? "Failed to seed demo data");
    } finally {
      setSeeding(false);
    }
  }

  function handleUploadButtonClick() {
    setUploadMessage(null);
    setUploadError(null);
    fileInputRef.current?.click();
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadMessage(null);
    setUploadError(null);

    try {
      setIsUploadingFile(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/invoice-uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || data?.detail || "Failed to upload invoice"
        );
      }

      const statusText =
        data?.upload?.status && typeof data.upload.status === "string"
          ? data.upload.status
          : "processing";

      setUploadMessage(`Uploaded ${file.name}. Status: ${statusText}.`);

      // Refresh uploads list
      setReloadFlag((x) => x + 1);
    } catch (err: any) {
      setUploadError(err.message ?? "Failed to upload invoice");
    } finally {
      setIsUploadingFile(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  }

  async function handleProcessUpload(uploadId: string) {
    try {
      setUploadProcessingId(uploadId);
      setUploadError(null);

      const res = await fetch(`/api/invoice-uploads/${uploadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || data?.detail || "Failed to process upload"
        );
      }

      const updated = data?.upload as InvoiceUploadRow | undefined;
      if (updated) {
        setUploads((prev) =>
          prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
        );
      }
    } catch (err: any) {
      setUploadError(err.message ?? "Failed to process upload");
    } finally {
      setUploadProcessingId(null);
    }
  }

  // Derived data
  const venues = useMemo(() => {
    const set = new Set<string>();
    invoices.forEach((inv) => set.add(inv.venueName));
    return Array.from(set);
  }, [invoices]);

  const recentInvoices = useMemo(() => invoices.slice(0, 4), [invoices]);

  const selectedInvoice: Invoice | null = useMemo(() => {
    if (!selectedInvoiceId) return null;
    return invoices.find((inv) => inv.id === selectedInvoiceId) ?? null;
  }, [selectedInvoiceId, invoices]);

  const kpis = useMemo(() => {
    const base: InvoicesResponseSummary = summary ?? {
      thisWeekCount: 0,
      weeklySpend: 0,
      mappedSuppliers: 0,
      autoClassifiedLines: 0,
      dataConfidence: 0,
      reviewCount: 0,
      errorCount: 0,
      suppliersThisWeek: 0,
      venuesThisWeek: 0,
      monthlyExtraCostRisk: 0,
      monthlyExtraCostInvoices: 0,
    };
    return base;
  }, [summary]);

  const supplierSummaries: SupplierSummary[] = useMemo(() => {
    const map = new Map<string, SupplierSummary>();
    invoices.forEach((inv) => {
      if (!map.has(inv.supplierName)) {
        map.set(inv.supplierName, {
          supplier: inv.supplierName,
          totalThisWeek: 0,
          venues: new Set<string>(),
        });
      }
      const s = map.get(inv.supplierName)!;
      s.totalThisWeek += inv.totalAmount;
      s.venues.add(inv.venueName);
    });
    return Array.from(map.values()).sort(
      (a, b) => b.totalThisWeek - a.totalThisWeek
    );
  }, [invoices]);

  const topSuppliers = supplierSummaries.slice(0, 3);

  const riskSummary = useMemo(
    () => ({
      totalExtraCost: summary?.monthlyExtraCostRisk ?? 0,
      count: summary?.monthlyExtraCostInvoices ?? 0,
    }),
    [summary]
  );

  const totalPages = useMemo(() => {
    if (total <= 0) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-10 space-y-10">
        {/* Error banner */}
        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
            There was a problem loading invoices from ODYAN.{" "}
            <span className="text-rose-200">{error}</span>
          </div>
        )}

        {/* Page header */}
        <header className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/40 px-3 py-1 text-xs text-fuchsia-200">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                <span>EL&N demo workspace</span>
                <span className="text-slate-400">
                  · Invoices and Data Hub
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Invoices and Data Hub
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
                See every invoice that hits your restaurants, understand its GP
                impact within seconds, and keep your supplier and product
                mapping clean across all EL&N sites.
              </p>
            </div>
          </div>
        </header>

        {/* KPI strip */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Invoices this week
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {kpis.thisWeekCount}
                </p>
              </div>
              <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-full px-2 py-0.5">
                Demo delta vs last week
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Every new invoice feeds ODYAN GP, waste, and supplier intelligence
              in real time across the group.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Mapped suppliers
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {kpis.mappedSuppliers}
                </p>
              </div>
              <span className="text-xs text-sky-300 bg-sky-500/10 border border-sky-500/40 rounded-full px-2 py-0.5">
                Multi-site normalised
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Same supplier, same internal ID, consistent GP across Hans
              Crescent, Oxford Circus, Doha and more.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Lines auto classified
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {autoLinesDisplay(kpis.autoClassifiedLines)}
                </p>
              </div>
              <span className="text-xs text-fuchsia-200 bg-fuchsia-500/10 border border-fuchsia-500/40 rounded-full px-2 py-0.5">
                Categories, allergens, GP
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              ODYAN recognises products, maps them to your menu and keeps
              allergen and GP data aligned for finance, chefs and ops.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Data confidence
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-2xl font-semibold">
                    {kpis.dataConfidence}
                    <span className="text-sm text-slate-400"> percent</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-full px-2 py-0.5">
                  High quality
                </span>
                <span className="text-[10px] text-slate-400">
                  {kpis.reviewCount} to review · {kpis.errorCount} errors
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Clear the review queue to push confidence above 98 percent and
              unlock investor grade reporting.
            </p>
          </div>
        </section>

        {/* Next actions strip with risk summary */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Next actions from ODYAN
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5 text-[11px] text-slate-400">
              <p>
                Monthly extra cost risk from flagged invoices:{" "}
                <span className="text-slate-100 font-semibold">
                  GBP{" "}
                  {riskSummary.totalExtraCost.toLocaleString("en-GB", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </p>
              <p>
                Clear {riskSummary.count} high impact invoices to lock this
                saving back into GP.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <ActionChip
              title="Review new supplier mapping"
              detail="Approve La Fromagerie Milano mapping so cheese GP stays consistent with your previous supplier."
              label="1 invoice"
            />
            <ActionChip
              title="Resolve corrupted invoice"
              detail="Fix the FreshPoint UK file so ODYAN can include this category in GP and cashflow."
              label={`${kpis.errorCount} blocking`}
              tone="critical"
            />
            <ActionChip
              title="Check price spikes"
              detail="Review berry price increase on FreshPoint and decide if a menu or supplier change is needed."
              label="GP risk source"
              tone="warning"
            />
          </div>
        </section>

        {/* Ingestion and pipeline explanation */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
          {/* Ingestion engine */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Ingestion engine
                </p>
                <p className="text-sm text-slate-300">
                  Drag in your invoices, ODYAN does the rest.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Pipeline online</span>
              </div>
            </div>

            <div className="mt-2 grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-stretch">
              {/* Drag and drop zone */}
              <div className="flex flex-col justify-between rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.csv,.xls,.xlsx"
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-100">
                    Drop invoices here
                  </p>
                  <p className="text-xs text-slate-400">
                    PDF, image or CSV from any supplier. ODYAN auto-detects tax,
                    currency, supplier, and line items.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleUploadButtonClick}
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={isUploadingFile}
                  >
                    {isUploadingFile ? "Uploading..." : "Upload invoice"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Paste from email
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-1.5 text-xs text-fuchsia-100 hover:bg-fuchsia-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleSimulateBatch}
                    disabled={seeding}
                  >
                    {seeding ? "Seeding EL&N batch..." : "Simulate EL&N batch"}
                  </button>
                </div>
                {(uploadMessage || uploadError || uploadsLoading) && (
                  <div className="mt-3 space-y-1 text-[11px]">
                    {uploadsLoading && (
                      <p className="text-slate-400">
                        Refreshing uploads from ODYAN...
                      </p>
                    )}
                    {uploadMessage && (
                      <p className="text-emerald-300">{uploadMessage}</p>
                    )}
                    {uploadError && (
                      <p className="text-rose-300">{uploadError}</p>
                    )}
                  </div>
                )}
                {seedMessage && (
                  <p className="mt-3 text-[11px] text-slate-300">
                    {seedMessage}
                  </p>
                )}
                <div className="mt-4 space-y-1">
                  <p className="text-[11px] font-medium text-slate-300">
                    Latest uploads
                  </p>
                  {uploads.length === 0 && !uploadsLoading ? (
                    <p className="text-[11px] text-slate-500">
                      No uploads yet. Use the button above to push real files
                      into the pipeline.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {uploads.map((u) => (
                        <li
                          key={u.id}
                          className="flex items-center justify-between gap-2 text-[11px]"
                        >
                          <div className="flex flex-col">
                            <span className="text-slate-100 truncate max-w-[200px]">
                              {u.original_filename}
                            </span>
                            <span className="text-slate-500">
                              {new Date(
                                u.created_at
                              ).toLocaleString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border " +
                                (u.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/40"
                                  : u.status === "failed"
                                  ? "bg-rose-500/10 text-rose-200 border-rose-500/40"
                                  : "bg-sky-500/10 text-sky-200 border-sky-500/40")
                              }
                            >
                              {u.status.toUpperCase()}
                            </span>
                            {(u.status === "uploaded" ||
                              u.status === "processing") && (
                              <button
                                type="button"
                                onClick={() => handleProcessUpload(u.id)}
                                disabled={uploadProcessingId === u.id}
                                className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900 px-2.5 py-0.5 text-[10px] text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {uploadProcessingId === u.id
                                  ? "Processing..."
                                  : "Mark completed"}
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="mt-3 text-[11px] text-slate-500">
                  In a real workspace you connect ODYAN directly to your AP
                  inbox or supplier portals so invoices land here
                  automatically, ready for AI processing.
                </p>
              </div>

              {/* Pipeline health */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-200">
                    Pipeline health
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Live snapshot
                  </span>
                </div>
                <dl className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">Processing now</dt>
                    <dd className="text-sky-300">
                      {invoices.some((inv) => inv.status === "processing")
                        ? "1 invoice"
                        : "0 invoice"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">Needs review</dt>
                    <dd className="text-amber-300">
                      {kpis.reviewCount} invoices
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">Blocked by errors</dt>
                    <dd className="text-rose-300">
                      {kpis.errorCount} invoices
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-400">
                      Last successful GP update
                    </dt>
                    <dd className="text-emerald-300">
                      Demo: a few minutes ago
                    </dd>
                  </div>
                </dl>
                <p className="text-[11px] text-slate-500">
                  Clear the review and error queues to keep GP, cashflow and
                  supplier intelligence fully current and safe to share with
                  finance and investors.
                </p>
              </div>
            </div>
          </div>

          {/* Behind the scenes explainer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                What ODYAN does with each invoice
              </p>
              <p className="text-sm text-slate-200">
                Not just storage. A full AI data pipeline optimised for
                restaurants.
              </p>
            </div>
            <ol className="space-y-2 text-xs text-slate-300">
              <li>
                <span className="text-slate-400">1.</span> OCR and parsing of
                every line, tax, discount and total even on low quality scans.
              </li>
              <li>
                <span className="text-slate-400">2.</span> Supplier recognition
                and normalisation so Marr Premium or FreshPoint UK look the
                same across all venues.
              </li>
              <li>
                <span className="text-slate-400">3.</span> Product and category
                mapping to your internal items, menu dishes, allergen matrix and
                GP model.
              </li>
              <li>
                <span className="text-slate-400">4.</span> Price benchmarking
                against your last 4 to 12 weeks across all sites and suppliers.
              </li>
              <li>
                <span className="text-slate-400">5.</span> GP and cashflow
                impact calculation plus anomaly detection on unusual shifts.
              </li>
              <li>
                <span className="text-slate-400">6.</span> Final clean dataset
                available to your dashboards, exports and finance tools.
              </li>
            </ol>
            <p className="text-[11px] text-slate-500">
              For investors this page proves that ODYAN is not just a report,
              but the system of record that produces reliable, auditable F and B
              data from raw invoices.
            </p>
          </div>
        </section>

        {/* Supplier and venue intelligence */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          {/* Aggregate spend and coverage */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Spend and coverage snapshot
                </p>
                <p className="text-sm text-slate-200">
                  Where your money flows and which part of the EL&N estate is
                  covered.
                </p>
              </div>
              <span className="text-[11px] text-slate-400">
                Summary based on recent invoices
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Total spend this week
                </p>
                <p className="text-xl font-semibold text-slate-100">
                  GBP{" "}
                  {kpis.weeklySpend.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[11px] text-slate-500">
                  Based only on invoices that have been ingested into ODYAN.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Suppliers this week
                </p>
                <p className="text-xl font-semibold text-slate-100">
                  {kpis.suppliersThisWeek}
                </p>
                <p className="text-[11px] text-slate-500">
                  ODYAN keeps a single identity for each supplier across all
                  venues.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Venues covered
                </p>
                <p className="text-xl font-semibold text-slate-100">
                  {kpis.venuesThisWeek}
                </p>
                <p className="text-[11px] text-slate-500">
                  The number of EL&N locations with invoices hitting ODYAN
                  recently.
                </p>
              </div>
            </div>
          </div>

          {/* Top suppliers mini view */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Top suppliers by spend
              </p>
              <p className="text-sm text-slate-200">
                Quick view of who you are paying most in the current window.
              </p>
            </div>
            <div className="space-y-2">
              {topSuppliers.length === 0 && (
                <p className="text-xs text-slate-500">
                  Once invoices start flowing in, ODYAN builds a live supplier
                  picture here.
                </p>
              )}
              {topSuppliers.map((s) => (
                <div
                  key={s.supplier}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-100">
                      {s.supplier}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Touching {s.venues.size} venue
                      {s.venues.size !== 1 ? "s" : ""} in this view
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-slate-100">
                    GBP{" "}
                    {s.totalThisWeek.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              In a full build ODYAN connects this to supplier negotiation,
              contract compliance and price alerts for buyers and finance.
            </p>
          </div>
        </section>

        {/* Data confidence by venue and data paths */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          {/* Confidence by venue */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Data confidence by venue
                </p>
                <p className="text-sm text-slate-200">
                  How strong the data is for each EL&N site and why.
                </p>
              </div>
              <span className="text-[11px] text-slate-400">
                Multiple data paths, one confidence score
              </span>
            </div>

            <div className="space-y-2">
              {venueConfidenceDemo.map((vc) => (
                <div
                  key={vc.venue}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-slate-100">
                        {vc.venue}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Confidence {vc.confidence} percent
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 rounded-full border border-slate-700 flex items-center justify-center text-[11px] text-slate-100">
                        {vc.confidence}
                        <span className="text-[9px] text-slate-500">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {vc.dataPaths.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100"
                      >
                        {p}
                      </span>
                    ))}
                    {vc.missing.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300"
                      >
                        Missing: {m}
                      </span>
                    ))}
                  </div>
                  {vc.missing.length > 0 && (
                    <p className="text-[11px] text-slate-500">
                      Connect {vc.missing.join(" and ")} to push this venue
                      above 95 percent and unlock stronger GP forecasts.
                    </p>
                  )}
                  {vc.missing.length === 0 && (
                    <p className="text-[11px] text-emerald-300/90">
                      This venue already uses all data paths, ideal for
                      investors and board reporting.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data paths explainer and export */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Data paths into ODYAN
                </p>
                <p className="text-sm text-slate-200">
                  Invoices are one path. ODYAN blends others when needed.
                </p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>
                  • Invoices: primary source for costs, supplier terms and tax.
                </li>
                <li>
                  • POS sales: used to estimate GP and mix even if some
                  invoices are delayed.
                </li>
                <li>
                  • Stock counts: tighten variance and shrinkage when teams
                  perform counts.
                </li>
                <li>
                  • Photo uploads: capture handwritten delivery notes or fridge
                  photos when paperwork is weak.
                </li>
              </ul>
              <p className="text-[11px] text-slate-500">
                When one path is missing, ODYAN clearly marks it and uses the
                others with adjusted confidence, instead of hiding gaps.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Export and audit
                </p>
                <p className="text-sm text-slate-200">
                  How finance and investors take this data outside ODYAN.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-100 hover:bg-slate-800">
                  Export clean dataset (CSV)
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-100 hover:bg-slate-800">
                  Send to finance tool
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-100 hover:bg-slate-800">
                  Open audit trail
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                In production these actions are backed by an auditable history
                of every mapping change, file upload and GP adjustment.
              </p>
            </div>
          </div>
        </section>

        {/* Filters and search */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Search and filters
              </p>
              <p className="text-xs text-slate-400">
                Focus on the invoices that actually need your attention.
              </p>
            </div>
            {loading && (
              <p className="text-[11px] text-slate-400">
                Loading invoices from ODYAN Supabase...
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search by supplier, venue or invoice ID"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/60"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 text-xs">
                ⌘K
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={venueFilter}
                onChange={(e) => {
                  setPage(1);
                  setVenueFilter(e.target.value);
                }}
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/60"
              >
                <option value="all">All venues</option>
                {venues.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>

              <div className="inline-flex items-center gap-1 rounded-full bg-slate-950/60 border border-slate-700 px-1 py-0.5 text-[11px]">
                {(
                  ["all", "ready", "needs_review", "error", "processing"] as const
                ).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setPage(1);
                      setStatusFilter(
                        s === "all" ? "all" : (s as InvoiceStatus)
                      );
                    }}
                    className={
                      "px-2 py-1 rounded-full transition text-xs " +
                      (statusFilter === s
                        ? "bg-fuchsia-500/80 text-white"
                        : "text-slate-300 hover:bg-slate-800")
                    }
                  >
                    {s === "all" ? "All" : statusLabel(s as InvoiceStatus)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ingestion alerts and mini intelligence */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          {/* Ingestion alerts section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Ingestion alerts
                </p>
                <p className="text-sm text-slate-200">
                  Supplier changes, price spikes and data issues detected in
                  real time.
                </p>
              </div>
              <span className="text-[11px] text-slate-400">
                {demoAlerts.length} active alerts
              </span>
            </div>

            <div className="space-y-3">
              {demoAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border " +
                            alertTypeClasses(alert.type)
                          }
                        >
                          {alert.type === "info"
                            ? "Info"
                            : alert.type === "warning"
                            ? "Attention"
                            : "Error"}
                        </span>
                        <p className="text-xs font-medium text-slate-100">
                          {alert.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {alert.detail}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {alert.timeAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90">
                    {alert.impact}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Use these alerts as your daily checklist. Clear them and ODYAN
              will keep your GP and supplier position fully up to date.
            </p>
          </div>

          {/* Mini intelligence summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                This week, ODYAN noticed
              </p>
              <p className="text-sm text-slate-200">
                A quick narrative on what invoices are really doing to your
                business.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                • Berry prices increased on FreshPoint UK. If nothing changes,
                your monthly cost rises by about 420 GBP at current EL&N volume.
              </li>
              <li>
                • La Fromagerie Milano appears on Hans Crescent invoices.
                Accepting this supplier mapping will keep your cheese GP history
                consistent.
              </li>
              <li>
                • Marr Premium is already normalised across London, so ODYAN
                can now compare like for like between Oxford Circus and
                Knightsbridge.
              </li>
              <li>
                • Any corrupted or blocked invoices temporarily reduce data
                confidence. Clearing them pushes the score back toward 98
                percent.
              </li>
            </ul>
            <p className="text-[11px] text-slate-500">
              In a full rollout this narrative is updated daily and pushed into
              the owner and GM daily brief.
            </p>
          </div>
        </section>

        {/* Focused invoice AI breakdown */}
        {selectedInvoice && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Invoice focus · AI breakdown
                </p>
                <p className="text-sm text-slate-200">
                  ODYAN’s view of a single invoice and why it matters.
                </p>
              </div>
              <div className="flex items-end gap-3 flex-wrap">
                <div className="text-right text-xs">
                  <p className="text-slate-400">Currently selected</p>
                  <p className="text-slate-100 font-medium">
                    {selectedInvoice.invoiceNumber}
                  </p>
                </div>
                <span
                  className={
                    "inline-flex items-center rounded-full px-3 py-1 text-[11px] border " +
                    getSeverityClasses(getInvoiceSeverity(selectedInvoice))
                  }
                >
                  {getSeverityLabel(getInvoiceSeverity(selectedInvoice))}
                </span>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] items-start">
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400">
                        {selectedInvoice.invoiceDate}
                      </p>
                      <p className="text-sm font-medium text-slate-100">
                        {selectedInvoice.supplierName}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-slate-400">Total invoice</p>
                      <p className="text-slate-100 font-semibold">
                        {selectedInvoice.currency}{" "}
                        {selectedInvoice.totalAmount.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 mt-2">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-400">Venue</span>
                      <span className="text-slate-100">
                        {selectedInvoice.venueName}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-400">Lines parsed</span>
                      <span className="text-slate-100">
                        {selectedInvoice.linesCount > 0
                          ? `${selectedInvoice.linesCount} items`
                          : "Pending OCR"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-400">Status</span>
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] " +
                          statusBadgeClasses(selectedInvoice.status)
                        }
                      >
                        {statusLabel(selectedInvoice.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <p className="text-xs font-medium text-slate-200">
                    ODYAN’s headline
                  </p>
                  <p className="text-xs text-slate-300">
                    {buildInvoiceSummary(selectedInvoice).headline}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <p className="text-xs font-medium text-slate-200">
                    What ODYAN sees in this invoice
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {buildInvoiceSummary(selectedInvoice).bullets.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <p className="text-xs font-medium text-slate-200">
                    Suggested actions
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {buildInvoiceSummary(selectedInvoice).actions.map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-slate-500 mt-1">
                    In the full product, confirming these actions would mark the
                    invoice as cleared and update GP, supplier and risk modules.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent invoices table */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Recent invoices
              </p>
              <p className="text-sm text-slate-200">
                The last invoices touching your GP model, across all EL&N
                venues.
              </p>
            </div>
            <span className="text-[11px] text-slate-400">
              Showing {recentInvoices.length} of {invoices.length} loaded
              invoices
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Invoice</th>
                  <th className="px-3 py-2 text-left font-medium">Venue</th>
                  <th className="px-3 py-2 text-left font-medium">Supplier</th>
                  <th className="px-3 py-2 text-right font-medium">Total</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Key issue</th>
                  <th className="px-3 py-2 text-left font-medium">Impact</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => {
                  const isSelected = inv.id === selectedInvoiceId;
                  return (
                    <tr
                      key={inv.id}
                      className={
                        "border-t border-slate-800/80 cursor-pointer transition " +
                        (isSelected
                          ? "bg-slate-900/80 border-fuchsia-500/40"
                          : "hover:bg-slate-900/60")
                      }
                      onClick={() => setSelectedInvoiceId(inv.id)}
                    >
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.invoiceDate}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-200 font-medium">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.venueName}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.supplierName}
                      </td>
                      <td className="px-3 py-2 align-top text-right text-slate-200">
                        {inv.currency}{" "}
                        {inv.totalAmount.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] " +
                            statusBadgeClasses(inv.status)
                          }
                        >
                          {statusLabel(inv.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.issues.length > 0
                          ? inv.issues[0]
                          : "No issues detected"}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.impactSummary}
                      </td>
                    </tr>
                  );
                })}

                {recentInvoices.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-xs text-slate-500"
                    >
                      No invoices found for the current filters.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-xs text-slate-400"
                    >
                      Loading invoices...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Full invoices list with pagination */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                All invoices
              </p>
              <p className="text-sm text-slate-200">
                The feed that powers ODYAN GP, cashflow and supplier analytics.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>
                Page {page} of {totalPages}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>{total} invoices in current query</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Invoice</th>
                  <th className="px-3 py-2 text-left font-medium">Venue</th>
                  <th className="px-3 py-2 text-left font-medium">Supplier</th>
                  <th className="px-3 py-2 text-right font-medium">Total</th>
                  <th className="px-3 py-2 text-left font-medium">Lines</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Issues</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const isSelected = inv.id === selectedInvoiceId;
                  return (
                    <tr
                      key={inv.id}
                      className={
                        "border-t border-slate-800/80 cursor-pointer transition " +
                        (isSelected
                          ? "bg-slate-900/80 border-fuchsia-500/40"
                          : "hover:bg-slate-900/60")
                      }
                      onClick={() => setSelectedInvoiceId(inv.id)}
                    >
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.invoiceDate}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-200 font-medium">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.venueName}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.supplierName}
                      </td>
                      <td className="px-3 py-2 align-top text-right text-slate-200">
                        {inv.currency}{" "}
                        {inv.totalAmount.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.linesCount > 0
                          ? `${inv.linesCount} lines`
                          : "Pending OCR"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] " +
                            statusBadgeClasses(inv.status)
                          }
                        >
                          {statusLabel(inv.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {inv.issues.length > 0
                          ? inv.issues.join(" · ")
                          : "No issues detected"}
                      </td>
                    </tr>
                  );
                })}

                {invoices.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-xs text-slate-500"
                    >
                      No invoices found for the current filters.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-xs text-slate-400"
                    >
                      Loading invoices...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] text-slate-400">
            <p>
              In production this table is paginated and backed by your invoice
              data store. ODYAN only loads what is needed for each view to keep
              the interface fast.
            </p>
            <div className="inline-flex items-center gap-2">
              <button
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
              >
                Previous
              </button>
              <button
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() =>
                  setPage((p) => (p < totalPages ? p + 1 : p))
                }
                disabled={page >= totalPages || loading}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
