import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteData, saveSiteData } from "@/lib/site-data";
import {
  inspectAdminRateLimit,
  registerAdminFailure,
  registerAdminSuccess,
} from "@/lib/admin-rate-limit";

export const dynamic = "force-dynamic";

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function rateLimited(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many failed attempts. Try again later." },
    {
      status: 429,
      headers: {
        ...PRIVATE_HEADERS,
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

function authorize(request: Request) {
  const limit = inspectAdminRateLimit(request);
  if (!limit.allowed) return rateLimited(limit.retryAfterSeconds);

  if (!isAdminRequest(request)) {
    const retryAfterSeconds = registerAdminFailure(request);
    if (retryAfterSeconds) return rateLimited(retryAfterSeconds);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_HEADERS },
    );
  }

  registerAdminSuccess(request);
  return null;
}

export async function GET(request: Request) {
  const denied = authorize(request);
  if (denied) return denied;

  return NextResponse.json(await getSiteData(), {
    headers: PRIVATE_HEADERS,
  });
}

export async function PUT(request: Request) {
  const denied = authorize(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    return NextResponse.json(await saveSiteData(body), {
      headers: PRIVATE_HEADERS,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400, headers: PRIVATE_HEADERS },
    );
  }
}
