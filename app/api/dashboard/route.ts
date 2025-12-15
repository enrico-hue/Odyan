// app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import { getMockDashboard } from "@/lib/data/mockDashboard";

export async function GET() {
  const snapshot = await getMockDashboard();
  return NextResponse.json(snapshot);
}
