// lib/data/mockInvoices.ts

import type { PurchaseInvoiceSummary } from "@/types/procurement";

export const mockInvoiceSummaries: PurchaseInvoiceSummary[] = [
  {
    id: "inv-001",
    supplierName: "FreshFields Produce Ltd",
    invoiceNumber: "FF-2024-1189",
    issueDate: "2024-11-28",
    dueDate: "2024-12-12",
    status: "open",
    totalGross: 1842.35,
    currency: "GBP",
  },
  {
    id: "inv-002",
    supplierName: "OceanCatch Seafood",
    invoiceNumber: "OC-2024-771",
    issueDate: "2024-11-26",
    dueDate: "2024-12-10",
    status: "overdue",
    totalGross: 964.5,
    currency: "GBP",
  },
  {
    id: "inv-003",
    supplierName: "MetroDry Goods",
    invoiceNumber: "MD-2024-443",
    issueDate: "2024-11-20",
    dueDate: "2024-12-04",
    status: "paid",
    totalGross: 2310.1,
    currency: "GBP",
  },
];

export async function getMockInvoiceSummaries(): Promise<PurchaseInvoiceSummary[]> {
  return mockInvoiceSummaries;
}
