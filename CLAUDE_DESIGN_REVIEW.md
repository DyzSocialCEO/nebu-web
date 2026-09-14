# NEBU — CLAUDE DESIGN REVIEW

## Status
This is a **design-review build**, not the production deployment.

## Narrative is frozen
Do not rewrite, reposition, rename, or expand the product concept.

- NEBU is the meme.
- $N4X33 is the coin.
- The music is NEBU's delusional rap career.
- Pulse is NEBU reacting to the token.
- The management note is where the token/CA action lives.

Do **not** add new slogans, dashboards, crypto stats, fake buys/sells, engineering-status messages, or additional sections.

## Structural work already completed
- The flat poster has been split into a background plate and a separate NEBU layer.
- NEBU is an independent responsive element.
- Thought + record are anchored to NEBU, not viewport percentages.
- Main screen is reduced to: mark, thought, record, management note.
- The contract address is explicitly labelled `CONTRACT ADDRESS` and has its own monospace box.
- `COPY CA` and `CHART` are directly attached to the CA block.
- The real `lib/pulse-bank.ts` is imported in the React experience.
- Until a real chain feed exists, the UI only pulls from the `silence` category. No fake SOL transactions.
- Existing audio/video/current-track/older-track data behavior remains intact.

## What Claude Design should improve
Only polish the design and motion:

1. **Use the finished layered assets already provided**
   - `public/nebu-garden-clean.jpg` is the repaired clean background plate. Do not reintroduce the old ghosted plate.
   - Character base is `public/nebu-neutral.webp`; expression overlays are `public/nebu-face-blink.webp`, `public/nebu-face-sideeye.webp`, and `public/nebu-face-smug.webp`.
   - Preserve this identity and do not redraw him into a different man/style.

2. **Character micro-motion**
   - The React build already performs natural blinks, occasional side-eye, and a restrained smug/mic reaction.
   - Keep the timing subtle. Do not turn him into a looping cartoon or add exaggerated body motion.

3. **Parallax / depth**
   - Keep it subtle.
   - Background moves slightly opposite NEBU.
   - Coins/particles remain between plate and NEBU.
   - No casino-like animation.

4. **Responsive hierarchy**
   - Thought must never cover NEBU's face/body.
   - Record must remain visually attached to him.
   - Management note must remain readable and must not cover his face.
   - The CA must be identifiable within ~3 seconds on desktop and mobile.

5. **Record / cover motion**
   - The vinyl spins only while media plays.
   - The sleeve and modal artwork breathe very slightly while playing.
   - Keep this tactile and restrained; no visualizer/casino treatment.

6. **Pulse motion**
   - Quiet/silence lines may appear low over the grass and leave softly.
   - No fake transaction amounts until a real chain feed is wired.

## Do not change
- Copy/narrative unless fixing a typo.
- Pulse Bank wording.
- Site data/API/admin contracts.
- Audio/video playback behavior.
- Existing token data source.
- The four-object hierarchy.

## Review output requested
Return the same repo with only visual/layout/motion improvements. Document every file changed. Do not deploy. The final build will be audited before admin/production work continues.
