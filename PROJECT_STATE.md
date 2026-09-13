# NEBUCHADREKTZAR / $N4X33 — CANONICAL PROJECT STATE

Last recovered: 2026-09-13

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

### Current decision: FEATURED BROADCAST IS MOTION-GRAPHIC-FIRST

Homepage hero must support a featured broadcast in this priority order:

1. VIDEO-FIRST (preferred): show the featured motion graphic / music video as the main broadcast surface.
2. FALLBACK: if no video exists, show the featured still image + audio player.

Do not make a separate detached music-player section the main experience. The broadcast media, character and track are one hero experience.

### Canonical site-data target

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

Compatibility rule: existing `currentTrack` data must migrate/fallback safely so old stored content is not lost.

### Public rendering rules

- If `featuredBroadcast.videoUrl` exists: render responsive HTML5 video as the main hero broadcast.
- Video must support `playsInline`, controls, poster art and responsive object-fit behavior.
- Do not force sound autoplay. User interaction should start audio/video playback.
- If video is missing: render `imageUrl` (or the main character art as last visual fallback) plus the audio experience.
- If both video and audio are unavailable: still render the hero cleanly; never show a broken media frame.
- Mobile: featured media + track identity/play action must remain obvious above the fold.

## Public site: nebu-web

Existing foundation already contains:

- Next.js / React app
- NEBU character/lore homepage
- persistent site JSON on Railway `/data`
- protected admin content API
- current audio-first `currentTrack`
- contract/social/lore fields

Next public-site task: migrate the audio-first hero into the Featured Broadcast system above.

## Admin: nebu-admin

Admin stays deliberately simple.

Current controls already include:

- status
- eyebrow / headline / one-liner
- character URL
- track title/subtitle/audio URL
- lore
- contract address
- X / Telegram

Required upgrade:

- Rename/reframe ROYAL BROADCAST around `featuredBroadcast`.
- Add fields for video URL, poster URL, image URL and audio URL.
- Keep title/subtitle.
- Show a simple preview/state indicator so it is clear whether the public site will render VIDEO or IMAGE + AUDIO.
- Bunny storage/CDN remains `NEBUFILES`; media URLs stored here point to Bunny-served assets.

## Infrastructure already created

GitHub:
- DyzSocialCEO/nebu-web
- DyzSocialCEO/nebu-admin

Railway:
- Project: NEBUCHADREKTZAR
- Services: nebu-web, nebu-admin
- Production environment exists
- nebu-web has a persistent 5 GB volume mounted at `/data`
- server-side admin key is configured; never expose it to the browser

Bunny:
- Storage/CDN asset bucket/zone name: NEBUFILES

Cloudflare:
- Intended to sit in front of final public domain for DNS/security once production site is ready.

## Build workflow

1. Build functional product in GitHub first.
2. Use approved logo + character sheet as visual source of truth.
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

## Immediate next task

Implement the Featured Broadcast schema + migration + public video-first rendering + admin controls, then build/test both repos before deployment.
