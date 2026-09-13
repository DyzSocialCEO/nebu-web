"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SiteData } from "@/lib/site-data";
import NebuPulse from "@/components/NebuPulse";

const headlines = [
  ["I'M NOT WRONG.", "I'M EARLY.", "very fucking early"],
  ["TAKE PROFITS?", "TAKE WHAT?", ""],
  ["WE JUST GOT HERE.", "", "it has been nine months"],
  ["MY WEALTH IS RESTING.", "", ""],
  ["TIME IS FUD.", "", ""],
  ["THE PALACE IS UNDER RENOVATION.", "", "indefinitely"],
  ["SEVEN YEARS.", "GIVE OR TAKE SEVEN YEARS.", ""],
] as const;

export default function NebuExperience({ initialData }: { initialData: SiteData }) {
  const broadcast = initialData.featuredBroadcast;
  const audio = useRef<HTMLAudioElement | null>(null);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const videoReady = Boolean(broadcast.videoUrl) && !videoFailed;
  const audioReady = Boolean(broadcast.audioUrl);
  const art = broadcast.imageUrl || broadcast.posterUrl || initialData.characterUrl || "/nebu-fallen-king.webp";
  const poster = broadcast.posterUrl || broadcast.imageUrl || initialData.characterUrl || "/nebu-fallen-king.webp";
  const currentHeadline = headlines[headlineIndex];

  useEffect(() => setVideoFailed(false), [broadcast.videoUrl]);

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

  const headlineClass = useMemo(() => currentHeadline[1] ? "headline split" : "headline", [currentHeadline]);

  return (
    <main className="site">
      <header className="topbar">
        <div className="wrap topbarInner">
          <a className="brand" href="#top" aria-label="NEBUCHADREKTZAR home">
            <span className="brandMark"><img src="/nebu-fallen-king.webp" alt="" aria-hidden="true" /></span>
            <span className="brandName">NEBUCHADREKTZAR</span>
            <span className="brandTicker">$N4X33</span>
          </a>
          <div className="kingdomStatus"><span className="heartbeat" />KINGDOM ONLINE</div>
          <nav className="nav" aria-label="Main navigation">
            <a href="#record">record</a>
            <a href="#pulse">pulse</a>
            <a href="#token">token</a>
          </nav>
        </div>
      </header>

      <section id="top" className="wrap hero">
        <div className="copy">
          <div className="eyebrow">royal transmission // still early</div>
          <button
            className="headlineButton"
            type="button"
            onClick={() => setHeadlineIndex((headlineIndex + 1) % headlines.length)}
            aria-label="Show another NEBU headline"
          >
            <h1 className={headlineClass}>
              {currentHeadline[0]}
              {currentHeadline[1] && <><br /><span className="acid">{currentHeadline[1]}</span></>}
            </h1>
            <div className="subline">{currentHeadline[2]}</div>
          </button>
          <p className="signature"><strong>I don&apos;t have a job.</strong> I have a rap career and a thesis.</p>
          <div className="ctaRow">
            <a className="cta primary" href="#record">▶ play my new one</a>
            <a className="cta gold" href="#token">buy the token</a>
          </div>
          <div className="credential">KING · RAPPER · FORMERLY EXTREMELY LIQUID</div>
        </div>

        <div className="heroArt">
          <div className="portraitShell">
            <div className="portraitMeta">NEBU // FIELD RECORD // 7Y LOCKUP</div>
            <div className="coin coin1">$</div><div className="coin coin2">$</div><div className="coin coin3">$</div>
            <div className="ruin ruin1" /><div className="ruin ruin2" /><div className="ruin ruin3" />
            <img className="kingImage" src={initialData.characterUrl || "/nebu-fallen-king.webp"} alt="NEBUCHADREKTZAR fallen king" />
            <div className="grassField" aria-hidden="true" />
            <div className="portraitQuote">“The palace is under renovation.”</div>
          </div>
        </div>
      </section>

      <section id="record" className="section">
        <div className="wrap">
          <div className="sectionKicker">current masterpiece</div>
          <h2 className="sectionTitle">I made another one.<br /><span className="acid">You&apos;re welcome.</span></h2>
          <div className="recordGrid">
            <div className="coverWrap">
              <div className={`cover ${playing ? "isPlaying" : ""}`}>
                <div className="coverTag">RECORD 001</div>
                <div className="vinylRing" />
                {videoReady ? (
                  <video src={broadcast.videoUrl} poster={poster} controls playsInline preload="metadata" onError={() => setVideoFailed(true)} />
                ) : (
                  <img src={art} alt={`${broadcast.title} artwork`} />
                )}
                <div className="coverShade" />
                <div className="coverTitle">{broadcast.title || "HE SAID SOON"}</div>
              </div>
            </div>

            <div className="recordCopy">
              <h3>I wrote this about a man in a rented Lamborghini.</h3>
              <p>He knows what he did. I would say more but I am a professional.</p>
              {!videoReady && (
                <div className="playerRow">
                  <button className="play" type="button" onClick={togglePlayback} disabled={!audioReady} aria-label={playing ? "Pause" : "Play"}>{audioReady ? (playing ? "Ⅱ" : "▶") : "—"}</button>
                  <div className="trackMeta">
                    <small>{broadcast.subtitle || "now transmitting"}</small>
                    <strong>{broadcast.title || "HE SAID SOON"} — NEBUCHADREKTZAR</strong>
                    <div className="bar"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
                  </div>
                  <div className="duration">{audioReady ? (playing ? "LIVE" : "READY") : "SOON"}</div>
                  {audioReady && <audio ref={audio} src={broadcast.audioUrl} preload="metadata" />}
                </div>
              )}
              <div className="smallTalk">You look financially exhausted. This will help.</div>
              <div className="olderWorks"><small>older masterpieces</small><p>Don&apos;t Sell Yet · recorded during a 40% day, my best work<br /><br />Grass Fed · about dinner. dinner is going well<br /><br />Have You Forgotten · for the ones who left. no hard feelings, I wrote your name down</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="pulse" className="section pulseSection">
        <div className="wrap">
          <div className="sectionKicker">kingdom pulse</div>
          <div className="pulseGrid">
            <div className="pulseIntro">
              <h2 className="sectionTitle">I see<br />every one.</h2>
              <p>I am awake. I am always awake.</p>
              <div className="credential">LIVE REACTIONS USE THE 68-LINE PULSE BANK</div>
            </div>
            <NebuPulse />
          </div>
        </div>
      </section>

      <section id="token" className="section tokenSection">
        <div className="wrap tokenGrid">
          <div>
            <div className="sectionKicker">handler note // do not show him</div>
            <h2 className="tokenHead">Buy the token.<br />Support<br /><span>the arts.</span></h2>
            <div className="handlerCard">The artist lost everything.<small>May also be purchased by successful traders. We do not discriminate against temporary wealth.</small></div>
            <div className="handlerNote">HE HAS NOT SEEN THIS SECTION AND IT IS GOING TO STAY THAT WAY.</div>
            <div className="truth">Sometimes we get rekt. Sometimes we print. <span>Somehow we always come back.</span></div>
          </div>
          <div className="tokenPanel">
            <p>I have expenses. Nobody asks about my expenses.</p>
            <div className="ca">{initialData.contractAddress || "N4X33xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}</div>
            <div className="ctaRow tokenActions">
              <button className="cta gold" type="button" onClick={() => initialData.contractAddress && navigator.clipboard?.writeText(initialData.contractAddress)}>copy address</button>
              <a className="cta" href={initialData.socials.x || "#"}>chart</a>
            </div>
            <p className="tokenFine">If you are asking when: seven years. Give or take seven years.</p>
          </div>
        </div>
      </section>

      <footer><div className="wrap footFlex"><span>NEBUCHADREKTZAR // $N4X33</span><span>TIME IS FUD.</span></div></footer>
    </main>
  );
}
