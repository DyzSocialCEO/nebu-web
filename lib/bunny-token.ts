import "server-only";
import { createHmac } from "node:crypto";

export type SignedBunnyUrl = {
  url: string;
  expires: number | null;
};

function tokenTtlSeconds() {
  const parsed = Number(process.env.BUNNY_TOKEN_TTL_SECONDS || "600");
  if (!Number.isFinite(parsed)) return 600;
  return Math.min(3600, Math.max(60, Math.floor(parsed)));
}

export function signBunnyUrl(rawUrl: string): SignedBunnyUrl {
  const source = rawUrl.trim();
  if (!source) throw new Error("Audio URL is missing");

  if (/^\/(?!\/)/.test(source)) {
    return { url: source, expires: null };
  }

  const cdnBase = process.env.BUNNY_CDN_BASE_URL?.trim();
  const securityKey = process.env.BUNNY_TOKEN_AUTH_KEY?.trim();
  if (!cdnBase) throw new Error("BUNNY_CDN_BASE_URL is not configured");

  const target = new URL(source);
  const base = new URL(cdnBase);

  if (target.origin !== base.origin) {
    return { url: source, expires: null };
  }

  if (!securityKey) throw new Error("BUNNY_TOKEN_AUTH_KEY is not configured");

  const params: Record<string, string> = {};
  for (const [key, value] of target.searchParams) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      throw new Error(`Duplicate Bunny query parameter: ${key}`);
    }
    if (key === "token" || key === "expires") continue;
    params[key] = value;
  }

  const sorted = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  const signingData = sorted.map(([key, value]) => `${key}=${value}`).join("&");
  const urlData = sorted.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
  const expires = Math.floor(Date.now() / 1000) + tokenTtlSeconds();

  const hmac = createHmac("sha256", securityKey);
  hmac.update(target.pathname);
  hmac.update(String(expires));
  hmac.update(signingData);

  const digest = hmac.digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const token = `HS256-${digest}`;
  const tail = urlData ? `&${urlData}` : "";

  return {
    url: `${target.origin}${target.pathname}?token=${token}${tail}&expires=${expires}`,
    expires,
  };
}
