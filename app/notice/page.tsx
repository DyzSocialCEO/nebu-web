import type { Metadata } from "next";
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
      <SiteNav active="notice" hireEnabled={data.hire.enabled} />

      <section className="notice-shell">
        <div className="page-brand">
          <img src="/nebu-avatar.webp" alt="" width={160} height={160} />
          <div>
            <b>NEBUCHADREKTZAR</b>
            <span>IMPORTANT BUSINESS. UNFORTUNATELY.</span>
          </div>
        </div>

        <span className="page-kicker">FROM NEBU</span>
        <h1>NOTICE<br />BOARD</h1>
        <p className="lead">records, announcements and other matters affecting the arts.</p>

        <div className="notice-list">
          <article className="notice-card">
            <div className="notice-meta">
              <span>15 SEP 2026</span>
              <span>CAREER UPDATE</span>
            </div>
            <h2>apparently i am a content creator now.</h2>
            <div className="notice-copy">
              <p>terrible development. i also rap.</p>
              <p>so when your bag pumps, dumps, rugs, round-trips a 40x or somehow comes back from the dead, i’ll be around making the soundtrack and acting like my own portfolio is fine.</p>
              <p>listen to the records. laugh a little. support the talent if you see the vision.</p>
              <p>rent remains aggressively denominated in fiat.</p>
            </div>
          </article>
        </div>

        <div className="notice-next">next notice: whenever i have something important to say or require attention.</div>
      </section>
    </main>
  );
}
