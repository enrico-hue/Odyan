import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase env vars are missing for invoice-uploads/[id]");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

const VALID_STATUSES = ["uploaded", "processing", "completed", "failed"] as const;

export async function PATCH(req: NextRequest) {
  // Get id directly from the URL path so we don't depend on params wiring
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  // e.g. /api/invoice-uploads/<id>  -> last segment is the id
  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json(
      { error: "Missing upload id" },
      { status: 400 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const status =
    typeof body.status === "string" ? body.status : "completed";

  if (!VALID_STATUSES.includes(status as any)) {
    return NextResponse.json(
      {
        error: "Invalid status value",
        detail: `Must be one of: ${VALID_STATUSES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("invoice_uploads")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single<InvoiceUploadRow>();

  if (error) {
    console.error("Error updating invoice_uploads status", error);
    return NextResponse.json(
      {
        error: "Failed to update invoice upload",
        detail: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ upload: data });
}
