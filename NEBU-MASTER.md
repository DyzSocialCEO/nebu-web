# NEBUCHADREKTZAR — MASTER

This file is the canonical project truth. If a chat/workspace loses context, read this first and continue from **CURRENT BUILD STATE / NEXT STEP**.

## 1. Product

**NEBUCHADREKTZAR ($N4X33)** is a responsive web experience that works across desktop, tablet and mobile. There is not a separate mobile app at this stage.

NEBU is not a mascot sitting on top of a normal crypto website. **NEBU is the interface.** The visitor enters his world. He talks before anybody explains him. His music, market reactions, token and system messages all happen around his personality.

Do not build a normal corporate crypto landing page. Do not build a childish meme-template either. The target is **premium absurdity**: expensive art direction, strong character, weird confidence, dry/unhinged humor, beautiful composition.

## 2. The four laws

1. **First person, always.** NEBU speaks for himself.
2. **Never wrong, only early.** He cannot admit a bad call.
3. **Never broke, only illiquid.** His dignity survives every financial fact.
4. **Every song is generational.** He considers his own music historically important.

Only the handlers/fundraising note may deliberately use third person because the joke is that somebody else added it behind his back.

## 3. Critical narrative rule

**Nothing on the public page explains the Nebuchadnezzar/Bible joke.**

Do not write Daniel 4:33, King of Babylon, biblical exposition, “fallen king explained,” or a lore section that tells users the reference. Users should discover the resemblance themselves through the character: former king, lost wealth, grass, absurd pride, exile energy, recovery delusion.

The older `NEBUCHADREKTZAR_Meme_Kingdom_Concept.html` is useful only as visual history. Its explicit biblical copy is superseded.

## 4. Voice

Approved examples:

- `I'M NOT WRONG. I'M EARLY.` / `very fucking early`
- `TAKE PROFITS? TAKE WHAT?`
- `MY WEALTH IS RESTING.`
- `WE JUST GOT HERE.` / `it has been nine months`
- `TIME IS FUD.`
- `THE PALACE IS UNDER RENOVATION.` / `indefinitely`
- `I don't have a job. I have a rap career and a thesis.`
- `King. Rapper. Formerly extremely liquid.`
- `I MADE ANOTHER ONE.` / `you're welcome`
- `I SEE EVERY ONE.` / `I am awake. I am always awake.`
- `you sold. that is a timing problem, not a me problem`
- `somebody with money has entered the garden`
- `told you`
- `normal. healthy. deeply normal`
- `I have expenses. Nobody asks about my expenses.`

System behavior rule: **every line can be him.** Loading, errors, copy confirmations, empty media states and live-event reactions should all preserve the character where practical.

## 5. Public experience

### Front door

The king is already talking. Character is dominant. Full visual presence with grass / ruined-royalty atmosphere. Nothing should cover or diminish his face.

Rotating/clickable delusional headline. Immediate music CTA. Character credential line. The interface should feel alive, not like an About page.

### Music

**The music is the product.**

Current release is treated like an object in NEBU's world, not an embedded generic Spotify card. Album art / video / audio can be supplied through Bunny `NEBUFILES`. Older tracks sit beneath as “older masterpieces.”

### Kingdom Pulse

NEBU reacts to market/token activity. This must never become a sterile analytics dashboard. Events are translated into his voice. Until the real feed is wired, any simulated feed must be clearly identified as simulated/demo in-character.

### Token

The token is secondary to the character and music. Fundraising is presented like his handlers quietly inserted it:

`BUY THE TOKEN. SUPPORT THE ARTS.`

`The artist lost everything.`

NEBU may interrupt with: `I have expenses. Nobody asks about my expenses.`

Contract copy/chart controls live here once the token exists.

## 6. Visual rules

- Premium dark world: near-black / deep purple, dirty gold, acid green accents.
- Character-first; NEBU art dominates key screens.
- Funny because of writing, delusion, reactions and props — **not** because the page is covered in childish emojis, rainbow colors or random meme stickers.
- Avoid SaaS cards, corporate metrics grids, generic Web3 gradients and giant “BUY NOW” token-page behavior.
- Avoid over-serious museum/diagnostic copy. NEBU should feel alive and stupidly confident.
- Desktop should feel cinematic and spacious.
- Mobile must retain the same joke and hierarchy; it is not a stripped-down afterthought.
- Respect `prefers-reduced-motion`.

## 7. Saved references

Library files known to exist:

- `The Fallen Bullish Crypto King.png` — preferred core NEBU identity/look.
- `Nebuchadrektzar: Fallen King Character Sheet.png` — consistency reference for face/clothes/character.
- `Fallen King Drops a Verse.png` — supporting NEBU image.
- `nebu-voice-mockup-2.html` / duplicate `(1)` — strongest voice/rule reference.
- `nebu-responsive-mockup-v3.html` — responsive/interaction reference, but its conventional section grammar is not final.
- `NEBUCHADREKTZAR_Meme_Kingdom_Concept.html` — early visual history only; explicit biblical explanation is rejected.

## 8. Infrastructure

GitHub:
- `DyzSocialCEO/nebu-web`
- `DyzSocialCEO/nebu-admin`

Railway project:
- `NEBUCHADREKTZAR`
- services: `nebu-web`, `nebu-admin`
- public web service has persistent `/data` volume

Storage:
- Bunny storage zone/asset setup named **NEBUFILES**

Public app uses persisted site JSON under `DATA_DIR` and protected admin API. Admin/browser must never receive the server-side admin API key.

## 9. CURRENT BUILD STATE

Public `nebu-web` has been rewritten to the character-first direction:

- responsive desktop + mobile UI
- rotating NEBU thoughts
- dominant character stage
- music/featured release object with audio support
- older-masterpieces archive sourced from editable site data
- clearly labeled simulated Kingdom Pulse reactions
- handler-style token area and copy-address behavior
- social links from editable data
- explicit Bible/diagnostic presentation removed from the public interface
- default content updated to the four-law voice

**This code is committed but not deployed by ChatGPT.** Do not deploy without explicit user instruction.

## 10. NEXT STEP

1. Visually QA the actual build with the real NEBU character asset on desktop and mobile.
2. Refine only visual/humor issues that materially improve the character experience — avoid endless redesign loops.
3. Align `nebu-admin` fields/copy with the final public model and Bunny NEBUFILES media workflow.
4. Wire real Bunny media URLs.
5. Later: wire real Kingdom Pulse/token activity feed.
6. Only after QA: deploy to Railway, then place Cloudflare in front as planned.
