import { notFound } from "next/navigation";
import { getAllProperties } from "../../cms";
import { getPropertySection, menuSections, propertySlugs, type PropertySlug } from "../../property-data";
import { PropertyMenuPage } from "../../property-pages";

// Every property/section is known at build time; anything else is a real 404.
export const dynamicParams = false;
// Refresh CMS content at least every 5 minutes; WordPress also triggers /api/revalidate on save.
export const revalidate = 300;

export function generateStaticParams() {
  return propertySlugs.flatMap((property) => menuSections.map((section) => ({ property, section: section.slug })));
}

export default async function PropertySectionRoute({ params }: { params: Promise<{ property: string; section: string }> }) {
  const { property: slug, section: sectionSlug } = await params;
  if (!propertySlugs.includes(slug as PropertySlug)) {
    notFound();
  }

  const collection = await getAllProperties();
  const property = collection[slug as PropertySlug];
  const section = getPropertySection(property, sectionSlug);

  if (!section) {
    notFound();
  }

  return <PropertyMenuPage property={property} section={section} collection={collection} />;
}
