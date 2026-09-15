"use client";

import { useEffect, useRef, useState } from "react";
import { pickPulseLine, type PulseLine } from "@/lib/pulse-bank";
import type { SiteData } from "@/lib/site-data";

type KingFrame = "neutral" | "blink" | "sideeye" | "smug";

type SignedAudio = {
  url: string;
  expires: number | null;
};

const thoughts = [
  ["i’m not wrong.", "i’m early.", "very fucking early."],
  ["portfolio update?", "absolutely not.", "mind your business."],
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

const faceFrames = ["/nebu-face-blink.webp", "/nebu-face-sideeye.webp", "/nebu-face-smug.webp"] as const;

function PlayIcon({ pause = false }: { pause?: boolean }) {
  return pause
    ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
    : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7 3 15 9-15 9z" /></svg>;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function warmImage(src: string) {
  return new Promise<void>(resolve => {
    const image = new Image();
    const finish = () => resolve();
    image.onload = () => {
      if (typeof image.decode === "function") image.decode().catch(() => undefined).finally(finish);
      else finish();
    };
    image.onerror = finish;
    image.src = src;
  });
}

export default function NebuExperience({ initialData }: { initialData: SiteData }) {
  const broadcast = initialData.featuredBroadcast;
  const [thought, setThought] = useState(0);
  const [kingFrame, setKingFrame] = useState<KingFrame>("neutral");
  const [pulse, setPulse] = useState<{ text: string; key: number } | null>(null);
  const previousPulse = useRef<PulseLine | null>(null);
  const pulseKey = useRef(0);
  const pulseHide = useRef(0);
  const [demoMode, setDemoMode] = useState(false);
  const [feedLive, setFeedLive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [copyState, setCopyState] = useState("");
  const [criticalReady, setCriticalReady] = useState(false);
  const [facesLoaded, setFacesLoaded] = useState(false);
  const [audioSource, setAudioSource] = useState<SignedAudio | null>(null);
  const player = useRef<HTMLAudioElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const coins = useRef<HTMLDivElement>(null);

  const canAudio = Boolean(broadcast.audioUrl);
  const timelineReady = Number.isFinite(duration) && duration > 0;
  const cover = broadcast.imageUrl || broadcast.posterUrl || "/nebu-cover.webp";
  const chartUrl = initialData.contractAddress
    ? `https://dexscreener.com/search?q=${encodeURIComponent(initialData.contractAddress)}`
    : "";

  useEffect(() => {
    let active = true;
    const garden = window.matchMedia("(max-width: 560px)").matches ? "/nebu-garden-sm.webp" : "/nebu-garden.webp";
    const safety = window.setTimeout(() => { if (active) setCriticalReady(true); }, 2400);

    Promise.all([warmImage(garden), warmImage("/nebu-neutral.webp"), warmImage(cover)]).then(() => {
      if (!active) return;
      window.clearTimeout(safety);
      setCriticalReady(true);
    });

    return () => {
      active = false;
      window.clearTimeout(safety);
    };
  }, [cover]);

  useEffect(() => {
    if (!criticalReady) return;
    let active = true;
    const timer = window.setTimeout(() => {
      Promise.all(faceFrames.map(warmImage)).then(() => {
        if (active) setFacesLoaded(true);
      });
    }, 350);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [criticalReady]);

  useEffect(() => {
    if (!canAudio) return;
    let active = true;

    const getSignedAudio = async () => {
      try {
        const response = await fetch("/api/audio/sign", { cache: "no-store", headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("signing failed");
        const payload = await response.json() as SignedAudio;
        if (active && payload.url) setAudioSource(payload);
      } catch {
        if (active) setMediaError(true);
      }
    };

    getSignedAudio();
    const refresh = window.setInterval(() => {
      setAudioSource(current => {
        const expiresSoon = current?.expires ? current.expires <= Math.floor(Date.now() / 1000) + 120 : false;
        if (!current || expiresSoon) void getSignedAudio();
        return current;
      });
    }, 60000);

    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, [canAudio]);

  function flashKing(frame: Exclude<KingFrame, "neutral">, duration = 950) {
    setKingFrame(frame);
    window.setTimeout(() => setKingFrame(current => current === frame ? "neutral" : current), duration);
  }

  const nextThought = () => {
    setThought(value => (value + 1) % thoughts.length);
    flashKing("sideeye", 1050);
  };

  function showPulse(text: string) {
    pulseKey.current += 1;
    const key = pulseKey.current;
    setPulse({ text, key });
    flashKing(Math.random() > .55 ? "smug" : "sideeye", 900);
    window.clearTimeout(pulseHide.current);
    pulseHide.current = window.setTimeout(() => setPulse(current => current?.key === key ? null : current), 7000);
  }

  function showQuietPulse() {
    const next = pickPulseLine("silence", previousPulse.current);
    previousPulse.current = next;
    showPulse(next.text);
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const thoughtTimer = window.setInterval(nextThought, 16000);

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
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useEffect(() => {
    const demo = new URLSearchParams(window.location.search).get("demo") === "1";
    setDemoMode(demo);

    let source: EventSource;
    try {
      source = new EventSource(demo ? "/api/pulse?demo=1" : "/api/pulse");
    } catch {
      setFeedLive(false);
      return;
    }

    source.onmessage = event => {
      try {
        const payload = JSON.parse(event.data) as { kind?: string; text?: string };
        if (payload.kind === "line" && payload.text) {
          setFeedLive(true);
          showPulse(payload.text);
        } else if (payload.kind === "live") {
          setFeedLive(true);
        } else if (payload.kind === "standby") {
          setFeedLive(false);
        }
      } catch {
        // malformed frames are ignored instead of killing the stream
      }
    };

    source.onerror = () => setFeedLive(false);
    return () => source.close();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || feedLive) return;

    const firstPulse = window.setTimeout(showQuietPulse, 4800);
    const pulseTimer = window.setInterval(showQuietPulse, 17000);
    return () => {
      window.clearTimeout(firstPulse);
      window.clearInterval(pulseTimer);
    };
  }, [feedLive]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

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
      window.clearTimeout(blinkTimer);
      window.clearTimeout(reactionTimer);
      window.clearTimeout(blinkReturn);
      window.clearTimeout(reactionReturn);
    };
  }, []);

  function syncAudioClock() {
    const audio = player.current;
    if (!audio) return;
    if (Number.isFinite(audio.currentTime) && audio.currentTime >= 0) setProgress(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
  }

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(syncAudioClock, 250);
    return () => window.clearInterval(timer);
  }, [playing]);

  async function refreshAudioSource() {
    const response = await fetch("/api/audio/sign", { cache: "no-store", headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("signing failed");
    const payload = await response.json() as SignedAudio;
    setAudioSource(payload);
    return payload;
  }

  async function toggleAudio() {
    const audio = player.current;
    if (!audio || !canAudio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      let source = audioSource;
      const now = Math.floor(Date.now() / 1000);
      if (!source || (source.expires && source.expires <= now + 30)) source = await refreshAudioSource();
      if (audio.src !== source.url) {
        audio.src = source.url;
        audio.load();
      }
      await audio.play();
      syncAudioClock();
      setMediaError(false);
      flashKing("smug", 1200);
    } catch {
      setMediaError(true);
      setPlaying(false);
    }
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
    <main className={`world ${criticalReady ? "nebu-ready" : ""}`} aria-busy={!criticalReady}>
      <style>{`.world:not(.nebu-ready) .plate,.world:not(.nebu-ready) .coins,.world:not(.nebu-ready) .stage,.world:not(.nebu-ready) .pulse,.world:not(.nebu-ready) .mark,.world:not(.nebu-ready) .management-note{visibility:hidden}`}</style>
      <div ref={plate} className="plate" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div ref={coins} className="coins" aria-hidden="true">
        {coinStyles.map(([left, duration, delay, scale], index) => (
          <i key={index} style={{ left: `${left}%`, animationDuration: `${duration}s`, animationDelay: `${delay}s`, scale }} />
        ))}
      </div>

      <div ref={stage} className="stage">
        <div className="king-stack" aria-label="NEBUCHADREKTZAR">
          <img className="king" src="/nebu-neutral.webp" alt="NEBUCHADREKTZAR" width={1154} height={1363} loading="eager" fetchPriority="high" decoding="sync" />
          {facesLoaded && <>
            <img className={`king-face ${kingFrame === "blink" ? "active" : ""}`} src="/nebu-face-blink.webp" alt="" aria-hidden="true" decoding="async" />
            <img className={`king-face ${kingFrame === "sideeye" ? "active" : ""}`} src="/nebu-face-sideeye.webp" alt="" aria-hidden="true" decoding="async" />
            <img className={`king-face ${kingFrame === "smug" ? "active" : ""}`} src="/nebu-face-smug.webp" alt="" aria-hidden="true" decoding="async" />
          </>}
        </div>
        <button className="king-hit" onClick={nextThought} aria-label="Another thought from NEBU" />

        <button className="thought" onClick={nextThought} aria-label="Another thought from NEBU">
          <span key={thought} className="thought-anim">
            <strong>{thoughts[thought][0]}<br /><em>{thoughts[thought][1]}</em></strong>
            <small>{thoughts[thought][2]}</small>
          </span>
        </button>

        <div className={`record ${playing ? "playing" : ""}`}>
          <button
            className="record-main"
            onClick={toggleAudio}
            aria-label={canAudio ? `${playing ? "Pause" : "Play"} ${broadcast.title}` : `${broadcast.title} audio not loaded yet`}
            aria-disabled={!canAudio}
          >
            <span className="cd" aria-hidden="true" />
            <span className="sleeve">
              <img src={cover} alt="" width={480} height={480} loading="eager" fetchPriority="high" decoding="sync" />
              <b>{broadcast.title}</b>
              {canAudio && <span className="cover-play"><PlayIcon pause={playing} /></span>}
            </span>
            <span className="record-note">{canAudio ? (playing ? "playing. obviously. ♫" : "i made another one. ▶") : "the masterpiece is loading."}</span>
          </button>

          {canAudio && <div className="inline-audio-controls">
            <button className="inline-play" onClick={toggleAudio} aria-label={playing ? "Pause track" : "Play track"}>
              <PlayIcon pause={playing} />
            </button>
            <div className="inline-timeline">
              <input
                aria-label="Seek track"
                type="range"
                min="0"
                max={timelineReady ? duration : 1}
                step="0.1"
                value={timelineReady ? Math.min(progress, duration) : 0}
                disabled={!timelineReady}
                onChange={event => {
                  if (player.current && timelineReady) {
                    const next = Math.min(Number(event.target.value), duration);
                    player.current.currentTime = next;
                    setProgress(next);
                  }
                }}
              />
              <span>{formatTime(progress)} / {timelineReady ? formatTime(duration) : "--:--"}</span>
            </div>
          </div>}

          {mediaError && <span role="alert" className="inline-media-error">speakers are being difficult.</span>}

          {initialData.tracks.length > 0 && (
            <a className="record-more" href="/records">
              {initialData.tracks.length === 1 ? "one more of these" : `${initialData.tracks.length} more of these`} &#8594;
            </a>
          )}

          <audio
            ref={player}
            preload="none"
            onLoadedMetadata={syncAudioClock}
            onLoadedData={syncAudioClock}
            onDurationChange={syncAudioClock}
            onCanPlay={syncAudioClock}
            onTimeUpdate={syncAudioClock}
            onPlay={() => { setPlaying(true); syncAudioClock(); }}
            onPause={() => { setPlaying(false); syncAudioClock(); }}
            onEnded={() => { setPlaying(false); setProgress(0); }}
            onError={() => { setMediaError(true); setPlaying(false); }}
          />
        </div>
      </div>

      <div className="pulse" aria-live="polite">
        {demoMode && <div className="pulse-demo">DEMO FEED &middot; NOT REAL TRADES</div>}
        {pulse && <div key={pulse.key} className="pulse-message">{pulse.text}</div>}
      </div>

      <a className="mark" href="/" aria-label="NEBUCHADREKTZAR home">
        <img src="/nebu-avatar.webp" alt="" width={160} height={160} loading="eager" decoding="async" />
        <span><b>NEBUCHADREKTZAR</b><small>$N4X33</small><i style={{ color: "#f3ead1", fontSize: "16px", fontWeight: 600, textShadow: "0 2px 12px #0d0a13, 0 0 18px #0d0a13" }}>the rapper for the trenches.</i></span>
      </a>

      <aside className="management-note">
        <span className="tape" aria-hidden="true" />
        <small>A NOTE FROM NEBU</small>
        <h1>buy the token.<br />support the arts.</h1>
        <p>i make music now. shit happened.</p>

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
          <div className="token-actions">
            <a href="/hire">HIRE ME ↗</a>
          </div>
          {copyState && <span role="status" className="copy-status">{copyState}</span>}
        </div>
      </aside>
    </main>
  );
}