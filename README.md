# NEBUCHADREKTZAR — public web

Public character + motion/music experience for **NEBUCHADREKTZAR ($N4X33)**.

## Runtime

- Next.js 16.3.3 / React 19.3
- Railway service: `nebu-web`
- Persistent content data: `${DATA_DIR}/site.json` (Railway volume mounted at `/data`)
- Admin mutations require `ADMIN_API_KEY` via `x-nebu-admin-key`
- Heavy media is expected to be served from Bunny `NEBUFILES` URLs stored in site data.

## Featured broadcast

The homepage is **video-first**.

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

Rendering priority:

1. `videoUrl` — responsive HTML5 motion/video broadcast with native controls and `playsInline`.
2. If video is missing or fails to load, use `imageUrl`/`posterUrl`/`characterUrl` plus `audioUrl`.
3. If audio is absent, keep a clean visual-only hero instead of a broken player.

Legacy stored `currentTrack` data is read automatically as the new broadcast, so an existing track title/subtitle/audio survives the migration.

## Environment

```bash
PORT=3000
DATA_DIR=/data
ADMIN_API_KEY=change-me
```

## Content API

- `GET /api/site` — public site data
- `GET /api/admin/site` — protected full data
- `PUT /api/admin/site` — protected update

The web experience deliberately avoids a generic meme-token template. The character, lore and featured broadcast are one Daniel 4:33 experience.
