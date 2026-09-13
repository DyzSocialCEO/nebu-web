"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteData } from "@/lib/site-data";

export default function NebuExperience({ initialData }: { initialData: SiteData }) {
  const broadcast = initialData.featuredBroadcast;
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const videoReady = Boolean(broadcast.videoUrl) && !videoFailed;
  const audioReady = Boolean(broadcast.audioUrl);
  const fallbackImage = broadcast.imageUrl || broadcast.posterUrl || initialData.characterUrl;
  const videoPoster = broadcast.posterUrl || broadcast.imageUrl || initialData.characterUrl || undefined;

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    const sync = () => setProgress(player.duration ? player.currentTime / player.duration : 0);
    const stop = () => setPlaying(false);
    player.addEventListener("timeupdate", sync);
    player.addEventListener("ended", stop);
    player.addEventListener("pause", stop);
    return () => {
      player.removeEventListener("timeupdate", sync);
      player.removeEventListener("ended", stop);
      player.removeEventListener("pause", stop);
    };
  }, [audioReady, videoReady]);

  async function togglePlayback() {
    const player = audio.current;
    if (!player || !audioReady) return;
    if (player.paused) {
      try {
        await player.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      player.pause();
    }
  }

  const broadcastMode = videoReady ? "MOTION FEED" : audioReady ? "IMAGE + AUDIO" : fallbackImage ? "VISUAL FEED" : "SIGNAL PENDING";

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="NEBUCHADREKTZAR home">
          <span className="sigil">N</span>
          <span><b>NEBUCHADREKTZAR</b><small>$N4X33</small></span>
        </a>
        <div className="system-line"><i /> KINGDOM NETWORK // DEGRADED</div>
        <nav>
          <a href="#broadcast">BROADCAST</a>
          <a href="#lore">LORE</a>
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

        <div id="broadcast" className="broadcast-stage">
          <div className="broadcast-head">
            <span>FEATURED BROADCAST</span>
            <small><i /> {broadcastMode}</small>
          </div>

          <div className="media-frame">
            {videoReady ? (
              <video
                key={broadcast.videoUrl}
                src={broadcast.videoUrl}
                poster={videoPoster}
                controls
                playsInline
                preload="metadata"
                onError={() => setVideoFailed(true)}
              >
                Your browser does not support video playback.
              </video>
            ) : fallbackImage ? (
              <img src={fallbackImage} alt={`${broadcast.title} broadcast artwork`} />
            ) : (
              <div className="broadcast-placeholder" aria-label="Featured broadcast awaiting media">
                <span className="crown">♛</span>
                <strong>N4X33</strong>
                <small>TRANSMISSION AWAITING MEDIA</small>
              </div>
            )}
            <div className="frame-code">ROYAL_SIGNAL // {videoReady ? "VIDEO" : "FALLBACK"}</div>
            <div className="scanline" />
          </div>

          <div className="broadcast-meta">
            <div className="broadcast-title">
              <small>{broadcast.subtitle}</small>
              <strong>{broadcast.title}</strong>
            </div>

            {!videoReady && (
              <div className="audio-row">
                <button onClick={togglePlayback} disabled={!audioReady} aria-label={playing ? "Pause broadcast audio" : "Play broadcast audio"}>
                  {audioReady ? (playing ? "Ⅱ" : "▶") : "—"}
                </button>
                <div className="audio-progress">
                  <div className="progress"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
                  <small>{audioReady ? (playing ? "TRANSMITTING" : "PLAY FIELD AUDIO") : "AUDIO NOT YET RECEIVED"}</small>
                </div>
                {audioReady && <audio ref={audio} src={broadcast.audioUrl} preload="metadata" />}
              </div>
            )}
          </div>

          <div className="broadcast-caption">
            <b>{videoReady ? "LIVE FILE:" : "FALLBACK FILE:"}</b> THE KING IS STILL OUTSIDE // SIGNAL QUALITY QUESTIONABLE
          </div>
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
