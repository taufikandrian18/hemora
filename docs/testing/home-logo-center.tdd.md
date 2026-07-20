# Home Logo Center TDD Evidence

## Scope

Move the HEMORA wordmark to the viewport center on the initial selector page only, while keeping Lereng Senja and Sriti Palu on the property-header template.

## Red

Added a regression test in `tests/rendered-html.test.mjs` before implementation:

- `page-home` must render the logo wrapper with `brand-lockup home-brand-center`.
- The CSS must place `.home-brand-center` at `top: 50svh` with `transform: translate(-50%, -50%)`.
- `page-lereng` and `page-sriti` must not render the home-only center class.

Command:

```bash
npm test
```

Result: failed as expected because the home logo still rendered as plain `brand-lockup`.

## Green

Implemented a `className` prop on `BrandLockup`, applied `home-brand-center` only on the initial page, and moved the center-positioning CSS to that class.

Validation commands:

```bash
npm test
npm run lint
```

Result:

- `npm test`: pass, 7 tests.
- `npm run lint`: pass.
- Browser check on `http://localhost:3002/`: pass. Home logo center delta was `0px` on both axes, the selector-card gap below the logo was `112px`, Lereng kept `selector-topbar property-topbar`, and console error count was 0.
