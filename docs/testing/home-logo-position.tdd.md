# Home Logo Position TDD Evidence

## Scope

Move the HEMORA wordmark to the top center on the initial page only, while keeping the property pages on their existing property-header layout.

## Red

Added a regression test in `tests/rendered-html.test.mjs` before implementation:

- `page-home` must render `selector-topbar home-topbar`.
- `page-lereng` and `page-sriti` must render `selector-topbar property-topbar`.
- Property sections must not receive the home-only header class.

Command:

```bash
npm test
```

Result: failed as expected because the home header still rendered only `selector-topbar`.

## Green

Implemented page-specific header classes in `app/page.tsx` and centered only `.home-topbar .brand-lockup` in `app/globals.css`.

Validation commands:

```bash
npm test
npm run lint
```

Result:

- `npm test`: pass, 6 tests.
- `npm run lint`: pass.
- Browser check on `http://localhost:3002/`: pass. Home logo center delta was `0px`; Lereng used `selector-topbar property-topbar` with the logo positioned on the right; console error count was 0.
