import { getAllProperties } from "./cms";
import { NotFoundPage } from "./property-pages";

export default async function NotFound() {
  const collection = await getAllProperties();
  return <NotFoundPage collection={collection} />;
}
