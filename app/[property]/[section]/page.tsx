import { notFound } from "next/navigation";
import { getProperty, getPropertySection, menuSections, propertySlugs } from "../../property-data";
import { PropertyMenuPage } from "../../property-pages";

export function generateStaticParams() {
  return propertySlugs.flatMap((property) => menuSections.map((section) => ({ property, section: section.slug })));
}

export default async function PropertySectionRoute({ params }: { params: Promise<{ property: string; section: string }> }) {
  const { property: slug, section: sectionSlug } = await params;
  const property = getProperty(slug);

  if (!property) {
    notFound();
  }

  const section = getPropertySection(property, sectionSlug);

  if (!section) {
    notFound();
  }

  return <PropertyMenuPage property={property} section={section} />;
}
