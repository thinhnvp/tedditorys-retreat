import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BookingSection from "@/components/BookingSection";
import RevealSetup from "@/components/RevealSetup";
import { LISTINGS, getListing } from "@/lib/listings";

export function generateStaticParams() {
  return LISTINGS.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) return {};
  return {
    title: listing.name,
    description: listing.cardFeature,
    alternates: { canonical: `/listings/${listing.slug}` },
    openGraph: {
      title: `${listing.name} · Tedditory Retreat`,
      description: listing.cardFeature,
      images: [{ url: listing.heroImage }],
    },
  };
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: listing.name,
    description: listing.description,
    address: { "@type": "PostalAddress", addressRegion: "WA", addressCountry: "US" },
    numberOfBedrooms: 1,
    petsAllowed: false,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RevealSetup />
      <NavBar />

      <section className="listing-header">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/#rooms">Rooms</Link> / {listing.name}
          </div>
          {listing.tagline && <div className="listing-tagline">{listing.tagline}</div>}
          <h1>{listing.name}</h1>
          {listing.experienceHighlights && (
            <p className="hero-capacity">
              Private stay for 1–{listing.maxGuests} guest{listing.maxGuests === 1 ? "" : "s"}.
            </p>
          )}

          <div className="gallery reveal">
            <Image src={listing.heroImage} alt={listing.heroAlt} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="listing-layout">
            <BookingSection listing={listing} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
