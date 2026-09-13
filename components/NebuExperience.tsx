"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SiteData } from "@/lib/site-data";

const headlineDeck = [
  ["I'M NOT WRONG.", "I'M EARLY.", "very fucking early"],
  ["TAKE PROFITS?", "TAKE WHAT?", "I have principles"],
  ["MY WEALTH", "IS RESTING.", "do not disturb it"],
  ["WE JUST", "GOT HERE.", "it has been nine months"],
  ["TIME IS", "FUD.", "look it up"],
  ["THE PALACE IS", "UNDER RENOVATION.", "indefinitely"],
  ["I HAVE A", "RAP CAREER.", "please respect the arts"],
];

const pulseLines = [
  { tag: "quiet", text: "nothing is happening. that is usually when everything is happening" },
  { tag: "+0.8 SOL", text: "good. you are early. I am not going to say it twice" },
  { tag: "-1.2 SOL", text: "you sold. that is a timing problem, not a me problem" },
  { tag: "+0.2 SOL", text: "tiny. but spiritually important" },
  { tag: "green", text: "told you" },
  { tag: "red", text: "normal. healthy. deeply normal" },
  { tag: "whale", text: "somebody with money has entered the garden" },
];

export default function NebuExperience({ initialData }: { initialData: SiteData }) {
  const broadcast = initialData.featuredBroadcast;
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const artwork = broadcast.imageUrl || broadcast.posterUrl || initialData.characterUrl;
  const activeHeadline = headlineDeck[headlineIndex];
  const visiblePulse = useMemo(() => {
    return Array.from({ length: 4 }, (_, offset) => pulseLines[(pulseIndex + offset) % pulseLines.length]);
  }, [pulseIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => setPulseIndex((value) => (value + 1) % pulseLines.length), 4300);
    return () => window.clearInterval(timer);
  }, []);

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
  }, [broadcast.audioUrl]);

  async function togglePlayback() {
    const player = audio.current;
    if (!player || !broadcast.audioUrl) return;
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

  async function copyAddress() {
    if (!initialData.contractAddress) return;
    try {
      await navigator.clipboard.writeText(initialData.contractAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="kingdom">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="NEBUCHADREKTZAR home">
          <img src="/nebu-fallen-king.webp" alt="" aria-hidden="true" />
          <span><b>NEBUCHADREKTZAR</b><small>$N4X33</small></span>
        </a>
        <div className="kingdom-status"><i /> KINGDOM ONLINE</div>
        <nav>
          <a href="#record">MUSIC</a>
          <a href="#pulse">PULSE</a>
          <a href="#support">TOKEN</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <div className="eyebrow">{initialData.eyebrow}</div>
          <button
            className="headline-button"
            onClick={() => setHeadlineIndex((headlineIndex + 1) % headlineDeck.length)}
            aria-label="Show another NEBU thought"
          >
            <h1>{activeHeadline[0]}<br /><span>{activeHeadline[1]}</span></h1>
            <small>{activeHeadline[2]}</small>
          </button>
          <p className="hero-line">{initialData.heroCopy}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#record">▶ PLAY MY NEW ONE</a>
            <a className="ghost-action" href="#pulse">SEE WHAT I'M WATCHING</a>
          </div>
          <p className="credentials">KING · RAPPER · FORMERLY EXTREMELY LIQUID</p>
        </div>

        <div className="king-stage" aria-label="NEBUCHADREKTZAR in the field">
          <img src={initialData.characterUrl || "/nebu-fallen-king.webp"} alt="NEBUCHADREKTZAR" />
          <div className="coin coin-one">$</div>
          <div className="coin coin-two">$</div>
          <div className="coin coin-three">$</div>
          <div className="speech">do not call this a comeback.<br /><b>I never left.</b><small>I was outside.</small></div>
          <div className="status-sticker">STATUS: {initialData.status.toUpperCase()}</div>
        </div>
      </section>

      <section id="record" className="record-zone">
        <div className="record-intro">
          <span className="kicker">NEW ROYAL RELEASE</span>
          <h2>I MADE<br />ANOTHER ONE.</h2>
          <p>you&apos;re welcome</p>
          <div className="nebu-note">I wrote this after making several completely reasonable decisions in a row.</div>
        </div>

        <div className="record-object">
          <div className="record-cover">
            <img src={artwork} alt={`${broadcast.title} artwork`} />
            <div className="cover-stamp">DEGEN CONTENT</div>
            <div className="cover-type"><small>NEBUCHADREKTZAR</small><strong>{broadcast.title}</strong></div>
          </div>
          <div className="player-console">
            <div>
              <small>{broadcast.subtitle}</small>
              <strong>{broadcast.title}</strong>
            </div>
            <button onClick={togglePlayback} disabled={!broadcast.audioUrl} aria-label={playing ? "Pause" : "Play"}>
              {broadcast.audioUrl ? (playing ? "Ⅱ" : "▶") : "—"}
            </button>
            <div className="progress"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
            <span>{broadcast.audioUrl ? (playing ? "TRANSMITTING" : "PLAY IT") : "HANDLERS HAVE NOT UPLOADED THE SONG"}</span>
            {broadcast.audioUrl && <audio ref={audio} src={broadcast.audioUrl} preload="metadata" />}
          </div>
        </div>

        <div className="archive">
          <span className="kicker">OLDER MASTERPIECES</span>
          {initialData.lore.map((item) => (
            <div className="archive-row" key={`${item.code}-${item.title}`}>
              <small>{item.code}</small><b>{item.title}</b><p>{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pulse" className="pulse-zone">
        <div className="pulse-copy">
          <span className="kicker">KINGDOM PULSE</span>
          <h2>I SEE<br />EVERY ONE.</h2>
          <p>I am awake. I am always awake.</p>
          <div className="truth-label">HANDLERS ARE FAKING THIS FEED UNTIL THE REAL WIRE GOES LIVE.</div>
        </div>

        <div className="pulse-feed">
          <div className="pulse-head"><span><i /> watching, as usual</span><small>NEBU CAM</small></div>
          {visiblePulse.map((line, index) => (
            <div className="pulse-line" key={`${line.tag}-${index}-${pulseIndex}`}>
              <span>{line.tag}</span><p>{line.text}</p>
            </div>
          ))}
          <div className="pulse-footer">if something breaks, it is almost certainly the market&apos;s fault.</div>
        </div>
      </section>

      <section id="support" className="support-zone">
        <div className="handler-card">
          <span>HANDLER NOTE // DO NOT SHOW HIM</span>
          <h2>BUY THE TOKEN.<br />SUPPORT THE ARTS.</h2>
          <p>The artist lost everything.</p>
          <small>May also be purchased by successful traders. We do not discriminate against temporary wealth.</small>
        </div>

        <div className="token-object">
          <div className="nebu-interruption">I have expenses.<br />Nobody asks about my expenses.</div>
          <b>$N4X33</b>
          <code>{initialData.contractAddress || "CONTRACT ADDRESS ARRIVES WHEN THE KING DOES"}</code>
          <div className="token-actions">
            <button onClick={copyAddress} disabled={!initialData.contractAddress}>{copied ? "COPIED. DO NOT LOSE IT." : "COPY ADDRESS"}</button>
            <span>chart coming when there is something worth staring at</span>
          </div>
        </div>
      </section>

      <footer>
        <div><b>NEBUCHADREKTZAR</b><span>$N4X33</span></div>
        <strong>TIME IS FUD.</strong>
        <div className="socials">
          {initialData.socials.x && <a href={initialData.socials.x} target="_blank" rel="noreferrer">X</a>}
          {initialData.socials.telegram && <a href={initialData.socials.telegram} target="_blank" rel="noreferrer">TELEGRAM</a>}
        </div>
      </footer>
    </main>
  );
}
