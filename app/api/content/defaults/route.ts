import { properties } from "../../../property-data";

export const dynamic = "force-static";

/** Built-in content, used once by `wp hemora seed` to pre-fill WordPress. */
export function GET() {
  return Response.json({ properties });
}
