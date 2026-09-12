import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { findInquiryByRef, markAwaitingPayment } from "../lib/db";
import { createCheckoutSessionForInquiry } from "../lib/stripe";
import { sendPaymentLinkEmail } from "../lib/email";
import { getListing } from "../lib/listings";

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) out[match[1]] = match[2];
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const ref = args.ref;
  const amount = args.amount ? Number(args.amount) : NaN;

  if (!ref) {
    console.error("Usage: npm run inquiries:send-payment-link -- --ref=ABC123 --amount=1400");
    process.exit(1);
  }
  if (!amount || amount <= 0) {
    console.error("Provide a positive --amount in dollars, e.g. --amount=1400");
    process.exit(1);
  }

  const inquiry = await findInquiryByRef(ref);
  if (!inquiry) {
    console.error(`No inquiry found with reference ${ref}.`);
    process.exit(1);
  }

  const listing = getListing(inquiry.listing_slug);
  const amountCents = Math.round(amount * 100);

  console.log(
    `About to send a $${amount.toFixed(2)} payment link to ${inquiry.name} <${inquiry.email}> ` +
      `for ${listing?.name ?? inquiry.listing_slug} (${inquiry.check_in} to ${inquiry.check_out}).`
  );

  const session = await createCheckoutSessionForInquiry(inquiry, amountCents);
  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  await markAwaitingPayment(inquiry.id, {
    stripeCheckoutSessionId: session.id,
    amountCents,
  });

  await sendPaymentLinkEmail(inquiry, session.url, amountCents);

  console.log(`Sent. Checkout URL: ${session.url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
