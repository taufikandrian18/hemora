# Property Page Template TDD Evidence

## Scope

Move the initial HEMORA logo back to top-center and rebuild the Lereng Senja and Sriti Palu page views using the attached hotel landing-page layout language. Keep the HEMORA brand color system and use only local property assets.

## Source Plan

The source plan was the attached `pasted-text.txt` UI reference. It was treated as visual guidance for layout, spacing, hierarchy, and states, not as code to paste.

## User Journeys

- As a visitor, I can return to the initial selector and see the HEMORA logo at the top center.
- As a visitor choosing Lereng Senja, I can enter a scrollable property page with hero, marquee, philosophy, rooms, facilities, experiences, quote, FAQ, and booking sections.
- As a visitor choosing Sriti Palu, I can enter the same attachment-derived layout with Sriti-specific content and assets.
- As the brand owner, the property views keep HEMORA colors and local assets instead of adopting the reference sketch palette or remote images.

## Red

Added and updated regression tests in `tests/rendered-html.test.mjs` before implementation:

- The home section must render `brand-lockup home-brand-top`, not the previous viewport-centered class.
- Lereng and Sriti sections must render `property-page` classes and the attachment-derived section classes.
- Both property pages must use local files from `public/assets/hemora`.
- The stylesheet must expose scrollable property pages and must not include the reference sketch color tokens or hardcoded reference colors.

Command:

```bash
npm test
```

Result: failed as expected. The logo still rendered `home-brand-center`, and the property views were still one-screen panels without the new sections.

## Green

Implemented a data-driven property template in `app/page.tsx`, reset the home brand lockup to `home-brand-top`, and replaced the old property-panel CSS with scrollable editorial page styles in `app/globals.css`.

Validation commands:

```bash
npm test
npm run lint
```

Result:

- `npm test`: pass, 8 tests.
- `npm run lint`: pass.

## Guarantees

| # | What is guaranteed | Test file or command | Test type | Result |
|---|--------------------|----------------------|-----------|--------|
| 1 | Initial logo is top-centered and no longer uses the viewport-centered class | `tests/rendered-html.test.mjs` | render integration | PASS |
| 2 | Lereng and Sriti render the attachment-derived property-page sections | `tests/rendered-html.test.mjs` | render integration | PASS |
| 3 | Property views use local HEMORA assets and do not reference Unsplash or Maison Aurèle content | `tests/rendered-html.test.mjs` | render integration | PASS |
| 4 | The CSS keeps HEMORA tokens and avoids the reference sketch color system | `tests/rendered-html.test.mjs` | render integration | PASS |
| 5 | The project still avoids `next/image` and added image libraries | `tests/rendered-html.test.mjs` | source assertion | PASS |

## Known Gaps

No browser visual QA was run for this change because the request did not explicitly ask for browser testing. The render tests and lint passed.
