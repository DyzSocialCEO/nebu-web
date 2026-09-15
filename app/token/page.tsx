import type { Metadata } from "next";
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

      <section className="token-shell">
        <h1>$N3BU</h1>
        <span className="token-chain">SOLANA</span>
        <TokenPanel contractAddress={data.contractAddress} buyUrl={data.buyUrl} />
      </section>
    </main>
  );
}
