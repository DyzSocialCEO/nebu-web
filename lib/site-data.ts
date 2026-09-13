import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type FeaturedBroadcast = {
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
  imageUrl: string;
  audioUrl: string;
};

export type SiteData = {
  status: string;
  eyebrow: string;
  heroTitle: string;
  heroCopy: string;
  characterUrl: string;
  contractAddress: string;
  featuredBroadcast: FeaturedBroadcast;
  lore: Array<{ code: string; title: string; copy: string }>;
  socials: { x: string; telegram: string };
};

export const defaultSiteData: SiteData = {
  status: "STILL EARLY",
  eyebrow: "ROYAL TRANSMISSION // CONFIDENCE UNCHANGED",
  heroTitle: "I'M NOT WRONG. I'M EARLY.",
  heroCopy: "I don't have a job. I have a rap career and a thesis.",
  characterUrl: "/nebu-fallen-king.webp",
  contractAddress: "",
  featuredBroadcast: {
    title: "HE SAID SOON",
    subtitle: "I MADE ANOTHER ONE. YOU'RE WELCOME.",
    videoUrl: "",
    posterUrl: "",
    imageUrl: "",
    audioUrl: "",
  },
  lore: [
    { code: "01 / CLASSIC", title: "DON'T SELL YET", copy: "Recorded during a 40% day. My best work, according to me." },
    { code: "02 / DINNER", title: "GRASS FED", copy: "A song about dinner. Dinner is going well. Please stop asking." },
    { code: "03 / ARCHIVE", title: "HAVE YOU FORGOTTEN", copy: "For the ones who left. No hard feelings. I wrote your name down." },
  ],
  socials: { x: "", telegram: "" },
};

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "site.json");

function cleanString(value: unknown, fallback: string, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

export function normalizeSiteData(value: unknown): SiteData {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const legacyTrack = input.currentTrack && typeof input.currentTrack === "object"
    ? (input.currentTrack as Record<string, unknown>)
    : {};
  const featured = input.featuredBroadcast && typeof input.featuredBroadcast === "object"
    ? (input.featuredBroadcast as Record<string, unknown>)
    : legacyTrack;
  const socials = input.socials && typeof input.socials === "object" ? (input.socials as Record<string, unknown>) : {};
  const loreInput = Array.isArray(input.lore) ? input.lore.slice(0, 6) : defaultSiteData.lore;
  const lore = loreInput.map((item, i) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const fallback = defaultSiteData.lore[i] || { code: `0${i + 1}`, title: "UNTITLED", copy: "" };
    return {
      code: cleanString(source.code, fallback.code, 40),
      title: cleanString(source.title, fallback.title, 100),
      copy: cleanString(source.copy, fallback.copy, 300),
    };
  });

  return {
    status: cleanString(input.status, defaultSiteData.status, 32),
    eyebrow: cleanString(input.eyebrow, defaultSiteData.eyebrow, 100),
    heroTitle: cleanString(input.heroTitle, defaultSiteData.heroTitle, 140),
    heroCopy: cleanString(input.heroCopy, defaultSiteData.heroCopy, 300),
    characterUrl: cleanString(input.characterUrl, defaultSiteData.characterUrl, 1000) || defaultSiteData.characterUrl,
    contractAddress: cleanString(input.contractAddress, defaultSiteData.contractAddress, 200),
    featuredBroadcast: {
      title: cleanString(featured.title, defaultSiteData.featuredBroadcast.title, 120),
      subtitle: cleanString(featured.subtitle, defaultSiteData.featuredBroadcast.subtitle, 120),
      videoUrl: cleanString(featured.videoUrl, defaultSiteData.featuredBroadcast.videoUrl, 1000),
      posterUrl: cleanString(featured.posterUrl, defaultSiteData.featuredBroadcast.posterUrl, 1000),
      imageUrl: cleanString(featured.imageUrl, defaultSiteData.featuredBroadcast.imageUrl, 1000),
      audioUrl: cleanString(featured.audioUrl, defaultSiteData.featuredBroadcast.audioUrl, 1000),
    },
    lore: lore.length ? lore : defaultSiteData.lore,
    socials: {
      x: cleanString(socials.x, defaultSiteData.socials.x, 1000),
      telegram: cleanString(socials.telegram, defaultSiteData.socials.telegram, 1000),
    },
  };
}

export async function getSiteData(): Promise<SiteData> {
  try {
    const raw = await readFile(dataFile, "utf8");
    return normalizeSiteData(JSON.parse(raw));
  } catch {
    return defaultSiteData;
  }
}

export async function saveSiteData(value: unknown): Promise<SiteData> {
  const data = normalizeSiteData(value);
  await mkdir(dataDir, { recursive: true });
  const temporary = `${dataFile}.tmp`;
  await writeFile(temporary, JSON.stringify(data, null, 2), "utf8");
  await rename(temporary, dataFile);
  return data;
}
