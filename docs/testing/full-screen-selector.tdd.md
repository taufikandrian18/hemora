# Full-Screen Property Selector TDD Evidence

## Scope

Rebuild the HEMORA entry experience from the attached HTML draft as a no-scroll, full-screen selector:

- Home view with the supplied HEMORA video asset as the overview background.
- Lereng Senja, Ciwidey property view using local HEMORA imagery.
- Sriti Palu property view using local HEMORA imagery.
- React state switching inside the existing Vinext/Next stack.

## Red

Added server-rendered tests in `tests/rendered-html.test.mjs` before implementation. The first run failed because the app still rendered the previous scrolling homepage, old navigation sections, and old hero class names.

Failing expectations covered:

- `page-home`, `page-lereng`, and `page-sriti` full-screen views.
- `selector-video` using `/assets/hemora/hemora-hero.mp4`.
- Direct local image assets instead of `next/image` optimization.
- React state controls for `lereng` and `sriti`.

## Green

Implemented `app/page.tsx` as a three-state selector and replaced the old scrolling CSS in `app/globals.css` with the fixed full-screen interaction layer.

Validation commands:

```bash
npm test
npm run lint
```

Result:

- `npm test`: pass, 4 tests.
- `npm run lint`: pass.
- Browser check on `http://localhost:3002/`: pass, zero console errors, desktop state switches from home to Lereng and Sriti.
- Mobile viewport check at `390x844`: pass, home and property content remain inside the viewport with body overflow hidden.

## Notes

The implementation intentionally uses direct `<img>` and `<video>` elements. The current Vinext worker environment does not expose Cloudflare `ASSETS.fetch` to the local image optimizer path, so `next/image` would reintroduce the asset fetch crash that this project already hit.
