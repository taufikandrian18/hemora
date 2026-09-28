import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "../../cms";

export const dynamic = "force-dynamic";

/**
 * Called by WordPress (hemora-content mu-plugin) after a property is saved, so edits show
 * up right away instead of after the 5-minute refresh. Requires the shared secret.
 *
 * Marks the CMS content stale ("max" = stale-while-revalidate) rather than purging pages:
 * the property routes are prerendered with dynamicParams = false, and purging them makes
 * Next.js answer 404 (NoFallbackError) instead of regenerating.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-hemora-secret") !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }

  revalidateTag(CONTENT_TAG, "max");
  return Response.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
