"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteData } from "@/lib/site-data";

const fallStory = [
  {
    number: "01",
    label: "THE EGO",
    title: "HE LOOKED AT BABYLON AND GOT WAY TOO COMFORTABLE.",
    copy: "Palaces. Gold. Chariots. Zero risk management. His Majesty concluded this meant he was basically invincible.",
    quote: "I BUILT THIS. WHAT COULD POSSIBLY GO WRONG?",
  },
  {
    number: "02",
    label: "THE GROUP CHAT",
    title: "SOME PALACE INTERN EXPLAINED LEVERAGE.",
    copy: "The presentation should have ended at 'high risk.' Instead somebody said 50x and the king heard '50 kingdoms.'",
    quote: "YOUR MAJESTY, TECHNICALLY THE UPSIDE IS ENORMOUS.",
  },
  {
    number: "03",
    label: "THE TRADE",
    title: "HE PUT THE ROYAL TREASURY ON ONE CANDLE.",
    copy: "Advisers asked about a stop loss. He reminded them he was the king. History has not been kind to this answer.",
    quote: "STOP LOSS? I AM THE STOP LOSS.",
  },
  {
    number: "04",
    label: "THE LIQUIDATION",
    title: "BABYLON GOT MARGIN-CALLED BEFORE LUNCH.",
    copy: "Treasury gone. Palace repossessed. Royal credit score cooked. Even the chariot people stopped answering his calls.",
    quote: "PLEASE DEPOSIT ADDITIONAL COLLATERAL.",
  },
  {
    number: "05",
    label: "DANIEL 4:33",
    title: "THE MARKET FINALLY TOLD HIM TO GO TOUCH GRASS.",
    copy: "He took the instruction extremely literally. Crown stayed on. Dignity did not.",
    quote: "CURRENT DIET: LOCALLY SOURCED GRASS.",
  },
  {
    number: "06",
    label: "THE COMEBACK",
    title: "SO HE STARTED RAPPING FOR RENT.",
    copy: "The kingdom is still gone, but he found a microphone. Every stream is now technically part of the Babylon reconstruction fund.",
    quote: "ONE MORE 100X AND I GET THE PALACE BACK.",
  },
];

export default function NebuExperience({ initialData }: { initialData: SiteData }) {
  const broadcast = initialData.featuredBroadcast;
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const videoReady = Boolean(broadcast.videoUrl) && !videoFailed;
  const audioReady = Boolean(broadcast.audioUrl);
  const fallbackImage = broadcast.imageUrl || broadcast.posterUrl || initialData.characterUrl || "/nebu-fallen-king.webp";
  const videoPoster = broadcast.posterUrl || broadcast.imageUrl || initialData.characterUrl || "/nebu-fallen-king.webp";

  useEffect(() => {
    setVideoFailed(false);
  }, [broadcast.videoUrl]);

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

  const mode = videoReady ? "MUSIC VIDEO" : audioReady ? "AUDIO DROP" : "COVER ART";

  return (
    <main className="kingdom-shell">
      <header className="kingdom-nav">
        <a className="kingdom-brand" href="#top" aria-label="NEBUCHADREKTZAR home">
          <span className="brand-face"><img src="/nebu-fallen-king.webp" alt="" aria-hidden="true" /></span>
          <span className="brand-type"><b>NEBUCHADREKTZAR</b><small>$N4X33</small></span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#track">THE TRACK</a>
          <a href="#fall">THE FALL</a>
          <a href="#coin">THE COIN</a>
        </nav>

        <a className="salad-button" href="#coin">BUY THE KING A SALAD</a>
      </header>

      <div className="rekt-ticker" aria-label="Current kingdom status">
        <div className="ticker-run">
          <span>👑 KINGDOM: <b>LIQUIDATED</b></span>
          <span>💸 ROYAL TREASURY: <b>$0.43</b></span>
          <span>🌱 CURRENT DIET: <b>GRASS</b></span>
          <span>📉 LEVERAGE USED: <b>TOO MUCH</b></span>
          <span>🧠 SANITY: <b>PENDING</b></span>
          <span>🎤 NEW CAREER: <b>DEGEN RAPPER</b></span>
          <span>👑 KINGDOM: <b>LIQUIDATED</b></span>
          <span>💸 ROYAL TREASURY: <b>$0.43</b></span>
          <span>🌱 CURRENT DIET: <b>GRASS</b></span>
          <span>📉 LEVERAGE USED: <b>TOO MUCH</b></span>
          <span>🧠 SANITY: <b>PENDING</b></span>
          <span>🎤 NEW CAREER: <b>DEGEN RAPPER</b></span>
        </div>
      </div>

      <section id="top" className="meme-hero">
        <div className="stars" aria-hidden="true">
          {Array.from({ length: 22 }).map((_, i) => <i key={i} />)}
        </div>
        <div className="moon" aria-hidden="true"><span>↘</span></div>
        <div className="ruins ruins-back" aria-hidden="true" />
        <div className="grass-line" aria-hidden="true" />

        <div className="hero-copy-block">
          <div className="incident-sticker">⚠ DANIEL 4:33 // DEGEN KINGDOM INCIDENT</div>
          <p className="name-line">NEBUCHADREKTZAR</p>
          <h1>KING OF<br />BABYLON. <em>NOW REKT.</em></h1>
          <p className="hero-punchline">{initialData.heroCopy}</p>

          <div className="hero-actions">
            <a className="comic-btn primary" href="#track">▶ HEAR HIS NEW TRACK</a>
            <a className="comic-btn light" href="#fall">HOW DID THIS HAPPEN?</a>
          </div>

          <div className="status-stickers">
            <span className="red">KINGDOM: GONE</span>
            <span className="green">STATE: {initialData.status.toUpperCase()}</span>
            <span className="cream">TICKER: $N4X33</span>
          </div>
        </div>

        <div className="king-stage">
          <div className="speech-bubble">
            <strong>“ONE MORE 100X<br />AND I GET THE PALACE BACK.”</strong>
            <small>— last recorded words before another bad entry</small>
          </div>

          <div className="portrait-card">
            <div className="credit-sticker">ROYAL CREDIT SCORE: COOKED</div>
            <img src={initialData.characterUrl || "/nebu-fallen-king.webp"} alt="NEBUCHADREKTZAR, the fallen king turned degen rapper" />
            <div className="rapper-sticker">NEW CAREER:<br /><b>DEGEN RAPPER</b></div>
          </div>
        </div>
      </section>

      <section id="track" className="royal-records">
        <div className="records-copy">
          <span className="section-tag">🎤 ROYAL RECORDS PRESENTS</span>
          <h2>THE KING<br />NEEDED A <em>JOB.</em></h2>
          <p>After losing an entire kingdom, normal employment was apparently “beneath the crown.” So he bought a microphone and started dropping degen records from the ruins.</p>

          <div className="career-card">
            <span>FORMER OCCUPATION</span><b>KING OF BABYLON</b>
            <span>CURRENT OCCUPATION</span><b>RAPPER / GRASS ENTHUSIAST</b>
            <span>CAREER OBJECTIVE</span><b>BUY THE PALACE BACK</b>
          </div>
        </div>

        <div className="track-player">
          <div className="player-topline">
            <span>NEW DROP // {broadcast.subtitle}</span>
            <b>{mode}</b>
          </div>

          <div className="track-screen">
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
            ) : (
              <img src={fallbackImage} alt={`${broadcast.title} cover artwork`} />
            )}
            <span className="on-air">● ROYAL RECORDS</span>
          </div>

          <div className="track-bottom">
            <div className="track-name">
              <small>NEBUCHADREKTZAR // SINGLE</small>
              <strong>{broadcast.title}</strong>
            </div>

            {!videoReady && (
              <div className="fallback-player">
                <button type="button" onClick={togglePlayback} disabled={!audioReady} aria-label={playing ? "Pause track" : "Play track"}>
                  {audioReady ? (playing ? "Ⅱ" : "▶") : "—"}
                </button>
                <div className="track-progress">
                  <div><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
                  <small>{audioReady ? (playing ? "KING IS RAPPING..." : "PLAY THE TRACK") : "DROP COMING SOON"}</small>
                </div>
                {audioReady && <audio ref={audio} src={broadcast.audioUrl} preload="metadata" />}
              </div>
            )}
          </div>

          <p className="player-joke">STREAMING REVENUE CURRENTLY BEING USED TO REBUILD THE EAST WING.</p>
        </div>
      </section>

      <section id="fall" className="fall-section">
        <div className="fall-heading">
          <span>UNOFFICIAL TRENCHES TRANSLATION</span>
          <h2>HOW TO LOSE A KINGDOM<br />IN <em>SIX EASY STEPS.</em></h2>
          <p>Scholars may dispute the financial details. The liquidation definitely feels canon.</p>
        </div>

        <div className="story-grid">
          {fallStory.map((item, index) => (
            <article className={`story-panel p${index + 1}`} key={item.number}>
              <div className="story-number">{item.number}</div>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <blockquote>{item.quote}</blockquote>
            </article>
          ))}
        </div>
      </section>

      <section className="prophecy-section">
        <div className="prophecy-card">
          <span>DANIEL 4:33</span>
          <h2>THE ORIGINAL STORY SAID HE ENDED UP EATING GRASS.</h2>
          <p>Our completely unofficial degen footnote is simply that leverage probably would have got him there faster.</p>
          <div className="prophecy-note">NOT A BIBLE TRANSLATION. VERY MUCH A MEME.</div>
        </div>
        <div className="grass-king" aria-hidden="true">🌱 👑 🌱</div>
      </section>

      <section id="coin" className="coin-section">
        <div>
          <span className="section-tag">THE ASSET HE SHOULD NOT BE ALLOWED TO MANAGE</span>
          <h2>$N4X33</h2>
          <p>Named after the chapter that ended the royal bull run. Absolutely no guarantee the king has learned anything.</p>
        </div>

        <div className="contract-card">
          <small>ROYAL CONTRACT</small>
          <code>{initialData.contractAddress || "CONTRACT NOT YET PROCLAIMED"}</code>
          <div className="coin-links">
            {initialData.socials.x && <a href={initialData.socials.x} target="_blank" rel="noreferrer">X / TRENCHES</a>}
            {initialData.socials.telegram && <a href={initialData.socials.telegram} target="_blank" rel="noreferrer">TELEGRAM</a>}
          </div>
        </div>
      </section>

      <footer className="meme-footer">
        <div><b>NEBUCHADREKTZAR</b><span>$N4X33 // DANIEL 4:33</span></div>
        <p>NOT FINANCIAL ADVICE. HE LOST A KINGDOM.</p>
      </footer>
    </main>
  );
}
