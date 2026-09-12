import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RevealSetup from "@/components/RevealSetup";
import ItineraryDay from "@/components/ItineraryDay";
import { getItineraryByReference } from "@/lib/itineraries";
import { findInquiryByRef } from "@/lib/db";
import { getListing } from "@/lib/listings";
import { formatFriendlyDate } from "@/lib/format";

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

          <div className="curated-for reveal">
            <div className="sub-label">Curated for you</div>
            <ul className="rules-list">
              {guestProfile.curatedFor.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="itinerary-days">
            {itinerary.days.map((day) => (
              <ItineraryDay day={day} key={day.date} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
