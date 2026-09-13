import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSiteData(), {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
