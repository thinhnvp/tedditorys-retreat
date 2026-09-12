import { getSql } from "./db";

export type GuestProfile = {
  /** Optional display name for the itinerary heading — distinct from the booking's formal name, e.g. for a demo. */
  displayName?: string;
  partySize: number;
  hasRentalCar: boolean;
  /** Free-form interest tags collected from the intake form, e.g. "food", "nature", "nightlife". */
  preferences: string[];
  pace?: "relaxed" | "mixed" | "packed";
  notes?: string;
};

export type GeoPoint = { name: string; lat: number; lng: number };

export type ItineraryActivity = {
  type: "activity";
  title: string;
  /** Free-form for now (e.g. "food", "nature", "landmark") — not yet used for filtering/map pins. */
  category: string;
  location: GeoPoint;
  /** 24-hour "HH:MM" local time. */
  fromTime: string;
  toTime: string;
  notes?: string;
};

export type ItineraryCommute = {
  type: "commute";
  from: GeoPoint;
  to: GeoPoint;
  by: string;
  fromTime: string;
  toTime: string;
  notes?: string;
};

export type ItineraryItem = ItineraryActivity | ItineraryCommute;

export type ItineraryDay = {
  date: string;
  title?: string;
  items: ItineraryItem[];
};

export type Itinerary = {
  id: number;
  referenceCode: string;
  guestProfile: GuestProfile;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
};

type ItineraryRow = {
  id: number;
  reference_code: string;
  guest_profile: GuestProfile;
  days: ItineraryDay[];
  created_at: string | Date;
  updated_at: string | Date;
};

function toIsoString(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

function normalizeItinerary(row: ItineraryRow): Itinerary {
  return {
    id: row.id,
    referenceCode: row.reference_code,
    guestProfile: row.guest_profile,
    days: row.days,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

export async function getItineraryByReference(referenceCode: string): Promise<Itinerary | null> {
  const db = getSql();
  const rows = (await db`
    SELECT * FROM itineraries WHERE reference_code = ${referenceCode.toUpperCase()}
  `) as ItineraryRow[];
  return rows[0] ? normalizeItinerary(rows[0]) : null;
}

/** Inserts or fully replaces the itinerary for a reference code — there's exactly one per inquiry. */
export async function upsertItinerary(input: {
  referenceCode: string;
  guestProfile: GuestProfile;
  days: ItineraryDay[];
}): Promise<Itinerary> {
  const db = getSql();
  const rows = (await db`
    INSERT INTO itineraries (reference_code, guest_profile, days)
    VALUES (${input.referenceCode.toUpperCase()}, ${JSON.stringify(input.guestProfile)}, ${JSON.stringify(input.days)})
    ON CONFLICT (reference_code)
    DO UPDATE SET guest_profile = EXCLUDED.guest_profile, days = EXCLUDED.days, updated_at = now()
    RETURNING *
  `) as ItineraryRow[];
  return normalizeItinerary(rows[0]);
}
