"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteData } from "@/lib/site-data";
import styles from "./AdminPanel.module.css";

type SaveState = "idle" | "loading" | "saving" | "saved" | "error";

const emptyTrack = () => ({
  id: `track-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  audioUrl: "",
  story: "",
  imageUrl: "",
  credit: "",
});

function cloneData(data: SiteData): SiteData {
  return JSON.parse(JSON.stringify(data)) as SiteData;
}

function normalizeXInput(value: string): string {
  const input = value.trim();
  if (!input) return "";
  if (/^https:\/\//i.test(input)) return input;
  const handle = input.replace(/^@/, "");
  return /^[A-Za-z0-9_]{1,15}$/.test(handle) ? `https://x.com/${handle}` : input;
}

export default function AdminPanel() {
  const [key, setKey] = useState("");
  const [draft, setDraft] = useState<SiteData | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const remembered = window.sessionStorage.getItem("n4x33-ops-key") || "";
    if (remembered) setKey(remembered);
  }, []);

  const dirty = useMemo(() => {
    if (!draft) return false;
    return JSON.stringify(draft) !== savedSnapshot;
  }, [draft, savedSnapshot]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function adminRequest(method: "GET" | "PUT", body?: SiteData) {
    const response = await fetch("/api/n4x33-ops-18763/site", {
      method,
      headers: {
        "x-nebu-admin-key": key,
        ...(body ? { "content-type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (response.status === 401) throw new Error("Wrong admin key.");
    if (response.status === 429) {
      const retry = response.headers.get("retry-after");
      throw new Error(retry ? `Too many failed attempts. Try again in about ${Math.ceil(Number(retry) / 60)} minutes.` : "Too many failed attempts. Try again later.");
    }
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      throw new Error(payload?.error || `Request failed (${response.status}).`);
    }
    return response.json() as Promise<SiteData>;
  }

  async function unlock() {
    if (!key.trim()) {
      setState("error");
      setMessage("Enter the admin key.");
      return;
    }

    setState("loading");
    setMessage("");
    try {
      const data = await adminRequest("GET");
      const clean = cloneData(data);
      setDraft(clean);
      setSavedSnapshot(JSON.stringify(clean));
      window.sessionStorage.setItem("n4x33-ops-key", key);
      setState("idle");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not unlock admin.");
    }
  }

  async function reload() {
    if (!draft) return;
    if (dirty && !window.confirm("Discard unsaved admin changes and reload live data?")) return;
    setState("loading");
    setMessage("");
    try {
      const data = await adminRequest("GET");
      const clean = cloneData(data);
      setDraft(clean);
      setSavedSnapshot(JSON.stringify(clean));
      setState("idle");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not reload live data.");
    }
  }

  function validateDraft(data: SiteData): string {
    const media = [
      ["artwork", data.featuredBroadcast.imageUrl],
      ["poster", data.featuredBroadcast.posterUrl],
      ["audio", data.featuredBroadcast.audioUrl],
      ...data.tracks.map((track, index) => [`archive track ${index + 1}`, track.audioUrl]),
    ] as Array<[string, string]>;

    for (const [label, value] of media) {
      if (value && !/^https:\/\//i.test(value) && !/^\/(?!\/)/.test(value)) {
        return `${label} must use HTTPS or a local /path.`;
      }
    }

    if (data.buyUrl && !/^https:\/\//i.test(data.buyUrl)) return "Buy URL must use HTTPS.";

    const xUrl = normalizeXInput(data.socials.x);
    if (xUrl && !/^https:\/\//i.test(xUrl)) return "X must be a handle like @N3B_U or a full HTTPS URL.";

    const incompleteTrack = data.tracks.findIndex(track => !track.audioUrl.trim());
    if (incompleteTrack !== -1) return `Archive track ${incompleteTrack + 1} needs an audio URL or should be removed.`;
    return "";
  }

  async function save() {
    if (!draft) return;
    const validationError = validateDraft(draft);
    if (validationError) {
      setState("error");
      setMessage(validationError);
      return;
    }

    const payload = cloneData(draft);
    payload.socials.x = normalizeXInput(payload.socials.x);

    setState("saving");
    setMessage("");
    try {
      const data = await adminRequest("PUT", payload);
      const clean = cloneData(data);
      setDraft(clean);
      setSavedSnapshot(JSON.stringify(clean));
      setState("saved");
      setMessage("Saved. Public site data updated.");
      window.setTimeout(() => setState(current => current === "saved" ? "idle" : current), 2200);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not save.");
    }
  }

  async function setCommissions(open: boolean) {
    if (!draft) return;
    setDraft(current => current ? { ...current, hire: { ...current.hire, enabled: open } } : current);
    setState("saving");
    setMessage("");
    try {
      const base = savedSnapshot ? JSON.parse(savedSnapshot) as SiteData : draft;
      const data = await adminRequest("PUT", { ...base, hire: { ...base.hire, enabled: open } });
      const clean = cloneData(data);
      setSavedSnapshot(JSON.stringify(clean));
      setDraft(current => current ? { ...current, hire: { ...current.hire, enabled: clean.hire.enabled } } : clean);
      setState("saved");
      setMessage(open ? "Commissions open. HIRE ME is visible." : "Commissions closed. HIRE ME is hidden.");
      window.setTimeout(() => setState(current => current === "saved" ? "idle" : current), 2600);
    } catch (error) {
      setDraft(current => current ? { ...current, hire: { ...current.hire, enabled: !open } } : current);
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not change commissions.");
    }
  }

  function forgetKey() {
    window.sessionStorage.removeItem("n4x33-ops-key");
    setDraft(null);
    setSavedSnapshot("");
    setKey("");
    setState("idle");
    setMessage("");
  }

  if (!draft) {
    return (
      <main className={styles.shell}>
        <section className={styles.lockCard}>
          <div className={styles.brandRow}>
            <img src="/nebu-avatar.webp" alt="" />
            <div>
              <b>NEBUCHADREKTZAR</b>
              <span>PRIVATE PUBLISHING DESK</span>
            </div>
          </div>
          <h1>admin.</h1>
          <p>Enter the private key to manage the public site.</p>
          <label className={styles.field}>
            <span>ADMIN KEY</span>
            <input
              type="password"
              value={key}
              autoComplete="current-password"
              onChange={event => setKey(event.target.value)}
              onKeyDown={event => { if (event.key === "Enter") unlock(); }}
              placeholder="••••••••••••"
            />
          </label>
          <button className={styles.primary} onClick={unlock} disabled={state === "loading"}>
            {state === "loading" ? "CHECKING…" : "OPEN DESK"}
          </button>
          {message && <p role="alert" className={styles.error}>{message}</p>}
        </section>
      </main>
    );
  }

  const setField = <K extends keyof SiteData,>(field: K, value: SiteData[K]) => {
    setDraft(current => current ? { ...current, [field]: value } : current);
  };

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brandRow}>
          <img src="/nebu-avatar.webp" alt="" />
          <div>
            <b>NEBU PUBLISHING DESK</b>
            <span>{dirty ? "UNSAVED CHANGES" : state === "saved" ? "SAVED" : "LIVE DATA LOADED"}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.saveTop} onClick={save} disabled={!dirty || state === "saving" || state === "loading"}>
            {state === "saving" ? "SAVING…" : "SAVE CHANGES"}
          </button>
          <a href="/" target="_blank" rel="noreferrer">OPEN SITE ↗</a>
          <button onClick={reload} disabled={state === "loading" || state === "saving"}>RELOAD</button>
          <button onClick={forgetKey}>LOCK</button>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={`${styles.card} ${styles.full}`}>
          <div className={styles.sectionHead}>
            <div>
              <span>01</span>
              <h2>launch details</h2>
            </div>
            <small>CA + buy link + X. Nothing else needed for launch.</small>
          </div>

          <div className={styles.routeNote}>
            <b>WHERE THESE APPEAR</b>
            <span>CA and X appear on the $N3BU tab. The buy link powers BUY $N3BU on the token page and desktop header.</span>
          </div>

          <div className={styles.launchGrid}>
            <label className={styles.field}>
              <span>CONTRACT ADDRESS</span>
              <textarea
                rows={2}
                value={draft.contractAddress}
                onChange={event => setField("contractAddress", event.target.value)}
                placeholder="Paste the live Solana contract address"
              />
              <small>Leave blank before launch. The $N3BU page shows CA SOON.</small>
            </label>

            <label className={styles.field}>
              <span>BUY / LAUNCH URL</span>
              <input
                type="url"
                value={draft.buyUrl}
                onChange={event => setField("buyUrl", event.target.value)}
                placeholder="https://www.stonkfun.xyz/..."
              />
              <small>Use the exact live launch page. BUY stays hidden while blank.</small>
            </label>

            <label className={styles.field}>
              <span>X HANDLE OR URL</span>
              <input
                value={draft.socials.x}
                onChange={event => setField("socials", { ...draft.socials, x: event.target.value })}
                placeholder="@N3B_U or https://x.com/N3B_U"
              />
              <small>You can paste just the handle. We save it as the proper X URL.</small>
            </label>
          </div>
        </section>

        <section className={`${styles.card} ${styles.full}`}>
          <div className={styles.sectionHead}>
            <div>
              <span>02</span>
              <h2>current record</h2>
            </div>
            <small>The record shown first on Records and in Now Playing.</small>
          </div>

          <label className={styles.field}>
            <span>TITLE</span>
            <input
              value={draft.featuredBroadcast.title}
              onChange={event => setField("featuredBroadcast", { ...draft.featuredBroadcast, title: event.target.value })}
              placeholder="HE SAID SOON"
            />
          </label>

          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>CUSTOM COVER (OPTIONAL)</span>
              <input
                type="url"
                value={draft.featuredBroadcast.imageUrl}
                onChange={event => setField("featuredBroadcast", { ...draft.featuredBroadcast, imageUrl: event.target.value })}
                placeholder="https://.../cover.webp"
              />
              <small>Leave blank to use the approved NEBU artwork.</small>
            </label>

            <label className={styles.field}>
              <span>AUDIO URL</span>
              <input
                type="url"
                value={draft.featuredBroadcast.audioUrl}
                onChange={event => setField("featuredBroadcast", { ...draft.featuredBroadcast, audioUrl: event.target.value })}
                placeholder="https://.../track.mp3"
              />
              <small>Bunny/CDN HTTPS URL.</small>
            </label>
          </div>

          <div className={styles.mediaPreview}>
            <div>
              <span>PUBLIC PLAYER</span>
              <b>{draft.featuredBroadcast.audioUrl ? "READY" : "WAITING FOR AUDIO"}</b>
            </div>
            <img src={draft.featuredBroadcast.imageUrl || "/nebu-approved.webp"} alt="Current release preview" />
          </div>
        </section>

        <section className={`${styles.card} ${styles.full}`}>
          <div className={styles.sectionHead}>
            <div>
              <span>03</span>
              <h2>older records</h2>
            </div>
            <button className={styles.secondary} onClick={() => setField("tracks", [...draft.tracks, emptyTrack()])}>+ ADD TRACK</button>
          </div>

          {draft.tracks.length === 0 ? (
            <p className={styles.empty}>No older records yet.</p>
          ) : (
            <div className={styles.trackList}>
              {draft.tracks.map((track, index) => (
                <div className={styles.trackRow} key={track.id}>
                  <span className={styles.trackNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <input
                    aria-label={`Track ${index + 1} title`}
                    value={track.title}
                    placeholder="Track title"
                    onChange={event => setField("tracks", draft.tracks.map((item, i) => i === index ? { ...item, title: event.target.value } : item))}
                  />
                  <input
                    aria-label={`Track ${index + 1} audio URL`}
                    type="url"
                    value={track.audioUrl}
                    placeholder="https://.../track.mp3"
                    onChange={event => setField("tracks", draft.tracks.map((item, i) => i === index ? { ...item, audioUrl: event.target.value } : item))}
                  />
                  <input
                    aria-label={`Track ${index + 1} cover image URL`}
                    type="url"
                    value={track.imageUrl}
                    placeholder="https://.../cover.webp"
                    onChange={event => setField("tracks", draft.tracks.map((item, i) => i === index ? { ...item, imageUrl: event.target.value } : item))}
                  />
                  <input
                    aria-label={`Track ${index + 1} credit`}
                    type="text"
                    maxLength={80}
                    value={track.credit}
                    placeholder="credit (optional)"
                    onChange={event => setField("tracks", draft.tracks.map((item, i) => i === index ? { ...item, credit: event.target.value } : item))}
                  />
                  <textarea
                    className={styles.trackStory}
                    aria-label={`Track ${index + 1} story`}
                    rows={2}
                    maxLength={400}
                    value={track.story}
                    placeholder="optional note about the record"
                    onChange={event => setField("tracks", draft.tracks.map((item, i) => i === index ? { ...item, story: event.target.value } : item))}
                  />
                  <button
                    className={styles.remove}
                    aria-label={`Remove track ${index + 1}`}
                    onClick={() => setField("tracks", draft.tracks.filter((_, i) => i !== index))}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={`${styles.card} ${styles.full}`}>
          <div className={styles.sectionHead}>
            <div>
              <span>04</span>
              <h2>commissions</h2>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={draft.hire.enabled}
              className={draft.hire.enabled ? styles.primary : styles.secondary}
              onClick={() => setCommissions(!draft.hire.enabled)}
            >{draft.hire.enabled ? "OPEN" : "CLOSED"}</button>
          </div>

          <p className={styles.empty}>
            {draft.hire.enabled
              ? "HIRE ME is visible and the form accepts submissions."
              : "HIRE ME is hidden. This switch saves immediately."}
          </p>

          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>RATE — IN TOKENS</span>
              <input maxLength={80} value={draft.hire.rateAmount} placeholder="e.g. 250000"
                onChange={event => setField("hire", { ...draft.hire, rateAmount: event.target.value })} />
            </label>
            <label className={styles.field}>
              <span>PAYMENT WALLET</span>
              <input maxLength={200} value={draft.hire.walletAddress} placeholder="solana address"
                onChange={event => setField("hire", { ...draft.hire, walletAddress: event.target.value })} />
            </label>
          </div>
          <p className={styles.empty}>Rate and wallet save with SAVE CHANGES.</p>
        </section>
      </div>

      <footer className={styles.savebar}>
        <div>
          <b>{dirty ? "UNSAVED CHANGES" : state === "saved" ? "SAVED" : "ALL CHANGES SAVED"}</b>
          <span className={state === "error" ? styles.errorText : ""}>{message || "Changes are stored in the persistent site data."}</span>
        </div>
        <button className={styles.primary} onClick={save} disabled={!dirty || state === "saving" || state === "loading"}>
          {state === "saving" ? "SAVING…" : "SAVE CHANGES"}
        </button>
      </footer>
    </main>
  );
}
