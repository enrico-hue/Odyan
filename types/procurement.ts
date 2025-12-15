// types/procurement.ts

export type PurchaseInvoiceStatus = "open" | "paid" | "overdue";

export type PurchaseInvoiceSummary = {
  id: string;
  supplierName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: PurchaseInvoiceStatus;
  totalGross: number;
  currency: string;
};
export type IngestionChannel = "PDF" | "CSV" | "Photo" | "API";

export interface OdyanInvoice {
  id: string;
  supplierName: string;
  venueName: string;
  channel: IngestionChannel;
  totalGross: number;           // in base currency
  currency: string;             // "GBP", "ZAR", etc.
  linesMapped: number;
  linesTotal: number;
  priceMovesCount: number;      // how many SKUs changed price vs last time
  ingestionStatus: "OK" | "Attention";
  seenAt: string;               // ISO string
}
