import { notFound } from "next/navigation";
import { getProperty, propertySlugs } from "../property-data";
import { PropertyLandingPage } from "../property-pages";

// Every property/section is known at build time; anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return propertySlugs.map((property) => ({ property }));
}

export default async function PropertyRoute({ params }: { params: Promise<{ property: string }> }) {
  const { property: slug } = await params;
  const property = getProperty(slug);

  if (!property) {
    notFound();
  }

  return <PropertyLandingPage property={property} />;
}
