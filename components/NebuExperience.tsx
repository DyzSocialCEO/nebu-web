"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteData } from "@/lib/site-data";

export default function NebuExperience({ initialData }: { initialData: SiteData }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const trackReady = Boolean(initialData.currentTrack.audioUrl);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    const sync = () => setProgress(player.duration ? player.currentTime / player.duration : 0);
    const stop = () => setPlaying(false);
    player.addEventListener("timeupdate", sync);
    player.addEventListener("ended", stop);
    return () => {
      player.removeEventListener("timeupdate", sync);
      player.removeEventListener("ended", stop);
    };
  }, []);

  async function togglePlayback() {
    const player = audio.current;
    if (!player || !trackReady) return;
    if (player.paused) {
      await player.play();
      setPlaying(true);
    } else {
      player.pause();
      setPlaying(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="NEBUCHADREKTZAR home">
          <span className="sigil">N</span>
          <span><b>NEBUCHADREKTZAR</b><small>$N4X33</small></span>
        </a>
        <div className="system-line"><i /> KINGDOM NETWORK // DEGRADED</div>
        <nav>
          <a href="#lore">LORE</a>
          <a href="#broadcast">BROADCAST</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <div className="eyebrow">{initialData.eyebrow}</div>
          <h1>{initialData.heroTitle}</h1>
          <p className="lede">{initialData.heroCopy}</p>
          <div className="state-row">
            <span className="state"><i /> STATE: {initialData.status.toUpperCase()}</span>
            <span>SUBJECT: FORMERLY MAJESTIC</span>
          </div>
          <div className="terminal-copy">
            <span>ROYAL_DIAGNOSTIC.LOG</span>
            <p>&gt; dominion ........ LOST<br />&gt; sanity .......... PENDING<br />&gt; diet ............ FIELD GRASS<br />&gt; chapter ......... 4:33</p>
          </div>
        </div>

        <div className="portrait-column">
          <div className="portrait-frame">
            <div className="frame-code">SUBJECT_N4X33 / VISUAL RECORD</div>
            {initialData.characterUrl ? (
              <img src={initialData.characterUrl} alt="NEBUCHADREKTZAR character" />
            ) : (
              <div className="portrait-placeholder" aria-label="NEBUCHADREKTZAR artwork placeholder">
                <span className="crown">♛</span>
                <strong>N4X33</strong>
                <div className="grass">///// ///// /////</div>
              </div>
            )}
            <div className="scanline" />
          </div>
          <div className="portrait-caption"><b>LAST SEEN:</b> OUTSIDE // EATING GRASS // STILL BULLISH</div>
        </div>
      </section>

      <section id="broadcast" className="broadcast">
        <div className="broadcast-label"><span>ROYAL BROADCAST</span><small>ONE SONG FROM THE FIELD</small></div>
        <div className="player">
          <button onClick={togglePlayback} disabled={!trackReady} aria-label={playing ? "Pause" : "Play"}>
            {trackReady ? (playing ? "Ⅱ" : "▶") : "—"}
          </button>
          <div className="track-meta">
            <small>{initialData.currentTrack.subtitle}</small>
            <strong>{initialData.currentTrack.title}</strong>
            <div className="progress"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
          </div>
          <div className="track-state">{trackReady ? (playing ? "TRANSMITTING" : "READY") : "AUDIO INTAKE"}</div>
          {trackReady && <audio ref={audio} src={initialData.currentTrack.audioUrl} preload="metadata" />}
        </div>
      </section>

      <section id="lore" className="lore">
        <div className="section-heading"><span>THE INCIDENT</span><h2>THE FALL OF A VERY LIQUID KING.</h2></div>
        <div className="lore-grid">
          {initialData.lore.map((item) => (
            <article key={`${item.code}-${item.title}`}>
              <small>{item.code}</small>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contract-strip">
        <span>ROYAL ASSET</span><b>$N4X33</b>
        <code>{initialData.contractAddress || "CONTRACT // NOT YET PROCLAIMED"}</code>
      </section>

      <footer>
        <span>NEBUCHADREKTZAR // EST. DANIEL 4:33</span>
        <span>NO ROADMAP. HE CANNOT READ IT FROM THE FIELD.</span>
      </footer>
    </main>
  );
}
