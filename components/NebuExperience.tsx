"use client";

import { useEffect, useRef, useState } from "react";
import NowPlaying from "@/components/NowPlaying";
import type { SiteData } from "@/lib/site-data";

type KingFrame = "neutral" | "blink" | "sideeye" | "smug";

const thoughts = [
  ["i’m not wrong.", "i’m early."],
  ["portfolio update?", "absolutely not."],
  ["take profits?", "take what?"],
  ["we just", "got here."],
  ["the house is", "being renovated."],
  ["i have a", "rap career."],
  ["time", "is fud."],
];

const coinStyles = [
  [8, 7.8, -2.8, .75], [18, 10.2, -7.1, .9], [31, 8.9, -4.3, .62],
  [43, 12.4, -9.2, .82], [57, 7.1, -1.5, .68], [68, 11.3, -6.2, .95],
  [77, 9.6, -3.4, .7], [87, 13.1, -8.7, .86], [95, 8.2, -5.1, .58],
] as const;

const faceFrames = ["/nebu-face-blink.webp", "/nebu-face-sideeye.webp", "/nebu-face-smug.webp"] as const;

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
  const [thought, setThought] = useState(0);
  const [kingFrame, setKingFrame] = useState<KingFrame>("neutral");
  const [pulse, setPulse] = useState<{ text: string; key: number } | null>(null);
  const pulseKey = useRef(0);
  const pulseHide = useRef(0);
  const [demoMode, setDemoMode] = useState(false);
  const [facesLoaded, setFacesLoaded] = useState(false);
  const plate = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const coins = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      Promise.all(faceFrames.map(warmImage)).then(() => {
        if (active) setFacesLoaded(true);
      });
    }, 700);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

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
      return;
    }

    source.onmessage = event => {
      try {
        const payload = JSON.parse(event.data) as { kind?: string; text?: string };
        if (payload.kind === "line" && payload.text) {
          showPulse(payload.text);
        }
      } catch {
        // malformed frames are ignored instead of killing the stream
      }
    };

    return () => source.close();
  }, []);

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
      window.clearTimeout(pulseHide.current);
    };
  }, []);

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
          <img className="king" src="/nebu-neutral.webp" alt="NEBUCHADREKTZAR" width={1154} height={1363} loading="eager" fetchPriority="high" decoding="sync" />
          {facesLoaded && <>
            <img className={`king-face ${kingFrame === "blink" ? "active" : ""}`} src="/nebu-face-blink.webp" alt="" aria-hidden="true" decoding="async" />
            <img className={`king-face ${kingFrame === "sideeye" ? "active" : ""}`} src="/nebu-face-sideeye.webp" alt="" aria-hidden="true" decoding="async" />
            <img className={`king-face ${kingFrame === "smug" ? "active" : ""}`} src="/nebu-face-smug.webp" alt="" aria-hidden="true" decoding="async" />
          </>}
        </div>
        <button className="king-hit" onClick={nextThought} aria-label="Another thought from NEBU" />

        <div className="say">
          <p className="origin-line">formerly extremely liquid. now i rap.</p>

          <button className="thought" onClick={nextThought} aria-label="Another thought from NEBU">
            <span key={thought} className="thought-anim">
              <strong>{thoughts[thought][0]}<br /><em>{thoughts[thought][1]}</em></strong>
            </span>
          </button>
        </div>
      </div>

      <div className="pulse" aria-live="polite">
        {demoMode && <div className="pulse-demo">DEMO FEED &middot; NOT REAL TRADES</div>}
        {pulse && <div key={pulse.key} className="pulse-message">{pulse.text}</div>}
      </div>

      <NowPlaying
        title={initialData.featuredBroadcast.title}
        imageUrl={initialData.featuredBroadcast.imageUrl}
        hasAudio={Boolean(initialData.featuredBroadcast.audioUrl)}
      />
    </main>
  );
}
