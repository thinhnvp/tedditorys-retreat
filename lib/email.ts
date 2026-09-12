import { Resend } from "resend";
import type { Inquiry } from "./db";
import { getListing } from "./listings";
import type { Quote } from "./pricing";
import {
  renderInquiryEmail,
  inquirySubject,
  renderPaymentLinkEmail,
  renderPaymentReceivedEmail,
  type InquiryEmailData,
  type PaymentLinkEmailData,
  type PaymentReceivedEmailData,
} from "./email-templates";

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

  const data: PaymentLinkEmailData = {
    guestName: inquiry.name,
    listingName,
    checkIn: inquiry.check_in,
    checkOut: inquiry.check_out,
    checkInTime: listing?.checkInTime ?? "3:00 PM",
    checkOutTime: listing?.checkOutTime ?? "11:00 AM",
    guests: inquiry.guests,
    amountCents,
    checkoutUrl,
    referenceCode: inquiry.reference_code,
  };
  const { html, text } = renderPaymentLinkEmail(data);

  await client.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    cc: TO_EMAIL,
    subject: `Re: ${inquirySubject({ listingName, referenceCode: inquiry.reference_code })}`,
    html,
    text,
  });
}

/**
 * Sent once the webhook confirms payment. Guest is the primary recipient
 * (host CC'd), same as the inquiry and payment-link emails, so the whole
 * conversation — automated and manually-typed replies alike — stays in one
 * reply-all thread.
 */
export async function sendPaymentReceivedEmail(
  inquiry: Inquiry,
  amountCents: number | null
): Promise<void> {
  const listing = getListing(inquiry.listing_slug);
  const listingName = listing?.name ?? inquiry.listing_slug;
  const client = getResend();

  const data: PaymentReceivedEmailData = {
    guestName: inquiry.name,
    listingName,
    checkIn: inquiry.check_in,
    checkOut: inquiry.check_out,
    checkInTime: listing?.checkInTime ?? "3:00 PM",
    checkOutTime: listing?.checkOutTime ?? "11:00 AM",
    guests: inquiry.guests,
    amountCents: amountCents ?? inquiry.amount_cents ?? 0,
    referenceCode: inquiry.reference_code,
  };
  const { html, text } = renderPaymentReceivedEmail(data);

  await client.emails.send({
    from: FROM_EMAIL,
    to: inquiry.email,
    cc: TO_EMAIL,
    subject: `Re: ${inquirySubject({ listingName, referenceCode: inquiry.reference_code })} — Payment received`,
    html,
    text,
  });
}

/** Internal, host-only alert — a delayed payment method failed to clear. */
export async function sendPaymentFailedNotice(referenceCode: string): Promise<void> {
  const client = getResend();
  await client.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `Action needed — payment failed (ref ${referenceCode})`,
    text: [
      `The payment attempt for inquiry ${referenceCode} did not clear.`,
      "That checkout link is now unusable — send a new one if the guest still wants to book.",
    ].join("\n"),
  });
}
