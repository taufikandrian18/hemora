# Property Routes Layout TDD

## Source

Journeys were derived from the user request and the attached HTML/Tailwind visual reference.

## User Journeys

- As a visitor, I can open Lereng Senja and Sriti Palu as separate property pages.
- As a visitor, I can open each property menu item as its own page: Stay, Dining, Wellness, and Journal.
- As the site owner, I can keep the HEMORA brand palette while using the supplied property assets.

## Evidence

| # | What is guaranteed | Test file or command | Test type | Result | Evidence |
|---|---|---|---|---|---|
| 1 | Home renders route links to `/lereng` and `/sriti` instead of hidden in-page property views | `tests/rendered-html.test.mjs` | integration | PASS | `npm test` |
| 2 | `/lereng` and `/sriti` render the reference-style nav, hero, offers, alternating blocks, quote, booking CTA, and footer | `tests/rendered-html.test.mjs` | integration | PASS | `npm test` |
| 3 | `/lereng/{stay,dining,wellness,journal}` and `/sriti/{stay,dining,wellness,journal}` each render as dedicated pages | `tests/rendered-html.test.mjs` | integration | PASS | `npm test` |
| 4 | Pages use local HEMORA assets and preserve existing forest, ivory, and gold tokens | `tests/rendered-html.test.mjs` | integration | PASS | `npm test` |
| 5 | Property and menu page navs use an accessible icon-only back link instead of visible `Overview` text | `tests/rendered-html.test.mjs` | integration | PASS | `npm test` |
| 6 | Property and menu page navs stay transparent, include one nav `Reserve` CTA, and do not render the old reserve summary bar | `tests/rendered-html.test.mjs` | integration | PASS | `npm test` |
| 7 | Property landing and menu pages render the icon-only floating WhatsApp widget | `tests/rendered-html.test.mjs` | integration | PASS | `npm test` |
| 8 | Mobile property nav hides the inline Stay/Dining/Wellness/Journal links and exposes them through a hamburger disclosure | `tests/rendered-html.test.mjs` | integration | PASS | `npm test` |

## RED/GREEN

- RED: `npm test` failed because `/lereng`, `/sriti`, and menu routes returned 404 and `app/property-pages.tsx` did not exist.
- GREEN: `npm test` passed with 5/5 tests after adding the route pages, shared components, property data, CSS, and local assets.
- RED: `npm test` failed after adding the icon-only nav assertion because the property nav still rendered visible `Overview` text.
- GREEN: `npm test` passed with 5/5 tests after replacing the text link with a back-arrow link and tightening the nav grid.
- RED: `npm test` failed after adding transparent-nav, removed nav CTA, and WhatsApp pill assertions because the nav still had the `Reserve` link and the widget was still an arrow square.
- GREEN: `npm test` passed with 5/5 tests after removing the nav CTA, making the property nav transparent, and reusing the WhatsApp pill on landing and menu pages.
- RED: `npm test` failed after requiring the transparent nav to include `Reserve`, removing the reserve summary bar, and making WhatsApp icon-only.
- GREEN: `npm test` passed with 5/5 tests after moving `Reserve` into the transparent nav, deleting the reserve bar, and replacing the text WhatsApp badge with an SVG mark.
- RED: `npm test` failed after requiring desktop and mobile nav paths because the property nav only rendered inline menu links.
- GREEN: `npm test` passed with 5/5 tests after adding the native hamburger disclosure and mobile CSS rules.
- Lint: `npm run lint` passed after converting internal navigation to `next/link`.
- Lint: `npm run lint` passed after the transparent-nav and WhatsApp widget update.
- Lint: `npm run lint` passed after the reserve-bar removal and icon-only widget update.
- Lint: `npm run lint` passed after the mobile hamburger update.

## Known Gaps

No browser screenshot QA was requested. The running local server returned 200 for `/`, `/lereng`, `/sriti`, `/lereng/stay`, and `/sriti/journal`.
