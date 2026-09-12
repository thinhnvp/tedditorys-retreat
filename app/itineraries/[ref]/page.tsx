import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RevealSetup from "@/components/RevealSetup";
import ItineraryDayTabs from "@/components/ItineraryDayTabs";
import { getItineraryByReference } from "@/lib/itineraries";
import { findInquiryByRef } from "@/lib/db";
import { getListing } from "@/lib/listings";
import { formatFriendlyDate } from "@/lib/format";

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default async function ItineraryPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const [itinerary, inquiry] = await Promise.all([getItineraryByReference(ref), findInquiryByRef(ref)]);
  if (!itinerary || !inquiry) notFound();

  const listing = getListing(inquiry.listing_slug);
  const { guestProfile } = itinerary;
  const title = guestProfile.displayName ? `${guestProfile.displayName}'s Seattle Plan` : "Your Seattle Plan";

  return (
    <>
      <RevealSetup />
      <NavBar />

      <section className="listing-header">
        <div className="wrap">
          <div className="listing-tagline">Your itinerary</div>
          <h1>{title}</h1>
          <p className="hero-capacity">
            {listing?.name ?? inquiry.listing_slug} · {formatFriendlyDate(inquiry.check_in)} –{" "}
            {formatFriendlyDate(inquiry.check_out)}
          </p>

          <div className="profile-kv reveal">
            <div className="profile-kv-row">
              <span className="profile-kv-label">Plan for</span>
              <span className="profile-kv-value">
                {guestProfile.partySize === 1 ? "Solo traveler" : plural(guestProfile.partySize, "guest")}
              </span>
            </div>
            <div className="profile-kv-row">
              <span className="profile-kv-label">Commute</span>
              <span className="profile-kv-value">{guestProfile.hasRentalCar ? "Rental car" : "No rental car"}</span>
            </div>
            {guestProfile.pace && (
              <div className="profile-kv-row">
                <span className="profile-kv-label">Pace</span>
                <span className="profile-kv-value" style={{ textTransform: "capitalize" }}>
                  {guestProfile.pace}
                </span>
              </div>
            )}
            <div className="profile-kv-row">
              <span className="profile-kv-label">Preferences</span>
              <span className="profile-kv-value">{guestProfile.preferences.join(", ")}</span>
            </div>
            {guestProfile.notes && (
              <div className="profile-kv-row">
                <span className="profile-kv-label">Notes</span>
                <span className="profile-kv-value">{guestProfile.notes}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ItineraryDayTabs days={itinerary.days} />
        </div>
      </section>

      <Footer />
    </>
  );
}
