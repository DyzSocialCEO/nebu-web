# NEBUCHADREKTZAR / $N4X33 — CANONICAL PROJECT STATE

Last updated: 2026-09-13

## Identity

- Project: NEBUCHADREKTZAR
- Ticker: $N4X33
- Biblical/lore anchor: Daniel 4:33 — the king loses his mind/kingdom and eats grass.
- Tone: premium, funny, unhinged crypto-degen character world. Not a generic meme-token landing page.
- Primary identity/logo artwork: the approved seated Fallen King image.
- Character production reference: the NEBUCHADREKTZAR character sheet (front / 3-4 / profile / expressions / details).
- Keep the same recognizable character: Babylonian gold crown, headphones, enormous curled beard, tired eyes, grass, maroon robe, ripped trousers, burgundy/cream sneakers, microphone.

## Product / UX direction

The product is a character + music/motion experience, not an audio player with a token page attached.

### Featured Broadcast: IMPLEMENTED

Homepage hero uses this priority:

1. VIDEO-FIRST: the featured motion graphic / music video is the main broadcast surface.
2. FALLBACK: if video is missing or fails to load, use still image/poster/character + audio.
3. If audio is also unavailable, keep a clean visual-only hero; never show a broken media frame.

Do not make a separate detached music-player section the main experience. Broadcast media, character and track are one hero experience.

### Canonical site data

```ts
featuredBroadcast: {
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
  imageUrl: string;
  audioUrl: string;
}
```

Compatibility is implemented: legacy stored `currentTrack` title/subtitle/audio are read into `featuredBroadcast` automatically so old content is not lost.

### Public rendering rules

- `videoUrl` renders responsive HTML5 video with controls, `playsInline`, poster support and no forced autoplay.
- Runtime video load failure automatically falls back to still image/poster/character + audio.
- Fallback audio has explicit user play/pause and progress state.
- If media is missing, a branded placeholder renders instead of a broken frame.
- Mobile hides nonessential diagnostic copy so the featured broadcast reaches the viewport quickly.

## Public site: nebu-web

Implemented:

- Next.js / React app
- NEBU character/lore homepage
- featured motion-first broadcast hero
- safe `currentTrack` → `featuredBroadcast` compatibility migration
- persistent site JSON on Railway `/data`
- protected admin content API
- contract/social/lore fields
- GitHub Actions production build check

Build status: PASSING.

## Admin: nebu-admin

Admin remains deliberately small.

Implemented controls:

- status
- eyebrow / headline / one-liner
- approved character/logo URL
- featured broadcast title/subtitle
- preferred video URL
- video poster URL
- fallback image URL
- fallback audio URL
- public-mode indicator + media preview
- lore
- contract address
- X / Telegram

Security:

- Browser never receives `ADMIN_API_KEY`.
- Admin proxies mutations server-side to `nebu-web`.
- Entire admin surface is protected by HTTP Basic auth in `proxy.ts`.
- Production fails closed with HTTP 503 if admin login variables are missing.
- Railway variables for admin API access and admin-panel login are staged with deploy disabled.

Build status: PASSING.

## Infrastructure

GitHub:
- DyzSocialCEO/nebu-web
- DyzSocialCEO/nebu-admin
- both repos have CI build checks on `main`

Railway:
- Project: NEBUCHADREKTZAR
- Services: nebu-web, nebu-admin
- Production environment exists
- nebu-web has a persistent 5 GB volume mounted at `/data`
- server-side admin API key configured
- admin service API origin/API key/panel credentials staged
- NOT DEPLOYED YET

Bunny:
- Storage/CDN asset bucket/zone name: NEBUFILES
- intended for video, posters, feature images and audio

Cloudflare:
- Intended to sit in front of the final public domain once production is ready.

## Build workflow

1. Build functional product in GitHub first. ✅
2. Use approved logo + character sheet as visual source of truth. IN PROGRESS
3. Give working product to Claude Design for visual-only refinement; do not let design work rewrite product logic blindly.
4. Review/approve visuals.
5. Deploy to Railway and connect Cloudflare.
6. Export/download final repos as ZIPs for Claude audit: bugs, security, responsiveness, production issues.
7. Fix audit findings, then launch.

## Guardrails

- Super responsive and clean; no tired/ugly template feel.
- Cleverly integrate character, lore, media and token identity.
- Avoid generic Web3 dashboard/landing-page aesthetic.
- Keep admin small and private.
- Use Bunny NEBUFILES for heavy media rather than Railway filesystem/app bundle.
- Do not lose existing stored data during schema migrations.
- Do not deploy without explicit approval.

## Immediate next task

Integrate the approved Fallen King identity artwork into the working public UI, prepare a realistic hero state for visual review, then hand the working layout to Claude Design for visual-only refinement before Railway deployment.
