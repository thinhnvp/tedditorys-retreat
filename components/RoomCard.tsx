import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/listings";

export default function RoomCard({ listing }: { listing: Listing }) {
  return (
    <Link className="room reveal" href={`/listings/${listing.slug}`}>
      <div className="room-media">
        <Image
          src={listing.heroImage}
          alt={listing.heroAlt}
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="room-body">
        <h3>{listing.name}</h3>
        <p className="room-feat">{listing.cardFeature}</p>
        <div className="chips">
          {listing.chips.map((chip) => (
            <span className="chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>
        <span className="room-link">
          View listing
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
