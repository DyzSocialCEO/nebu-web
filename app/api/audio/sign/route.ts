import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/site-data";
import { signBunnyUrl } from "@/lib/bunny-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestedTrack = new URL(request.url).searchParams.get("track");
  const data = await getSiteData();

  const source = requestedTrack
    ? data.tracks.find(track => track.id === requestedTrack)?.audioUrl || ""
    : data.featuredBroadcast.audioUrl;

  if (!source) {
    return NextResponse.json({ error: "audio_not_found" }, {
      status: 404,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }

  try {
    const signed = signBunnyUrl(source);
    return NextResponse.json(signed, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ error: "audio_signing_unavailable" }, {
      status: 503,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }
}
