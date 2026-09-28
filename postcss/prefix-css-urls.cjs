/**
 * Prefixes root-relative url(/assets/...) and url(/favicon...) references in CSS with
 * NEXT_PUBLIC_BASE_PATH when the site is served under a sub-path (e.g. /hemora).
 */
module.exports = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return {
    postcssPlugin: "prefix-css-urls",
    Declaration(decl) {
      if (basePath && decl.value.includes("url(")) {
        decl.value = decl.value.replace(/url\((["']?)\/(assets|favicon)/g, `url($1${basePath}/$2`);
      }
    },
  };
};
module.exports.postcss = true;
