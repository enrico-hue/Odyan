import { OdyanInvoice } from "@/types/procurement";

export const mockInvoices: OdyanInvoice[] = [
  {
    id: "INV-9482",
    supplierName: "Elysian Dairy",
    venueName: "SINN Sandton",
    channel: "PDF",
    totalGross: 1984,
    currency: "GBP",
    linesMapped: 124,
    linesTotal: 124,
    priceMovesCount: 3,
    ingestionStatus: "Attention",
    seenAt: new Date().toISOString(),
  },
  {
    id: "INV-9479",
    supplierName: "Prime Meats",
    venueName: "Colicci Southbank",
    channel: "CSV",
    totalGross: 3412,
    currency: "GBP",
    linesMapped: 89,
    linesTotal: 93,
    priceMovesCount: 2,
    ingestionStatus: "Attention",
    seenAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
  },
  {
    id: "INV-9475",
    supplierName: "FreshPoint",
    venueName: "Group central",
    channel: "Photo",
    totalGross: 960,
    currency: "GBP",
    linesMapped: 67,
    linesTotal: 67,
    priceMovesCount: 0,
    ingestionStatus: "OK",
    seenAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
  },
  {
    id: "INV-9472",
    supplierName: "Dry Store Co",
    venueName: "SINN Sandton",
    channel: "API",
    totalGross: 742,
    currency: "GBP",
    linesMapped: 52,
    linesTotal: 52,
    priceMovesCount: 1,
    ingestionStatus: "OK",
    seenAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20h ago
  },
];
