import Stripe from "stripe";
import type { Inquiry } from "./db";
import { getListing } from "./listings";

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (stripe) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Stripe is not configured — set STRIPE_SECRET_KEY in the environment.");
  }
  stripe = new Stripe(key);
  return stripe;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://retreat.tedditory.co";

export async function createCheckoutSessionForInquiry(
  inquiry: Inquiry,
  amountCents: number
): Promise<Stripe.Checkout.Session> {
  const listing = getListing(inquiry.listing_slug);
  const listingName = listing?.name ?? inquiry.listing_slug;

  const client = getStripe();
  return client.checkout.sessions.create({
    mode: "payment",
    customer_email: inquiry.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: {
            name: `${listingName} — ${inquiry.check_in} to ${inquiry.check_out}`,
            description: `Direct booking for ${inquiry.name} (ref ${inquiry.reference_code})`,
          },
        },
      },
    ],
    metadata: {
      inquiryId: String(inquiry.id),
      referenceCode: inquiry.reference_code,
      listingSlug: inquiry.listing_slug,
    },
    success_url: `${SITE_URL}/booking/success?ref=${inquiry.reference_code}`,
    cancel_url: `${SITE_URL}/booking/cancelled?ref=${inquiry.reference_code}`,
  });
}
