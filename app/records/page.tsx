import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import RecordsList from "@/components/RecordsList";
import "./records.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NEBUCHADREKTZAR — everything i have made",
  description: "i was extremely liquid. now i rap.",
};

export default async function RecordsPage() {
  const data = await getSiteData();

  return (
    <main className="records-page">
      <div className="records-plate" aria-hidden="true" />
      <div className="records-shade" aria-hidden="true" />

      <header className="records-head">
        <a className="records-back" href="/">&#8592; back</a>
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
          },
          ...[...data.tracks].reverse(),
        ].filter(track => track.audioUrl)}
        fallbackCover={data.featuredBroadcast.imageUrl}
      />

      <footer className="records-foot">
        <a href="/">&#8592; back to me</a>
      </footer>
    </main>
  );
}
