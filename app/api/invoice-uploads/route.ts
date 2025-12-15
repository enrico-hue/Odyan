import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase env vars are missing");
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

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export async function GET() {
  const { data, error } = await supabase
    .from("invoice_uploads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching invoice_uploads", error);
    return NextResponse.json(
      { error: "Failed to load invoice uploads", detail: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    uploads: (data as InvoiceUploadRow[]) ?? [],
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Missing file field" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "Empty file" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Max 15 MB" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    const bucketName = "invoice-uploads"; // ensure this bucket exists
    const ext = file.name.includes(".")
      ? file.name.split(".").pop()
      : undefined;

    const safeExt = ext || "bin";
    const filePath = `raw/${Date.now()}-${crypto.randomUUID()}.${safeExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      console.error("Supabase storage upload error", storageError);
      return NextResponse.json(
        {
          error: "Failed to store file",
          detail: storageError.message,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      return NextResponse.json(
        { error: "Could not get file public URL" },
        { status: 500 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("invoice_uploads")
      .insert({
        status: "processing",
        source_file_url: publicUrl,
        original_filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        parsed_invoice_id: null,
        error_message: null,
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Error inserting invoice_upload row", insertError);
      return NextResponse.json(
        {
          error: "Failed to create invoice upload record",
          detail: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        upload: inserted as InvoiceUploadRow,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Unexpected error in invoice-uploads POST", err);
    return NextResponse.json(
      { error: "Unexpected server error", detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
