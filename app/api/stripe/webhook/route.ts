import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { markPaidByCheckoutSession } from "@/lib/db";
import { sendPaymentReceivedEmail } from "@/lib/email";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const inquiry = await markPaidByCheckoutSession(session.id, {
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    });
    if (inquiry) {
      await sendPaymentReceivedEmail(inquiry, session.amount_total ?? inquiry.amount_cents);
    }
  }

  return NextResponse.json({ received: true });
}
