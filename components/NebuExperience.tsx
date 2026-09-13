"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteData } from "@/lib/site-data";

const thoughts = [
  ["i’m not wrong.", "i’m early.", "very fucking early."],
  ["my wealth", "is resting.", "do not disturb it."],
  ["take profits?", "take what?", "i have principles."],
  ["we just", "got here.", "it has been nine months."],
  ["the palace is", "under renovation.", "indefinitely."],
  ["i have a", "rap career.", "please respect the arts."],
  ["time", "is fud.", "look it up."],
];

function PlayIcon({ pause = false }: { pause?: boolean }) {
  return pause ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg> : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7 3 15 9-15 9z" /></svg>;
}

export default function NebuExperience({ initialData }: { initialData: SiteData }) {
  const broadcast = initialData.featuredBroadcast;
  const [thought, setThought] = useState(0);
  const [recordOpen, setRecordOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [copyState, setCopyState] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLAudioElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const nextThought = () => setThought(value => (value + 1) % thoughts.length);
  const canVideo = Boolean(broadcast.videoUrl) && !videoFailed;
  const canAudio = Boolean(broadcast.audioUrl);
  const hasMedia = canVideo || canAudio;
  const cover = broadcast.imageUrl || broadcast.posterUrl || "/nebu-approved.webp";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setThought(value => (value + 1) % thoughts.length), 16000);
    return () => window.clearInterval(timer);
  }, []);

  function openRecord() { setRecordOpen(true); dialog.current?.showModal(); }
  function stopMedia() {
    dialog.current?.querySelectorAll<HTMLMediaElement>("audio, video").forEach(media => media.pause());
    setPlaying(false);
    setRecordOpen(false);
  }
  function closeRecord() {
    stopMedia();
    setPlaying(false);
    dialog.current?.close();
  }
  async function toggleAudio() {
    const audio = player.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); setMediaError(false); } catch { setMediaError(true); }
  }
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(initialData.contractAddress);
      setCopyState("copied. do not lose it.");
    } catch { setCopyState("select the address below. i cannot do everything."); }
  }

  return (
    <main className="world">
      <div className="world-art" aria-hidden="true" />
      <div className="world-shade" aria-hidden="true" />
      <div className="dust" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <header className="signature">
        <a className="identity" href="/" aria-label="NEBUCHADREKTZAR home">
          <span className="face-mark"><img src="/nebu-avatar.webp" alt="" /></span>
          <span><b>NEBUCHADREKTZAR</b><small>$N4X33 <em>·</em> still early.</small></span>
        </a>
        <div className="socials">
          {initialData.socials.x && <a href={initialData.socials.x} target="_blank" rel="noopener noreferrer" aria-label="NEBU on X">X ↗</a>}
          {initialData.socials.telegram && <a href={initialData.socials.telegram} target="_blank" rel="noopener noreferrer">TELEGRAM ↗</a>}
        </div>
      </header>

      <div className="scene-caption">somewhere outside the palace.<br /><span>ownership is a sensitive subject.</span></div>
      <button className="character-hit" onClick={nextThought} aria-label="Hear another thought from NEBU" />
      <div className="thought-area">
        <span className="handwritten thought-intro">a word from me, apparently.</span>
        <button className="thought" onClick={nextThought} aria-label="Show another NEBU thought">
          <span key={thought} className="thought-text"><strong>{thoughts[thought][0]}<br /><em>{thoughts[thought][1]}</em></strong><small>{thoughts[thought][2]}</small></span>
          <span className="thought-next">tap for more wisdom <span>↗</span></span>
        </button>
      </div>

      <div className="record-place">
        <span className="handwritten record-note">i made another one. ↘</span>
        <button className="record" onClick={openRecord} aria-label={`Open ${broadcast.title}`}>
          <span className={`vinyl ${playing ? "spinning" : ""}`}><span><img src="/nebu-approved.webp" alt="" /></span></span>
          <span className="sleeve"><img src={cover} alt="" /><span className="sleeve-caption">NEBUCHADREKTZAR<em>{broadcast.title}</em><small>ANOTHER GENERATIONAL RECORD</small></span><span className="parental">EXPLICIT<br />CONFIDENCE</span></span>
          <span className="record-play"><PlayIcon pause={playing} /></span>
        </button>
        <button className="record-label" onClick={openRecord}><span className="release-dot" />{hasMedia ? "PLAY MY NEW ONE" : "MY NEXT MASTERPIECE"}<span>↗</span></button>
        <span className="record-aside">{hasMedia ? "you’re welcome." : "the handlers are finding the file."}</span>
      </div>

      <aside className="handler">
        <span className="tape" aria-hidden="true" />
        <small>A NOTE FROM MANAGEMENT</small>
        <h1>buy the token.<br />support the arts.</h1>
        <p>The artist lost everything.</p>
        <span className="nebu-correction">my wealth is resting.</span>
        <div className="token-controls">
          <b>$N4X33</b>
          {initialData.contractAddress ? <><button onClick={copyAddress}>COPY CA <span>↗</span></button><a href={`https://dexscreener.com/search?q=${encodeURIComponent(initialData.contractAddress)}`} target="_blank" rel="noopener noreferrer">CHART ↗</a></> : <span>CA SOON</span>}
        </div>
        {initialData.contractAddress && <code className="contract">{initialData.contractAddress}</code>}
        {copyState && <p role="status" className="copy-status">{copyState}</p>}
      </aside>

      <footer className="world-footer">
        <div className="feed-state"><span className="standby-dot" /><span>i’m watching.<small>CHAIN FEED · NOT CONNECTED</small></span></div>
        <span className="footer-thought">king. rapper. formerly extremely liquid.</span>
        <span className="sound-state"><i className={playing ? "active" : ""} />{playing ? "HISTORY IS PLAYING" : "SOUND ON YOUR TERMS"}</span>
      </footer>

      <dialog ref={dialog} className="record-dialog" onCancel={stopMedia} onClose={stopMedia} onPlayCapture={event => {
        dialog.current?.querySelectorAll<HTMLMediaElement>("audio, video").forEach(media => { if (media !== event.target) media.pause(); });
        setPlaying(true);
      }} onClick={event => { if (event.target === dialog.current) closeRecord(); }}>
        <div className="record-room">
          <button className="close" onClick={closeRecord} aria-label="Close record player">×</button>
          <span className="room-eyebrow">I HAVE A RAP CAREER. PLEASE RESPECT IT.</span>
          <h2>{broadcast.title}</h2>
          <p className="room-subtitle">every song is generational. this one included.</p>
          {canVideo && recordOpen ? <video ref={video} controls playsInline preload="metadata" poster={cover} src={broadcast.videoUrl} onError={() => { setVideoFailed(true); setPlaying(false); }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} /> : <div className="fallback-cover"><img src={cover} alt={`${broadcast.title} artwork`} /></div>}
          {!canVideo && canAudio && recordOpen && <div className="audio-controls">
            <button onClick={toggleAudio} aria-label={playing ? "Pause track" : "Play track"}><PlayIcon pause={playing} /></button>
            <label>the generational part<input aria-label="Seek track" type="range" min="0" max={duration || 1} step="0.1" value={progress} onChange={event => { if (player.current) { player.current.currentTime = Number(event.target.value); setProgress(Number(event.target.value)); } }} /></label>
            <span>{Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2, "0")}</span>
            <audio ref={player} src={broadcast.audioUrl} preload="metadata" onLoadedMetadata={() => setDuration(Number.isFinite(player.current?.duration) ? player.current!.duration : 0)} onTimeUpdate={() => setProgress(player.current?.currentTime || 0)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setMediaError(true); setPlaying(false); }} />
          </div>}
          {!hasMedia && <p className="empty-record">{videoFailed ? "the video has left the building. the handlers have been informed." : "my next masterpiece is with the handlers."}<small>{videoFailed ? "try again in a moment. my legacy can wait." : "i would hurry them, but genius cannot be managed."}</small></p>}
          {mediaError && <p role="alert">the speakers are being difficult. try pressing play again.</p>}
          {initialData.tracks.length > 0 && <div className="older-records"><h3>older masterpieces.</h3>{initialData.tracks.map(track => <div key={track.id}><b>{track.title}</b><audio controls preload="none" src={track.audioUrl} onPlay={() => { player.current?.pause(); video.current?.pause(); }} /></div>)}</div>}
        </div>
      </dialog>
    </main>
  );
}
