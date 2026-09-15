import type { Metadata } from "next";
import Atmosphere from "@/components/Atmosphere";
import { getSiteData } from "@/lib/site-data";
import RecordsList from "@/components/RecordsList";
import SiteNav from "@/components/SiteNav";
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
      <Atmosphere />
      <SiteNav active="records" hireEnabled={data.hire.enabled} buyUrl={data.buyUrl} />

      <RecordsList
        tracks={[
          {
            id: "featured",
            title: data.featuredBroadcast.title,
            audioUrl: data.featuredBroadcast.audioUrl,
            story: data.featuredBroadcast.subtitle,
            imageUrl: data.featuredBroadcast.imageUrl,
            credit: "",
          },
          ...[...data.tracks].reverse(),
        ].filter(track => track.audioUrl)}
        fallbackCover={data.featuredBroadcast.imageUrl}
      />
    </main>
  );
}
