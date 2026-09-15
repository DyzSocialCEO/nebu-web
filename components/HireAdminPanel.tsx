"use client";

import { useEffect, useState } from "react";
import type { HireSubmission, HireStatus } from "@/lib/hire-data";
import type { SiteData } from "@/lib/site-data";
import styles from "./AdminPanel.module.css";

export default function HireAdminPanel() {
  const [key, setKey] = useState("");
  const [site, setSite] = useState<SiteData | null>(null);
  const [submissions, setSubmissions] = useState<HireSubmission[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setKey(window.sessionStorage.getItem("n4x33-ops-key") || "");
  }, []);

  async function request<T>(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        "x-nebu-admin-key": key,
        ...(options.body ? { "content-type": "application/json" } : {}),
        ...(options.headers || {}),
      },
      cache: "no-store",
    });
    if (response.status === 401) throw new Error("Wrong admin key.");
    if (response.status === 429) throw new Error("Too many failed attempts. Try again later.");
    const payload = await response.json().catch(() => null) as T & { error?: string } | null;
    if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status}).`);
    return payload as T;
  }

  async function unlock() {
    if (!key.trim()) return setMessage("Enter the admin key.");
    setBusy(true);
    setMessage("");
    try {
      const [siteData, queue] = await Promise.all([
        request<SiteData>("/api/n4x33-ops-18763/site"),
        request<{ submissions: HireSubmission[] }>("/api/n4x33-ops-18763/hire"),
      ]);
      setSite(siteData);
      setSubmissions(queue.submissions);
      window.sessionStorage.setItem("n4x33-ops-key", key);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not open hire desk.");
    } finally {
      setBusy(false);
    }
  }

  async function saveSettings() {
    if (!site) return;
    setBusy(true);
    setMessage("");
    try {
      const saved = await request<SiteData>("/api/n4x33-ops-18763/site", {
        method: "PUT",
        body: JSON.stringify(site),
      });
      setSite(saved);
      setMessage("Hire settings published.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save hire settings.");
    } finally {
      setBusy(false);
    }
  }

  async function updateSubmission(item: HireSubmission, status: HireStatus) {
    setBusy(true);
    setMessage("");
    try {
      const result = await request<{ submission: HireSubmission }>("/api/n4x33-ops-18763/hire", {
        method: "PATCH",
        body: JSON.stringify({
          id: item.id,
          status,
          response: item.response,
          deliveredTrack: item.deliveredTrack,
        }),
      });
      setSubmissions(current => current.map(value => value.id === item.id ? result.submission : value));
      setMessage(`Marked ${status}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update submission.");
    } finally {
      setBusy(false);
    }
  }

  function patchSubmission(id: string, patch: Partial<HireSubmission>) {
    setSubmissions(current => current.map(item => item.id === id ? { ...item, ...patch } : item));
  }

  if (!site) {
    return (
      <main className={styles.shell}>
        <section className={styles.lockCard}>
          <div className={styles.brandRow}>
            <img src="/nebu-avatar.webp" alt="" />
            <div><b>NEBUCHADREKTZAR</b><span>PRIVATE HIRE DESK</span></div>
          </div>
          <h1>hire desk.</h1>
          <p>Same key. Different paperwork.</p>
          <label className={styles.field}>
            <span>ADMIN KEY</span>
            <input type="password" value={key} onChange={event => setKey(event.target.value)} onKeyDown={event => { if (event.key === "Enter") unlock(); }} placeholder="••••••••••••" />
          </label>
          <button className={styles.primary} onClick={unlock} disabled={busy}>{busy ? "CHECKING…" : "OPEN HIRE DESK"}</button>
          {message && <p role="alert" className={styles.error}>{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brandRow}>
          <img src="/nebu-avatar.webp" alt="" />
          <div><b>NEBU HIRE DESK</b><span>THE RAPPER FOR THE TRENCHES</span></div>
        </div>
        <div className={styles.headerActions}>
          <a href="/hire" target="_blank" rel="noreferrer">OPEN /HIRE ↗</a>
          <a href="/n4x33-ops-18763">PUBLISHING DESK ↗</a>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={`${styles.card} ${styles.full}`}>
          <div className={styles.sectionHead}>
            <div><span>01</span><h2>hire settings</h2></div>
            <small>Nothing opens publicly until the switch, rate and wallet are all set.</small>
          </div>

          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>RATE IN $N4X33</span>
              <input value={site.hire.rateAmount} onChange={event => setSite({ ...site, hire: { ...site.hire, rateAmount: event.target.value } })} placeholder="e.g. 250000" />
            </label>
            <label className={styles.field}>
              <span>JOBS PER DAY</span>
              <input type="number" min="1" max="20" value={site.hire.dailyCap} onChange={event => setSite({ ...site, hire: { ...site.hire, dailyCap: Number(event.target.value) || 1 } })} />
            </label>
          </div>

          <label className={styles.field}>
            <span>COMMISSION WALLET</span>
            <textarea rows={2} value={site.hire.walletAddress} onChange={event => setSite({ ...site, hire: { ...site.hire, walletAddress: event.target.value } })} placeholder="Wallet that receives $N4X33" />
          </label>

          <label className={styles.field} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
            <input type="checkbox" checked={site.hire.enabled} onChange={event => setSite({ ...site, hire: { ...site.hire, enabled: event.target.checked } })} style={{ width: 18, height: 18 }} />
            <span style={{ margin: 0 }}>COMMISSIONS OPEN</span>
          </label>

          <button className={styles.primary} onClick={saveSettings} disabled={busy}>{busy ? "SAVING…" : "PUBLISH HIRE SETTINGS"}</button>
        </section>

        <section className={`${styles.card} ${styles.full}`}>
          <div className={styles.sectionHead}>
            <div><span>02</span><h2>the queue</h2></div>
            <small>{submissions.length} submission{submissions.length === 1 ? "" : "s"} loaded.</small>
          </div>

          {submissions.length === 0 ? <p className={styles.empty}>Nobody has hired him yet. He is handling it professionally.</p> : (
            <div style={{ display: "grid", gap: 18 }}>
              {submissions.map(item => (
                <article key={item.id} style={{ border: "1px solid #3b3543", padding: 18, background: "#16131c" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                    <div><b>{item.handle}</b><div style={{ fontSize: 11, opacity: .65, marginTop: 4 }}>{new Date(item.createdAt).toLocaleString()}</div></div>
                    <span style={{ fontSize: 11, letterSpacing: 1, color: "#c4d774" }}>{item.status.toUpperCase()} · {item.quotedRate || "?"} $N4X33</span>
                  </div>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 14 }}>{item.story}</p>
                  <div style={{ fontSize: 12, opacity: .72, marginBottom: 14 }}>coin: {item.coin || "—"} · mood: {item.mood || "—"} · credit: {item.credit || "ANONYMOUS"}</div>
                  <label className={styles.field}><span>PAYMENT TX</span><input readOnly value={item.paymentTx} /></label>
                  <div className={styles.twoCol}>
                    <label className={styles.field}><span>NEBU RESPONSE / REJECTION LINE</span><input value={item.response} onChange={event => patchSubmission(item.id, { response: event.target.value })} placeholder="declined. you handled this far too responsibly." /></label>
                    <label className={styles.field}><span>DELIVERED TRACK URL</span><input value={item.deliveredTrack} onChange={event => patchSubmission(item.id, { deliveredTrack: event.target.value })} placeholder="https://..." /></label>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                    <button className={styles.secondary} onClick={() => updateSubmission(item, "approved")} disabled={busy}>APPROVE</button>
                    <button className={styles.secondary} onClick={() => updateSubmission(item, "declined")} disabled={busy}>DECLINE</button>
                    <button className={styles.primary} onClick={() => updateSubmission(item, "delivered")} disabled={busy}>MARK DELIVERED</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {message && <footer className={styles.savebar}><div><b>HIRE DESK</b><span>{message}</span></div></footer>}
    </main>
  );
}
