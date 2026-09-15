"use client";

import { useState } from "react";

type Props = {
  contractAddress: string;
  buyUrl: string;
};

export default function TokenPanel({ contractAddress, buyUrl }: Props) {
  const [status, setStatus] = useState("");
  const chartUrl = contractAddress
    ? `https://dexscreener.com/search?q=${encodeURIComponent(contractAddress)}`
    : "";

  async function copyAddress() {
    if (!contractAddress) return;
    try {
      await navigator.clipboard.writeText(contractAddress);
      setStatus("copied. try not to paste it into the wrong chat.");
    } catch {
      setStatus("copy failed — select the address manually.");
    }
  }

  async function shareSite() {
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "NEBUCHADREKTZAR | $N3BU",
          text: "full-time rapper. temporarily illiquid.",
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("site link copied.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("share failed — copy nebuchadrektzar.xyz.");
    }
  }

  return (
    <div className="token-panel">
      <div className="token-ca-heading">
        <span>CONTRACT ADDRESS</span>
        <small>SOLANA</small>
      </div>

      <div className={`token-ca-box ${contractAddress ? "is-live" : ""}`}>
        <code>{contractAddress || "CA SOON"}</code>
        {contractAddress && <button type="button" onClick={copyAddress}>COPY ↗</button>}
      </div>

      {buyUrl ? (
        <a className="token-buy" href={buyUrl} target="_blank" rel="noopener noreferrer">BUY $N3BU ↗</a>
      ) : (
        <div className="token-buy token-buy--waiting">BUY LINK SOON</div>
      )}

      <div className="token-utility-row">
        {chartUrl && <a href={chartUrl} target="_blank" rel="noopener noreferrer">CHART ↗</a>}
        <button type="button" onClick={shareSite}>SHARE ↗</button>
      </div>

      {status && <p className="token-status" role="status">{status}</p>}
    </div>
  );
}
