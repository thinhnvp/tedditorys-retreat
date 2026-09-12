import Link from "next/link";
import { LISTINGS } from "@/lib/listings";

const rooms = LISTINGS.filter((listing) => !listing.experienceHighlights);
const hostedExperiences = LISTINGS.filter((listing) => listing.experienceHighlights);

export default function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="footgrid">
          <div className="footbrand">
            Tedditory Retreat<span className="dot">.</span>
            <p>Elevated room-sharing in the Seattle metro area. Private comfort, shared simplicity.</p>
          </div>
          <div className="footcol">
            <h5>Rooms</h5>
            {rooms.map((listing) => (
              <Link key={listing.slug} href={`/listings/${listing.slug}`}>
                {listing.name}
              </Link>
            ))}
          </div>
          <div className="footcol">
            <h5>Hosted Hideaway</h5>
            {hostedExperiences.map((listing) => (
              <Link key={listing.slug} href={`/listings/${listing.slug}`}>
                {listing.name}
              </Link>
            ))}
          </div>
          <div className="footcol">
            <h5>Connect</h5>
            <a href="https://www.airbnb.com/users/show/116747850" target="_blank" rel="noopener noreferrer">
              Airbnb host profile
            </a>
            <a href="mailto:hello@tedditory.co">hello@tedditory.co</a>
          </div>
        </div>
        <div className="copyright">
          <span>© {new Date().getFullYear()} Tedditory Retreat · Metro Seattle, WA</span>
          <span>Where private comfort meets shared simplicity.</span>
        </div>
      </div>
    </footer>
  );
}
