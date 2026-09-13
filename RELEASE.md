# NEBU immersive world release — 2026-09-13

## What changed
- Replaced sectional homepage with a full illustrated NEBU world.
- Exact approved identity retained in source artwork, night-world derivative, and head logo.
- Tap character/speech for thoughts; atmospheric motion respects reduced-motion preferences.
- Physical record opens accessible native dialog. Video-first playback, runtime audio fallback, seeking, and clean no-media state.
- Media mounts on opening the player so early errors cannot occur before hydration handlers attach.
- Management note exposes contract copy/chart only when configured.
- Recovered all 68 Pulse lines and engine; live chain integration remains explicitly disconnected.
- Canonical recovery/handoff docs consolidated. Old instructions now point to NEBU-MASTER.md.
- Fonts self-hosted with licenses. Existing API, persisted media, and server-side admin authentication preserved.

## Verification completed before publication
- Production build and TypeScript passed.
- Browser layouts inspected at 1440, 1024, 768, 430, and 375 pixels; no horizontal overflow or page JavaScript errors.
- Tap thoughts, record opening, and Escape closing passed at all five sizes.
- Failed-video -> audio fallback, no automatic playback, play, seek, single-media playback, and closing archive playback passed with isolated local fixtures.
- Anonymous admin request returned 401; legacy currentTrack media survived normalization; unsafe social scheme rejected.
- Pulse threshold classification and nonrepeating selection passed.

## Publication target
User authorized deployment. Existing Railway production service `nebu-web`, sourced from `meme-kingdom-direct-build`, at https://nebu-web-production.up.railway.app.
This release consolidates `main` and the old deployment branch without force-pushing. The release commit is identified by git HEAD and Railway deployment metadata; verify those agree when recovering state.

## Inputs still pending
No song/video URL, contract address, or social URLs were present in live public data at release preparation. UI waits honestly. Real chain adapter and Bunny URL signing are not implemented.

## Art provenance
Built-in imagegen used with the supplied exact character reference for two project assets:
1. Identity-preserving nighttime ruined palace garden: same face/crown/headphones/beard/grass/robe/microphone/pose, centered, deep purple sky, gold moonlight, no text.
2. Head avatar: same face, crown, headphones, beard and grass, dark purple background, no new symbol or lettering.
Original supplied art is preserved as `public/nebu-approved.webp`.
