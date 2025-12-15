import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type VenueSeed = {
  code: string;
  name: string;
  city: string;
  country: string;
};

type SupplierSeed = {
  name: string;
  country: string;
  currency: string;
};

type InvoiceSeed = {
  invoice_number: string;
  invoice_date: string;
  venue_code: string;
  supplier_name: string;
  currency: string;
  total_amount: number;
  status: "ready" | "needs_review" | "error" | "processing";
  issues: string[];
  impact_summary: string;
  estimated_monthly_impact?: number;
  lines_count: number;
  raw_source: string;
};

const venueSeeds: VenueSeed[] = [
  {
    code: "ELN_HANS",
    name: "EL&N Hans Crescent",
    city: "London",
    country: "UK",
  },
  {
    code: "ELN_OXFORD",
    name: "EL&N Oxford Circus",
    city: "London",
    country: "UK",
  },
  {
    code: "ELN_KNIGHTS",
    name: "EL&N Knightsbridge",
    city: "London",
    country: "UK",
  },
  {
    code: "ELN_DOHA_PV",
    name: "EL&N Doha Place Vendôme",
    city: "Doha",
    country: "Qatar",
  },
];

const supplierSeeds: SupplierSeed[] = [
  { name: "La Fromagerie Milano", country: "Italy", currency: "GBP" },
  { name: "Marr Premium", country: "UK", currency: "GBP" },
  { name: "Nordic Seafood UK", country: "UK", currency: "GBP" },
  { name: "Brindisa", country: "UK", currency: "GBP" },
  { name: "FreshPoint UK", country: "UK", currency: "GBP" },
  { name: "La Molisana", country: "Italy", currency: "GBP" },
];

const invoiceSeeds: InvoiceSeed[] = [
  {
    invoice_number: "INV-ELN-0421",
    invoice_date: "2025-12-04",
    venue_code: "ELN_HANS",
    supplier_name: "La Fromagerie Milano",
    total_amount: 4820.4,
    currency: "GBP",
    status: "needs_review",
    issues: ["New supplier mapping", "Unusual burrata price spike"],
    impact_summary: "Potential extra 310 GBP per month if not renegotiated.",
    estimated_monthly_impact: 310,
    lines_count: 46,
    raw_source: "simulated_upload",
  },
  {
    invoice_number: "INV-ELN-0419",
    invoice_date: "2025-12-04",
    venue_code: "ELN_OXFORD",
    supplier_name: "Marr Premium",
    total_amount: 3260.15,
    currency: "GBP",
    status: "ready",
    issues: [],
    impact_summary:
      "Prices within expected range for last 60 days, locked into GP history.",
    estimated_monthly_impact: 0,
    lines_count: 39,
    raw_source: "simulated_upload",
  },
  {
    invoice_number: "INV-ELN-0415",
    invoice_date: "2025-12-03",
    venue_code: "ELN_KNIGHTS",
    supplier_name: "Nordic Seafood UK",
    total_amount: 2189.9,
    currency: "GBP",
    status: "needs_review",
    issues: ["Missing allergen data on 3 lines"],
    impact_summary:
      "Menu allergen matrix incomplete for 2 seafood dishes until confirmed.",
    estimated_monthly_impact: 0,
    lines_count: 27,
    raw_source: "simulated_upload",
  },
  {
    invoice_number: "INV-ELN-0412",
    invoice_date: "2025-12-03",
    venue_code: "ELN_DOHA_PV",
    supplier_name: "Brindisa",
    total_amount: 5740.35,
    currency: "GBP",
    status: "processing",
    issues: ["OCR in progress"],
    impact_summary:
      "Estimated GP impact available once OCR and mapping complete.",
    lines_count: 0,
    raw_source: "simulated_upload",
  },
  {
    invoice_number: "INV-ELN-0407",
    invoice_date: "2025-12-02",
    venue_code: "ELN_HANS",
    supplier_name: "FreshPoint UK",
    total_amount: 1890.75,
    currency: "GBP",
    status: "error",
    issues: ["PDF corrupted", "Totals do not match line sum"],
    impact_summary:
      "Needs manual review before GP and cashflow can be updated.",
    estimated_monthly_impact: 0,
    lines_count: 0,
    raw_source: "simulated_upload",
  },
  {
    invoice_number: "INV-ELN-0399",
    invoice_date: "2025-12-01",
    venue_code: "ELN_OXFORD",
    supplier_name: "Marr Premium",
    total_amount: 2998.3,
    currency: "GBP",
    status: "ready",
    issues: [],
    impact_summary:
      "Locked into GP history and supplier benchmarks across London venues.",
    estimated_monthly_impact: 0,
    lines_count: 33,
    raw_source: "simulated_upload",
  },
  {
    invoice_number: "INV-ELN-0394",
    invoice_date: "2025-11-30",
    venue_code: "ELN_KNIGHTS",
    supplier_name: "La Molisana",
    total_amount: 1120.12,
    currency: "GBP",
    status: "ready",
    issues: ["New pasta format detected"],
    impact_summary:
      "Auto mapped to existing pasta category, GP unchanged after confirmation.",
    estimated_monthly_impact: 0,
    lines_count: 18,
    raw_source: "simulated_upload",
  },
  {
    invoice_number: "INV-ELN-0388",
    invoice_date: "2025-11-29",
    venue_code: "ELN_DOHA_PV",
    supplier_name: "FreshPoint UK",
    total_amount: 2045.5,
    currency: "GBP",
    status: "needs_review",
    issues: ["Berry prices +14 percent vs 4 week average"],
    impact_summary:
      "Predicted monthly impact plus 420 GBP at current volume if unchanged.",
    estimated_monthly_impact: 420,
    lines_count: 22,
    raw_source: "simulated_upload",
  },
];

export async function POST() {
  const supabase = supabaseServer;

  try {
    // 1) Ensure venues exist and map code -> id
    const venueCodes = venueSeeds.map((v) => v.code);

    const { data: existingVenues, error: venuesSelectError } = await supabase
      .from("venues")
      .select("id, code")
      .in("code", venueCodes);

    if (venuesSelectError) {
      console.error("Error selecting venues:", venuesSelectError);
      return NextResponse.json(
        { error: "Failed to read venues" },
        { status: 500 }
      );
    }

    const venueIdByCode = new Map<string, string>();
    (existingVenues ?? []).forEach((v: any) => {
      venueIdByCode.set(v.code, v.id);
    });

    const missingVenues = venueSeeds.filter(
      (v) => !venueIdByCode.has(v.code)
    );

    if (missingVenues.length > 0) {
      const { data: insertedVenues, error: venuesInsertError } = await supabase
        .from("venues")
        .insert(
          missingVenues.map((v) => ({
            code: v.code,
            name: v.name,
            city: v.city,
            country: v.country,
          }))
        )
        .select("id, code");

      if (venuesInsertError) {
        console.error("Error inserting venues:", venuesInsertError);
        return NextResponse.json(
          { error: "Failed to insert venues" },
          { status: 500 }
        );
      }

      (insertedVenues ?? []).forEach((v: any) => {
        venueIdByCode.set(v.code, v.id);
      });
    }

    // 2) Ensure suppliers exist and map name -> id
    const supplierNames = supplierSeeds.map((s) => s.name);

    const { data: existingSuppliers, error: suppliersSelectError } =
      await supabase
        .from("suppliers")
        .select("id, name")
        .in("name", supplierNames);

    if (suppliersSelectError) {
      console.error("Error selecting suppliers:", suppliersSelectError);
      return NextResponse.json(
        { error: "Failed to read suppliers" },
        { status: 500 }
      );
    }

    const supplierIdByName = new Map<string, string>();
    (existingSuppliers ?? []).forEach((s: any) => {
      supplierIdByName.set(s.name, s.id);
    });

    const missingSuppliers = supplierSeeds.filter(
      (s) => !supplierIdByName.has(s.name)
    );

    if (missingSuppliers.length > 0) {
      const { data: insertedSuppliers, error: suppliersInsertError } =
        await supabase
          .from("suppliers")
          .insert(
            missingSuppliers.map((s) => ({
              name: s.name,
              country: s.country,
              currency: s.currency,
            }))
          )
          .select("id, name");

      if (suppliersInsertError) {
        console.error("Error inserting suppliers:", suppliersInsertError);
        return NextResponse.json(
          { error: "Failed to insert suppliers" },
          { status: 500 }
        );
      }

      (insertedSuppliers ?? []).forEach((s: any) => {
        supplierIdByName.set(s.name, s.id);
      });
    }

    // 3) Avoid duplicate invoices by invoice_number
    const seedNumbers = invoiceSeeds.map((i) => i.invoice_number);

    const { data: existingInvoices, error: invoicesSelectError } =
      await supabase
        .from("invoices")
        .select("invoice_number")
        .in("invoice_number", seedNumbers);

    if (invoicesSelectError) {
      console.error("Error selecting invoices:", invoicesSelectError);
      return NextResponse.json(
        { error: "Failed to read invoices" },
        { status: 500 }
      );
    }

    const existingNumbers = new Set<string>(
      (existingInvoices ?? []).map((i: any) => i.invoice_number)
    );

    const invoicesToInsert = invoiceSeeds.filter(
      (inv) => !existingNumbers.has(inv.invoice_number)
    );

    if (invoicesToInsert.length === 0) {
      return NextResponse.json({
        inserted: 0,
        skipped: invoiceSeeds.length,
        message:
          "Demo invoices already seeded. You can refresh the page to see them.",
      });
    }

    // 4) Insert invoices
    const { error: insertInvoicesError } = await supabase
      .from("invoices")
      .insert(
        invoicesToInsert.map((inv) => ({
          invoice_number: inv.invoice_number,
          invoice_date: inv.invoice_date,
          currency: inv.currency,
          total_amount: inv.total_amount,
          status: inv.status,
          issues: inv.issues,
          impact_summary: inv.impact_summary,
          estimated_monthly_impact: inv.estimated_monthly_impact ?? null,
          lines_count: inv.lines_count,
          raw_source: inv.raw_source,
          venue_id: venueIdByCode.get(inv.venue_code) ?? null,
          supplier_id: supplierIdByName.get(inv.supplier_name) ?? null,
        }))
      );

    if (insertInvoicesError) {
      console.error("Error inserting invoices:", insertInvoicesError);
      return NextResponse.json(
        { error: "Failed to insert invoices" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      inserted: invoicesToInsert.length,
      skipped: existingNumbers.size,
      message: `Seeded ${invoicesToInsert.length} demo invoices for EL&N.`,
    });
  } catch (err) {
    console.error("Unexpected error in seed-demo:", err);
    return NextResponse.json(
      { error: "Unexpected error while seeding demo data" },
      { status: 500 }
    );
  }
}
