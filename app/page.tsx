import { getAllProperties } from "./cms";
import { HomeSelector } from "./property-pages";

// Refresh CMS content at least every 5 minutes; WordPress also triggers /api/revalidate on save.
export const revalidate = 300;

export default async function Home() {
  const collection = await getAllProperties();
  return <HomeSelector collection={collection} />;
}
