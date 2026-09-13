# CLAUDE CODE — NEBU MEME KINGDOM REBUILD

Repository: `DyzSocialCEO/nebu-web`

## Mission

Rebuild the PUBLIC frontend presentation around the new locked meme direction while preserving all working media/data/API behavior.

This is a frontend implementation task, not a new architecture task.

## Before coding

Read completely:

1. `PROJECT_STATE.md`
2. `CLAUDE_DESIGN_HANDOFF.md` only for legacy functional constraints; where it conflicts with `PROJECT_STATE.md`, the newer `PROJECT_STATE.md` wins.
3. `lib/site-data.ts`
4. `components/NebuExperience.tsx`
5. `app/globals.css`
6. existing API routes

Create branch:

`meme-kingdom-rebuild`

Do NOT work directly on `main`.
Do NOT deploy.
Do NOT touch Railway/Cloudflare.
Do NOT modify `nebu-admin` in this pass.

## New creative truth

The website must instantly communicate:

**NEBUCHADREKTZAR WAS KING OF BABYLON, FOUND LEVERAGE, GOT THE KINGDOM LIQUIDATED, NOW EATS GRASS, AND HAS STARTED A NEW CAREER AS A DEGEN RAPPER TO PAY THE BILLS.**

This is the central joke and must be visible immediately.

The old serious/corporate/editorial crypto direction is rejected.

## Hero goal

The first screen should feel like a ridiculous cartoon kingdom, not a corporate website.

Use the existing approved character art:

`public/nebu-fallen-king.webp`

His face must remain fully visible. Do not put title text, speech bubbles, stickers, badges or other overlays across his eyes/face.

Suggested opening copy direction:

- `NEBUCHADREKTZAR`
- `KING OF BABYLON. NOW REKT.`
- `Had a kingdom. Found leverage. Now he eats grass.`

Support with immediate absurd status jokes such as:

- `KINGDOM: LIQUIDATED`
- `ROYAL TREASURY: $0.43`
- `CURRENT DIET: GRASS`
- `LEVERAGE USED: TOO MUCH`
- `SANITY: PENDING`
- `ROYAL CREDIT SCORE: COOKED`

Speech-bubble style joke:

`ONE MORE 100X AND I GET THE PALACE BACK.`

## Visual style

Cartoon Babylon meme kingdom at night:

- deep purple/night sky
- glowing moon/stars
- ruined palace/castle silhouettes
- grass foreground
- falling coins / silly financial debris
- bold yellow/cream/pink/lime/cyan accents
- chunky black comic outlines
- hard offset shadows
- crooked stickers/badges
- speech bubbles
- playful glow/pulse/twinkle/wiggle animation
- large readable comic typography
- meme energy immediately

Avoid corporate polish, SaaS, glassmorphism, institutional crypto, generic dashboard cards and serious terminal-heavy presentation.

## Story section

Tell the fall as a sequence of quick punchlines.

Recommended structure:

1. `OWNED BABYLON`
   - Walls. Gold. Servants. Property. Actual kingdom.

2. `DISCOVERED CHARTS`
   - Someone showed him green candles. He assumed they continued forever.

3. `USED 100X`
   - `Risk management is for peasants.`

4. `KINGDOM GOT LIQUIDATED`
   - Treasury cooked. Palace gone. Dignity marked down 99.7%.

5. `DANIEL 4:33`
   - Now grazing outside.

6. `NEW CAREER: DEGEN RAPPER`
   - Crown retained. Microphone retained. Income source urgently required.

Use the biblical/historical beat as setup, then translate it into degen logic. Keep each joke short enough to land instantly.

## Music section — this is his new job

The Featured Broadcast is no longer presented as an abstract technical broadcast.

It is NEBU's latest music drop / new rap career.

Rename/present the section in a funny way, for example:

- `THE KING DROPPED A TRACK`
- `ROYAL RECORDS`
- `NEW CAREER: DEGEN RAPPER`
- `LATEST DESPERATE RELEASE`

The actual functional `featuredBroadcast` schema MUST NOT change:

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

Preserve existing priority exactly:

1. Valid video -> video first.
2. Missing/failed video -> image/poster/character + audio.
3. No audio -> visual-only intentional state.
4. Never broken/empty media.

Preserve controls, playsInline, poster, no sound autoplay, runtime error fallback, audio play/pause/progress and legacy currentTrack migration.

## Lyrics / motion

Design the video area so a final motion-graphic MP4 can drop in cleanly later.

Lip sync is not required.

The visual concept should also support lyric-led videos: character movement + kingdom animation + big animated lyric typography.

Do not bundle a fake MP4 into the repo.

## Bunny media architecture

Do not expose storage/API/signing secrets client-side.

Heavy media remains on Bunny `NEBUFILES`.

Prepare code cleanly for a later server-side short-lived signed URL endpoint, but do not invent credentials.

Do not replace media URLs with hardcoded external secrets.

## Responsiveness

Test at minimum:

- 1440
- 1024
- 768
- 430
- 375

Critical mobile rule:

The first screen must still show the joke + NEBU identity + current music drop quickly.

Do not bury the music/video below long story content.
No horizontal overflow.
No face obstruction.
No unreadably tiny functional text.

## Allowed changes

You may heavily rewrite the presentation layer:

- `components/NebuExperience.tsx`
- `app/globals.css`
- split presentational components if useful
- layout, copy presentation, animations, story sections, labels, stickers, comic visuals

Do not change without approval:

- API contracts
- persistence
- `featuredBroadcast` schema
- fallback rules
- admin behavior
- Railway assumptions

## Quality bar

A visitor should understand the joke in roughly 3 seconds:

`Former king + degen liquidation + grass + broke rapper career pivot.`

The page should feel screenshot-worthy and highly memeable.

## Validation

Run:

`npm install --no-audit --no-fund`

`npm run build`

Fix all build/type errors.

Verify video state and image+audio fallback state conceptually.

## Delivery

When finished:

- keep changes on `meme-kingdom-rebuild`
- commit
- do NOT merge
- do NOT deploy
- report branch, commit SHA, changed files, build result, and any proposed logic changes you intentionally did not implement

If PR creation is available, create a review-only PR into `main` titled:

`NEBU — Meme Kingdom Rebuild`

Do not merge it.
