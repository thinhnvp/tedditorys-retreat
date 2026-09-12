"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Listing } from "@/lib/listings";
import { COUNTRY_CODES } from "@/lib/country-codes";
import {
  GUEST_SURCHARGE_PER_NIGHT,
  airbnbUrlWithDates,
  calcAirbnbEstimate,
  calcDirectQuote,
  nightsBetween,
  nightsRangeError,
} from "@/lib/pricing";

type Status = { type: "idle" } | { type: "submitting" } | { type: "ok"; reference: string } | { type: "err"; message: string };

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function defaultStayNights(listing: Listing): number {
  if (listing.minNights || listing.maxNights) {
    const lo = listing.minNights ?? 1;
    const hi = listing.maxNights ?? lo;
    return Math.min(Math.max(listing.weeklyDiscountMinNights ?? lo, lo), hi);
  }
  return 30;
}

export default function BookingSection({ listing }: { listing: Listing }) {
  const [checkIn, setCheckIn] = useState(todayISO);
  const [checkOut, setCheckOut] = useState(() => addDaysISO(todayISO(), defaultStayNights(listing)));
  const [guests, setGuests] = useState(1);
  const [phoneCountry, setPhoneCountry] = useState("United States");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [renderedAt] = useState(() => Date.now());

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const quote = useMemo(() => calcDirectQuote(listing, nights, guests), [listing, nights, guests]);
  const airbnbEstimate = useMemo(() => calcAirbnbEstimate(listing, nights, guests), [listing, nights, guests]);
  const airbnbExtra = Math.max(Math.round(airbnbEstimate - quote.total), 0);
  const airbnbUrl = useMemo(
    () => airbnbUrlWithDates(listing, checkIn, checkOut, guests),
    [listing, checkIn, checkOut, guests]
  );
  const stayError = nightsRangeError(listing, nights);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stayError) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const dialCode = COUNTRY_CODES.find((c) => c.name === phoneCountry)?.code ?? "+1";

    setStatus({ type: "submitting" });

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingSlug: listing.slug,
          name: data.get("name"),
          email: data.get("email"),
          phone: `${dialCode} ${phoneNumber}`.trim(),
          checkIn,
          checkOut,
          guests,
          message: data.get("message"),
          company: data.get("company"),
          renderedAt,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus({ type: "err", message: json.error || "Something went wrong. Please try again." });
        return;
      }
      setStatus({ type: "ok", reference: json.reference });
      form.reset();
      setPhoneNumber("");
    } catch {
      setStatus({ type: "err", message: "Something went wrong. Please try again." });
    }
  }

  return (
    <>
      <div className="listing-body reveal">
        <h2 className="h-sm">About this room</h2>
        <p>{listing.description}</p>

        {listing.curatedExperience && (
          <>
            <h2 className="h-sm">What&apos;s included</h2>
            <ul className="rules-list">
              {listing.curatedExperience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}

        <h2 className="h-sm">What this place offers</h2>
        <ul className="amenity-grid">
          {listing.amenities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <h2 className="h-sm">The neighborhood</h2>
        <p>{listing.neighborhood}</p>

        <h2 className="h-sm">House rules</h2>
        <ul className="rules-list">
          <li>{listing.checkInTime.includes("–") ? `Check-in: ${listing.checkInTime}` : `Check-in after ${listing.checkInTime}`}</li>
          <li>Check-out by {listing.checkOutTime}</li>
          {listing.houseRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>

        <h2 className="h-sm">Two ways to book</h2>
        <p>
          Book directly with us — payment in full, arranged by email. Or book through Airbnb, which includes
          their service fee and handles payment on their platform.
        </p>
        <div className="compare">
          <div className="compare-card direct">
            <div className="tag">Book direct</div>
            <div className="price">
              {money(quote.total)}
              <span> total</span>
            </div>
            <ul>
              <li>No management platform fee</li>
              <li>Full stay paid upfront (secure card checkout)</li>
              <li>Arranged directly, by email</li>
            </ul>
          </div>
          <div className="compare-card airbnb">
            <div className="tag">Book on Airbnb</div>
            <div className="price">
              {money(quote.total)} + {money(airbnbExtra)}
              <span> estimate</span>
            </div>
            <ul>
              <li>Airbnb handles monthly payments</li>
              <li>Airbnb&apos;s standard cancellation &amp; support</li>
              <li>Familiar checkout if you already book there</li>
            </ul>
            <a href={airbnbUrl} target="_blank" rel="noopener noreferrer" className="compare-link">
              See real quote on Airbnb ↗
            </a>
          </div>
        </div>
      </div>

      <div className="sidebar-card reveal">
        <h3>Check dates &amp; inquire</h3>
        <p className="sub">
          See your price instantly, then reach out directly to reserve your stay.
          {listing.inquiryOnly && " This stay is arranged individually, so availability is confirmed by inquiry."}
        </p>

        <form className="inquiry-form" onSubmit={onSubmit}>
          <input type="text" name="company" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="field">
            <div className="date-range">
              <div className="date-cell">
                <label htmlFor="checkIn">Move in</label>
                <input
                  id="checkIn"
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="date-cell">
                <label htmlFor="checkOut">Move out</label>
                <input
                  id="checkOut"
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            {(listing.minNights || listing.maxNights) && (
              <p className="field-hint">
                {listing.minNights && listing.maxNights
                  ? `${listing.minNights}–${listing.maxNights} night stays`
                  : listing.minNights
                    ? `${plural(listing.minNights, "night")} minimum`
                    : `${plural(listing.maxNights ?? 0, "night")} maximum`}
                {listing.weeklyDiscountPercent &&
                  listing.weeklyDiscountMinNights &&
                  ` · ${listing.weeklyDiscountPercent}% off ${listing.weeklyDiscountMinNights}+ nights`}
              </p>
            )}
            {stayError && <p className="field-error">{stayError}</p>}
          </div>

          <div className="field">
            <label htmlFor="guests">
              Guests <span className="hint">(max {listing.maxGuests})</span>
            </label>
            <input
              id="guests"
              type="number"
              min={1}
              max={listing.maxGuests}
              required
              value={guests}
              onChange={(e) =>
                setGuests(Math.min(listing.maxGuests, Math.max(1, Number(e.target.value) || 1)))
              }
            />
          </div>

          <div className="price-summary">
            <div className="total-row">
              <span>
                Total for {plural(nights, "night")}, {plural(guests, "guest")}
              </span>
              <strong>{money(quote.total)}</strong>
            </div>
            {!listing.maxNights && (
              <div className="total-row secondary">
                <span>Monthly average</span>
                <strong>{money(quote.monthlyAverage)}</strong>
              </div>
            )}
            <details>
              <summary>Show breakdown</summary>
              {quote.discountApplied && (
                <div className="breakdown-row">
                  <span>
                    {money(listing.nightlyRate)}/night, {listing.weeklyDiscountPercent}% weekly discount applied
                  </span>
                  <span>{money(quote.nightlyRate)}/night</span>
                </div>
              )}
              <div className="breakdown-row">
                <span>
                  {money(quote.nightlyRate)}/night × {nights} night{nights === 1 ? "" : "s"}
                </span>
                <span>{money(quote.nightlyRate * nights)}</span>
              </div>
              {guests > 1 && (
                <div className="breakdown-row">
                  <span>
                    +{money(GUEST_SURCHARGE_PER_NIGHT)}/night × {guests - 1} extra guest × {nights} night
                    {nights === 1 ? "" : "s"}
                  </span>
                  <span>{money(quote.guestSurcharge * nights)}</span>
                </div>
              )}
              {listing.cleaningFee > 0 && (
                <div className="breakdown-row">
                  <span>Cleaning fee (one-time)</span>
                  <span>{money(listing.cleaningFee)}</span>
                </div>
              )}
              <div className="breakdown-row total">
                <span>Total</span>
                <span>{money(quote.total)}</span>
              </div>
            </details>
            <p className="calc-note">This exact quote is included in your inquiry email.</p>
          </div>

          {status.type === "ok" ? (
            <div className="form-status ok">
              Thanks — your inquiry is in (reference {status.reference}). We&apos;ll follow up by email or phone
              soon.
            </div>
          ) : !showContact ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!stayError}
              onClick={() => setShowContact(true)}
            >
              Inquire
            </button>
          ) : (
            <>
              <hr className="widget-divider" />

              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" required maxLength={200} />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>

              <div className="field">
                <label htmlFor="phoneNumber">Phone</label>
                <div className="phone-row">
                  <select
                    aria-label="Country"
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                  <input
                    id="phoneNumber"
                    type="tel"
                    required
                    placeholder="206 555 0134"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">Message (optional)</label>
                <textarea id="message" name="message" maxLength={2000} placeholder="Anything we should know?" />
              </div>

              {status.type === "err" && <div className="form-status err">{status.message}</div>}

              <button className="btn btn-primary" type="submit" disabled={status.type === "submitting" || !!stayError}>
                {status.type === "submitting" ? "Sending…" : "Send inquiry"}
              </button>

              <p className="form-note">
                This sends your details directly to our team. We&apos;ll reply by email or phone to work out next
                steps.
              </p>
            </>
          )}
        </form>
      </div>
    </>
  );
}
