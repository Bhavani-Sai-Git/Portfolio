# Session Notes — Portfolio Redesign

Record of the work done in this Claude Code session on the `react/` portfolio app.

## Starting point

The repo had two separate portfolios:
- Root `index.html` / `style.css` / `script.js` — an older, tracked static site (different project list, no ERPDIRECT content). Left untouched throughout this session.
- `react/` — an untracked Vite + React app whose content (ERP Parking, ERP Billing, eNAM Weighment, ERPDIRECT Solutions) matched every redesign brief given in this session, so it was treated as the live target for all the work below.

## Redesign passes (in order)

1. **Neo-brutalist editorial redesign** — first pass: cream/ivory background, lime/purple/orange accents, hard offset shadows, thick borders, grain texture, hand-drawn stickers/arrows. Installed `react-icons` for brand tech logos, copied the resume into `react/public/Bhavani_Sai_Resume.pdf`.

2. **Exact-match "scrapbook editorial" redesign** — replaced the above after the user supplied a reference image. Rebuilt to match precisely: Archivo/DM Sans/Caveat fonts, cream + lime scrapbook look, torn-paper dark contact/footer close, dot-grid background, pastel-badge "about" tiles, hero collage with abstract placeholder photography (no real photos existed/were fabricated — used duotone placeholder panels instead, by the user's choice over supplying real photos).

3. **Button color iterations**:
   - Changed the black→lime-hover buttons (nav CTA, hero primary) to white with a black border, keeping the lime hover.
   - Then unified all buttons to match the "Download Resume" style exactly: transparent background, black border/text at rest, solid black fill + cream text on hover (lime dropped from these buttons).

4. **Projects section — added the remaining projects.** The 3 featured cards (ERP Parking, ERP Billing (POS), eNAM Weighment) stayed; the other 4 projects (Gate Entry App, Odisha Tourism, Food Frenzy, Railway Object Detection) were added below as a "More Work" stacked list — a single bordered container with numbered rows (title, short description, tags, arrow), each opening the same project modal.

5. **Complete monochrome "space poster" redesign** — current/final state, after a second reference image (black & white vintage-engraving space illustration style):
   - Whole site wrapped in a black-margined poster frame (rounded corners, cream canvas on a pure black backdrop).
   - Single black/cream accent system (dropped lime entirely; fixed several contrast bugs this caused along the way — sticky notes, modal close button, hover states, dark-section dots/icons).
   - Hero rebuilt: 3D-extruded block headline ("BHAVANI SAI" via stacked text-shadow + outline), hand-drawn loop arrow into "Software Developer", black pill "View My Work" / outline pill "Download Resume", black rounded-square social icon badges.
   - New logo mark (spiral icon + "BS / BHAVANI SAI" two-line brand), nav switched from fixed to sticky, dropped the "Let's Talk" nav CTA in favor of a small decorative orbit icon (matching the reference, which had no nav button).
   - Hand-built simplified line-art illustrations (not true engraving-detail artwork): ringed planet, cratered moon, comet, UFO, telescope, asteroids, twinkling stars — placed in black organic blob shapes top-left/top-right of the hero and scattered along the hero floor.
   - Effects added: floating/bobbing animation on each illustration, twinkling stars, and scroll parallax on the hero layers — all respect `prefers-reduced-motion`.

## Known open items (as of session 1)

- **Real illustration assets**: the space illustrations were hand-coded simplified line-art, not the detailed vintage-engraving style from that session's reference image.
- ~~**LinkedIn URL** still a placeholder~~ — fixed in session 2, see below.
- **Deployment**: root `index.html` and `react/` were still two separate portfolios, with no decision made on which one ships.

## Key files (session 1)

- `react/src/Portfolio.jsx` — the entire app (single-file component tree + inline CSS-in-JS styles).
- `react/index.html` — page title/meta.
- `react/public/Bhavani_Sai_Resume.pdf` — resume served for the Download Resume button.

---

## Session 2 — "Playful Neo-Brutalist Doodle UI" redesign

Picked up from a completely different design direction than session 1's monochrome space poster (that direction was apparently abandoned/superseded between sessions). This session's work was driven by a sequence of real screenshot references the user dropped into the working directory (`image.png`, `image copy.png`, `image copy N.png`), each showing one section of a target design, plus an explicit theme brief: **"Playful Neo-Brutalist Doodle UI"** — warm cream graph-paper background, oversized condensed typography, thick black outlines, offset shadows, pastel sticker-style cards, hand-drawn arrows/doodles, pill navigation, yellow/pink/mint/periwinkle accents, no gradients or glassmorphism.

Also discovered partway through: the user's live/running app is `react/` (`npm run dev`), **not** the root `index.html` — both were kept in sync for this session, but `react/src/Portfolio.jsx` is the one that matters.

### 1. Hero redesign (root `index.html`, then ported to `react/`)
- Rebuilt nav + hero to pixel-match a reference screenshot: pill nav with yellow active tab, circular "BS" logo, "Bhavani / Sai" headline (blue→purple gradient on "Sai", yellow marker underline), handwritten "Turn ideas into real products" note, solid-black "View My Work" + outline "Get In Touch" buttons, 4-icon stat row, and a centered "Skills / Featured Work / About Me" peek-card row.
- The desk/laptop/badges illustration (plant, lamp, coffee mug, books, sticky notes) was **cropped directly out of the reference screenshot** with `sharp` (not redrawn) — `react/public/hero-illustration.png`. Same technique reused later for the About section's laptop graphic.
- Fixed a real bug found via headless-browser verification: a global `.rb-root a{color:inherit}` reset was out-specificity-ing the new button classes, making "View My Work" text invisible (black-on-black) — fixed by bumping selector specificity (`a.rb-btn-dark` etc.).
- Added the real LinkedIn link (`https://www.linkedin.com/in/munaganti-bhavani-sai`, opens in a new tab) to the hero social rail and the Contact section, replacing the old `"#"` placeholder.
- Centered the "Skills / Featured Work / About Me" peek-card row as a group instead of stretching full-bleed.

### 2. Sitewide theme pass (`react/src/Portfolio.jsx`)
Brought every other section (Nav, Skills & About, About/Experience, Projects, Trust, Contact, Footer) in line with the hero's theme instead of the app's older "scrapbook" look:
- Palette softened to a consistent pastel family (`--yellow`, `--yellow-soft`, `--pink`, `--mint`, `--blue` as periwinkle) plus a `--violet` accent, matching the hero's badge colors.
- Removed every `linear-gradient` (project theme tiles, Contact polaroid fills) — replaced with flat pastel colors, since gradients conflict with the brutalist brief.
- Buttons/nav unified to solid-black pills with offset-shadow hover, sentence-case labels (matching the hero), reserving uppercase for the big Anton display headlines.
- Added offset-shadow treatment to the About card and Experience cards to match the rest of the doodle system.
- Deleted now-dead CSS left over from the old hero (`.rb-btn-ghost`, `.rb-btn-light`, `.rb-circle-badge`).

### 3. Projects section rebuilt as a detail-page layout (reference: `image.png`)
Replaced the old alternating full-bleed dark/yellow panels (which broke the cream-background continuity) with, per project: a "PROJECT 0N" badge pill, oversized title, tag pills with auto-matched brand icons (`tagIcon()` helper maps tag text → `react-icons/si` or `lucide-react` icon), category line, description, arrow-bullet highlights, stack pills, and — on the right — a **reusable, data-driven phone mockup** (search bar, tag tiles, 2 feature rows pulled from that project's real `points`, nav dots) plus a rotated sticky note showing the project's badge. Deliberately *not* fake screenshots — built from each project's real content, confirmed with the user as the preferred approach over fabricating per-app UI mockups.
- Fixed a mobile bug where the sticky note and phone mockup weren't stacking (`flex-direction:column` was missing in the `<860px` media query), causing horizontal overflow from the rotated phone's bounding box.
- Renamed project badges "POS Application" and both "Android App" entries to "Mobile App" per the user's request.

### 4. About + Experience redesign (reference: `image copy.png`)
- About: added a "who's this?" hand-drawn-arrow label, a "Hey, I'm Bhavani Sai" intro line with a yellow highlight behind the name, and the laptop+sticky-note illustration **cropped from the reference image** (`react/public/about-laptop.png`), overlapping the bottom of the About card.
- Experience rebuilt as an actual timeline: dashed vertical line, colored dots, rotated year-pill tags, and per-entry icon avatars (`Building2` / `Laptop2` / `GraduationCap`) — each card's box-shadow now uses that entry's own accent color instead of plain black.
- Added a "Turning ideas into real products" sticky note (lightbulb icon) next to the Experience heading, hidden below the 2-column breakpoint to avoid overlap.

### Verification method used throughout
No `mcp__claude-in-chrome__*` or built-in browser tools were available this session. Instead: `npm run build` after every substantive change to catch compile errors, then `vite --port 5180` + a locally-installed `puppeteer-core` driving the system's Edge install (`msedge.exe`) to screenshot desktop (1500–1600px) and mobile (390px) viewports and actually read the rendered output back. This caught the button-specificity bug, the duplicated-illustration overlap bug, and the mobile phone-mockup overflow bug before reporting anything as done.

## Known open items (as of session 2)

- **Deployment** is still an open question: root `index.html` and `react/` remain two separate, manually-synced portfolios. `react/` is the one the user actually runs.
- **Repo hygiene**: the working directory has several loose reference screenshots (`image.png`, `image copy*.png`) and leftover scratch files (`.vite/`) not yet cleaned up or gitignored.
- **Dev server**: `cd react && npm run dev` to preview locally; nothing is left running between sessions.

## Key files (session 2 additions)

- `react/src/Portfolio.jsx` — still the entire app; now themed consistently end-to-end.
- `react/public/hero-illustration.png` — cropped hero desk/badges illustration.
- `react/public/about-laptop.png` — cropped About-section laptop/sticky-note illustration.
- `index.html` (repo root) — static mirror of the hero/nav/peek-cards redesign; kept in sync with session 2's early hero work but not with the later sitewide theme/Projects/About passes.

---

## Session 3 — Scroll-jacked Projects section, Motion library adoption, nav interactions

Continuation in `react/`, same running dev server (`npm run dev`, port 5173). No browser automation tool was available this session either — verification relied on `npm run build` after every change plus reading the compiled Vite dev output, not actual rendered screenshots. This is weaker verification than session 2's Puppeteer approach; flagged as an open item below.

### 1. Projects section rebuilt as a horizontal scroll-jacked carousel
Replaced the old vertically-stacked case-study panel list with a "row of projects that swipes left as you scroll down, then releases to normal scroll" pattern:
- The `Work` section is now a tall spacer (`100vh + (n-1)×70vh`) containing a pinned viewport-height panel; horizontal scroll progress is derived from how far the user has scrolled through that spacer.
- **Root cause of an early bug**: native CSS `position: sticky` silently doesn't work because an ancestor (`.rb-frame`) has `overflow: hidden`. Replaced with a hand-rolled sticky polyfill — the pin switches between `position: absolute` (before/after the scroll range, anchored to the section) and `position: fixed` (during the pinned range) — so it looks identical to sticky but isn't broken by the ancestor's overflow.
- **Second bug**: card content taller than the 100vh pinned viewport was getting symmetrically clipped top-and-bottom (badge/title cut off, stack tags cut off) by `align-items:center` + `overflow:hidden`. Fixed by shrinking the in-pin heading, tightening card typography/spacing with `clamp()`, top-anchoring cards instead of centering them, and adding a quiet `overflow-y:auto` fallback (hidden unless actually needed) so content degrades to a small internal scroll instead of silently losing data.
- Progress dots were moved from next to the "Projects" heading to their own row under the card track, per request.
- Visual treatment: each project card got a "book page" look (bordered card, stacked-page edge on the right via `::after`), and the whole pinned section got a thicker "book cover" border + a center vertical spine line.

### 2. Adopted the `motion` npm package (user explicitly asked for it) across the whole site
Installed `motion` (v14) and used it for real interaction/perf work, not just decoration:
- **Projects swipe**: replaced a `setState`-inside-`requestAnimationFrame` smoothing loop (which re-rendered the whole section every frame) with `useMotionValue` / `useSpring` / `useTransform` — scroll progress now drives the track's `x` and each card's scale/opacity/`rotateY` tilt without React re-renders; dot highlighting only re-renders when the rounded index actually changes.
- **Hero**: staggered entrance (tag → headline → note → desc → CTAs → stats), illustration fade/scale-in, staggered peek-card row.
- **Nav**: animated active-section indicator pill (`layoutId` shared-element transition), staggered mobile-menu items, tap feedback on buttons.
- **Skills board, tech/"built with" row, Experience timeline**: staggered card entrances; the timeline's dashed line changed from a static CSS pseudo-element to a real element that draws downward (`scaleY` 0→1) on scroll.
- **`Reveal` helper** (used in ~12 places — About, Experience items, Contact, project cards, section headings) was rewritten from a hand-rolled `IntersectionObserver` to Motion's `whileInView`, same external API so no call sites changed.
- All of the above wrap large/decorative motion in `useReducedMotion()` checks; small tap/press feedback is left unconditional since it's functional confirmation, not decoration. Global `html{scroll-behavior:smooth}` was added, gated under `prefers-reduced-motion: no-preference`.
- Ran a full code-quality/content audit per the user's request first (unused imports, dead code, spelling/grammar, broken links) — found nothing to clean up; the codebase and copy were already clean. That audit is what justified going straight to the animation work instead of a cleanup pass.

### 3. "Every animation replays every time its section is shown" (explicit follow-up request)
Initial pass had several `whileInView` calls set to `viewport={{ once: true }}` (fires once ever) and the original `Reveal` `IntersectionObserver` called `unobserve()` after the first trigger. Both meant scrolling away from a section and back up again did **not** replay its entrance animation. Fixed by flipping every `once: true` → `once: false` and removing the `unobserve()` call, plus converting Hero's mount-only entrance to `whileInView` so it replays on scroll-back too. Also added entrance motion to two previously-static decorative elements (About's laptop illustration, Experience's "Turning ideas into real products" sticky note) for full section coverage.

### 4. Nav hover/click interaction redesign (iterated twice based on user feedback)
- First pass: a solid "active section" pill (follows scroll position) plus a separate lighter "hover" pill (follows cursor between tabs) — two visually distinct yellow pills.
- User asked to simplify: now a **single** yellow pill that defaults to sitting under the active section, and springs to follow whichever tab the mouse is over; returns to the active tab when the mouse leaves the nav. Implemented as one `layoutId`-based shared element whose target tab is `hovered ?? active`.
- Click feedback: an expanding-circle ripple burst from the click point on each nav tab, plus a press-scale.
- Click-to-navigate: clicking a nav link now calls `scrollIntoView({ behavior: "smooth" })` (manually, via `preventDefault` + JS) instead of relying on the bare anchor jump, then — once the destination actually enters the viewport (`IntersectionObserver`, not a timer) — triggers a brief inset yellow glow pulse (`rb-section-flash`) so arrival is visually confirmed. Also fixed a real bug here: the sticky nav bar was covering the top of the destination section after navigating, because nothing accounted for its height — fixed with `scroll-margin-top` on every anchorable section (`#top`, `#skills`, `#about`, `#experience`, `#work`, `#contact`).

### Verification method used this session
`npm run build` after every substantive change (always succeeded, no errors) plus reading Vite's compiled dev output for syntax errors. **No actual rendered/visual verification was performed** — no browser automation tool was available in this session (unlike session 2's Puppeteer-based screenshot verification). All claims about how things *look* are based on code review, not observation.

## Known open items (as of session 3)

- **No visual verification tool this session** — everything above compiles and builds cleanly, but hasn't actually been seen rendered. Worth a Puppeteer/browser pass like session 2 used, especially the Projects pin section (most layout-sensitive part) and the nav hover pill/ripple.
- **Deployment** still unresolved: root `index.html` and `react/` remain two separate portfolios; root was not touched this session.
- **Repo hygiene**: loose files at repo root (`image copy*.png`, `Munaganti_Bhavani_Sai_Resume.pdf` duplicate of `react/public/Bhavani_Sai_Resume.pdf`, `.vite/`) still not cleaned up or gitignored.
- `react/` is still untracked in git as of this session.

## Key files (session 3 additions)

- `react/src/Portfolio.jsx` — Work/CasePanel rewritten for scroll-jacking + Motion; Nav rewritten for hover-pill/ripple/click-redirect; `Reveal` rewritten on top of Motion; animation added to Hero/Skills/Experience/Trust/Contact.
- `react/package.json` / `package-lock.json` — added the `motion` dependency.

---

## Session 4 — Motion best-practices pass, navbar fixed-position fix, Trust section redesign, dark theme, orbit layout fix

Continuation in `react/`, same dev server. Same verification limitation as session 3: no browser automation tool available, so everything below was checked with `npm run build` (always succeeded) and direct code review, not actual rendered screenshots, unless noted otherwise.

### 1. Project 1's card no longer has an internal scrollbar
Per explicit request, `.rb-case-track .rb-case-panel:first-child{overflow-y:hidden;}` — only the first project card; every other card keeps the quiet `overflow-y:auto` fallback from session 3.

### 2. Adopted Motion's own best-practices guidance (`npx motion-ai`)
The user added the `motion` npm package expectation and asked to run `npx motion-ai` (Motion/Framer Motion's official AI-agent tooling installer). `npx motion-ai` itself is interactive (needs a TTY) and its MCP-server-registration step (`claude mcp add ...`) was **blocked by Claude Code's own safety guardrail** (flagged as self-modification) — did not attempt to work around that; it's left for the user to run themselves if wanted. Instead, read the bundled best-practices docs directly from the npx-downloaded package on disk and applied concrete fixes they called out:
- Every `useTransform(value, (v) => ...)` call (Work's scroll progress, track position, per-card tilt/scale/opacity) was using a form the docs explicitly list as deprecated. Rewritten to the current form: `useTransform(() => fn(value.get()))`.
- One-shot UI springs (nav pill, skill-card pop-in, timeline sticky note) switched from raw `stiffness`/`damping` to Motion's newer `{ type: "spring", visualDuration, bounce }` API. The Projects-carousel scroll spring was deliberately *kept* on physics params (`stiffness`/`damping`) since it's continuously interrupted by live scroll input — the docs call that out as the case physics-based springs suit best.
- Added `<MotionConfig reducedMotion="user">` at the app root as a documented, idiomatic safety net on top of the existing manual `useReducedMotion()` checks.
- Removed a leftover unused `AnimatePresence` import (later re-added once an actual `AnimatePresence` usage — the theme-toggle icon swap, see §6 — needed it).
- MotionScore performance audits, doc/example search, and CSS-spring generation all require the hosted Motion MCP server, which isn't connected (see guardrail block above) — not available this session.

### 3. Fixed the navbar actually covering content (two compounding bugs)
- **Root cause**: `.rb-frame` (the outer poster-frame wrapper) has `overflow:hidden`, which silently breaks native `position:sticky` on any descendant — this had already bitten the Projects pin in session 3, and it turned out the navbar had the exact same problem: it was never really staying pinned, just scrolling away like normal content.
- **Fix**: Nav switched from `position:sticky` to `position:fixed` (not restricted by an ancestor's `overflow`), inset to match the poster frame's own margin (18px desktop / 8px mobile) so it visually docks inside the frame. Since `fixed` removes it from flow, added a measured spacer (`ref` + `offsetHeight`, re-measured on resize) so content below doesn't jump.
- **Knock-on bug this exposed**: once the navbar was genuinely always-visible, it started permanently covering the top ~96px of whatever section was scrolled under it — most visibly, the "Projects" heading inside the Work section's pinned viewport, which was positioning itself flush at the literal top of the screen. Fixed properly, not just nudged: introduced a shared `NAV_CLEARANCE` constant used by both the navbar's CSS and the Work section's pin engage/disengage scroll-math (trigger thresholds, progress calculation, and the pin's own `height: calc(100vh - NAV_CLEARANCE)`), so the heading now sits cleanly below the nav with the swipe timing still correctly synced to scroll. Had to tighten card padding/fonts slightly further to compensate for the lost vertical room.
- Also removed the decorative center "book spine" vertical line from the Work section pin per request.
- Added polish while touching the navbar: slide+fade entrance on page load, and a frosted-glass (`backdrop-filter: blur`) look once scrolled, animated via CSS transition.

### 4. Trust section ("built with" / "Let's Talk") redesigned with SVGs + animation
- A hand-drawn wobbly circle that draws itself (`pathLength` 0→1) around the "Let's Talk" heading each time it scrolls into view.
- New `WinkingSmiley` component (kept separate from the shared `<Smiley>` used elsewhere, which stays static) — blinks **on hover**, not on a timer: first built as an ambient every-few-seconds blink loop, then changed per follow-up request to a `whileHover` variant-triggered blink (both eyes, quick close-open) since the user specifically wanted hover to trigger it.
- Three small sparkle icons float/bob around the heading on independent staggered loops, hidden on small screens.
- Tech chips got tap/press feedback on top of their existing hover lift.

### 5. Dark theme toggle — "brighter and sharper," not just inverted
Sun/moon toggle button in the navbar (visible on mobile too), preference saved to `localStorage`, defaults to `prefers-color-scheme` on first visit. The theme itself is CSS-variable-driven (`:root[data-theme="dark"]` redefining `--paper`/`--warm`/`--card`/`--line`/`--ink`/`--ink-dim`/`--ink-faint`), which is why it was able to cascade correctly across the whole site without touching individual components:
- Background drops to near-black; text/borders/offset-shadows flip to off-white so the signature thick-border/hard-shadow look stays crisp instead of muddy. Accent colors (yellow/pink/mint/blue/violet) are left **unchanged** — against near-black they read more vivid than on the old cream background, which is most of what makes it feel "brighter."
- **Real contrast bug caught and fixed**: ~16 places draw dark icons/text directly on pastel accent chips (project badges, tag pills, the smiley's eyes, timeline pills, stickers, the Contact section's yellow note, etc.) by inheriting the page's ink color. Just flipping `--ink` to white would have made all of that white-on-pale-yellow and unreadable. Added a theme-**invariant** `--ink-on-accent` (always dark) and applied it specifically to those ~16 rules, while borders/shadows on the same elements still flip to white via `--ink` as normal.
- Soft shadows and faint background dot-textures were hardcoded to a dark RGB triple (`rgba(23,22,21,...)`), which would've been invisible on a black background — converted to a theme-aware `--ink-rgb` custom property used as `rgba(var(--ink-rgb),alpha)`.
- The two raster illustrations (`hero-illustration.png`, `about-laptop.png`) have opaque cream backgrounds baked into the pixels, so they can't recolor via CSS. Rather than leave them looking like a stray light rectangle on a dark page, framed them like pinned photos in dark mode (border, rounded corners, shadow) with a brightness/contrast/saturation boost. The hand-drawn SVG doodles (smiley, sparkles, scribbles) didn't need this — they already used theme CSS variables for their strokes/fills, so they adapt automatically.

### 6. Discovered the Skills section is now a completely different, undocumented design
While fixing a reported collision bug (screenshot showed overlapping skill cards), found that `SkillsAbout` is no longer the flex-wrap "scrapbook card wall" described in sessions 1–3: it's now a tabbed Skills/About toggle (`role="tablist"`, animated via `AnimatePresence`) where the **Skills** tab renders `SkillsOrbit` — a radial layout with 12 skill cards (`OrbitCard`) positioned absolutely around a center "My Skills" badge via `--x`/`--y` custom properties, with hand-drawn dashed orbit rings (`OrbitPath`) and two "note" callout cards (`rb-orbit-note`) — and the **About** tab renders a new `AboutCanvas` (torn-paper card + 4 fact tiles). **This entire orbit/tab redesign has no record in this notes file and no visible record in the conversation history available when writing this entry** — it must have been built in a part of this session that isn't in the current context window (likely summarized away) or in an unlogged earlier pass. Flagging this explicitly so a future session doesn't go looking for the old scrapbook layout and doesn't assume Notes.md is a complete history.
- **The fix itself**: `ORBIT_ITEMS`' `x`/`y` positions were ad-hoc percentages causing real overlaps (JS/AWS, MySQL/Hibernate, Spring Boot/Git in the reported screenshot). Replaced with two clean concentric rings computed on paper — 5 items on an inner ring (radius 30%, 72° apart: core daily stack — JS, TypeScript, Node.js, AWS, Git) and 7 on an outer ring (radius 44%, ~51.4° apart: supporting tools/strengths), angularly offset from each other so inner and outer cards interleave rather than lining up radially. Checked the worst-case inner/outer center-to-center distance (~141–144px) against the card footprint (~105–110px) to confirm real clearance, not just a visual nudge.

### Verification method used this session
`npm run build` after every substantive change (always succeeded) plus direct code/CSS reasoning. No browser automation tool was available, so none of the visual claims above (the navbar glass effect, the Trust section circle/sparkles, dark-theme contrast, the orbit layout spacing) have actually been seen rendered — all computed/reasoned from code, same limitation as session 3.

## Known open items (as of session 4)

- **No visual verification tool across sessions 3–4** — a real risk at this point given the accumulated CSS complexity (scroll-jacked pin math, dark theme variable cascade, orbit trigonometry). Worth a Puppeteer/browser pass (like session 2 used) before trusting further blind changes.
- **Undocumented Skills/About redesign** (§6 above) — the `SkillsOrbit`/`AboutCanvas` tab system exists and works (builds clean), but nothing in this file explains why it replaced the scrapbook layout or what reference/brief drove its specific visual choices. Worth asking the user directly if more work is needed there, rather than assuming intent from the code alone.
- **Deployment** still unresolved: root `index.html` and `react/` remain two separate portfolios; root was not touched this session.
- **Repo hygiene**: loose files at repo root (multiple `image copy*.png` reference screenshots, a duplicate resume PDF, `.vite/`) still not cleaned up or gitignored.
- The Motion hosted MCP server (`motion` / `motion-plus`) is not connected — MotionScore audits, doc search, and the visual transition editor are unavailable until the user runs the registration themselves (blocked for Claude Code to do directly, see §2).

---

## Session 5 — Current portfolio refinement

All work in this session targeted `react/src/Portfolio.jsx` and was verified with `cmd /c npm run build` after substantive updates.

### Skills & About

- Replaced the original orbital Skills view with a responsive, reference-inspired category board: Languages (Java, JavaScript, TypeScript); Mobile / Frontend (React Native, HTML, CSS); Backend (Node.js, Spring Boot, Hibernate); Database (MySQL); and Tools (Git, AWS).
- Kept the animated Skills / About switch and About canvas.
- Centered the Skills & About heading and removed the “what's in the toolkit” label and its decorations.
- Added one-time section entrances; the Skills board waits to animate until it reaches the viewport.

### Hero, navigation, and assets

- Updated the visible role to **Software Engineer** in the app, About labels, and page metadata.
- Hero name now lands from above; Bhavani's yellow underline draws after the landing, with a slower follow-up animation for Sai. Reduced-motion behavior is preserved.
- Generated and activated `react/public/hero-illustration-icons.png` with Full Stack Development, Web Development, and React Native Apps cards plus appropriate original line icons.
- Social actions are separate GitHub, LinkedIn, and Email buttons beneath the theme control, with hover/focus tooltips. The Navbar Resume button downloads `react/public/Bhavani_Sai_Resume.pdf`.
- Removed Hero's Get In Touch action and the Skills / Featured Work / About Me shortcut-card row.
- Removed the outer poster-frame margin/border so the page is edge-to-edge.

### Content and layout changes

- Updated experience dates to `2026 — Present` and `2025`.
- Enlarged Project heading/title typography; removed all phone/mockup project art; converted projects to smaller single-page book layouts with a stronger page-turn rotation.
- Removed the Contact heading box, lower social row, and decorative 01 / 02 Contact cards.
- Reduced the Let’s Talk heading, removed its descriptive paragraph, moved the smiley beside AWS, and adjusted the doodle outline to avoid overlap.

### Theme and interaction details

- Theme preference persists through `localStorage`; the curtain theme switch remains protected against rapid repeated clicks.
- Navbar becomes transparent when scrolled.
- Reveal animations run once on first entry rather than replaying on every scroll.

### Local preview

- Run `cmd /c npm run dev -- --host 0.0.0.0` from `react/` to test on a phone connected to the same Wi-Fi.
- Local Vite servers were checked and stopped at the end of this session.

## Key files (session 4 additions)

- `react/src/Portfolio.jsx` — Nav switched to fixed positioning with measured spacer; shared `NAV_CLEARANCE` constant; Work section pin math updated to account for it; Trust section SVG/animation rework; full dark-theme variable system + toggle; `ORBIT_ITEMS` repositioned onto two clean rings.

---

## Session 6 — Reference-portfolio features, section restructure, project cards, hero + theme-curtain animations

Continuation in `react/` (2026-10-27 → 2026-10-28). Unlike sessions 3–5, every visual change this session was **actually seen rendered**: `npm run build` after each change, then `puppeteer-core` (installed temporarily with `npm install puppeteer-core --no-save`, removed again after each check) driving the system Edge (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`) against the dev server, screenshotting light mode, dark mode and 390px mobile.

### 1. Reviewed a reference portfolio for ideas
- Read `D:\Games\Portfolioo-main\Portfolioo-main` — **someone else's** portfolio (Gowtham Vallate, manga-brutalist, React + Tailwind + GSAP + Lenis + R3F, Vercel contact function). It contains that person's name, resume and photo — only *patterns* were borrowed, never their content.
- Features taken from it (all re-themed to this site's doodle look, built on the existing `motion` library rather than adding GSAP): magnetic buttons, Lenis smooth scroll + `scrollToId()`, scroll-triggered count-up stats, fixed section-legend rail, a scroll-scrubbed section "wipe" band (later removed, §6), a single `content.js` data file, and the pinned horizontal "shelf" Projects flow (§3).

### 2. Let's Talk + enquiry card (first pass)
- Moved "Let's Talk" to the left and added a **Quick Enquiry** card (name / email / message) on the right.
- **The form is mailto-based**: submitting opens the visitor's own email app pre-filled to `munaganti.bhavanisai@gmail.com`. The user chose to *skip* a real backend for now. Options discussed for later: a Vercel serverless function (`api/contact.js` + Nodemailer + Gmail app password, like the reference project), EmailJS, or Formspree.
- The hand-drawn circle around "Let's Talk" was shrunk, then found to be mis-sized by a real bug (the heading wrapper had `flex:1 1 300px`, so it stretched across the row and the circle was centred over empty space — fixed with `flex:0 1 auto`), and finally **removed at the user's request** (`HandCircle` deleted); the floating sparkles were kept and the heading enlarged.

### 3. Projects rebuilt as a pinned horizontal shelf
- Replaced the one-card-at-a-time "book page" swipe (and its pagination dots) with the reference's flow: the section pins and vertical scrolling drags a continuous row of cards sideways. Drag distance is measured from the track's real `scrollWidth` (`SHELF_END_PAD` = 160px of run-out); stacks vertically ≤760px.
- Removed `CasePanel`, the book/spine CSS, `THEME_COLOR`, `TAG_ICON_MAP`/`tagIcon()`, `CHIP_COLORS` and the dots.
- Cards were then **redesigned** (§5) and the section frame later removed (§6).

### 4. New hooks, components and the content file
- `src/data/content.js` — single source of truth: `PROFILE`, `NAV_LINKS`, `SECTIONS` (derived from `NAV_LINKS`), `CONTACT`, `ABOUT`, `PROJECTS`, `EXPERIENCE`, `SKILL_GROUPS`, `HERO_STATS`. Projects now carry an `accent` colour variable instead of the old `theme` key; unused `desc` / `cardTags` fields were dropped. Hero stats show real counts derived from the project data: `7+` projects, `3+` React Native apps, `2+` web apps.
- `src/hooks/useLenis.js` (smooth scroll; `scrollToId()` used by nav, legend, hero button and "Back to top", offset by `NAV_CLEARANCE`), `useMagnetic.js` (spring pull on the hero CTA, nav Resume pill and enquiry submit), `useActiveSection.js` (scroll-spy, extracted so Nav and the legend share it), `useFontReady.js` (§8).
- `src/components/CountUp.jsx` (scroll-triggered count-up, optional `delay`), `SectionLegend.jsx` (right-edge dots + tooltips, ≥1180px only).
- Added the `lenis` dependency (`react/package.json`).

### 5. Page restructure + new project card design
- **New page order: Hero → About → Experience → Projects → Skills → Let's Talk.** Nav and legend follow it (an Experience tab was added).
- Removed the Skills/About tab toggle (`SkillsAbout`, `SkillsOrbit`, `AboutCanvas`, orbit CSS) and the combined About+Experience block. Now:
  - **About** — one card: intro + two paragraphs on the left, four fact tiles on the right, laptop illustration tucked under the card.
  - **Experience** — its own section, timeline left-aligned, "Turning ideas into real products" note top-right.
  - **Skills** — its own section; the five skill cards plus the "Build / Learn / Explore" badge fill a 3×2 grid.
- Removed the "built with" tech-chip row.
- **Project card design**: coloured header band per project (number sticker, handwritten type badge, year), category line, title, one-line description, yellow check bullets (same style as Experience), stack chips + black "Code" pill.
- Theme/bug fixes found while checking screenshots: accent skill chips were light-on-pale-yellow in dark mode (unreadable); the scrolled nav was fully transparent so content showed behind the logo (now frosted); Lenis and `html{scroll-behavior:smooth}` were fighting (added Lenis's recommended `html.lenis` CSS); browser-default `h2` margins left a big gap under every section note; hardcoded `#9d3efc` → `var(--violet)`.
- Dead code removed: the orbit system, stickers, `ScribbleUnderline`, `WinkingSmiley`, `SHOWCASE_ITEMS`, `TECH`, `ABOUT_TILES`, unused icon imports and ~27 unused CSS rules (found with a script that cross-checks every `.rb-*` class against the JSX). `Portfolio.jsx` went ~1,470 → ~1,190 lines; bundle 430 KB → 393 KB.

### 6. Follow-up tweaks
- **Nav hover bug**: when the yellow pill slid to a hovered tab, the current tab kept its dark "on-yellow" text and vanished on the dark background. Dark text now follows the pill (`has-pill` class); the current tab stays bold in the normal text colour.
- Deleted the unused `hero-illustration.png`, `hero-illustration-full-stack.png`, `hero-illustration-react-native.png` (~4.7 MB) from `react/public/`.
- **"View My Work" tap animation** (`WorkButton`): pill squash, arrow launches out top-right and a new one slides back in, the circle flashes yellow, a 12-piece confetti/sparkle burst fans out, then it scrolls to Projects after 450ms. Reduced motion skips straight to the scroll.
- Removed the "Let's build something" wipe band (`SectionWipe.jsx` deleted).
- **Hero**: name enlarged (`clamp(60px, 7.8vw, 124px)`, ~74px on phones); illustration moved down (`clamp(32px, 5vw, 80px)`) and right by `--art-shift: clamp(0px, calc(50vw - 660px), 48px)` — zero at ≤1320px so it never collides with the fixed social-icon rail.
- **Projects frame removed** (border, radius, shadow, solid background). This exposed things the frame had hidden, also fixed: the heading was actually centred by a flex auto-margin quirk (now left-aligned, standard size scaled by viewport height so cards still fit short laptops); the pinned panel jumped 18px sideways when it locked (inset removed); the first card now lines up under the heading.
- **Let's Talk upgraded**: heading ~132px; mint "Open to new opportunities" status pill with a pulsing dot; the user's own intro line; four contact tiles (Email, Phone, LinkedIn clickable; "Based in Hyderabad"); "I can help with" chips. Copy lives in `CONTACT` in `content.js`.
- Fixed a silent CSS bug: `.rb-root ul{margin:0}` out-ranks a single class, so margins on `ul` elements (contact tiles, Experience bullets) were being dropped — selectors now `ul.rb-…`.

### 7. Hero name intro — made clearly visible
- "Bhavani" bounces in letter by letter (spin + spring), the yellow underline swipes in with overshoot, "Sai" stamps down from oversized/tilted, then a yellow and a pink ✦ sparkle pop out and keep floating. Letters hop on hover.
- Everything else in the hero (note, description, button, stats, image) now waits until the name has landed (`HERO_AFTER_NAME`); hero stats count up *after* they appear (`CountUp` `delay`).
- The name is rendered as letter spans for animation, with a visually hidden "Bhavani Sai" (`.rb-sr-only`) so screen readers still read one heading.

### 8. Fonts load from `index.html` now
- Found why the old name animation was easy to miss: Google Fonts were loaded by an `@import` inside the JS-injected `<style>`, so fonts weren't even requested until React rendered — the intro often played in a fallback font. Moved to `<link rel="preconnect">` + stylesheet in `react/index.html`, removed the `@import`, and the intro waits for Poppins via `useFontReady` (polls `document.fonts.load`, 1.5s timeout so the hero never stays hidden).
- Fixed a latent `CountUp` bug at the same time: its effect depended on a regex-match array recreated every render, so it re-ran every frame (a delay timer would never have fired).

### 9. Theme-switch curtain — made clearly visible
- The old "BS" mark was on screen for about one frame (it finished fading in at the same moment the curtain started opening), and the panels used `--ink`, so they flipped white→black mid-switch.
- New timeline: panels close (420ms) → **hold** (620ms: a 116px BS badge spins in with a rotating dashed ring, halo and a "Dark mode" / "Light mode" caption; the theme swaps halfway through while fully covered) → panels open (440ms). Panels use a fixed `--curtain` colour with a dotted texture and yellow seam, so they read the same from either theme. Reduced motion still swaps instantly with no curtain.

### Verification notes / gotchas
- Motion runs many animations through the browser's Web Animations API, so an element's **inline `style` doesn't change mid-animation** — check `getComputedStyle()` instead. Slowing animations with the CDP `Animation.setPlaybackRate` worked for the button burst but produced blank frames for the font-gated intro; rapid real-time JPEG screenshots (~120ms apart) were the reliable way to capture intro/curtain stages.
- The only console error seen is a `/favicon.ico` 404 (the site has no favicon).

## Known open items (as of session 6)

- **Repo root clean-up**: `script.js` and `style.css` belong to the old static site whose `index.html` the user already deleted (uncommitted). Deleting them was blocked by the permission check — user to decide.
- **Nothing committed**: `react/` is still untracked in git; all of this session's work exists only on disk.
- **Enquiry form is mailto-only** (§2) — a real server-side send still needs one of the listed options.
- **Copy to confirm**: "Open to new opportunities" and the "I can help with" chips were written by Claude — edit `CONTACT` in `react/src/data/content.js` if they don't fit.
- ~~**Minor overlap**: on desktop the right-edge section-legend dots sit on top of the projects shelf's right-most card while it's pinned.~~ — resolved in session 7 (legend removed).
- A Vite dev server (port 5181/5182) may have been left running from this session — stopping it via `taskkill` was blocked; close its terminal if it's still up.
- No favicon.

## Key files (session 6)

- `react/src/Portfolio.jsx` — new section components (`About`, `Experience`, `Skills`, `LetsTalk`, `EnquiryCard`, `WorkButton`), redesigned `ProjectCard`/`Work` shelf, letter-by-letter hero intro, new `ThemeCurtain` timeline, all CSS updates.
- `react/src/data/content.js` — all site copy and data.
- `react/src/hooks/` — `useLenis.js`, `useMagnetic.js`, `useActiveSection.js`, `useFontReady.js`.
- `react/src/components/` — `CountUp.jsx`, `SectionLegend.jsx`.
- `react/index.html` — Google Fonts now loaded here.
- `react/package.json` — added `lenis`.

---

## Session 7 — Skills expanded from the resume, section legend removed, transparent scrolled nav, phone number removed

Continuation in `react/` (2026-10-28). Every change was checked with `npm run build`, then screenshots via `puppeteer-core` driving the system Edge against `vite preview` (port 5191). puppeteer-core was installed in the Claude session's temporary scratchpad folder, **not** in the project, so `react/package.json` is unchanged.

### 1. Skills section — more skills, taken from the resume and projects
- Source: the resume's Technical Skills block (`react/public/Bhavani_Sai_Resume.pdf`) plus the `stack`/`points` of each entry in `PROJECTS`.
- `SKILL_GROUPS` in `content.js` went from 5 cards / 12 skills to **7 cards / 53 skills**:
  - **Languages** — Java, JavaScript, TypeScript, Python, SQL, C
  - **Mobile / Frontend** — React Native, React.js, Android (Java), React Query, React Navigation, Axios, HTML5, CSS3, Tailwind CSS, Bootstrap
  - **Backend** — Node.js, Express, Spring Boot, Spring MVC, Hibernate, JDBC, REST APIs, JWT Auth, Maven
  - **Database** — MySQL, SQLite, Stored Procedures, Query Design
  - **Cloud & DevOps** (renamed from "Tools") — AWS Lambda, API Gateway, S3, AWS SAM, CodeBuild, Firebase, Docker, Git, GitHub, Postman
  - **AI / ML** (new, `Brain` icon) — YOLOv8, OpenCV, Computer Vision, Knowledge Distillation, Claude Code
  - **Engineering Practices** (new, `ClipboardCheck` icon, `wide: true`) — Functional & Regression Testing, Defect Triage, Root-Cause Analysis, Code Review, Technical Documentation, Release & Version Management, Secure Auth & Access Control, Payment Integrations (UPI / QR), Offline-First Sync
- **Not on the resume, taken from the projects instead**: SQLite + Offline-First Sync (Gate Entry App), Axios (ERP Parking), Knowledge Distillation (Railway Object Detection), Payment Integrations (ERP Billing's UPI/QR, Odisha Tourism's Paytm EDC), Claude Code (Anthropic certification). Remove these if the list should match the resume exactly.
- **Layout**: new `wide` flag → `.rb-skill-group.wide{grid-column:span 2}`. On desktop (3 columns) the grid is two full rows of 3 cards, then Engineering Practices (2 columns) + the "Build / Learn / Explore" badge. At ≤900px the wide card and the badge each take a full row (`grid-column:1/-1`), so no row is left half-empty at any width. No horizontal overflow at 1500 / 820 / 390px.

### 2. Right-edge section legend removed
- The user didn't want the dot rail on the right edge ("no need of this, I have the navbar").
- Removed the `<SectionLegend>` render and import, all `.rb-section-legend*` CSS, and the `SECTIONS` export in `content.js` (only the legend used it). **Deleted `react/src/components/SectionLegend.jsx`**. `useActiveSection` is kept because the Nav still uses it for its active-tab pill.

### 3. Navbar fully transparent once scrolled (both themes)
- `.rb-nav.scrolled` is now `background-color:transparent; backdrop-filter:none; box-shadow:none` (it was frosted: 86% `--paper` + blur + shadow). There's no theme-specific nav rule, so one change covers light and dark. Checked with computed styles (`rgba(0,0,0,0)`, `none`, `none`) and screenshots in both themes at desktop and 390px.
- **This reverses session 6 §5's "now frosted" fix**, at the user's explicit request. Trade-off: the tabs pill, Resume button and desktop theme toggle have their own solid fills and stay legible, but the "BHAVANI SAI" brand text, the mobile hamburger and the mobile theme icon have no fill and sit directly over content as it scrolls. Offered (not done): give just those a small solid background and keep the bar transparent.

### 4. Mobile number removed for privacy
- Removed the Phone tile from Let's Talk, `phone` from `PROFILE`, and the unused `Phone` icon import. Grep confirms the number is gone from `react/src` and the rebuilt `react/dist`.
- With 3 tiles left, the Email tile now spans the full row (`ul.rb-talk-contacts > li:first-child`); LinkedIn and Based in sit side by side below it.
- **Fixed an existing bug**: the ≤520px "one tile per row" rule (`.rb-talk-contacts`) lost to the more specific `ul.rb-talk-contacts` base rule, so phones squeezed the tiles two per row and wrapped the LinkedIn handle mid-word. Same bug type as session 6 §6. Selector changed to `ul.rb-talk-contacts`; tiles now stack on phones.

### Verification gotcha
- puppeteer's `page.screenshot({ clip })` uses **document** coordinates, so a `position:fixed` navbar is missing from a `y:0` clip after scrolling. Use `y: window.scrollY`.

## Known open items (as of session 7)

- **The phone number is still public in two places** (both untouched, waiting for the user's decision):
  - The resume PDF the Resume button downloads (`react/public/Bhavani_Sai_Resume.pdf`) and its duplicate `Munaganti_Bhavani_Sai_Resume.pdf` at the repo root. Both show the number in the header line.
  - **Git history**: the old root `index.html` in commit `ea275cf` ("Updated portfolio website") contains it twice (`tel:+91…` links), and that commit is pushed to `origin` (`github.com/Bhavani-Sai-Git/Portfolio`). Deleting the file in a new commit won't remove it from history; that needs a history rewrite + force-push. If the repo is public, making it private is the quick fix.
- **Transparent nav legibility on mobile** (§3): the brand text and menu/theme icons can overlap busy content.
- **Skills not on the resume** (§1): confirm the user is happy with them.
- Still **nothing committed**: `react/` is untracked in git.

## Key files (session 7)

- `react/src/data/content.js` — expanded `SKILL_GROUPS` (+ `Brain`, `ClipboardCheck` imports); removed `SECTIONS` and `PROFILE.phone`.
- `react/src/Portfolio.jsx` — `.rb-skill-group.wide` + responsive rules, `wide` class in `Skills`; legend render/import/CSS removed; transparent `.rb-nav.scrolled`; Phone tile + import removed; contact-grid full-width first tile and the ≤520px selector fix.
- `react/src/components/SectionLegend.jsx` — deleted.

---

## Session 8 — Case studies, field notes, recruiter features, launch basics (2026-10-31)

The user asked for a senior UI/UX review ("what more can be added"), then asked for the whole list to be built one item at a time, starting with the case-study template. Checked with `npm run build`, puppeteer-core + Edge screenshots (light, dark, 390px) against `vite` (dev) and `vite preview` (prod), and scripted click/wheel tests. puppeteer-core and sharp were installed in the session scratchpad, **not** in the project, so `react/package.json` dependencies are unchanged.

### Pattern: content only the user can supply
- `src/components/Todo.jsx` renders a dashed red "To add" box **in `npm run dev` only**; production builds drop it.
- Notes have `draft: true`: shown in dev with a DRAFT badge, a 404 in production. The Testimonials section stays hidden while `TESTIMONIALS` is empty. `NOW` / `QUICK_FACTS` rows with an empty `value` show only in dev.
- Confirmed against the production preview: 0 `.rb-todo` boxes, no Notes or Testimonials section, `/notes/sni-ssl-bug` → 404. (Draft text still exists as data inside the JS bundle; it just isn't rendered.)
- Every fact on the new pages comes from the resume (`react/public/Bhavani_Sai_Resume.pdf`) or `content.js`. Nothing was invented. **Copy Claude wrote** (user to review): `HERO_TAGLINE`, the case-study "problem" / "learned" phrasing, and the general explanations in the notes.

### 1. Router + new pages
- `src/router.jsx`: a tiny History-API router (`usePath`, `navigate`, `matchPath`, `<Link>`) instead of adding react-router. Routes: `/`, `/work/:slug`, `/notes/:slug`, anything else → 404. The tab title updates per route.
- The nav works from any page: tabs on a non-home page go to `/#section`, and `Home` scrolls there on mount. That scroll uses `scrollToSection(..., { push: false })`, so it doesn't add a second history entry (that was a bug that broke Back; found and fixed in testing).
- `useActiveSection(hrefs, resetKey)` now re-attaches when the route changes. `scrollToTop({ smooth })` was added to `useLenis.js`. "Back to top" in the footer works on pages without `#top`.
- `vercel.json` (rewrite) + `public/_redirects` (Netlify) give deep links a fallback to `index.html` on hosting.

### 2. Case-study template (`src/pages/CaseStudy.jsx`, data `src/data/caseStudies.js`)
- 3 case studies: **ERP Parking, ERP Billing, eNAM Weighment** (picked over Gate Entry because the resume has the most detail on these).
- Layout: back link, kicker pill, giant title with word-by-word reveal and an accent swash, summary, 4 meta tiles; an accent "showcase" band with fanned device frames; 3 number cards (count-up); sticky "On this page" table of contents with an active state; 01 Problem / 02 Constraints / 03 Key decisions / 04 What shipped (+ yellow "What I took away" note, + a link to the related field note) / 05 Stack; "Next case study" card; reading-progress bar.
- `src/components/ScreenFrame.jsx`: phone or browser frame. It shows a real screenshot when `src` is set, otherwise a neutral wireframe sketch (`form | dashboard | list | pos`); no fake data.
- Numbers are all factual (e.g. 5 intake modes, 3 payment channels, 9-file integration module).

### 3. Field notes (`src/pages/Note.jsx`, data `src/data/notes.js`)
- 3 drafts: SNI SSL bug (eNAM), UTC off-by-one date bug (Parking), HTTP-200 errors / typed API layer (Parking). Each is laid out as Symptom → Cause → Fix → Lesson, with `todo` gaps for the specifics only the user knows (how it was narrowed down, the exact fix).
- Home has a "Field Notes" section of taped index cards (`#notes`), shown only while a note is visible.

### 4. Homepage changes
- **Hero**: the positioning line (`HERO_TAGLINE`) replaces "I build mobile and web apps…". Stats are now outcomes from the resume: **6** business apps at ERPDIRECT, **4** payment channels (SMS · QR · UPI · EDC), **18%** fewer false detections (YOLOv8, approx.). The stat icons were removed. Numbers are 34px Anton with a colour highlighter swipe (`--stat-accent`). They stack without dividers at ≤760px.
- **Projects**: footer button is "Case study" (→ `/work/<slug>`), "GitHub" for academic projects (`code: true`), or a dashed "Client app" label. The old "Code" button linked every card to the GitHub profile, which was misleading for private client code. Food Frenzy and Railway points now carry the resume's ~40% and ~18% results. The shelf hint row has a "03 / 07" counter and a progress bar driven by the same sprung progress as the track.
- **Skills**: each project has a `skills` array (names match chip labels exactly). Chips used in a project get a violet dot and become buttons; tapping one opens a "used in" strip inside that card, linking to the case study (or scrolling to Work).
- **New sections** (`src/sections/Extras.jsx`):
  - Certifications strip, from the resume: Claude Code in Action, AI Fluency (Anthropic), Salesforce Superbadges, ReactJS (Udemy), Full Stack Java (Codegnan).
  - In About: a "Now" card (Building: ERP Parking on RN 0.87; Learning: To add) + "Off the clock" tiles (state-level volleyball, NGO volunteering, HR Conclave 2024, travel & games).
  - Testimonials (hidden until quotes are added).
  - In Let's Talk: a "Quick facts" card (looking for, based in, experience; work mode and notice period To add) with **Copy email** and **View resume** buttons.
  - Global: a resume viewer modal (PDF inline + Download), a **Ctrl/⌘ + K command menu** (jump to sections, case studies, notes, resume, copy email, toggle theme, GitHub/LinkedIn; arrow keys + Enter) with a "Ctrl K" pill in the nav (desktop), a toast, and the secret smiley in About (click 5× → confetti + toast).
  - These talk to each other through window events: `rb:command`, `rb:resume`, `rb:toast`, `rb:toggle-theme` (the Nav listens for that last one).

### 5. Contact form
- `EnquiryCard` POSTs to Formspree when `VITE_FORMSPREE_ID` is set (sending / sent / error states, with an email fallback on error). Without it, it still opens the visitor's email app as before.

### 6. Launch basics
- `public/favicon.svg` (yellow BS badge) + `apple-touch-icon.png`; `public/og-image.png` (1200×630 doodle share card, rendered with puppeteer from an HTML mock); OG + Twitter tags in `react/index.html`. `__SITE_URL__` is filled at build time from `VITE_SITE_URL` by a small plugin in `vite.config.js`.
- Optional Plausible analytics in `main.jsx`, loaded only in production when `VITE_PLAUSIBLE_DOMAIN` is set.
- `react/.env.example` documents all three env vars; `.env` / `.env.local` were added to `react/.gitignore`.
- Global violet `:focus-visible` ring; the doodle 404 page (`src/pages/NotFound.jsx`).
- Images: `hero-illustration-icons.webp` (1.8 MB PNG → 137 KB) and `about-laptop.webp` (195 KB → 16 KB), served via `<picture>` with PNG fallback, plus explicit width/height; the hero image is preloaded.

### 7. Fix: mouse wheel didn't scroll the Ctrl+K menu (user report, screenshot `image copy 2.png`)
- **Cause**: Lenis smooth scroll captures every wheel event on the page and calls `preventDefault`, so the menu's scrollable list never received them.
- **Fix**: added `data-lenis-prevent` to both modal backdrops (command menu + resume viewer), which Lenis checks on the event path and leaves alone. Also added `overscroll-behavior: contain` to `.rb-cmd-list`.
- **Verified** with real wheel events in Edge: the list scrolled 480 px while the page stayed at 1200; after closing, the page wheel-scrolls normally (1200 → 1788).

### Gotchas (for future sessions)
- `.rb-root a{color:inherit}`, `.rb-root ul{margin:0}` and `.rb-root button{background:none; font:inherit}` (specificity 0,1,1) beat single-class rules. New link/list/button styles need `.rb-root a.x`, `ul.x`, `button.x`. Caused the next-case-study title to render white on yellow in dark mode, and lost margins on the meta tiles and certifications. All fixed.
- **Any new scrollable panel or modal needs `data-lenis-prevent`**, or the mouse wheel won't scroll it.
- Don't put a transform on the route wrapper in `Portfolio()`: it would break the Work shelf's `position:fixed` pin. It uses an opacity fade only.
- Section jumps land ~184px from the top (scroll-margin + nav offset, same as before this session); this wasn't changed.
- puppeteer `screenshot({ clip })` uses document coordinates (also noted in session 7).

## Known open items (as of session 8)
- **Needs the user's content**:
  - App screenshots for each case study: put them in `react/public/work/<slug>/` and set `src` in `caseStudies.js`, blurring customer data.
  - Real usage numbers (branches, vehicles or bills per day), if shareable.
  - 1–2 testimonials.
  - Now → Learning; work mode; notice period.
  - The "To add" gaps in each note, then set `draft: false` to publish it.
  - Optional: certificate links (`href` in `CERTIFICATIONS`).
- **Review Claude-written copy**: `HERO_TAGLINE`, the case-study phrasing, the note explanations.
- **Accounts/config**: create `react/.env` from `.env.example` (site URL for link previews, Formspree ID, Plausible domain). The share image only works on LinkedIn/WhatsApp once `VITE_SITE_URL` is set.
- **Carried over**: phone number in the resume PDF and in git history (commit `ea275cf`); transparent nav overlapping content on mobile (visible over the Field Notes cards too); loose root files (`image*.png`, duplicate resume, `.vite/`); **nothing committed**: `react/` is still untracked.

## Key files (session 8)
- `react/src/router.jsx` — new: tiny router + `<Link>`.
- `react/src/pages/CaseStudy.jsx`, `Note.jsx`, `NotFound.jsx` — new pages, each exporting its CSS string.
- `react/src/sections/Extras.jsx` — new: Certifications, AboutExtras, SecretSmiley, Notes, Testimonials, QuickFacts, ResumeModal, CommandMenu, CommandHint, Toaster, `EXTRAS_CSS`.
- `react/src/components/Reveal.jsx` (moved out of Portfolio.jsx), `Todo.jsx`, `ScreenFrame.jsx` — new.
- `react/src/data/caseStudies.js`, `notes.js` — new data. `content.js` — `HERO_TAGLINE`, new `HERO_STATS`, `CERTIFICATIONS`, `OFF_THE_CLOCK`, `NOW`, `TESTIMONIALS`, `QUICK_FACTS`; `caseStudy` / `code` / `skills` on `PROJECTS`.
- `react/src/Portfolio.jsx` — route switch (`resolveRoute`, `Home`), route-aware Nav, skills "used in", shelf counter, Formspree form, `<picture>` images, combined `ALL_CSS`.
- `react/src/hooks/useActiveSection.js` (`resetKey`), `useLenis.js` (`scrollToTop`), `react/src/main.jsx` (Plausible).
- `react/index.html`, `vite.config.js`, `vercel.json`, `.env.example`, `.gitignore`.
- `react/public/` — `favicon.svg`, `apple-touch-icon.png`, `og-image.png`, `*.webp`, `_redirects`.

---

## Session 9 - Portfolio privacy and content updates (2026-11-01)

### Conversation log

- **User:** Asked how to start the web project and share its IP.
- **Assistant:** Identified the React/Vite app in `react/`; gave `npm install` (first run) and `npm run dev -- --host 0.0.0.0`. Reported the Wi-Fi LAN URL as `http://192.168.1.5:5173`, available to devices on the same network.
- **User:** Asked what still needed to be done on the website.
- **Assistant:** Listed remaining content and launch details: project screenshots, case-study/note copy, profile facts, copy review, environment settings, and public hosting.
- **User:** Requested removal of “What people say” and “Field Notes” for company privacy; clarified that Food Frenzy and Railway Object Detection are personal projects and the rest are company projects built by the user. Requested removing Odisha Tourism and filling work mode and notice period after asking.
- **Assistant:** Asked for work mode, notice period and case-study privacy preference while carrying out the independent edits.
- **User:** Answered: work mode “Open to any,” notice period “a week,” and anonymize company case studies.
- **Assistant:** Removed testimonials and Field Notes from the site and removed their route/data files; deleted Odisha Tourism; labeled company versus personal projects; anonymized company project and case-study names/details; set quick facts to “Open to any” and “1 week”; changed project count to six. Build was not run.
- **User:** Requested renaming Offline Gate Entry App to Online Gate Entry App, and changing its year and Weighment Integration App year to 2026.
- **Assistant:** Updated both names/years in `react/src/data/content.js`.
- **User:** Attached `image copy 4.png` and asked to remove or redesign the section.
- **Assistant:** Identified the About “Now” card's unfinished Learning prompt and redesigned it to show a single “Currently building” item, removing the “To add” placeholder.
- **User:** Asked to rename “An enterprise parking app with React Native” based on the resume.
- **Assistant:** Read `react/public/Bhavani_Sai_Resume.pdf` and used its project wording, “ERP Parking - React Native Mobile App (Android).”
- **User:** Clarified not to mention the current app name and to keep it private.
- **Assistant:** Changed the copy to “React Native 0.87 Android app for parking operations.”
- **User:** Asked to save this session chat in `Notes.md`.

### Current portfolio state from this session

- The About card shows “Currently building: React Native 0.87 Android app for parking operations”; it does not name the company app.
- Work mode is “Open to any”; notice period is “1 week.”
- Six projects remain: four anonymized company projects and two personal projects (Food Frenzy and Railway Object Detection). The company gate-entry project is titled “Online Gate Entry App” and the weighment project year is 2026; both company project years are 2026.
- “What people say,” Field Notes and note routes/data are removed. Odisha Tourism is removed. Company case studies use generic names and anonymized details.
- No build was run after these edits.
