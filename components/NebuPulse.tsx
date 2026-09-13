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
  if (!latest) {
    return (
      <aside className={`${styles.pulse} ${styles.standby}`} aria-label="NEBU Pulse standby">
        <div className={styles.top}>
          <div className={styles.brand}><i className={styles.dot} /> NEBU PULSE</div>
          <div className={styles.mode}>FEED STANDBY</div>
        </div>
        <div className={styles.body}>
          <p className={styles.standbyCopy}>68 reactions loaded. waiting for the chain feed.</p>
          <span className={styles.standbySmall}>no fake trades. no fake price moves. the king speaks when something actually happens.</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.pulse} aria-live="polite" aria-label="Latest NEBU Pulse reaction">
      <div className={styles.top}>
        <div className={styles.brand}><i className={styles.dot} /> NEBU PULSE</div>
        <div className={styles.mode}>LIVE</div>
      </div>
      <div className={styles.body}>
        <p className={styles.line}>{latest.text}</p>
        <div className={styles.meta}>
          <span className={styles.category}>{latest.category.replaceAll("_", " ")}</span>
          <span>{latest.amountLabel ? `${latest.amountLabel} · ` : ""}{latest.timestamp}</span>
        </div>
      </div>
    </aside>
  );
}
