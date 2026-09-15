"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  imageUrl: string;
  hasAudio: boolean;
};

export default function NowPlaying({ title, imageUrl, hasAudio }: Props) {
  const player = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => () => { player.current?.pause(); }, []);

  async function toggle() {
    const audio = player.current;
    if (!audio || !hasAudio) return;
    setFailed(false);

    if (playing) {
      audio.pause();
      return;
    }

    try {
      if (!loaded) {
        const response = await fetch("/api/audio/sign", { cache: "no-store", headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("sign");
        const signed = await response.json() as { url?: string };
        if (!signed.url) throw new Error("sign");
        audio.src = signed.url;
        audio.load();
        setLoaded(true);
      }
      await audio.play();
    } catch {
      setFailed(true);
      setPlaying(false);
    }
  }

  if (!hasAudio) return null;

  return (
    <div className={`now-playing ${playing ? "is-playing" : ""}`}>
      <button type="button" onClick={toggle} aria-label={playing ? `Pause ${title}` : `Play ${title}`}>
        <img src={imageUrl || "/nebu-cover.webp"} alt="" width={120} height={120} loading="eager" decoding="async" />
        <span className="now-playing__text">
          <small>{failed ? "SPEAKERS ARE BEING DIFFICULT" : "NOW PLAYING"}</small>
          <b>{title}</b>
        </span>
        <span className="now-playing__control" aria-hidden="true">
          {playing
            ? <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" /></svg>}
        </span>
        <span className="now-playing__bars" aria-hidden="true"><i /><i /><i /><i /></span>
      </button>

      <audio
        ref={player}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => { setPlaying(false); setFailed(true); }}
      />
    </div>
  );
}
