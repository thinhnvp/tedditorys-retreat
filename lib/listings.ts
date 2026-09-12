export type Listing = {
  slug: string;
  name: string;
  location: string;
  airbnbUrl: string;
  heroImage: string;
  heroAlt: string;
  gallery: string[];
  bedBath: string;
  /**
   * The direct-booking nightly rate. Airbnb's own price (shown only once a
   * guest picks dates there) runs higher because it bakes in Airbnb's
   * service fee — see AIRBNB_MULTIPLIER in lib/pricing.ts.
   */
  nightlyRate: number;
  /** One-time cleaning fee added on top of the prorated stay. Per listing — some have none. */
  cleaningFee: number;
  /** Verified against the live Airbnb listing's "House rules" panel. */
  checkInTime: string;
  checkOutTime: string;
  /** Verified against the live Airbnb listing's "House rules" panel — varies per room. */
  maxGuests: number;
  cardFeature: string;
  description: string;
  amenities: string[];
  neighborhood: string;
  reviews: string;
  chips: string[];
  houseRules: string[];
  /** Short badge shown near the listing name, e.g. "Private Hosted Hideaway". */
  tagline?: string;
  /** Set when the stay is arranged individually rather than open to any dates. */
  inquiryOnly?: boolean;
  /** Bundled, hosted inclusions beyond standard room amenities (tours, transport, etc). */
  curatedExperience?: string[];
  minNights?: number;
  maxNights?: number;
  /** Applied to the nightly rate once a stay reaches weeklyDiscountMinNights. */
  weeklyDiscountPercent?: number;
  weeklyDiscountMinNights?: number;
};

export const LISTINGS: Listing[] = [
  {
    slug: "horizon-suite",
    name: "The Horizon Suite",
    location: "West Seattle · Delridge",
    airbnbUrl: "https://www.airbnb.com/rooms/1298850443785273376",
    heroImage: "/assets/images/container04.jpg",
    heroAlt: "The Horizon Suite, a top-floor bedroom with en-suite bath and a large window",
    gallery: ["/assets/images/container04.jpg"],
    bedBath: "1 bedroom · 1 en-suite bathroom · Queen bed",
    nightlyRate: 44,
    cleaningFee: 200,
    checkInTime: "3:00 PM",
    checkOutTime: "10:00 AM",
    maxGuests: 2,
    cardFeature:
      "The top-floor primary, with an en-suite rain shower and a floor-to-ceiling window over Delridge Skatepark. The best light in the house.",
    description:
      "The top-floor primary bedroom in an upgraded smart home, with an en-suite rain shower and a floor-to-ceiling window over Delridge Skatepark — the best light in the house. Smart-home touches include adjustable blinds and high-speed Wi-Fi, plus access to the shared kitchen and living room on the main floor.",
    amenities: [
      "En-suite bathroom",
      "Rain shower",
      "Skatepark view",
      "In-room AC",
      "Smart blinds",
      "Shared full kitchen",
      "High-speed Wi-Fi",
      "Dedicated workspace",
      "Free on-site parking",
      "Lock on bedroom door",
    ],
    neighborhood:
      "Delridge, steps from Delridge Playfield with a bus stop across the street running every 10–15 minutes. Minutes by car to Downtown Seattle, Costco, Alki Beach, The Junction, LA Fitness, and Whole Foods.",
    reviews: "5.0★ (3 reviews) · Superhost",
    chips: ["En-suite bath", "Rain shower", "Skatepark view", "In-room AC"],
    houseRules: [
      "No smoking inside the property or common areas",
      "No pets — other residents have allergies",
      "Follow city parking rules — don't block driveways or fire hydrants",
    ],
  },
  {
    slug: "sunny-nest",
    name: "The Sunny Nest",
    location: "West Seattle · Delridge",
    airbnbUrl: "https://www.airbnb.com/rooms/1233264176697997286",
    heroImage: "/assets/images/container06.jpg",
    heroAlt: "The Sunny Nest, a light-filled bedroom with a private bath and large window",
    gallery: ["/assets/images/container06.jpg"],
    bedBath: "1 bedroom · 1 private bathroom · Queen bed",
    nightlyRate: 40,
    cleaningFee: 200,
    checkInTime: "3:00 PM",
    checkOutTime: "10:00 AM",
    maxGuests: 1,
    cardFeature:
      "A light-filled bedroom with a private bath and a floor-to-ceiling window framing the skatepark view. Warm all afternoon.",
    description:
      "A light-filled bedroom in the same upgraded smart home, with a private attached bath and a floor-to-ceiling window framing the Delridge Skatepark view. Warm all afternoon, with access to the shared kitchen, laundry, and rooftop deck.",
    amenities: [
      "Private bathroom",
      "Big window",
      "In-unit AC",
      "Smart TV",
      "Coffee machine",
      "Smart blinds",
      "Rooftop access",
      "Free on-site parking",
      "Dedicated workspace",
      "Shared laundry",
    ],
    neighborhood:
      "Delridge, steps from transit — a bus stop across the street runs to downtown Seattle and West Seattle. Nearby: Costco, Alki Beach, The Junction, LA Fitness, Whole Foods, and Starbucks.",
    reviews: "5.0★ (5 reviews) · Superhost",
    chips: ["Private bath", "Big window", "In-unit AC"],
    houseRules: [
      "No smoking inside the property or common areas",
      "No pets — other residents have allergies",
      "Follow city parking rules — don't block driveways or fire hydrants",
    ],
  },
  {
    slug: "fern-nook",
    name: "The Fern Nook",
    location: "West Seattle · Delridge",
    airbnbUrl: "https://www.airbnb.com/rooms/1311814269001950782",
    heroImage: "/assets/images/container01.jpg",
    heroAlt: "The Fern Nook, a walk-out lower-level suite with private entrance and en-suite bath",
    gallery: ["/assets/images/container01.jpg"],
    bedBath: "1 bedroom · 1 en-suite bathroom · Queen bed",
    nightlyRate: 42,
    cleaningFee: 200,
    checkInTime: "3:00 PM",
    checkOutTime: "10:00 AM",
    maxGuests: 2,
    cardFeature:
      "A walk-out lower-level suite with its own private entrance at the back of the house and an en-suite bath. Built for quiet and a little separation.",
    description:
      "A walk-out lower-level suite with its own private entrance at the back of the house and an en-suite bath — built for quiet and a little separation, right across from Delridge Playfield. Shares the main-floor kitchen and living room with the rest of the home.",
    amenities: [
      "Private entrance",
      "En-suite bathroom",
      "Shared full kitchen",
      "Smart TV",
      "Coffee machine",
      "High-speed Wi-Fi",
      "Rooftop access",
      "Lock on bedroom door",
      "Dedicated workspace",
      "Free on-site parking",
    ],
    neighborhood:
      "Delridge, right across from Delridge Playfield with bus access downtown. Close to Costco, Alki Beach, The Junction, LA Fitness, Whole Foods, and Starbucks.",
    reviews: "5.0★ (4 reviews) · Superhost",
    chips: ["Private entrance", "En-suite bath", "Walk-out suite"],
    houseRules: [
      "No smoking inside the property or common areas",
      "No pets — other residents have allergies",
      "Follow city parking rules — don't block driveways or fire hydrants",
    ],
  },
  {
    slug: "elysian-escape",
    name: "The Elysian Escape",
    location: "Renton · Windsor Hills",
    airbnbUrl: "https://www.airbnb.com/rooms/1372127017588541267",
    heroImage: "/assets/images/container02.jpg",
    heroAlt: "The Elysian Escape, a private hosted hideaway in Renton with attached bath",
    gallery: ["/assets/images/container02.jpg"],
    bedBath: "1 bedroom · 1 private bathroom · Double bed",
    nightlyRate: 200,
    cleaningFee: 0,
    checkInTime: "3:00 PM–11:00 PM",
    checkOutTime: "10:00 AM",
    maxGuests: 2,
    tagline: "Private Hosted Hideaway",
    inquiryOnly: true,
    minNights: 5,
    maxNights: 13,
    weeklyDiscountPercent: 12,
    weeklyDiscountMinNights: 7,
    cardFeature:
      "A fully hosted stay in Renton, arranged around you — door-to-door arrival coordination, days planned around what you actually want, and an evening of wine and music along the way. By inquiry only.",
    description:
      "The Elysian Escape isn't really a room you book — it's a stay someone plans for you. Arrival is coordinated door-to-door, so you're not left figuring out a rideshare on no sleep. From there, your days get built around what you're actually here for — a specific list of restaurants, a slower pace, or just better recommendations than a search engine gives you. Most stays end up with an evening of wine and music that's turned into something of a house tradition. Because every stay is arranged this way, dates are confirmed by request rather than instant booking.",
    curatedExperience: [
      "Door-to-door arrival coordination",
      "Your days planned around what you're actually here for",
      "An evening of wine and music that's become a house tradition",
    ],
    amenities: [
      "Private bathroom",
      "Smart lock",
      "65\" smart TV",
      "Central AC",
      "Washer",
      "Keurig coffee maker",
      "High-speed Wi-Fi",
      "Free driveway parking",
      "Shared living room",
      "Workspace",
    ],
    neighborhood:
      "Windsor Hills is a quiet, residential corner of Renton, with a small neighborhood green space nearby if you want fresh air without driving. The Landing — Target, Regal Cinemas, and a solid lineup of Korean BBQ, sushi, and poke — is five minutes by car, and the freeway puts Bellevue fifteen minutes out, Tukwila ten.",
    reviews: "5.0★ (2 reviews) · Superhost",
    chips: ["Hosted experience", "Door-to-door arrival", "Personalized itinerary", "Inquiry only"],
    houseRules: [
      "No smoking inside the property or common areas",
      "No pets — other residents have allergies",
      "Street parking has a 48-hour limit",
    ],
  },
];

export function getListing(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}
