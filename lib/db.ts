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
      return rows[0];
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
  return rows[0] ?? null;
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
  return rows;
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
    RETURNING *
  `) as Inquiry[];
  return rows[0] ?? null;
}
