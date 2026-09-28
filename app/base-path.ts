/**
 * URL prefix the site is served under (e.g. "/hemora"), set at build time via
 * NEXT_PUBLIC_BASE_PATH. Next.js prefixes <Link> and its own build files itself;
 * plain asset URLs (<img>, <video>, favicon) go through `asset()`.
 */
export const basePath: string = (() => {
  try {
    return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  } catch {
    return "";
  }
})();

export function asset(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? `${basePath}${path}` : path;
}

/** Deep-copies data, prefixing every "/assets/..." string with the base path. */
export function withAssetBase<T>(value: T): T {
  if (!basePath) return value;
  if (typeof value === "string") return (value.startsWith("/assets/") ? asset(value) : value) as T;
  if (Array.isArray(value)) return value.map((item) => withAssetBase(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withAssetBase(item)])) as T;
  }
  return value;
}
