import { notFound } from "next/navigation";
import { getAllProperties } from "../cms";
import { propertySlugs, type PropertySlug } from "../property-data";
import { PropertyLandingPage } from "../property-pages";

// Every property/section is known at build time; anything else is a real 404.
export const dynamicParams = false;
// Refresh CMS content at least every 5 minutes; WordPress also triggers /api/revalidate on save.
export const revalidate = 300;

export function generateStaticParams() {
  return propertySlugs.map((property) => ({ property }));
}

export default async function PropertyRoute({ params }: { params: Promise<{ property: string }> }) {
  const { property: slug } = await params;
  if (!propertySlugs.includes(slug as PropertySlug)) {
    notFound();
  }

  const collection = await getAllProperties();
  const property = collection[slug as PropertySlug];

  return <PropertyLandingPage property={property} collection={collection} />;
}
