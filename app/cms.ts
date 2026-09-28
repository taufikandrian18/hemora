/**
 * Content source: the headless WordPress CMS (wp-admin → Properties), with the built-in
 * content in ./property-data.ts as the fallback for every field. If WordPress is not
 * configured (local dev, tests, CI builds) or unreachable, the built-in content is used.
 *
 * WordPress field names mirror PropertyData (see deploy/wordpress/mu-plugins/hemora-content.php).
 */
import { unstable_cache } from "next/cache";
import { menuSections, properties as builtIn, type PropertyData, type PropertySection, type PropertySlug } from "./property-data";

export const CONTENT_TAG = "hemora-content";
export const CONTENT_REVALIDATE_SECONDS = 300;

type Fields = Record<string, unknown>;

const textKeys = [
  "title",
  "shortTitle",
  "location",
  "tone",
  "selectorLine",
  "heroKicker",
  "heroTitle",
  "heroEmphasis",
  "intro",
  "primaryAction",
  "heroImage",
  "heroVideo",
  "heroPoster",
  "heroAlt",
  "philosophyLabel",
  "philosophyTitle",
  "philosophyLead",
  "philosophyBody",
  "offersTitle",
  "offersIntro",
  "quote",
  "quoteSource",
  "bookingTitle",
  "bookingLead",
  "bookingImage",
  "bookingAlt",
  "address",
  "email",
  "phone",
] as const satisfies readonly (keyof PropertyData)[];

function fields(value: unknown): Fields {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Fields) : {};
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function lines(value: unknown, fallback: string[]) {
  if (typeof value !== "string") return fallback;
  const list = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return list.length ? list : fallback;
}

function mergeSection(base: PropertySection, cms: Fields): PropertySection {
  return {
    ...base,
    label: text(cms.label, base.label),
    eyebrow: text(cms.eyebrow, base.eyebrow),
    title: text(cms.title, base.title),
    body: text(cms.body, base.body),
    secondary: text(cms.secondary, base.secondary ?? "") || undefined,
    image: text(cms.image, base.image),
    alt: text(cms.alt, base.alt),
    caption: text(cms.caption, base.caption),
    meta: text(cms.meta, base.meta),
    details: base.details.map((detail, index) => {
      const item = fields(cms[`detail_${index + 1}`]);
      return {
        title: text(item.title, detail.title),
        body: text(item.body, detail.body),
        image: text(item.image, detail.image ?? "") || undefined,
        alt: text(item.alt, detail.alt ?? "") || undefined,
      };
    }),
  };
}

export function mergeProperty(base: PropertyData, cms: Fields): PropertyData {
  const merged: PropertyData = { ...base };
  for (const key of textKeys) {
    merged[key] = text(cms[key], base[key]);
  }

  merged.wordmark = lines(cms.wordmark, base.wordmark);
  merged.marquee = lines(cms.marquee, base.marquee);
  merged.bookingPropertyId = text(cms.bookingPropertyId, base.bookingPropertyId ?? "") || null;

  const stats = fields(cms.stats);
  merged.stats = base.stats.map((stat, index) => {
    const item = fields(stats[`stat_${index + 1}`]);
    return { value: text(item.value, stat.value), label: text(item.label, stat.label) };
  });

  const offers = fields(cms.offers);
  merged.offers = base.offers.map((offer, index) => {
    const item = fields(offers[`offer_${index + 1}`]);
    return {
      name: text(item.name, offer.name),
      meta: text(item.meta, offer.meta),
      rate: text(item.rate, offer.rate),
      description: text(item.description, offer.description),
      image: text(item.image, offer.image),
      alt: text(item.alt, offer.alt),
    };
  });

  merged.sections = { ...base.sections };
  for (const { slug } of menuSections) {
    merged.sections[slug] = mergeSection(base.sections[slug], fields(cms[`section_${slug}`]));
  }

  return merged;
}

async function loadAllProperties(): Promise<Record<PropertySlug, PropertyData>> {
  const api = process.env.WP_API_URL;
  if (!api) return builtIn;

  const url = `${api.replace(/\/$/, "")}/index.php?rest_route=/wp/v2/hemora-properties&acf_format=standard&per_page=20&_fields=slug,acf`;

  try {
    const response = await fetch(url, {
      next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error(`WordPress responded ${response.status}`);

    const items = (await response.json()) as { slug?: string; acf?: unknown }[];
    const result = { ...builtIn };
    for (const item of Array.isArray(items) ? items : []) {
      if (item.slug && item.slug in builtIn) {
        const slug = item.slug as PropertySlug;
        result[slug] = mergeProperty(builtIn[slug], fields(item.acf));
      }
    }
    return result;
  } catch (error) {
    console.error("[cms] Using built-in content:", error instanceof Error ? error.message : error);
    return builtIn;
  }
}

/**
 * Both properties, with WordPress content layered over the built-in content.
 * Cached under CONTENT_TAG so that every page using it carries the tag, even pages
 * prerendered at build time without WordPress; POST /api/revalidate then marks exactly
 * those pages stale and the next visit regenerates them from WordPress.
 */
export const getAllProperties = unstable_cache(loadAllProperties, [CONTENT_TAG], {
  tags: [CONTENT_TAG],
  revalidate: CONTENT_REVALIDATE_SECONDS,
});
