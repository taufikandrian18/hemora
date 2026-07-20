# Hero Video Regression

## Source

Journeys were derived during this TDD run from the request to replace the
initial section with the attached video file.

## User Journeys

- As a visitor, I want the first HEMORA section to use the supplied video, so
  the page opens with the intended motion asset instead of the old split-image
  treatment.
- As a maintainer, I want the rendered HTML to prove the hero uses a direct MP4
  asset and no longer renders the split-image/fog scaffold.

## Task Report

| Task | Validation | Result | Evidence |
|---|---|---|---|
| Add a video-hero reproducer | `npm test` before implementation | RED | `uses the supplied video as the initial hero background` failed because the homepage still rendered `hero-panels` and no `<video>`. |
| Replace the split hero with the supplied MP4 | `npm test` after implementation | GREEN | 4 tests passed, including the video hero assertion and existing no-optimizer checks. |
| Optimize the attached video for web delivery | `ffprobe public/assets/hemora/hemora-hero.mp4` | PASS | Output is H.264, 1920x1080, 30fps, 15.53s, 5,990,736 bytes. |
| Check code style | `npm run lint` | PASS | ESLint completed with 0 errors. |
| Check running preview | `curl -I http://localhost:3002/` and `curl -I http://localhost:3002/assets/hemora/hemora-hero.mp4` | PASS | Homepage returned HTTP 200 and video asset returned HTTP 200 with `Content-Type: video/mp4`. |

## Coverage And Known Gaps

No coverage command is configured for this project. The feature is covered by
rendered HTML integration tests and a local preview smoke check.
