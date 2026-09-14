"use client";

import { useEffect, useRef, useState } from "react";
import { pickPulseLine, type PulseLine } from "@/lib/pulse-bank";
import type { SiteData } from "@/lib/site-data";

type KingFrame = "neutral" | "blink" | "sideeye" | "smug";

const thoughts = [
  ["i’m not wrong.", "i’m early.", "very fucking early."],
  ["my wealth", "is resting.", "do not disturb it."],
  ["take profits?", "take what?", "i have principles."],
  ["we just", "got here.", "it has been nine months."],
  ["the house is", "being renovated.", "indefinitely."],
  ["i have a", "rap career.", "please respect the arts."],
  ["time", "is fud.", "look it up."],
];

const coinStyles = [
  [8, 7.8, -2.8, .75], [18, 10.2, -7.1, .9], [31, 8.9, -4.3, .62],
  [43, 12.4, -9.2, .82], [57, 7.1, -1.5, .68], [68, 11.3, -6.2, .95],
  [77, 9.6, -3.4, .7], [87, 13.1, -8.7, .86], [95, 8.2, -5.1, .58],
] as const;

function PlayIcon({ pause = false }: { pause?: boolean }) {
  return pause
    ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
    : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7 3 15 9-15 9z" /></svg>;
}

export default function NebuExperience({ initialData }: { initialData: SiteData }) {
  const broadcast = initialData.featuredBroadcast;
  const [thought, setThought] = useState(0);
  const [kingFrame, setKingFrame] = useState<KingFrame>("neutral");
  const [pulse, setPulse] = useState<PulseLine | null>(null);
  const previousPulse = useRef<PulseLine | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [copyState, setCopyState] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLAudioElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const coins = useRef<HTMLDivElement>(null);

  const canAudio = Boolean(broadcast.audioUrl);
  const hasMedia = canAudio;
  const cover = broadcast.imageUrl || broadcast.posterUrl || "/nebu-cover.webp";
  const chartUrl = initialData.contractAddress
    ? `https://dexscreener.com/search?q=${encodeURIComponent(initialData.contractAddress)}`
    : "";

  function flashKing(frame: Exclude<KingFrame, "neutral">, duration = 950) {
    setKingFrame(frame);
    window.setTimeout(() => setKingFrame(current => current === frame ? "neutral" : current), duration);
  }

  const nextThought = () => {
    setThought(value => (value + 1) % thoughts.length);
    flashKing("sideeye", 1050);
  };

  function showQuietPulse() {
    const next = pickPulseLine("silence", previousPulse.current);
    previousPulse.current = next;
    setPulse(next);
    flashKing(Math.random() > .55 ? "smug" : "sideeye", 900);
    window.setTimeout(() => setPulse(current => current?.id === next.id ? null : current), 7000);
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const thoughtTimer = window.setInterval(nextThought, 16000);
    const firstPulse = window.setTimeout(showQuietPulse, 4800);
    const pulseTimer = window.setInterval(showQuietPulse, 17000);

    function onPointerMove(event: PointerEvent) {
      const x = event.clientX / window.innerWidth - .5;
      const y = event.clientY / window.innerHeight - .5;
      if (plate.current) plate.current.style.transform = `translate(${x * -22}px,${y * -14}px) scale(1.035)`;
      if (coins.current) coins.current.style.transform = `translate(${x * -11}px,${y * -7}px)`;
      if (stage.current) stage.current.style.transform = `translateX(-50%) translate(${x * 9}px,${y * 5}px)`;
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.clearInterval(thoughtTimer);
      window.clearTimeout(firstPulse);
      window.clearInterval(pulseTimer);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let warmTimer = 0;
    const warmFaces = () => {
      warmTimer = window.setTimeout(() => {
        ["/nebu-face-blink.webp", "/nebu-face-sideeye.webp", "/nebu-face-smug.webp"].forEach(src => {
          const image = new Image();
          image.src = src;
        });
      }, 600);
    };
    if (document.readyState === "complete") warmFaces();
    else window.addEventListener("load", warmFaces, { once: true });

    let blinkTimer = 0;
    let reactionTimer = 0;
    let blinkReturn = 0;
    let reactionReturn = 0;

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setKingFrame(current => current === "neutral" ? "blink" : current);
        blinkReturn = window.setTimeout(() => setKingFrame(current => current === "blink" ? "neutral" : current), 145);
        scheduleBlink();
      }, 3600 + Math.random() * 3600);
    };

    const scheduleReaction = () => {
      reactionTimer = window.setTimeout(() => {
        setKingFrame(current => current === "neutral" ? "sideeye" : current);
        reactionReturn = window.setTimeout(() => setKingFrame(current => current === "sideeye" ? "neutral" : current), 1250);
        scheduleReaction();
      }, 13500 + Math.random() * 9000);
    };

    scheduleBlink();
    scheduleReaction();

    return () => {
      window.clearTimeout(warmTimer);
      window.removeEventListener("load", warmFaces);
      window.clearTimeout(blinkTimer);
      window.clearTimeout(reactionTimer);
      window.clearTimeout(blinkReturn);
      window.clearTimeout(reactionReturn);
    };
  }, []);

  function openRecord() {
    setRecordOpen(true);
    flashKing("smug", 1200);
    dialog.current?.showModal();
  }

  function stopMedia() {
    dialog.current?.querySelectorAll<HTMLMediaElement>("audio").forEach(media => media.pause());
    setPlaying(false);
    setRecordOpen(false);
  }

  function closeRecord() {
    stopMedia();
    dialog.current?.close();
  }

  async function toggleAudio() {
    const audio = player.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); setMediaError(false); } catch { setMediaError(true); }
  }

  async function copyAddress() {
    if (!initialData.contractAddress) return;
    try {
      await navigator.clipboard.writeText(initialData.contractAddress);
      setCopyState("copied.");
    } catch {
      setCopyState("copy failed — select the address.");
    }
  }

  return (
    <main className="world">
      <div ref={plate} className="plate" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div ref={coins} className="coins" aria-hidden="true">
        {coinStyles.map(([left, duration, delay, scale], index) => (
          <i key={index} style={{ left: `${left}%`, animationDuration: `${duration}s`, animationDelay: `${delay}s`, scale }} />
        ))}
      </div>

      <div ref={stage} className="stage">
        <div className="king-stack" aria-label="NEBUCHADREKTZAR">
          <img className="king" src="/nebu-neutral.webp" alt="NEBUCHADREKTZAR" width={1154} height={1363} fetchPriority="high" decoding="async" />
          <img className={`king-face ${kingFrame === "blink" ? "active" : ""}`} src="/nebu-face-blink.webp" alt="" aria-hidden="true" />
          <img className={`king-face ${kingFrame === "sideeye" ? "active" : ""}`} src="/nebu-face-sideeye.webp" alt="" aria-hidden="true" />
          <img className={`king-face ${kingFrame === "smug" ? "active" : ""}`} src="/nebu-face-smug.webp" alt="" aria-hidden="true" />
        </div>
        <button className="king-hit" onClick={nextThought} aria-label="Another thought from NEBU" />

        <button className="thought" onClick={nextThought} aria-label="Another thought from NEBU">
          <span key={thought} className="thought-anim">
            <strong>{thoughts[thought][0]}<br /><em>{thoughts[thought][1]}</em></strong>
            <small>{thoughts[thought][2]}</small>
          </span>
        </button>

        <button className={`record ${playing ? "playing" : ""}`} onClick={openRecord} aria-label={`Play ${broadcast.title}`}>
          <span className="vinyl" aria-hidden="true" />
          <span className="sleeve">
            <img src={cover} alt="" width={480} height={480} decoding="async" />
            <b>{broadcast.title}</b>
          </span>
          <span className="record-note">i made another one. ↘</span>
        </button>
      </div>

      <div className="pulse" aria-live="polite">
        {pulse && <div key={pulse.id} className="pulse-message">{pulse.text}</div>}
      </div>

      <a className="mark" href="/" aria-label="NEBUCHADREKTZAR home">
        <img src="/nebu-avatar.webp" alt="" width={160} height={160} decoding="async" />
        <span><b>NEBUCHADREKTZAR</b><small>$N4X33</small><i style={{ color: "#f3ead1", fontSize: "16px", fontWeight: 600, textShadow: "0 2px 12px #0d0a13, 0 0 18px #0d0a13" }}>i lost everything. now i’m a rapper.</i></span>
      </a>

      <aside className="management-note">
        <span className="tape" aria-hidden="true" />
        <small>A NOTE FROM NEBU</small>
        <h1>buy the token.<br />support the arts.</h1>
        <p>i lost everything. now i’m a rapper.</p>
        <span className="correction">my wealth is resting.</span>

        <div className="token-block">
          <div className="token-heading"><b>$N4X33</b></div>
          <label>CONTRACT ADDRESS</label>
          <code>{initialData.contractAddress || "NOT SET YET"}</code>
          <div className="token-actions">
            {initialData.contractAddress ? <>
              <button onClick={copyAddress}>COPY CA ↗</button>
              <a href={chartUrl} target="_blank" rel="noopener noreferrer">CHART ↗</a>
            </> : <span>CA SOON</span>}
          </div>
          {copyState && <span role="status" className="copy-status">{copyState}</span>}
        </div>
      </aside>

      <dialog ref={dialog} className="record-dialog" onCancel={stopMedia} onClose={stopMedia} onPlayCapture={event => {
        dialog.current?.querySelectorAll<HTMLMediaElement>("audio").forEach(media => { if (media !== event.target) media.pause(); });
        setPlaying(true);
      }} onClick={event => { if (event.target === dialog.current) closeRecord(); }}>
        <div className="record-room">
          <button className="close" onClick={closeRecord} aria-label="Close record player">×</button>
          <span className="room-eyebrow">I HAVE A RAP CAREER. PLEASE RESPECT IT.</span>
          <h2>{broadcast.title}</h2>
          <p className="room-subtitle">every song is generational. this one included.</p>

          <div className={`fallback-cover ${playing ? "playing" : ""}`}><img src={cover} alt={`${broadcast.title} artwork`} /></div>

          {canAudio && recordOpen && <div className="audio-controls">
            <button onClick={toggleAudio} aria-label={playing ? "Pause track" : "Play track"}><PlayIcon pause={playing} /></button>
            <label>the generational part
              <input aria-label="Seek track" type="range" min="0" max={duration || 1} step="0.1" value={progress}
                onChange={event => { if (player.current) { player.current.currentTime = Number(event.target.value); setProgress(Number(event.target.value)); } }} />
            </label>
            <span>{Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2, "0")}</span>
            <audio ref={player} src={broadcast.audioUrl} preload="metadata"
              onLoadedMetadata={() => setDuration(Number.isFinite(player.current?.duration) ? player.current!.duration : 0)}
              onTimeUpdate={() => setProgress(player.current?.currentTime || 0)}
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
              onError={() => { setMediaError(true); setPlaying(false); }} />
          </div>}

          {!hasMedia && <p className="empty-record">
            my next masterpiece is with the handlers.
            <small>i would hurry them, but genius cannot be managed.</small>
          </p>}

          {mediaError && <p role="alert" className="media-error">the speakers are being difficult. try pressing play again.</p>}

          {initialData.tracks.length > 0 && <div className="older-records">
            <h3>older masterpieces.</h3>
            {initialData.tracks.map(track => <div key={track.id}>
              <b>{track.title}</b>
              <audio controls preload="none" src={track.audioUrl} onPlay={() => { player.current?.pause(); }} />
            </div>)}
          </div>}
        </div>
      </dialog>
    </main>
  );
}
