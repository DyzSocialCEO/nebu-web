"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteData } from "@/lib/site-data";

type Track = SiteData["tracks"][number];

function PlayIcon({ pause }: { pause: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {pause
        ? <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>
        : <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />}
    </svg>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.floor(value);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function RecordsList({ tracks, fallbackCover }: { tracks: Track[]; fallbackCover: string }) {
  const player = useRef<HTMLAudioElement | null>(null);
  const [activeId, setActiveId] = useState("");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState("");

  useEffect(() => () => { player.current?.pause(); }, []);

  const sync = () => {
    const audio = player.current;
    if (!audio) return;
    if (Number.isFinite(audio.currentTime)) setProgress(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
  };

  async function toggle(track: Track) {
    const audio = player.current;
    if (!audio) return;
    setFailed("");

    if (activeId === track.id && !audio.paused) {
      audio.pause();
      return;
    }

    try {
      if (activeId !== track.id) {
        const response = await fetch(`/api/audio/sign?track=${encodeURIComponent(track.id)}`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("sign");
        const signed = await response.json() as { url?: string };
        if (!signed.url) throw new Error("sign");
        audio.src = signed.url;
        audio.load();
        setActiveId(track.id);
        setProgress(0);
        setDuration(0);
      }
      await audio.play();
    } catch {
      setFailed(track.id);
      setPlaying(false);
    }
  }

  if (tracks.length === 0) {
    return <p className="records-empty">nothing here yet. i am working on it. constantly. ask anyone.</p>;
  }

  return (
    <>
      <ol className="records-list">
        {tracks.map((track, index) => {
          const isActive = activeId === track.id;
          const cover = track.imageUrl || fallbackCover || "/nebu-approved.webp";
          return (
            <li key={track.id} className={`records-item ${isActive && playing ? "is-playing" : ""}`}>
              <span className="records-index">{String(tracks.length - index).padStart(2, "0")}</span>

              <button
                className="records-cover"
                onClick={() => toggle(track)}
                aria-label={`${isActive && playing ? "Pause" : "Play"} ${track.title}`}
              >
                <img src={cover} alt="" width={200} height={200} loading="lazy" decoding="async" />
                <span className="records-cover-play"><PlayIcon pause={isActive && playing} /></span>
              </button>

              <div className="records-body">
                <h2>{track.title}</h2>
                {track.story && <p>{track.story}</p>}

                {isActive && (
                  <div className="records-timeline">
                    <input
                      aria-label={`Seek ${track.title}`}
                      type="range"
                      min="0"
                      max={duration > 0 ? duration : 1}
                      step="0.1"
                      value={duration > 0 ? Math.min(progress, duration) : 0}
                      disabled={duration <= 0}
                      onChange={event => {
                        const audio = player.current;
                        if (audio && duration > 0) {
                          const next = Math.min(Number(event.target.value), duration);
                          audio.currentTime = next;
                          setProgress(next);
                        }
                      }}
                    />
                    <span>{formatTime(progress)} / {duration > 0 ? formatTime(duration) : "--:--"}</span>
                  </div>
                )}

                {failed === track.id && <span role="alert" className="records-error">speakers are being difficult.</span>}
              </div>
            </li>
          );
        })}
      </ol>

      <audio
        ref={player}
        preload="none"
        onLoadedMetadata={sync}
        onDurationChange={sync}
        onCanPlay={sync}
        onTimeUpdate={sync}
        onPlay={() => { setPlaying(true); sync(); }}
        onPause={() => { setPlaying(false); sync(); }}
        onEnded={() => { setPlaying(false); setProgress(0); }}
        onError={() => { setPlaying(false); setFailed(activeId); }}
      />
    </>
  );
}
