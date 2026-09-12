import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { generateReferenceCode } from "./reference-code";

export type InquiryStatus = "new" | "contacted" | "awaiting_payment" | "paid" | "closed";

export type Inquiry = {
  id: number;
  reference_code: string;
  listing_slug: string;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  message: string | null;
  status: InquiryStatus;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_cents: number | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
};

/**
 * The Postgres wire protocol reports DATE/TIMESTAMPTZ columns in a form the
 * driver parses into JS Date objects rather than the plain strings the
 * `Inquiry` type declares — that declaration is a compile-time assertion
 * only, not something the driver honors at runtime. Normalize here, once,
 * so every caller can trust the type.
 */
function normalizeInquiry<T extends Record<string, unknown>>(row: T): T {
  const toDateString = (value: unknown): unknown => {
    if (!(value instanceof Date)) return value;
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const toIsoString = (value: unknown): unknown => (value instanceof Date ? value.toISOString() : value);
  return {
    ...row,
    check_in: toDateString(row.check_in),
    check_out: toDateString(row.check_out),
    created_at: toIsoString(row.created_at),
    updated_at: toIsoString(row.updated_at),
    paid_at: toIsoString(row.paid_at),
  };
}

let sql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (sql) return sql;
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "Database is not configured — set DATABASE_URL (or POSTGRES_URL) in the environment."
    );
  }
  sql = neon(connectionString);
  return sql;
}

export async function createInquiry(input: {
  listingSlug: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string | null;
  quotedAmountCents: number;
}): Promise<Inquiry> {
  const db = getSql();

  // Reference codes are short, so on the (very unlikely) chance of a
  // collision, retry a couple of times before giving up.
  for (let attempt = 0; attempt < 5; attempt++) {
    const referenceCode = generateReferenceCode();
    try {
      const rows = (await db`
        INSERT INTO inquiries
          (reference_code, listing_slug, name, email, phone, check_in, check_out, guests, message, amount_cents)
        VALUES
          (${referenceCode}, ${input.listingSlug}, ${input.name}, ${input.email}, ${input.phone},
           ${input.checkIn}, ${input.checkOut}, ${input.guests}, ${input.message ?? null}, ${input.quotedAmountCents})
        RETURNING *
      `) as Inquiry[];
      return normalizeInquiry(rows[0]);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("reference_code") && attempt < 4) continue;
      throw err;
    }
  }
  throw new Error("Could not generate a unique reference code — please retry.");
}

export async function findInquiryByRef(referenceCode: string): Promise<Inquiry | null> {
  const db = getSql();
  const rows = (await db`
    SELECT * FROM inquiries WHERE reference_code = ${referenceCode.toUpperCase()}
  `) as Inquiry[];
  return rows[0] ? normalizeInquiry(rows[0]) : null;
}

export async function searchInquiries(filter: {
  status?: InquiryStatus;
  listingSlug?: string;
  limit?: number;
}): Promise<Inquiry[]> {
  const db = getSql();
  const limit = filter.limit ?? 20;
  const rows = (await db`
    SELECT * FROM inquiries
    WHERE (${filter.status ?? null}::text IS NULL OR status = ${filter.status ?? null})
      AND (${filter.listingSlug ?? null}::text IS NULL OR listing_slug = ${filter.listingSlug ?? null})
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as Inquiry[];
  return rows.map(normalizeInquiry);
}

export async function markAwaitingPayment(
  id: number,
  data: { stripeCheckoutSessionId: string; amountCents: number }
): Promise<void> {
  const db = getSql();
  await db`
    UPDATE inquiries
    SET status = 'awaiting_payment',
        stripe_checkout_session_id = ${data.stripeCheckoutSessionId},
        amount_cents = ${data.amountCents},
        updated_at = now()
    WHERE id = ${id}
  `;
}

/**
 * The `status != 'paid'` guard makes this idempotent: Stripe retries
 * webhook deliveries, and a session can also fire both
 * checkout.session.completed and checkout.session.async_payment_succeeded.
 * Without the guard, a second call would re-stamp paid_at and the caller
 * would send a duplicate "payment received" email.
 */
export async function markPaidByCheckoutSession(
  stripeCheckoutSessionId: string,
  data: { stripePaymentIntentId: string | null }
): Promise<Inquiry | null> {
  const db = getSql();
  const rows = (await db`
    UPDATE inquiries
    SET status = 'paid',
        stripe_payment_intent_id = ${data.stripePaymentIntentId},
        paid_at = now(),
        updated_at = now()
    WHERE stripe_checkout_session_id = ${stripeCheckoutSessionId}
      AND status != 'paid'
    RETURNING *
  `) as Inquiry[];
  return rows[0] ? normalizeInquiry(rows[0]) : null;
}
