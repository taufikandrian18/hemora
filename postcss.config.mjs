import { fileURLToPath } from "node:url";

// Absolute path: Turbopack does not resolve "./" plugin paths from the project root.
const prefixCssUrls = fileURLToPath(new URL("./postcss/prefix-css-urls.cjs", import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    [prefixCssUrls]: {},
  },
};

export default config;
