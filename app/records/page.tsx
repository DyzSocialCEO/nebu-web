import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import RecordsList from "@/components/RecordsList";
import SiteNav from "@/components/SiteNav";
import "./records.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NEBUCHADREKTZAR — everything i have made",
  description: "i was extremely liquid. now i rap.",
};

export default async function RecordsPage() {
  const data = await getSiteData();

  return (
    <main className="records-page has-tabs">
      <div className="records-plate" aria-hidden="true" />
      <div className="records-shade" aria-hidden="true" />
      <SiteNav active="records" hireEnabled={data.hire.enabled} />

      <header className="records-head">
        <span className="records-kicker">NEBUCHADREKTZAR RECORDS</span>
        <h1>EVERYTHING<br />I HAVE MADE</h1>
        <p>newest first. they are all my best work.</p>
      </header>

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

      <footer className="records-foot">
        <a href="/">← back to nebu</a>
      </footer>
    </main>
  );
}
