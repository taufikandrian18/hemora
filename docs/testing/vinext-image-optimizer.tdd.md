# Vinext Image Optimizer Regression

## Source

Journeys were derived during this TDD run from the browser overlay:
`Cannot read properties of undefined (reading 'fetch')` in `worker/index.ts`
while handling `/_vinext/image`.

## User Journeys

- As a visitor, I want the HEMORA homepage images to load without opening the
  Vinext optimizer endpoint, so the page does not show a runtime error overlay.
- As a maintainer, I want rendered HTML to prove local HEMORA images are served
  directly from `/assets/hemora`, so future edits do not reintroduce the broken
  path.

## Task Report

| Task | Validation | Result | Evidence |
|---|---|---|---|
| Add a reproducer for optimizer-routed local images | `npm test` before the fix | RED | `serves local HEMORA images directly...` and `keeps static image usage...` failed because rendered HTML contained `/_vinext/image?...` and source imported `next/image`. |
| Serve local HEMORA images directly | `npm test` after the fix | GREEN | 3 tests passed; rendered HTML contains `/assets/hemora/...` and no `/_vinext/image?`. |
| Check code style | `npm run lint` | PASS | ESLint completed with 0 errors. |
| Check running preview | `curl -I http://localhost:3002/` and direct asset checks | PASS | Homepage returned HTTP 200, `lereng-corridor.jpg` returned HTTP 200, scan reported `no-optimizer-url` and `direct-assets-present`. |

## Coverage And Known Gaps

No coverage command is configured for this project. The regression is covered by
rendered HTML integration tests and a live preview smoke check.
