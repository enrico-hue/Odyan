import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import type {
  Invoice,
  InvoiceStatus,
  InvoicesQuery,
  InvoicesResponse,
  InvoicesResponseSummary,
} from "@/types/invoices";

function parseQuery(searchParams: URLSearchParams): InvoicesQuery {
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "20");
  const statusParam = searchParams.get("status") ?? "all";
  const venue = searchParams.get("venue") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const safePage = isNaN(page) || page < 1 ? 1 : page;
  const safePageSize = isNaN(pageSize) || pageSize < 1 ? 20 : pageSize;

  const status = statusParam as InvoiceStatus | "all";

  return {
    page: safePage,
    pageSize: safePageSize,
    status,
    venue,
    search,
  };
}

function buildFilters(
  query: InvoicesQuery,
  base:
    | ReturnType<typeof supabaseServer["from"]>["select"]
    | any
) {
  let q = base;

  if (query.status && query.status !== "all") {
    q = q.eq("status", query.status);
  }

  if (query.venue) {
    // Filter by joined venue name
    q = q.eq("venues.name", query.venue);
  }

  if (query.search && query.search.trim().length > 0) {
    const s = query.search.trim();
    q = q.or(
      [
        `invoice_number.ilike.%${s}%`,
        `suppliers.name.ilike.%${s}%`,
        `venues.name.ilike.%${s}%`,
      ].join(",")
    );
  }

  return q;
}

function computeSummaryFromRows(rows: any[]): InvoicesResponseSummary {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 Sunday, 1 Monday
  const diffToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - diffToMonday
  );

  const parsed = rows.map((row) => {
    const date = new Date(row.invoice_date);
    return {
      invoice_date: date,
      total_amount: Number(row.total_amount ?? 0),
      status: row.status as InvoiceStatus,
      lines_count: Number(row.lines_count ?? 0),
      estimated_monthly_impact: Number(
        row.estimated_monthly_impact ?? 0
      ),
      supplier_id: row.supplier_id as string | null,
      venue_id: row.venue_id as string | null,
    };
  });

  const thisWeekInvoices = parsed.filter(
    (row) => row.invoice_date >= monday
  );
  const thisWeekCount = thisWeekInvoices.length;

  const weeklySpend = thisWeekInvoices.reduce(
    (sum, row) => sum + row.total_amount,
    0
  );

  const autoClassifiedLines = parsed.reduce(
    (sum, row) => sum + row.lines_count,
    0
  );

  const reviewCount = parsed.filter(
    (row) => row.status === "needs_review"
  ).length;
  const errorCount = parsed.filter(
    (row) => row.status === "error"
  ).length;

  const suppliersThisWeek = new Set(
    thisWeekInvoices
      .map((row) => row.supplier_id)
      .filter((id) => !!id)
  ).size;
  const venuesThisWeek = new Set(
    thisWeekInvoices
      .map((row) => row.venue_id)
      .filter((id) => !!id)
  ).size;

  const withImpact = parsed.filter(
    (row) => (row.estimated_monthly_impact ?? 0) > 0
  );
  const monthlyExtraCostRisk = withImpact.reduce(
    (sum, row) => sum + (row.estimated_monthly_impact ?? 0),
    0
  );
  const monthlyExtraCostInvoices = withImpact.length;

  const mappedSuppliers = new Set(
    parsed
      .map((row) => row.supplier_id)
      .filter((id) => !!id)
  ).size;

  const rawConfidence = 100 - (reviewCount + errorCount) * 2;
  const dataConfidence = Math.max(70, Math.min(99, rawConfidence));

  return {
    thisWeekCount,
    weeklySpend,
    mappedSuppliers,
    autoClassifiedLines,
    dataConfidence,
    reviewCount,
    errorCount,
    suppliersThisWeek,
    venuesThisWeek,
    monthlyExtraCostRisk,
    monthlyExtraCostInvoices,
  };
}

function mapRowToInvoice(row: any): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    invoiceDate: row.invoice_date,
    venueName: row.venues?.name ?? "Unknown venue",
    venueId: row.venue_id ?? undefined,
    supplierName: row.suppliers?.name ?? "Unknown supplier",
    supplierId: row.supplier_id ?? undefined,
    currency: row.currency,
    totalAmount: Number(row.total_amount ?? 0),
    status: row.status as InvoiceStatus,
    issues: row.issues ?? [],
    impactSummary: row.impact_summary ?? "",
    estimatedMonthlyImpact:
      row.estimated_monthly_impact != null
        ? Number(row.estimated_monthly_impact)
        : undefined,
    linesCount: Number(row.lines_count ?? 0),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = parseQuery(searchParams);

  const supabase = supabaseServer;

  // 1) Main paginated query
  const from = (query.page! - 1) * query.pageSize!;
  const to = from + query.pageSize! - 1;

  let baseQuery = supabase
    .from("invoices")
    .select(
      `
      id,
      invoice_number,
      invoice_date,
      currency,
      total_amount,
      status,
      issues,
      impact_summary,
      estimated_monthly_impact,
      lines_count,
      venue_id,
      supplier_id,
      venues:venue_id (
        name
      ),
      suppliers:supplier_id (
        name
      )
    `,
      { count: "exact" }
    )
    .order("invoice_date", { ascending: false });

  baseQuery = buildFilters(query, baseQuery);

  const { data, error, count } = await baseQuery.range(from, to);

  if (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }

  const invoices: Invoice[] = (data ?? []).map(mapRowToInvoice);
  const total = count ?? invoices.length;

  // 2) Lightweight summary query
  // We fetch at most 500 rows for summary to avoid giant loads.
  let summaryQuery = supabase
    .from("invoices")
    .select(
      `
      invoice_date,
      total_amount,
      status,
      lines_count,
      estimated_monthly_impact,
      venue_id,
      supplier_id
    `
    )
    .order("invoice_date", { ascending: false })
    .range(0, 499);

  summaryQuery = buildFilters(query, summaryQuery);

  const { data: summaryRows, error: summaryError } = await summaryQuery;

  if (summaryError) {
    console.error("Error fetching summary invoices:", summaryError);
    return NextResponse.json(
      { error: "Failed to compute summary" },
      { status: 500 }
    );
  }

  const summary: InvoicesResponseSummary = computeSummaryFromRows(
    summaryRows ?? []
  );

  const response: InvoicesResponse = {
    invoices,
    total,
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    summary,
  };

  return NextResponse.json(response);
}
