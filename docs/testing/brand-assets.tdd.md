# Brand Asset Update TDD Evidence

## Scope

Update the HEMORA selector page so the home intro headline and paragraph are removed, the visible brand lockup uses the supplied wordmark image, and the favicon uses the supplied emblem image.

## Red

Updated `tests/rendered-html.test.mjs` first. The initial RED run failed because:

- The rendered HTML still contained `Where the Land`, `Chooses You`, and the removed descriptive paragraph.
- `public/assets/hemora/hemora-logo.png` did not exist yet.
- The metadata still referenced `/favicon.svg`.

Command:

```bash
npm test
```

Result: failed as expected, 2 failing tests.

## Green

Implemented the change by generating web-ready PNG assets from the supplied files, replacing the text lockup with the wordmark image, removing the home headline and paragraph, and switching metadata icons to `/favicon.png`.

Validation commands:

```bash
npm test
npm run lint
```

Result:

- `npm test`: pass, 5 tests.
- `npm run lint`: pass.
- Browser check on `http://localhost:3002/`: pass, wordmark renders at `/assets/hemora/hemora-logo.png`, favicon links resolve to `/favicon.png`, removed copy is absent, and console error count is 0.

## Notes

The supplied images were large portrait PNGs. The header wordmark was cropped to `920x167` with transparent black background removal so it behaves as a usable logo in the top bar. The favicon was exported as a square `512x512` PNG.
