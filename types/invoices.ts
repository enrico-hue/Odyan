export type InvoiceStatus = "ready" | "needs_review" | "error" | "processing";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string; // ISO string or "YYYY-MM-DD"
  venueName: string;
  venueId?: string;
  supplierName: string;
  supplierId?: string;
  currency: string;
  totalAmount: number;
  status: InvoiceStatus;
  issues: string[];
  impactSummary: string;
  estimatedMonthlyImpact?: number;
  linesCount: number;
}

export interface InvoicesQuery {
  page?: number;
  pageSize?: number;
  status?: InvoiceStatus | "all";
  venue?: string;
  search?: string;
}

export interface InvoicesResponseSummary {
  thisWeekCount: number;
  weeklySpend: number;
  mappedSuppliers: number;
  autoClassifiedLines: number;
  dataConfidence: number;
  reviewCount: number;
  errorCount: number;
  suppliersThisWeek: number;
  venuesThisWeek: number;
  monthlyExtraCostRisk: number;
  monthlyExtraCostInvoices: number;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  pageSize: number;
  summary: InvoicesResponseSummary;
}
