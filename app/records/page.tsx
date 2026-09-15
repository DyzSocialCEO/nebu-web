import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import { buildPlaylist } from "@/lib/playlist";
import RecordsList from "@/components/RecordsList";
import "./records.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "RECORDS — NEBUCHADREKTZAR",
  description: "i was extremely liquid. now i rap.",
};

export default async function RecordsPage() {
  const data = await getSiteData();

  return (
    <main className="records-page">
      <RecordsList tracks={buildPlaylist(data)} fallbackCover={data.featuredBroadcast.imageUrl} />
    </main>
  );
}
