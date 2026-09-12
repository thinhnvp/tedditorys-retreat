import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { upsertItinerary, type GuestProfile, type ItineraryDay } from "@/lib/itineraries";

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

  const referenceCode = String(body.referenceCode || "").trim();
  if (!referenceCode) {
    return NextResponse.json({ ok: false, error: "Missing referenceCode." }, { status: 400 });
  }
  if (!body.guestProfile || !body.days) {
    return NextResponse.json({ ok: false, error: "Missing guestProfile or days." }, { status: 400 });
  }

  try {
    const itinerary = await upsertItinerary({
      referenceCode,
      guestProfile: body.guestProfile as unknown as GuestProfile,
      days: body.days as unknown as ItineraryDay[],
    });
    return NextResponse.json({ ok: true, itinerary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
