"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { PlayerTrack } from "@/lib/playlist";

type PlayerValue = {
  tracks: PlayerTrack[];
  fallbackCover: string;
  track: PlayerTrack | null;
  activeId: string;
  playing: boolean;
  progress: number;
  duration: number;
  failedId: string;
  toggle: (id: string) => void;
  seek: (seconds: number) => void;
  skip: (direction: 1 | -1) => void;
};

const PlayerContext = createContext<PlayerValue | null>(null);

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) throw new Error("usePlayer must be used inside PlayerProvider");
  return value;
}

export function coverFor(track: PlayerTrack | null, fallbackCover: string) {
  return track?.imageUrl || fallbackCover || "/nebu-cover.webp";
}

function signEndpoint(id: string) {
  return id === "featured" ? "/api/audio/sign" : `/api/audio/sign?track=${encodeURIComponent(id)}`;
}

/**
 * The only <audio> element on the site. It is mounted in the root layout, outside the
 * route-keyed subtree, so navigating between pages never unmounts it and never stops playback.
 */
export default function PlayerProvider({
  tracks,
  fallbackCover,
  children,
}: {
  tracks: PlayerTrack[];
  fallbackCover: string;
  children: ReactNode;
}) {
  const player = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef("");
  const progressRef = useRef(0);
  const resigned = useRef(false);

  const [activeId, setActiveId] = useState("");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failedId, setFailedId] = useState("");

  function sync() {
    const audio = player.current;
    if (!audio) return;
    if (Number.isFinite(audio.currentTime)) {
      progressRef.current = audio.currentTime;
      setProgress(audio.currentTime);
    }
    if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
  }

  const load = useCallback(async (id: string) => {
    const audio = player.current;
    if (!audio) throw new Error("no_audio_element");

    const response = await fetch(signEndpoint(id), { cache: "no-store", headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("sign");
    const signed = await response.json() as { url?: string };
    if (!signed.url) throw new Error("sign");

    audio.src = signed.url;
    audio.load();
  }, []);

  const start = useCallback(async (id: string) => {
    const audio = player.current;
    if (!audio) return;
    setFailedId("");

    try {
      if (activeRef.current !== id) {
        await load(id);
        activeRef.current = id;
        setActiveId(id);
        progressRef.current = 0;
        setProgress(0);
        setDuration(0);
      }
      resigned.current = false;
      await audio.play();
    } catch {
      setFailedId(id);
      setPlaying(false);
    }
  }, [load]);

  const toggle = useCallback((id: string) => {
    const audio = player.current;
    if (!audio) return;
    if (activeRef.current === id && !audio.paused) {
      audio.pause();
      return;
    }
    void start(id);
  }, [start]);

  const seek = useCallback((seconds: number) => {
    const audio = player.current;
    if (!audio || !Number.isFinite(seconds)) return;
    audio.currentTime = seconds;
    progressRef.current = seconds;
    setProgress(seconds);
  }, []);

  const skip = useCallback((direction: 1 | -1) => {
    if (tracks.length === 0) return;
    const current = tracks.findIndex(track => track.id === activeRef.current);
    const next = tracks[(current + direction + tracks.length) % tracks.length];
    if (next) void start(next.id);
  }, [tracks, start]);

  /**
   * Bunny tokens are short lived, so a long listening session can outlive the signed URL.
   * Re-sign once and pick the track back up where it stopped before admitting defeat.
   */
  function recover() {
    const audio = player.current;
    const id = activeRef.current;
    if (!audio || !id) return;

    if (resigned.current) {
      setPlaying(false);
      setFailedId(id);
      return;
    }

    resigned.current = true;
    const resumeAt = progressRef.current;

    load(id)
      .then(() => {
        const restore = () => {
          audio.currentTime = resumeAt;
          audio.removeEventListener("loadedmetadata", restore);
        };
        audio.addEventListener("loadedmetadata", restore);
        return audio.play();
      })
      .catch(() => {
        setPlaying(false);
        setFailedId(id);
      });
  }

  function advance() {
    const index = tracks.findIndex(track => track.id === activeRef.current);
    const next = tracks[index + 1];
    progressRef.current = 0;
    setProgress(0);
    setPlaying(false);
    if (next) void start(next.id);
  }

  const track = useMemo(
    () => tracks.find(item => item.id === activeId) || null,
    [tracks, activeId],
  );

  // Lock screen and headphone controls, so the bar keeps working with the phone asleep.
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;

    if (!track) {
      session.metadata = null;
      session.playbackState = "none";
      return;
    }

    session.metadata = new MediaMetadata({
      title: track.title,
      artist: "NEBUCHADREKTZAR",
      album: "$N3BU",
      artwork: [{ src: coverFor(track, fallbackCover), sizes: "512x512" }],
    });
    session.playbackState = playing ? "playing" : "paused";

    session.setActionHandler("play", () => { void start(track.id); });
    session.setActionHandler("pause", () => { player.current?.pause(); });
    session.setActionHandler("previoustrack", () => skip(-1));
    session.setActionHandler("nexttrack", () => skip(1));
    session.setActionHandler("seekto", details => {
      if (typeof details.seekTime === "number") seek(details.seekTime);
    });

    return () => {
      session.setActionHandler("play", null);
      session.setActionHandler("pause", null);
      session.setActionHandler("previoustrack", null);
      session.setActionHandler("nexttrack", null);
      session.setActionHandler("seekto", null);
    };
  }, [track, playing, fallbackCover, start, skip, seek]);

  const value = useMemo<PlayerValue>(() => ({
    tracks,
    fallbackCover,
    track,
    activeId,
    playing,
    progress,
    duration,
    failedId,
    toggle,
    seek,
    skip,
  }), [tracks, fallbackCover, track, activeId, playing, progress, duration, failedId, toggle, seek, skip]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={player}
        preload="none"
        onLoadedMetadata={sync}
        onDurationChange={sync}
        onCanPlay={() => { resigned.current = false; sync(); }}
        onTimeUpdate={sync}
        onPlay={() => { setPlaying(true); sync(); }}
        onPause={() => { setPlaying(false); sync(); }}
        onEnded={advance}
        onError={recover}
      />
    </PlayerContext.Provider>
  );
}
