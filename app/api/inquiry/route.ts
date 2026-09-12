import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/db";
import { sendInquiryEmails } from "@/lib/email";
import { getListing } from "@/lib/listings";
import { calcDirectQuote, nightsBetween, nightsRangeError } from "@/lib/pricing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_SUBMIT_MS = 1500;

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  // Honeypot — real visitors never fill this hidden field in.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true }); // pretend success, drop silently
  }

  const renderedAt = Number(body.renderedAt);
  if (!renderedAt || Date.now() - renderedAt < MIN_SUBMIT_MS) {
    return badRequest("Please try submitting again.");
  }

  const listingSlug = String(body.listingSlug || "");
  const listing = getListing(listingSlug);
  if (!listing) return badRequest("Unknown listing.");

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const checkIn = String(body.checkIn || "");
  const checkOut = String(body.checkOut || "");
  const guests = Number(body.guests);
  const message = body.message ? String(body.message).trim().slice(0, 2000) : null;

  if (!name || name.length > 200) return badRequest("Please enter your name.");
  if (!EMAIL_RE.test(email)) return badRequest("Please enter a valid email address.");
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return badRequest("Please enter a valid phone number, including area code.");
  }
  if (!checkIn || !checkOut || Number.isNaN(Date.parse(checkIn)) || Number.isNaN(Date.parse(checkOut))) {
    return badRequest("Please enter valid check-in and check-out dates.");
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    return badRequest("Check-out date must be after check-in date.");
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > listing.maxGuests) {
    return badRequest(`This listing allows a maximum of ${listing.maxGuests} guest(s).`);
  }

  const nights = nightsBetween(checkIn, checkOut);
  const rangeError = nightsRangeError(listing, nights);
  if (rangeError) return badRequest(rangeError);

  // Computed server-side (never trust a client-submitted price) so the
  // amount included in the inquiry email is authoritative.
  const quote = calcDirectQuote(listing, nights, guests);
  const quotedAmountCents = Math.round(quote.total * 100);

  try {
    const inquiry = await createInquiry({
      listingSlug,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      message,
      quotedAmountCents,
    });

    await sendInquiryEmails(inquiry, quote);

    return NextResponse.json({ ok: true, reference: inquiry.reference_code });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
