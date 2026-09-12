import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RevealSetup from "@/components/RevealSetup";
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

  return (
    <>
      <RevealSetup />
      <NavBar />

      <section className="listing-header">
        <div className="wrap">
          <div className="listing-tagline">Your itinerary</div>
          <h1>{inquiry.name.split(" ")[0]}&apos;s Seattle Plan</h1>
          <p className="hero-capacity">
            {listing?.name ?? inquiry.listing_slug} · {formatFriendlyDate(inquiry.check_in)} –{" "}
            {formatFriendlyDate(inquiry.check_out)}
          </p>

          <div className="profile-chips reveal">
            <span className="chip">{plural(guestProfile.partySize, "guest")}</span>
            <span className="chip">{guestProfile.hasRentalCar ? "Has a rental car" : "No rental car"}</span>
            {guestProfile.pace && <span className="chip">{guestProfile.pace} pace</span>}
            {guestProfile.preferences.map((p) => (
              <span className="chip" key={p}>
                {p}
              </span>
            ))}
          </div>
          {guestProfile.notes && <p className="profile-notes">{guestProfile.notes}</p>}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="itinerary-days">
            {itinerary.days.map((day) => (
              <div className="itinerary-day reveal" key={day.date}>
                <div className="itinerary-day-head">
                  <div className="itinerary-date">{formatFriendlyDate(day.date)}</div>
                  {day.title && <h3>{day.title}</h3>}
                </div>
                <ol className="itinerary-items">
                  {day.items.map((item, i) => (
                    <li className={item.type === "commute" ? "commute" : "activity"} key={i}>
                      <span className="itinerary-time">
                        {item.fromTime}
                        <span className="to">→ {item.toTime}</span>
                      </span>
                      <div className="itinerary-body">
                        {item.type === "commute" ? (
                          <>
                            <div className="itinerary-title">
                              {item.from} → {item.to}
                              <span className="itinerary-by"> · {item.by}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="itinerary-title">{item.title}</div>
                            <div className="itinerary-location">{item.location}</div>
                          </>
                        )}
                        {item.notes && <p className="itinerary-notes">{item.notes}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
