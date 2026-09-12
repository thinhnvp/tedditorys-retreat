import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { markPaidByCheckoutSession } from "@/lib/db";
import { sendPaymentReceivedEmail, sendPaymentFailedNotice } from "@/lib/email";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = new Stripe(secret);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // checkout.session.completed fires as soon as checkout finishes, which for
  // a delayed payment method (e.g. a bank debit) can be before the money
  // actually clears — payment_status still shows "unpaid" until then, and
  // the async_* events below fire once it resolves. Cards clear immediately,
  // so payment_status is already "paid" by the time completed fires for
  // those — this guard is a no-op for the common case.
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      const inquiry = await markPaidByCheckoutSession(session.id, {
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
      });
      // null means this session was already marked paid (a Stripe retry, or
      // both completed + async_payment_succeeded firing for the same
      // session) — skip so we don't send a duplicate receipt.
      if (inquiry) {
        await sendPaymentReceivedEmail(inquiry, session.amount_total ?? inquiry.amount_cents);
      }
    }
  } else if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const referenceCode = session.metadata?.referenceCode ?? session.id;
    await sendPaymentFailedNotice(referenceCode);
  }

  return NextResponse.json({ received: true });
}
