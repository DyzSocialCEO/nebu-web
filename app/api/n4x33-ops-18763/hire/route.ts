import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { inspectAdminRateLimit, registerAdminFailure, registerAdminSuccess } from "@/lib/admin-rate-limit";
import { listHireSubmissions, updateHireSubmission } from "@/lib/hire-data";

export const dynamic = "force-dynamic";

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function rateLimited(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many failed attempts. Try again later." },
    { status: 429, headers: { ...PRIVATE_HEADERS, "Retry-After": String(retryAfterSeconds) } },
  );
}

function authorize(request: Request) {
  const limit = inspectAdminRateLimit(request);
  if (!limit.allowed) return rateLimited(limit.retryAfterSeconds);

  if (!isAdminRequest(request)) {
    const retryAfterSeconds = registerAdminFailure(request);
    if (retryAfterSeconds) return rateLimited(retryAfterSeconds);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: PRIVATE_HEADERS });
  }

  registerAdminSuccess(request);
  return null;
}

export async function GET(request: Request) {
  const denied = authorize(request);
  if (denied) return denied;
  return NextResponse.json({ submissions: listHireSubmissions() }, { headers: PRIVATE_HEADERS });
}

export async function PATCH(request: Request) {
  const denied = authorize(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const submission = updateHireSubmission(body);
    return NextResponse.json({ submission }, { headers: PRIVATE_HEADERS });
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid";
    return NextResponse.json(
      { error: message === "not-found" ? "Submission not found" : "Invalid payload" },
      { status: message === "not-found" ? 404 : 400, headers: PRIVATE_HEADERS },
    );
  }
}
