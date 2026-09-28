export const dynamic = "force-dynamic";

/** Liveness probe for Docker and the deploy pipeline. */
export function GET() {
  return Response.json({ status: "ok" }, { headers: { "cache-control": "no-store" } });
}
