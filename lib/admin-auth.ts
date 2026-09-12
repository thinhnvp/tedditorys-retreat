import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/** Protects the /api/admin/* routes so the CLI scripts can drive Stripe/DB
 *  actions over HTTPS without ever needing the real secrets locally. */
export function isAuthorized(req: NextRequest): boolean {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return false;

  const header = req.headers.get("authorization") || "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (provided.length !== token.length) return false;

  return timingSafeEqual(Buffer.from(provided), Buffer.from(token));
}
