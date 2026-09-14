import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteData, saveSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

function denied() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return denied();
  return NextResponse.json(await getSiteData(), {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return denied();
  try {
    const body = await request.json();
    return NextResponse.json(await saveSiteData(body), {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
