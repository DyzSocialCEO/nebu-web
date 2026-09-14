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

export type HireSettings = {
  enabled: boolean;
  rateAmount: string;
  walletAddress: string;
  dailyCap: number;
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
  tracks: Array<{ id: string; title: string; audioUrl: string; story: string; imageUrl: string }>;
  socials: { x: string; telegram: string };
  hire: HireSettings;
};

export const defaultSiteData: SiteData = {
  status: "STILL EARLY",
  eyebrow: "ROYAL TRANSMISSION // CONFIDENCE UNCHANGED",
  heroTitle: "I'M NOT WRONG. I'M EARLY.",
  heroCopy: "I don't have a job. I have a rap career and a thesis.",
  characterUrl: "/nebu-neutral.webp",
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
  tracks: [],
  socials: { x: "", telegram: "" },
  hire: {
    enabled: false,
    rateAmount: "",
    walletAddress: "",
    dailyCap: 1,
  },
};

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "site.json");

function cleanString(value: unknown, fallback: string, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function safeHttpsLink(value: unknown): string {
  const link = cleanString(value, "", 1000);
  return /^https:\/\//i.test(link) ? link : "";
}

function safeMediaLink(value: unknown): string {
  const link = cleanString(value, "", 1000);
  if (!link) return "";
  if (/^https:\/\//i.test(link)) return link;
  if (/^\/(?!\/)/.test(link)) return link;
  return "";
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
  const hire = input.hire && typeof input.hire === "object" ? (input.hire as Record<string, unknown>) : {};
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

  const dailyCapRaw = typeof hire.dailyCap === "number" ? hire.dailyCap : Number(hire.dailyCap);
  const dailyCap = Number.isFinite(dailyCapRaw) ? Math.min(20, Math.max(1, Math.floor(dailyCapRaw))) : 1;

  return {
    status: cleanString(input.status, defaultSiteData.status, 32),
    eyebrow: cleanString(input.eyebrow, defaultSiteData.eyebrow, 100),
    heroTitle: cleanString(input.heroTitle, defaultSiteData.heroTitle, 140),
    heroCopy: cleanString(input.heroCopy, defaultSiteData.heroCopy, 300),
    characterUrl: cleanString(input.characterUrl, defaultSiteData.characterUrl, 1000) || defaultSiteData.characterUrl,
    contractAddress: cleanString(input.contractAddress, defaultSiteData.contractAddress, 200),
    featuredBroadcast: {
      title: cleanString(featured.title, defaultSiteData.featuredBroadcast.title, 120) || defaultSiteData.featuredBroadcast.title,
      subtitle: cleanString(featured.subtitle, defaultSiteData.featuredBroadcast.subtitle, 120),
      videoUrl: safeMediaLink(featured.videoUrl),
      posterUrl: safeMediaLink(featured.posterUrl),
      imageUrl: safeMediaLink(featured.imageUrl),
      audioUrl: safeMediaLink(featured.audioUrl),
    },
    lore: lore.length ? lore : defaultSiteData.lore,
    tracks: Array.isArray(input.tracks) ? input.tracks.slice(0, 60).flatMap((item, i) => {
      if (!item || typeof item !== "object") return [];
      const track = item as Record<string, unknown>;
      const audioUrl = safeMediaLink(track.audioUrl);
      if (!audioUrl) return [];
      return [{
        id: cleanString(track.id, `track-${i}`, 80),
        title: cleanString(track.title, "another masterpiece", 120) || "another masterpiece",
        audioUrl,
        story: cleanString(track.story, "", 400),
        imageUrl: safeMediaLink(track.imageUrl),
      }];
    }) : [],
    socials: {
      x: safeHttpsLink(socials.x),
      telegram: safeHttpsLink(socials.telegram),
    },
    hire: {
      enabled: hire.enabled === true,
      rateAmount: cleanString(hire.rateAmount, "", 80),
      walletAddress: cleanString(hire.walletAddress, "", 200),
      dailyCap,
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
