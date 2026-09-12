import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { findInquiryByRef, markAwaitingPayment } from "@/lib/db";
import { createCheckoutSessionForInquiry } from "@/lib/stripe";
import { sendPaymentLinkEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const ref = String(body.ref || "").trim();
  const amount = Number(body.amount);

  if (!ref) {
    return NextResponse.json({ ok: false, error: "Missing ref." }, { status: 400 });
  }
  if (!amount || amount <= 0) {
    return NextResponse.json({ ok: false, error: "Provide a positive amount in dollars." }, { status: 400 });
  }

  try {
    const inquiry = await findInquiryByRef(ref);
    if (!inquiry) {
      return NextResponse.json({ ok: false, error: `No inquiry found with reference ${ref}.` }, { status: 404 });
    }

    const amountCents = Math.round(amount * 100);
    const session = await createCheckoutSessionForInquiry(inquiry, amountCents);
    if (!session.url) {
      return NextResponse.json({ ok: false, error: "Stripe did not return a checkout URL." }, { status: 502 });
    }

    await markAwaitingPayment(inquiry.id, {
      stripeCheckoutSessionId: session.id,
      amountCents,
    });

    await sendPaymentLinkEmail(inquiry, session.url, amountCents);

    return NextResponse.json({
      ok: true,
      reference: inquiry.reference_code,
      guest: inquiry.name,
      email: inquiry.email,
      checkoutUrl: session.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
