"use client";

import { usePlayer } from "@/components/PlayerProvider";

type Props = {
  title: string;
  imageUrl: string;
  hasAudio: boolean;
};

/**
 * The scene's own handle on the featured broadcast. It is a trigger, not a player:
 * the audio itself lives in PlayerProvider, above the router.
 */
export default function NowPlaying({ title, imageUrl, hasAudio }: Props) {
  const { activeId, playing, failedId, toggle } = usePlayer();

  if (!hasAudio) return null;

  const live = activeId === "featured";
  const isPlaying = live && playing;
  const failed = failedId === "featured";

  return (
    <div className={`now-playing ${isPlaying ? "is-playing" : ""}`}>
      <button type="button" onClick={() => toggle("featured")} aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}>
        <img src={imageUrl || "/nebu-cover.webp"} alt="" width={120} height={120} loading="eager" decoding="async" />
        <span className="now-playing__text">
          <small>{failed ? "SPEAKERS ARE BEING DIFFICULT" : isPlaying ? "NOW PLAYING" : live ? "PAUSED" : "LATEST BROADCAST"}</small>
          <b>{title}</b>
        </span>
        <span className="now-playing__control" aria-hidden="true">
          {isPlaying
            ? <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" /></svg>}
        </span>
        <span className="now-playing__bars" aria-hidden="true"><i /><i /><i /><i /></span>
      </button>
    </div>
  );
}
