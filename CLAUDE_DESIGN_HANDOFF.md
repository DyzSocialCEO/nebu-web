# NEBUCHADREKTZAR / $N4X33 — CLAUDE DESIGN HANDOFF

## Mission

Take the existing working `nebu-web` product and make the public experience visually exceptional without changing the product architecture or breaking the media/admin logic.

This is **not** a request to redesign the app from scratch. The functionality is already implemented and passing CI.

## Character / identity source of truth

- Project: **NEBUCHADREKTZAR**
- Ticker: **$N4X33**
- Lore anchor: **Daniel 4:33** — fallen king, stripped of dominion, outside eating grass.
- Primary approved identity/logo artwork is bundled at:
  - `public/nebu-fallen-king.webp`
- The same Fallen King artwork is intentionally used as the header identity mark and as the guaranteed fallback visual.
- Character visual language: Babylonian gold crown, headphones, enormous curled beard, tired/half-lidded eyes, grass in mouth, maroon royal robe, ripped trousers, burgundy/cream sneakers, microphone.

Do not replace this character with a generic mascot, ape, token icon, fantasy king, or normal crypto logo.

## Product idea

NEBU is a **character + music + motion broadcast experience**. It should feel like the fallen king has his own corrupted royal transmission channel.

The homepage must not feel like:
- a generic memecoin landing page,
- a SaaS dashboard,
- a Web3 template,
- a boxed-card Vercel-style layout,
- or an audio player pasted under a hero.

The broadcast itself is part of the character world.

## NON-NEGOTIABLE FUNCTIONAL LOGIC

Do not remove, replace, or bypass the current logic in:

- `lib/site-data.ts`
- `components/NebuExperience.tsx`
- `/api/site`
- `/api/admin/site`

### Featured Broadcast behavior

The canonical schema is:

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

Public priority is:

1. **VIDEO FIRST** — when `videoUrl` exists and loads, video is the principal hero media.
2. **IMAGE + AUDIO FALLBACK** — if video is absent or fails at runtime, show `imageUrl`, then `posterUrl`, then character art; audio remains playable if supplied.
3. **VISUAL ONLY** — if there is no audio, the page must still look intentional.
4. Never show a broken empty media frame.

Keep:
- `controls`
- `playsInline`
- poster support
- no forced sound autoplay
- video runtime-error fallback
- fallback audio play/pause/progress
- legacy `currentTrack` migration compatibility

Do not convert this into separate unrelated video and audio sections.

## Current visual hierarchy

Desktop currently uses:
- left: NEBU headline / lore signal / state
- right: Featured Broadcast surface

Mobile currently stacks:
- identity/headline
- Featured Broadcast immediately after
- nonessential diagnostic content is suppressed

You may improve this hierarchy substantially, but on mobile the featured media and playable track must remain obvious near the top. Do not put a huge decorative illustration above the actual broadcast CTA.

## Desired design direction

Aim for **ancient Babylonian ruin x underground music broadcast x premium editorial degen comic**.

Useful visual ingredients:
- parchment/gold/maroon references from the approved art,
- near-black broadcast environment,
- understated acid signal green only for live/system states,
- Babylonian inscription / archival-document cues,
- distressed royal typography used with restraint,
- high-end music editorial composition,
- subtle signal noise / scan / transmission language,
- strong negative space,
- large character/media moments rather than many boxes.

The UI should feel designed around this exact character, not themed after the fact.

## Avoid

- excessive bordered cards
- generic gradients
- purple/blue crypto neon
- glassmorphism
- random cuneiform everywhere
- fake charts
- wallet-connect UI that does not exist
- fake metrics
- generic crown icons as the primary brand
- forcing the character image into every section
- tiny unreadable terminal copy on mobile
- heavy motion that harms media playback or responsiveness

## Copy that should retain the spirit

Current core direction includes lines such as:
- `THE KING HAS LEFT THE PALACE.`
- `He looked at the charts. The charts looked back. Now he eats grass.`
- `STATE: GRAZING`
- `DANIEL 4:33 // ROYAL SYSTEM FAILURE`
- `THE FALL OF A VERY LIQUID KING.`

Copy can be visually reflowed, but do not turn the tone into corporate marketing language.

## Header

The bundled Fallen King image is the identity mark. Keep the brand name **NEBUCHADREKTZAR** and ticker **$N4X33** clearly recognizable.

Header should remain lightweight. Do not build a huge token-navigation bar.

## Responsive requirements

Design and test at minimum:
- 1440 desktop
- 1024 laptop/tablet landscape
- 768 tablet
- 430 mobile
- 375 mobile

No horizontal overflow. No clipped headline. No media controls outside the viewport. No tiny 7px functional text.

## Performance

Heavy media will ultimately come from Bunny `NEBUFILES`.

Do not:
- bundle featured MP4 files into the app,
- introduce a heavy animation framework unless genuinely necessary,
- replace native video playback with a fragile custom player.

CSS-first visual motion is preferred for atmosphere around the media surface.

## What you may change

You may freely refine:
- layout
- spacing
- typography
- CSS
- visual hierarchy
- responsive behavior
- decorative layers
- section transitions
- presentation of lore / contract / footer
- broadcast frame treatment

You may split `NebuExperience.tsx` into presentational components if useful, provided the behavior remains identical.

## What you must not change without explicit approval

- featured broadcast schema
- fallback order
- video/audio playback rules
- persistence model
- admin API contract
- server-side admin protection
- Railway assumptions
- Bunny media strategy
- the approved Fallen King identity

## Definition of done

Return a polished production-ready public UI where:

1. NEBU is immediately recognizable as its own character/IP.
2. The featured broadcast is the visual centerpiece.
3. Video mode looks intentional and cinematic.
4. Image + audio fallback looks equally intentional, not like a degraded error state.
5. Mobile feels designed, not merely stacked.
6. Existing functionality and CI remain green.

Before changing product logic, stop and flag the proposed logic change separately.
