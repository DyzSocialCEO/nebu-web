import type { Metadata } from "next";
import Atmosphere from "@/components/Atmosphere";
import SiteNav from "@/components/SiteNav";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NOTICE — NEBUCHADREKTZAR",
  description: "important business. unfortunately.",
};

export default async function NoticePage() {
  const data = await getSiteData();

  return (
    <main className="notice-page">
      <Atmosphere />
      <SiteNav active="notice" hireEnabled={data.hire.enabled} buyUrl={data.buyUrl} />

      <section className="notice-shell">
        <article className="notice-card">
          <h2>apparently i am a content creator now.</h2>
          <div className="notice-copy">
            <p>terrible development. i also rap.</p>
            <p>when your bag pumps, dumps, rugs or comes back from the dead, i&rsquo;ll be around making the soundtrack while pretending my own portfolio is fine.</p>
            <p>if the music helps, support the arts.</p>
            <p>rent remains aggressively denominated in fiat.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
