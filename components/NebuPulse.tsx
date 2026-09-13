"use client";

import styles from "./NebuPulse.module.css";
import type { PulseCategory } from "@/lib/pulse-bank";

export type PulseDisplayEvent = {
  id: string;
  category: PulseCategory;
  text: string;
  timestamp: string;
  amountLabel?: string;
};

export default function NebuPulse({ latest = null }: { latest?: PulseDisplayEvent | null }) {
  return (
    <div className={styles.box} aria-live="polite" aria-label="NEBU Pulse">
      <div className={styles.head}>
        <span><i className={styles.dot} />watching, as usual</span>
        <b>{latest ? "live" : "feed standby"}</b>
      </div>
      {latest ? (
        <div className={`${styles.line} ${styles[latest.category.includes("sell") ? "sell" : latest.category.includes("buy") ? "buy" : "quiet"]}`}>
          <span className={styles.who}>{latest.amountLabel || latest.category.replaceAll("_", " ")}</span>
          <p>{latest.text}</p>
          <small>{latest.timestamp}</small>
        </div>
      ) : (
        <div className={styles.standby}>
          <span>CHAIN FEED NOT CONNECTED</span>
          <p>68 reactions are loaded. no fake trades are being shown.</p>
        </div>
      )}
    </div>
  );
}
