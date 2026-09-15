"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { coverFor, usePlayer } from "@/components/PlayerProvider";

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.floor(value);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function PlayIcon({ pause }: { pause: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {pause
        ? <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>
        : <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />}
    </svg>
  );
}

function StepIcon({ back }: { back: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {back
        ? <path d="M7 6v12h2V6H7Zm11 0-8 6 8 6V6Z" />
        : <path d="M17 6v12h-2V6h2ZM6 6l8 6-8 6V6Z" />}
    </svg>
  );
}

function ChevronIcon({ down }: { down: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      {down ? <path d="m6 9 6 6 6-6" /> : <path d="m6 15 6-6 6 6" />}
    </svg>
  );
}

export default function PlayerBar() {
  const { track, fallbackCover, playing, progress, duration, failedId, toggle, seek, skip } = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname() || "/";
  const hidden = pathname.startsWith("/n4x33-ops-18763") || !track;

  // Every page pads its own bottom with --n3-dock, so widening it there clears the bar everywhere at once.
  useEffect(() => {
    if (hidden) delete document.body.dataset.player;
    else document.body.dataset.player = "on";
    return () => { delete document.body.dataset.player; };
  }, [hidden]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  useEffect(() => { if (hidden) setExpanded(false); }, [hidden]);

  if (hidden || !track) return null;

  const cover = coverFor(track, fallbackCover);
  const seekable = duration > 0;
  const failed = failedId === track.id;

  const scrubber = (idPrefix: string) => (
    <div className="player-seek">
      <time>{formatTime(progress)}</time>
      <input
        id={`${idPrefix}-seek`}
        type="range"
        min="0"
        max={seekable ? duration : 1}
        step="0.1"
        value={seekable ? Math.min(progress, duration) : 0}
        disabled={!seekable}
        aria-label={`Seek ${track.title}`}
        onChange={event => seek(Math.min(Number(event.target.value), duration))}
      />
      <time>{seekable ? formatTime(duration) : "--:--"}</time>
    </div>
  );

  return (
    <>
      <div className={`player-bar ${playing ? "is-playing" : ""}`}>
        <button
          className="player-bar__cover"
          onClick={() => setExpanded(true)}
          aria-label={`Open now playing: ${track.title}`}
        >
          <img src={cover} alt="" width={120} height={120} loading="eager" decoding="async" />
        </button>

        <div className="player-bar__body">
          <button className="player-bar__meta" onClick={() => setExpanded(true)}>
            <small>{failed ? "SPEAKERS ARE BEING DIFFICULT" : playing ? "NOW PLAYING" : "PAUSED"}</small>
            <b>{track.title}</b>
          </button>
          {scrubber("bar")}
        </div>

        <div className="player-bar__controls">
          <button className="player-step" onClick={() => skip(-1)} aria-label="Previous track">
            <StepIcon back />
          </button>
          <button
            className="player-play"
            onClick={() => toggle(track.id)}
            aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
          >
            <PlayIcon pause={playing} />
          </button>
          <button className="player-step" onClick={() => skip(1)} aria-label="Next track">
            <StepIcon back={false} />
          </button>
          <button className="player-step player-expand" onClick={() => setExpanded(true)} aria-label="Expand player">
            <ChevronIcon down={false} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="player-sheet" role="dialog" aria-modal="true" aria-label={`Now playing: ${track.title}`}>
          <div className="player-sheet__top">
            <small>NOW PLAYING</small>
            <button className="player-step" onClick={() => setExpanded(false)} aria-label="Collapse player">
              <ChevronIcon down />
            </button>
          </div>

          <div className="player-sheet__body">
            <img src={cover} alt="" width={640} height={640} loading="eager" decoding="async" />
            <h2>{track.title}</h2>
            {track.story && <p>{track.story}</p>}
            {track.credit && <p className="player-sheet__credit">inspired by {track.credit}</p>}
            {failed && <p role="alert" className="player-sheet__error">speakers are being difficult.</p>}
          </div>

          <div className="player-sheet__foot">
            {scrubber("sheet")}
            <div className="player-sheet__controls">
              <button className="player-step" onClick={() => skip(-1)} aria-label="Previous track">
                <StepIcon back />
              </button>
              <button
                className="player-play"
                onClick={() => toggle(track.id)}
                aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                <PlayIcon pause={playing} />
              </button>
              <button className="player-step" onClick={() => skip(1)} aria-label="Next track">
                <StepIcon back={false} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
