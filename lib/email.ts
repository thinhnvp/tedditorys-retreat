import { Resend } from "resend";
import type { Inquiry } from "./db";
import { getListing } from "./listings";
import type { Quote } from "./pricing";
import { renderInquiryConfirmationEmail } from "./email-templates";

let resend: Resend | null = null;

function getResend(): Resend {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Email is not configured — set RESEND_API_KEY in the environment.");
  }
  resend = new Resend(key);
  return resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "Tedditory Retreat <onboarding@resend.dev>";
const TO_EMAIL = process.env.TO_EMAIL || "ted@tedditory.co";

function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function money(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export async function sendInquiryEmails(inquiry: Inquiry, quote: Quote): Promise<void> {
  const listing = getListing(inquiry.listing_slug);
  const listingName = listing?.name ?? inquiry.listing_slug;
  const client = getResend();

  await client.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: inquiry.email,
    subject: `New inquiry: ${listingName} — ${inquiry.name}`,
    text: [
      `Reference: ${inquiry.reference_code}`,
      `Listing: ${listingName}`,
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Phone: ${inquiry.phone}`,
      `Dates: ${inquiry.check_in} to ${inquiry.check_out} (${quote.nights} nights)`,
      `Guests: ${inquiry.guests}`,
      `Quoted total: ${money(quote.total)} (monthly average ${money(quote.monthlyAverage)})`,
      quote.discountApplied ? `Weekly discount applied — effective rate ${money(quote.nightlyRate)}/night` : null,
      inquiry.message ? `Message: ${inquiry.message}` : null,
      "",
      "Reply to this email to reach the guest directly.",
      `When you're ready to collect payment, tell Claude Code: "send a payment link for ${inquiry.reference_code}, $<amount>".`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  const { html, text } = renderInquiryConfirmationEmail({
    guestName: inquiry.name,
    listingName,
    checkIn: inquiry.check_in,
    checkOut: inquiry.check_out,
    nights: quote.nights,
    guests: inquiry.guests,
    checkInTime: listing?.checkInTime ?? "3:00 PM",
    checkOutTime: listing?.checkOutTime ?? "11:00 AM",
    nightlyRate: quote.nightlyRate,
    guestSurchargePerNight: quote.guestSurcharge,
    cleaningFee: listing?.cleaningFee ?? 0,
    total: quote.total,
    // A "monthly average" doesn't mean anything for a capped-length stay.
    monthlyAverage: listing?.maxNights ? null : quote.monthlyAverage,
    referenceCode: inquiry.reference_code,
  });

  await client.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    subject: `We got your inquiry for ${listingName}`,
    html,
    text,
  });
}

export async function sendPaymentLinkEmail(
  inquiry: Inquiry,
  checkoutUrl: string,
  amountCents: number
): Promise<void> {
  const listing = getListing(inquiry.listing_slug);
  const listingName = listing?.name ?? inquiry.listing_slug;
  const client = getResend();

  await client.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    replyTo: TO_EMAIL,
    subject: `Complete your booking — ${listingName}`,
    text: [
      `Hi ${inquiry.name},`,
      "",
      `Here's a secure link to complete payment and lock in ${listingName} for ${inquiry.check_in} to ${inquiry.check_out}:`,
      checkoutUrl,
      "",
      `Amount due: ${formatMoney(amountCents)}`,
      "",
      `Reference: ${inquiry.reference_code}`,
      "",
      "— Tedditory Retreat",
    ].join("\n"),
  });
}

export async function sendPaymentReceivedEmail(
  inquiry: Inquiry,
  amountCents: number | null
): Promise<void> {
  const listing = getListing(inquiry.listing_slug);
  const listingName = listing?.name ?? inquiry.listing_slug;
  const client = getResend();

  await client.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `Payment received: ${inquiry.name} — ${listingName}`,
    text: [
      `Reference: ${inquiry.reference_code}`,
      `Listing: ${listingName}`,
      `Guest: ${inquiry.name} (${inquiry.email}, ${inquiry.phone})`,
      `Dates: ${inquiry.check_in} to ${inquiry.check_out}`,
      amountCents ? `Amount paid: ${formatMoney(amountCents)}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
