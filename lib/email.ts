import { Resend } from "resend";
import type { Inquiry } from "./db";
import { getListing } from "./listings";
import type { Quote } from "./pricing";
import { renderInquiryEmail, inquirySubject, type InquiryEmailData } from "./email-templates";

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

function toEmailData(inquiry: Inquiry, quote: Quote): InquiryEmailData {
  const listing = getListing(inquiry.listing_slug);
  return {
    guestName: inquiry.name,
    guestEmail: inquiry.email,
    guestPhone: inquiry.phone,
    listingName: listing?.name ?? inquiry.listing_slug,
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
    message: inquiry.message,
  };
}

/**
 * One email, guest as primary recipient and the host CC'd, so both parties
 * land in the same thread from the start — a reply-all (from either side,
 * automated follow-ups included) keeps the whole conversation together.
 */
export async function sendInquiryEmails(inquiry: Inquiry, quote: Quote): Promise<void> {
  const data = toEmailData(inquiry, quote);
  const client = getResend();
  const { html, text } = renderInquiryEmail(data);

  await client.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    cc: TO_EMAIL,
    subject: inquirySubject(data),
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
    cc: TO_EMAIL,
    subject: `Re: ${inquirySubject({ listingName, referenceCode: inquiry.reference_code })}`,
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
    subject: `Re: ${inquirySubject({ listingName, referenceCode: inquiry.reference_code })} — Payment received`,
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
