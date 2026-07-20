# Property Scroll Snap TDD Evidence

## Scope

Make Lereng Senja and Sriti Palu property pages use a transparent menu, add weighted scroll snapping between major sections, reduce hero height, and clean up text overflow.

## Red

Added a regression test in `tests/rendered-html.test.mjs` before implementation:

- Property pages must use `scroll-snap-type: y mandatory`.
- Major property sections must render `property-snap-section`.
- The property nav must use a transparent background and no backdrop filter.
- Property hero and hero content must use a smaller `clamp(32rem, 78svh, 42rem)` height.
- Property text must have overflow guards and balanced headings.

Command:

```bash
npm test
```

Result: failed as expected because the property page did not yet have snap behavior and still used the old hero sizing.

## Green

Implemented the transparent nav, snap-section classes, reduced hero sizing, smaller hero/stat typography, and overflow-safe text rules.

Validation commands:

```bash
npm test
npm run lint
```

Result:

- `npm test`: pass, 9 tests.
- `npm run lint`: pass.

## Browser Check

Live check on `http://localhost:3002/` passed:

- Lereng Senja nav background: transparent; backdrop filter: none.
- Sriti Palu nav background: transparent; backdrop filter: none.
- Both property pages report `scroll-snap-type: y mandatory`.
- Main property sections report `scroll-snap-align: start` and `scroll-snap-stop: always`.
- Hero height measured at about `0.82` of the viewport on both property pages.
- Measured text overflow list was empty for both property pages.
- Browser console error count was 0.

## 2026-07-15 Follow-up

The next pass tightened the behavior requested after hands-on review:

- Sections `01 — Philosophy`, `02 — Rooms`, `03 — Facilities`, `04 — Experiences`, and `05 — Before you arrive` now render as `property-full-panel` sections with `min-height: 100svh`.
- The unnumbered guest quote is no longer a snap stop, so scrolling from `04 — Experiences` continues toward `05 — Before you arrive` instead of pausing on an intermediate short panel.
- The property menu is still transparent, but now uses a negative bottom margin tied to `--property-nav-height` so the hero sits behind the menu instead of revealing a solid page-background strip at scroll top.
- Property pages use `overscroll-behavior-y: contain` to reduce top-edge overscroll leakage.
- Room, facility, experience, and FAQ spacing/image proportions were tightened so the numbered sections fit more cleanly as snap panels.

Validation commands:

```bash
npm test
npm run lint
curl -I --max-time 10 http://localhost:3003/
```

Result:

- `npm test`: pass, 9 tests.
- `npm run lint`: pass.
- Local preview responded with HTTP 200 on `http://localhost:3003/`.

Visual browser automation could not be completed in this environment because the Chrome Playwright extension was missing and the installed Playwright package had no browser executable available.

## 2026-07-15 Panel Completion And Responsive Pass

Follow-up request covered four additions:

- Treat the running banner as part of `01 — Philosophy`, so that the marquee and philosophy copy share one full viewport snap panel.
- Make `Guest note` and `06 — Reserve` full viewport snap panels.
- Narrow `02 — Rooms` and `04 — Experiences` so the content reads as a cleaner editorial composition.
- Add a left-corner chat widget on Lereng Senja and Sriti Palu, with tablet/mobile responsive safeguards.

RED command:

```bash
npm test
```

Result: failed as expected because the banner was still outside the philosophy panel, guest note/reserve were not both full panels, the chat widget did not exist, and the new responsive/layout CSS guarantees were missing.

GREEN validation commands:

```bash
npm test
npm run lint
curl -I --max-time 10 http://localhost:3004/
```

Result:

- `npm test`: pass, 9 tests.
- `npm run lint`: pass.
- Local preview responded with HTTP 200 on `http://localhost:3004/`.

Responsive note: desktop keeps mandatory snap; tablet and mobile switch to proximity snapping to prevent tall form, FAQ, and card content from trapping scroll or clipping content.

## 2026-07-15 Hero And Chat Simplification

Follow-up request:

- Make Lereng Senja and Sriti Palu hero sections true full viewport panels now that the running banner belongs to `01 — Philosophy`.
- Keep the running banner out of the hero panel.
- Simplify the HEMORA chat widget to an icon-only fixed control in the bottom-right corner.

RED command:

```bash
npm test
```

Result: failed as expected because the hero still used the older `clamp(32rem, 78svh, 42rem)` height and the chat widget still expected a left-corner text label.

GREEN validation commands:

```bash
npm test
npm run lint
curl -I --max-time 10 http://localhost:3005/
```

Result:

- `npm test`: pass, 9 tests.
- `npm run lint`: pass.
- Local preview responded with HTTP 200 on `http://localhost:3005/`.

## 2026-07-15 Room Selector Removal And Global Chat

Follow-up request:

- Remove the thumbnail room selector component shown in the attached screenshot from `02 — Rooms` on Lereng Senja and Sriti Palu.
- Make the HEMORA chat widget a single fixed shell-level control so it follows the active property page instead of being duplicated inside each scrollable page.

RED command:

```bash
npm test
```

Result: failed as expected because `.room-tabs` / `.room-tab` CSS and markup still existed.

GREEN validation commands:

```bash
npm test
npm run lint
curl -I --max-time 10 http://localhost:3005/
```

Result:

- `npm test`: pass, 9 tests.
- `npm run lint`: pass.
- Local preview responded with HTTP 200 on `http://localhost:3005/`.
