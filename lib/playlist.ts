import type { SiteData } from "@/lib/site-data";

/** What the client is allowed to know about a track. Raw audio URLs stay on the server. */
export type PlayerTrack = {
  id: string;
  title: string;
  story: string;
  imageUrl: string;
  credit: string;
};

/** The one ordered catalogue the player and the records page share. */
export function buildPlaylist(data: SiteData): PlayerTrack[] {
  const featured = {
    id: "featured",
    title: data.featuredBroadcast.title,
    story: data.featuredBroadcast.subtitle,
    imageUrl: data.featuredBroadcast.imageUrl,
    credit: "",
    audioUrl: data.featuredBroadcast.audioUrl,
  };

  return [featured, ...[...data.tracks].reverse()]
    .filter(track => track.audioUrl)
    .map(({ id, title, story, imageUrl, credit }) => ({ id, title, story, imageUrl, credit }));
}
