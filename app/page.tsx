import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import Model3D from "@/components/Model3D";
import RevealSetup from "@/components/RevealSetup";
import { LISTINGS, getListing } from "@/lib/listings";

// The Elysian Escape is a separate, fully hosted experience — not part of
// the monthly room-share lineup — so it gets its own featured section
// below rather than sitting in the room grid.
const roomListings = LISTINGS.filter((listing) => listing.slug !== "elysian-escape");
const hideaway = getListing("elysian-escape")!;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Tedditory Retreat",
  description:
    "Elevated room-sharing in the Seattle metro area — private bedroom and bathroom, shared living, flexible monthly stays.",
  url: "https://retreat.tedditory.co/",
  areaServed: "Seattle metropolitan area, Washington",
  address: { "@type": "PostalAddress", addressRegion: "WA", addressCountry: "US", addressLocality: "Seattle" },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Private en-suite bathroom", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Shared kitchen", value: true },
  ],
  sameAs: ["https://www.airbnb.com/users/show/116747850"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RevealSetup />
      <NavBar />

      <header className="hero" id="top">
        <div className="reveal in">
          <div className="eyebrow">Metro Seattle · Washington</div>
          <h1>
            Private where it matters.
            <br />
            <span className="soft">Shared where it makes sense.</span>
          </h1>
          <p className="sub">
            Thoughtfully designed rooms with your own bedroom and bathroom, shared living spaces, and the freedom
            of a flexible monthly stay. A smarter way to live in Seattle.
          </p>
          <div className="herocta">
            <a className="btn btn-primary" href="#rooms">Explore the rooms</a>
            <a className="btn btn-ghost" href="#home">See the home</a>
          </div>
          <div className="scrollhint">
            <span>Scroll</span>
            <span className="ln" />
          </div>
        </div>
      </header>

      <section className="sec home" id="home">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow">The Home</div>
            <h2>Four floors, one calm rhythm.</h2>
            <p>
              A walk-out lower suite, shared kitchen and living on the main floor, and two bright bedrooms above —
              plus a rooftop deck at the top. Drag to turn the model, or choose a floor to look inside.
            </p>
          </div>
          <Model3D />
        </div>
      </section>

      <section className="sec" id="rooms">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow">The Rooms</div>
            <h2>Three rooms. Each its own kind of quiet.</h2>
            <p>Every room is a private bedroom with its own bathroom. Tap through for details, rates, and to reach out directly.</p>
          </div>
          <div className="roomgrid">
            {roomListings.map((listing) => (
              <RoomCard key={listing.slug} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec why" id="why">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow">Why Tedditory Retreat</div>
            <h2>Because housing in Seattle shouldn&apos;t cost your whole life.</h2>
            <p>Most of us don&apos;t need a whole apartment to ourselves. We need privacy where it counts, and a home that adapts to real life.</p>
          </div>
          <div className="whygrid reveal">
            <div className="whycell">
              <h4>Private where it counts</h4>
              <p>Your own bedroom and your own bathroom — every day, no compromise. Kitchen, dining, and common areas are shared, so costs stay low and life stays simple.</p>
            </div>
            <div className="whycell">
              <h4>No landlord dynamic</h4>
              <p>No one lives above you watching the clock. Everyone under the roof is equal — neighbors, not tenants — and mutual respect goes a long way.</p>
            </div>
            <div className="whycell">
              <h4>Minimal, intentional living</h4>
              <p>Modern layouts and just enough space. Designed for people building a career or exploring a new city, who&apos;d rather not burn their whole income to exist in it.</p>
            </div>
            <div className="whycell">
              <h4>Flexibility that fits real life</h4>
              <p>Stay as long as you like and leave when you need to. Monthly rent, no long-term lease, and only 30 days&apos; notice to move out.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="how">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow">Staying here</div>
            <h2>Simple to start. Easy to leave.</h2>
            <p>Book directly with us, or through Airbnb — no applications, no credit checks. Just a valid card and a good profile.</p>
          </div>
          <div className="howrow reveal">
            <div className="howcard">
              <div className="n">Monthly</div>
              <h4>Pay by the month</h4>
              <p>Transparent monthly pricing with a discount built in for booking direct.</p>
            </div>
            <div className="howcard">
              <div className="n">No lease</div>
              <h4>No long-term lease</h4>
              <p>No year-long commitment to sign. Stay for the season or the stretch you need.</p>
            </div>
            <div className="howcard">
              <div className="n">30 days</div>
              <h4>30-day notice</h4>
              <p>When it&apos;s time to move on, a month&apos;s notice is all it takes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec feature" id="hideaway">
        <div className="wrap">
          <div className="feature-card reveal">
            <div className="feature-media">
              <Image
                src={hideaway.heroImage}
                alt={hideaway.heroAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="feature-body">
              <span className="feature-tag">{hideaway.tagline}</span>
              <h2>{hideaway.name}</h2>
              <p className="feature-sub">{hideaway.location}</p>
              <p className="feature-desc">{hideaway.description}</p>
              {hideaway.experienceHighlights && (
                <ul className="feature-list">
                  {hideaway.experienceHighlights.map((item) => (
                    <li key={item.title}>{item.title}</li>
                  ))}
                </ul>
              )}
              <Link className="btn btn-gold" href={`/listings/${hideaway.slug}`}>
                Explore the Hideaway
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec note">
        <div className="wrap notecard reveal">
          <div className="eyebrow">From our founder</div>
          <blockquote>
            &ldquo;I&apos;m not a big investor or an Airbnb guru — I&apos;m an engineer who wanted to build something
            different. A place for young professionals that&apos;s affordable, intentional, and modern, without
            giving up comfort or community. I put care into every part of these homes. This isn&apos;t just a
            business — it&apos;s a personal project.&rdquo;
          </blockquote>
          <div className="sig">— Founder &amp; host</div>
        </div>
      </section>

      <Footer />
    </>
  );
}
