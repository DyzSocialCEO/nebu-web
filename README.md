# NEBUCHADREKTZAR · $N4X33

Read [NEBU-MASTER.md](NEBU-MASTER.md) to recover the project and [RELEASE.md](RELEASE.md) for release status.

Next.js/React public character and music world. `npm ci`, `npm run build`, `npm start`.

## Content
- `GET /api/site`: public data.
- `GET/PUT /api/admin/site`: protected with server-side `ADMIN_API_KEY` via `x-nebu-admin-key`.
- JSON persists at `${DATA_DIR}/site.json`; Railway mounts `/data`.
- `featuredBroadcast`: title, subtitle, videoUrl, posterUrl, imageUrl, audioUrl.
- Video first; missing or failed video falls back to artwork plus audio. No URLs means an intentional waiting state.
- Optional `tracks`: `{ id, title, audioUrl }[]` for playable older releases. Existing `lore` stays compatible but is not shown publicly.
- Media hosted on Bunny NEBUFILES. Signed playback URLs are not yet implemented. Never put storage credentials in content.
- Full 68-line Pulse Bank is preserved; real chain adapter is pending.

## Identity assets
`nebu-approved.webp` is the exact supplied illustration, re-encoded as WebP.
`nebu-world.webp` is the identity-preserving night-world derivative. `nebu-avatar.webp` is the matching face logo.
The historical `nebu-fallen-king.webp` remains for compatibility.
