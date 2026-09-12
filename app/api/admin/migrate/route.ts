import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

// Embedded rather than read from db/schema.sql — Vercel's serverless file
// tracing isn't guaranteed to bundle a file only touched via fs.readFileSync,
// and this only needs to stay in sync with schema.sql, not be its source of
// truth. Statements are idempotent (IF NOT EXISTS), so safe to re-run.
const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS itineraries (
    id BIGSERIAL PRIMARY KEY,
    reference_code TEXT NOT NULL UNIQUE REFERENCES inquiries (reference_code),
    guest_profile JSONB NOT NULL,
    days JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
];

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getSql();
    const ran: string[] = [];
    for (const statement of STATEMENTS) {
      await sql.query(statement);
      ran.push(statement.split("\n")[0].slice(0, 60));
    }
    return NextResponse.json({ ok: true, ran });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
