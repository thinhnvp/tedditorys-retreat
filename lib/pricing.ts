import type { Listing } from "./listings";

export const GUEST_SURCHARGE_PER_NIGHT = 5;
// Airbnb's own price runs higher once its service fee is factored in — this
// is a rough estimate for comparison only, not what Airbnb will actually charge.
export const AIRBNB_MULTIPLIER = 1.155;

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const inD = new Date(`${checkIn}T00:00:00`);
  const outD = new Date(`${checkOut}T00:00:00`);
  const diff = Math.round((outD.getTime() - inD.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

/** The nightly rate after any applicable weekly discount for this length of stay. */
export function effectiveNightlyRate(listing: Listing, nights: number): number {
  if (
    listing.weeklyDiscountPercent &&
    listing.weeklyDiscountMinNights &&
    nights >= listing.weeklyDiscountMinNights
  ) {
    return listing.nightlyRate * (1 - listing.weeklyDiscountPercent / 100);
  }
  return listing.nightlyRate;
}

/** Returns an error message if the stay length falls outside the listing's allowed range. */
export function nightsRangeError(listing: Listing, nights: number): string | null {
  if (nights <= 0) return null;
  if (listing.minNights && nights < listing.minNights) {
    return `This listing requires a minimum stay of ${listing.minNights} nights.`;
  }
  if (listing.maxNights && nights > listing.maxNights) {
    return `This listing allows a maximum stay of ${listing.maxNights} nights.`;
  }
  return null;
}

export type Quote = {
  nights: number;
  /** The nightly rate actually used, after any qualifying weekly discount. */
  nightlyRate: number;
  discountApplied: boolean;
  guestSurcharge: number;
  total: number;
  monthlyAverage: number;
};

/** The reliable, direct-booking quote — this is what goes in the inquiry email. */
export function calcDirectQuote(listing: Listing, nights: number, guests: number): Quote {
  const nightlyRate = effectiveNightlyRate(listing, nights);
  const guestSurcharge = Math.max(guests - 1, 0) * GUEST_SURCHARGE_PER_NIGHT;
  const total = nights > 0 ? (nightlyRate + guestSurcharge) * nights + listing.cleaningFee : 0;
  const monthlyAverage = nights > 0 ? (total / nights) * 30 : 0;
  return { nights, nightlyRate, discountApplied: nightlyRate < listing.nightlyRate, guestSurcharge, total, monthlyAverage };
}

/** A rough, non-authoritative estimate of Airbnb's equivalent price, for comparison only. */
export function calcAirbnbEstimate(listing: Listing, nights: number, guests: number): number {
  const nightlyRate = effectiveNightlyRate(listing, nights);
  const guestSurcharge = Math.max(guests - 1, 0) * GUEST_SURCHARGE_PER_NIGHT;
  return nights > 0 ? (nightlyRate * AIRBNB_MULTIPLIER + guestSurcharge) * nights + listing.cleaningFee : 0;
}

export function airbnbUrlWithDates(listing: Listing, checkIn: string, checkOut: string, guests: number): string {
  const url = new URL(listing.airbnbUrl);
  if (checkIn) url.searchParams.set("check_in", checkIn);
  if (checkOut) url.searchParams.set("check_out", checkOut);
  if (guests) url.searchParams.set("adults", String(guests));
  return url.toString();
}
