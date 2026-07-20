# Home Content Position and Favicon TDD Evidence

## Scope

Move the initial page selector content lower, close above the `Choose your escape` cue, and replace the favicon with the supplied `hem ra(2).png` source.

## Red

Updated `tests/rendered-html.test.mjs` before implementation:

- The favicon must match the deterministic `512x512` PNG generated from the new source image.
- `page-home` must render `selector-content home-selector-content`.
- Property pages must not receive the home-only content placement class.
- CSS must define the lower home-only placement.

Command:

```bash
npm test
```

Result: failed as expected because the previous favicon hash was still present and the home content still rendered as plain `selector-content`.

## Green

Implemented the home-only content placement class in `app/page.tsx`, added the lower positioning rules in `app/globals.css`, and regenerated `public/favicon.png` from `/Users/taufikandrian/Downloads/hem ra(2).png`.

Validation commands:

```bash
npm test
npm run lint
```

Result:

- `npm test`: pass, 7 tests.
- `npm run lint`: pass.
- Browser check on `http://localhost:3002/`: pass. The selector actions sat 17px above `Choose your escape`, `/favicon.png` was linked, body overflow stayed hidden, and console error count was 0.
