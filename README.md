# NEBUCHADREKTZAR — public web

Public character + music experience for **NEBUCHADREKTZAR ($N4X33)**.

## Runtime

- Next.js 16.3.3 / React 19.3
- Railway service: `nebu-web`
- Persistent content data: `${DATA_DIR}/site.json` (Railway volume mounted at `/data`)
- Admin mutations require `ADMIN_API_KEY` via `x-nebu-admin-key`
- Character art and audio are expected to be served from Bunny/NEBUFILES URLs stored in site data.

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

The web experience deliberately avoids a generic meme-token template. The character, lore and music player are one interface built around Daniel 4:33.
