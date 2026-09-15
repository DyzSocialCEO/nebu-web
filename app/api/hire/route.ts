import { NextResponse } from "next/server";
import { createHireSubmission } from "@/lib/hire-data";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
const attempts = new Map<string, number[]>();

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("cf-connecting-ip") || "unknown";
}

function allowed(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter(value => now - value < WINDOW_MS);
  if (recent.length >= MAX_SUBMISSIONS) {
    attempts.set(key, recent);
    return false;
  }
  recent.push(now);
  attempts.set(key, recent);
  return true;
}

export async function POST(request: Request) {
  if (!allowed(request)) {
    return NextResponse.json(
      { error: "i have heard enough from this device for one hour." },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "3600" } },
    );
  }

  try {
    const site = await getSiteData();
    if (!site.hire.enabled || !site.hire.walletAddress || !site.hire.rateAmount) {
      return NextResponse.json(
        { error: "commissions are not open yet. this is an administrative tragedy." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = await request.json() as Record<string, unknown>;
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    const saved = createHireSubmission({
      handle: body.handle,
      credit: body.credit,
      story: body.story,
      coin: body.coin,
      mood: body.mood,
      paymentTx: body.paymentTx,
      quotedRate: site.hire.rateAmount,
    });

    return NextResponse.json(
      { ok: true, id: saved.id },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid";
    const copy = message === "handle"
      ? "i need a handle. fame requires paperwork."
      : message === "story"
        ? "that is not a story yet. give me something to work with."
        : message === "paymentTx"
          ? "prove you paid me. paste the transaction."
          : "something broke. it was probably me. try again.";

    return NextResponse.json(
      { error: copy },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
