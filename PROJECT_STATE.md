# NEBUCHADREKTZAR / $N4X33 — CANONICAL PROJECT STATE

Last updated: 2026-09-13

## Identity

- Project: **NEBUCHADREKTZAR**
- Ticker: **$N4X33**
- Biblical anchor: **Daniel 4:33** — Nebuchadnezzar loses his sanity/status and eats grass.
- Approved identity art: `public/nebu-fallen-king.webp`.
- Character: Babylonian gold crown, headphones, giant curled beard, tired eyes, grass in mouth, maroon robe, ripped trousers, sneakers, microphone.

## LOCKED CREATIVE DIRECTION — MEME FIRST

The previous dark/premium/corporate editorial direction is rejected.

NEBU must feel like a **cartoon meme kingdom**, not a serious crypto company.

Immediate joke on page load:

> KING OF BABYLON → FOUND LEVERAGE → LOST THE KINGDOM → NOW EATS GRASS → HAS STARTED A NEW CAREER AS A DEGEN RAPPER TO PAY THE BILLS.

The visitor should understand the joke within seconds and laugh before reading a long explanation.

### Core comedy rule

Use recognizable story beats, then translate them into crypto-degen logic.

This is not a literal Bible retelling and not random sacrilegious shock copy. The humor comes from the absurd modern/degen reinterpretation.

Example pattern:
- historical/biblical event
- crypto interpretation
- immediate punchline

For NEBU:
- owns Babylon → thinks he is untouchable
- discovers charts/leverage → believes risk management is for peasants
- kingdom gets liquidated → treasury destroyed
- Daniel 4:33 → now grazing outside
- needs income → launches a rap career from the ruins

### Tone

- cartoonish
- ridiculous
- instantly readable
- degen group-chat humor
- exaggerated fictional details are welcome when they support the joke
- visually colorful and alive
- meme coin energy, not corporate brand strategy

Avoid:
- institutional/corporate crypto styling
- SaaS/dashboard look
- premium editorial seriousness as the dominant tone
- generic Web3 cards
- fake financial promises
- fake utility

## LOCKED VISUAL WORLD

Target visual language:

- cartoon Babylon kingdom at night
- purple/deep-night sky
- glowing moon / stars
- ruined palace/castle silhouettes
- grass foreground
- falling coins / silly financial debris
- bold yellow/cream/pink/lime/cyan accents
- comic outlines and chunky shadows
- stickers, speech bubbles and crooked badges
- glowing/pulsing animation used playfully
- large funny NEBU face/character moments

The king's face is a primary punchline and must NEVER be obscured by headline text, speech cards, badges or other overlays.

The approved concept direction includes jokes such as:
- `KINGDOM: LIQUIDATED`
- `ROYAL TREASURY: $0.43`
- `CURRENT DIET: GRASS`
- `LEVERAGE USED: TOO MUCH`
- `SANITY: PENDING`
- `ROYAL CREDIT SCORE: COOKED`
- `ONE MORE 100X AND I GET THE PALACE BACK.`

These establish the comedic world; copy can be improved but the joke density must remain high.

## LOCKED STORY ARC

The website is the story of a broke fallen king becoming a degen rapper.

Suggested arc:

1. **KING OF BABYLON** — had walls, gold, servants, property, everything.
2. **DISCOVERED CHARTS** — green candles looked permanent.
3. **USED STUPID LEVERAGE** — risk management was apparently for peasants.
4. **KINGDOM LIQUIDATED** — palace, treasury and dignity gone.
5. **DANIEL 4:33 / GRAZING ERA** — now outside eating grass.
6. **NEW CAREER: DEGEN RAPPER** — microphone retained, crown retained, career pivot forced by insolvency.
7. **LATEST TRACK** — the Featured Broadcast is his latest desperate music release to earn a living.

The music section is not an abstract broadcast terminal anymore. It is his **new rap career / latest drop**.

Possible labels include:
- `THE KING DROPPED A TRACK`
- `ROYAL RECORDS`
- `NEW CAREER: DEGEN RAPPER`
- `LATEST DESPERATE RELEASE`

## FEATURED MUSIC / VIDEO — FUNCTIONAL LOGIC LOCKED

Existing canonical schema remains:

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

Priority remains:

1. Video first.
2. If video is absent or fails, image/poster/character + audio.
3. If audio is absent too, clean visual-only state.
4. Never show a broken media frame.

Keep:
- HTML5 video controls
- `playsInline`
- poster support
- no forced sound autoplay
- runtime video error fallback
- fallback audio play/pause/progress
- legacy `currentTrack` compatibility

### Motion graphic production

Preferred launch pipeline:

1. Finish song master.
2. Produce a motion-graphic music video externally.
3. Lip sync is OPTIONAL, not required.
4. A strong alternative is animated NEBU + moving kingdom + lyric typography synced to the song.
5. Export final MP4 (H.264 video + AAC audio).
6. Keep MP3/audio-only fallback plus WebP poster.
7. Upload finished media to Bunny `NEBUFILES`.
8. Site receives/plays the Bunny-served media.

Claude Code/Design should build the web presentation and lyric/motion UI, but should not be treated as the final dedicated lip-sync video generator.

## BUNNY MEDIA SECURITY — LOCKED PLAN

Goal is not impossible DRM. Screenshots/downloads are acceptable. The goal is to stop abuse/hotlinking/bandwidth theft.

- Never expose Bunny storage/API/signing secrets in browser code.
- Secrets stay server-side in Railway environment variables.
- Do not rely on permanent naked Bunny asset URLs for protected featured media.
- Add a server endpoint that generates short-lived signed Bunny playback URLs.
- Prefer expiring signed URLs (roughly 10–30 minutes).
- Do not initially bind tokens to IP because mobile/VPN IP changes may break playback.
- Add Bunny hotlink/referrer protection for the production domain.
- Apply rate limiting to the signing endpoint / edge layer.
- Heavy media remains on Bunny, not bundled in the Next.js app.

## Current application state

`nebu-web`:
- Next.js/React app exists
- Featured Broadcast schema/fallback logic implemented
- currentTrack migration implemented
- persistent JSON content on Railway `/data`
- admin content API implemented
- CI passing before the meme redesign

`nebu-admin`:
- media URL controls implemented
- server-side API key
- protected admin panel
- CI passing

Railway:
- project/services exist
- variables staged
- **NOT DEPLOYED YET**

Bunny:
- `NEBUFILES` exists for media

Cloudflare:
- planned after Railway deployment

## Immediate next task

Use Claude Code on `DyzSocialCEO/nebu-web` to rebuild the public presentation around the LOCKED cartoon meme-kingdom / broke-degen-rapper direction while preserving the existing Featured Broadcast logic and backend contracts.

Do not deploy until the redesigned frontend is reviewed and approved.
