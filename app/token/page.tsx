import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import TokenPanel from "@/components/TokenPanel";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "$N3BU — NEBUCHADREKTZAR",
  description: "buy the token. support the arts.",
};

export default async function TokenPage() {
  const data = await getSiteData();

  return (
    <main className="token-page">
      <SiteNav active="token" hireEnabled={data.hire.enabled} />

      <section className="token-shell">
        <div className="page-brand">
          <img src="/nebu-avatar.webp" alt="" width={160} height={160} />
          <div>
            <b>NEBUCHADREKTZAR</b>
            <span>THE RAPPER FOR THE TRENCHES.</span>
          </div>
        </div>

        <span className="page-kicker">SUPPORT THE ARTS</span>
        <h1>$N3BU</h1>
        <p className="lead">i make music now. shit happened.</p>

        <TokenPanel contractAddress={data.contractAddress} buyUrl={data.buyUrl} />
        <p className="token-footnote">the contract address is the source of truth. check it before doing anything heroic.</p>
      </section>
    </main>
  );
}
