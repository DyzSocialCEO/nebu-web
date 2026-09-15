"use client";

import { usePlayer } from "@/components/PlayerProvider";
import type { PlayerTrack } from "@/lib/playlist";

function PlayIcon({ pause }: { pause: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {pause
        ? <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>
        : <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />}
    </svg>
  );
}

function Equaliser() {
  return <span className="records-eq" aria-hidden="true"><i /><i /><i /><i /></span>;
}

/**
 * Cards no longer carry a player. Each one asks the site-wide player to take over,
 * which is what lets a track keep going once you leave this page.
 */
export default function RecordsList({ tracks, fallbackCover }: { tracks: PlayerTrack[]; fallbackCover: string }) {
  const { activeId, playing, failedId, toggle } = usePlayer();

  if (tracks.length === 0) {
    return <p className="records-empty">nothing here yet. i am working on it. constantly. ask anyone.</p>;
  }

  const [featured, ...rest] = tracks;
  const featuredLive = activeId === featured.id;
  const featuredCover = featured.imageUrl || fallbackCover || "/nebu-cover.webp";

  return (
    <div className="records-shell">
      <section className={`record-feature ${featuredLive && playing ? "is-playing" : ""}`}>
        <div className="record-feature__art">
          <img src={featuredCover} alt="" width={900} height={900} loading="eager" decoding="async" />
          <div className="record-feature__caption">
            <h1>{featured.title}</h1>
            {featured.story && <p>{featured.story}</p>}
            {featured.credit && <p className="records-credit">inspired by {featured.credit}</p>}
          </div>
        </div>

        <div className="record-feature__bar">
          <button
            className="record-feature__play"
            onClick={() => toggle(featured.id)}
            aria-label={`${featuredLive && playing ? "Pause" : "Play"} ${featured.title}`}
          >
            <PlayIcon pause={featuredLive && playing} />
          </button>

          <span className="record-feature__state">
            {featuredLive && playing ? "PLAYING" : featuredLive ? "PAUSED" : "PLAY THE BROADCAST"}
            {failedId === featured.id && <em role="alert">speakers are being difficult.</em>}
          </span>

          <span className="record-feature__disc" aria-hidden="true" style={{ backgroundImage: `url(${featuredCover})` }} />
        </div>
      </section>

      {rest.length > 0 && (
        <ol className="records-list">
          {rest.map(track => {
            const live = activeId === track.id;
            const cover = track.imageUrl || fallbackCover || "/nebu-cover.webp";
            return (
              <li key={track.id} className={`records-item ${live && playing ? "is-playing" : ""}`}>
                <button
                  className="records-row"
                  onClick={() => toggle(track.id)}
                  aria-label={`${live && playing ? "Pause" : "Play"} ${track.title}`}
                >
                  <span className="records-cover">
                    <img src={cover} alt="" width={200} height={200} loading="lazy" decoding="async" />
                    <span className="records-cover-play"><PlayIcon pause={live && playing} /></span>
                  </span>

                  <span className="records-body">
                    <span className="records-title">{track.title}</span>
                    {track.story && <span className="records-story">{track.story}</span>}
                    {track.credit && <span className="records-credit">inspired by {track.credit}</span>}
                    {failedId === track.id && <span role="alert" className="records-error">speakers are being difficult.</span>}
                  </span>

                  {live && playing && <Equaliser />}
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
