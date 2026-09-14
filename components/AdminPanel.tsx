"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteData } from "@/lib/site-data";
import styles from "./AdminPanel.module.css";

type SaveState = "idle" | "loading" | "saving" | "saved" | "error";

const emptyTrack = () => ({
  id: `track-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  audioUrl: "",
});

function cloneData(data: SiteData): SiteData {
  return JSON.parse(JSON.stringify(data)) as SiteData;
}

export default function AdminPanel() {
  const [key, setKey] = useState("");
  const [draft, setDraft] = useState<SiteData | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const remembered = window.sessionStorage.getItem("nebu-admin-key") || "";
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
    const response = await fetch("/api/admin/site", {
      method,
      headers: {
        "x-nebu-admin-key": key,
        ...(body ? { "content-type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (response.status === 401) throw new Error("Wrong admin key.");
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
      window.sessionStorage.setItem("nebu-admin-key", key);
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

    for (const [label, value] of [["X", data.socials.x], ["Telegram", data.socials.telegram]] as Array<[string, string]>) {
      if (value && !/^https:\/\//i.test(value)) return `${label} must use HTTPS.`;
    }

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
    setState("saving");
    setMessage("");
    try {
      const data = await adminRequest("PUT", draft);
      const clean = cloneData(data);
      setDraft(clean);
      setSavedSnapshot(JSON.stringify(clean));
      setState("saved");
      setMessage("Published to persistent site data.");
      window.setTimeout(() => setState(current => current === "saved" ? "idle" : current), 2200);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not save.");
    }
  }

  function forgetKey() {
    window.sessionStorage.removeItem("nebu-admin-key");
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
          <p>This page exposes no site data until the server accepts the admin key.</p>
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
            <span>{dirty ? "UNSAVED CHANGES" : "LIVE DATA LOADED"}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <a href="/" target="_blank" rel="noreferrer">OPEN SITE ↗</a>
          <button onClick={reload} disabled={state === "loading" || state === "saving"}>RELOAD</button>
          <button onClick={forgetKey}>LOCK</button>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <div>
              <span>01</span>
              <h2>token + socials</h2>
            </div>
            <small>What visitors can actually act on.</small>
          </div>

          <label className={styles.field}>
            <span>CONTRACT ADDRESS</span>
            <textarea
              rows={2}
              value={draft.contractAddress}
              onChange={event => setField("contractAddress", event.target.value)}
              placeholder="Paste the live contract address when launched"
            />
            <small>Leave blank before launch. The public note will show CA SOON.</small>
          </label>

          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>X / TWITTER URL</span>
              <input
                type="url"
                value={draft.socials.x}
                onChange={event => setField("socials", { ...draft.socials, x: event.target.value })}
                placeholder="https://x.com/..."
              />
            </label>
            <label className={styles.field}>
              <span>TELEGRAM URL</span>
              <input
                type="url"
                value={draft.socials.telegram}
                onChange={event => setField("socials", { ...draft.socials, telegram: event.target.value })}
                placeholder="https://t.me/..."
              />
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <div>
              <span>02</span>
              <h2>current record</h2>
            </div>
            <small>Artwork + audio. That is the record.</small>
          </div>

          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>TITLE</span>
              <input
                value={draft.featuredBroadcast.title}
                onChange={event => setField("featuredBroadcast", { ...draft.featuredBroadcast, title: event.target.value })}
                placeholder="HE SAID SOON"
              />
            </label>
            <label className={styles.field}>
              <span>SUBTITLE / INTERNAL</span>
              <input
                value={draft.featuredBroadcast.subtitle}
                onChange={event => setField("featuredBroadcast", { ...draft.featuredBroadcast, subtitle: event.target.value })}
                placeholder="Optional compatibility field"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>CUSTOM COVER (OPTIONAL)</span>
            <input
              type="url"
              value={draft.featuredBroadcast.imageUrl}
              onChange={event => setField("featuredBroadcast", { ...draft.featuredBroadcast, imageUrl: event.target.value })}
              placeholder="Leave blank to use NEBUCHADREKTZAR"
            />
            <small>Leave blank and the site uses the approved NEBUCHADREKTZAR artwork automatically.</small>
          </label>

          <label className={styles.field}>
            <span>AUDIO URL</span>
            <input
              type="url"
              value={draft.featuredBroadcast.audioUrl}
              onChange={event => setField("featuredBroadcast", { ...draft.featuredBroadcast, audioUrl: event.target.value })}
              placeholder="https://.../track.mp3"
            />
            <small>Bunny/CDN HTTPS URL. Storage credentials never belong here.</small>
          </label>

          <div className={styles.mediaPreview}>
            <div>
              <span>PLAYER WILL USE</span>
              <b>{draft.featuredBroadcast.audioUrl ? "AUDIO + ARTWORK" : "WAITING STATE"}</b>
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
            <p className={styles.empty}>No archive tracks. That is fine.</p>
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
              <h2>pulse</h2>
            </div>
            <span className={styles.standby}>STANDBY</span>
          </div>
          <div className={styles.pulseStatus}>
            <b>68 NEBU reactions are loaded.</b>
            <p>No real chain adapter is connected yet, so production must not manufacture buys, sells, balances or price moves. The public character may use silence lines only until the actual chain, pair/source and threshold unit are confirmed.</p>
          </div>
        </section>
      </div>

      <footer className={styles.savebar}>
        <div>
          <b>{dirty ? "UNPUBLISHED CHANGES" : state === "saved" ? "PUBLISHED" : "NO UNSAVED CHANGES"}</b>
          <span>{message || "Persistent JSON is written atomically to DATA_DIR/site.json."}</span>
        </div>
        <button className={styles.primary} onClick={save} disabled={!dirty || state === "saving" || state === "loading"}>
          {state === "saving" ? "PUBLISHING…" : "PUBLISH"}
        </button>
      </footer>
    </main>
  );
}
