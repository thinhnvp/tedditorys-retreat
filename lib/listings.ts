export type ExperienceHighlight = { title: string; description: string };
export type StayStep = { step: string; title: string; description: string };

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
  minNights?: number;
  maxNights?: number;
  /** Applied to the nightly rate once a stay reaches weeklyDiscountMinNights. */
  weeklyDiscountPercent?: number;
  weeklyDiscountMinNights?: number;

  /**
   * Rich "what's included" cards — replaces a flat bullet list for experience
   * listings. Presence of this field marks the listing as an "experience"
   * product and switches on the richer page sections below — other listings
   * stay on the plain room-rental layout.
   */
  experienceHighlights?: ExperienceHighlight[];
  /** Numbered "how your stay works" steps, shown only for experience listings. */
  howItWorks?: StayStep[];
  /** Who this stay is built for, shown as a short list. */
  whoItsFor?: string[];
  /** Short value-framing block shown just above pricing. */
  valueFraming?: { heading: string; body: string };
  /** Custom heading for the neighborhood section (defaults to "The neighborhood"). */
  neighborhoodHeading?: string;
  /** Secondary, practical nearby list shown under the broader neighborhood framing. */
  nearbyEssentials?: string[];
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
    gallery: [
      "/assets/images/container02.jpg",
      "/assets/images/elysian-living-room.jpg",
      "/assets/images/elysian-hallway.jpg",
      "/assets/images/elysian-bathroom.jpg",
      "/assets/images/elysian-backyard.jpg",
    ],
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
      "A fully hosted stay in Renton, arranged around you — coordinated arrival, a personal Seattle plan, and an evening that's become a house tradition. By inquiry only.",
    description:
      "The Elysian Escape isn't really a room you book — it's a stay someone plans for you. Arrival is coordinated, your days are shaped around what you actually want, and one evening usually turns into wine, music, and something of a house tradition.",
    experienceHighlights: [
      {
        title: "Arrival, handled",
        description:
          "We coordinate your trip from SEA to the house, so your stay starts without figuring out transportation after a long flight.",
      },
      {
        title: "A Seattle plan made for you",
        description:
          "Tell us what you like, and a personal Seattle itinerary is waiting when you arrive — follow it, tweak it, or ignore it entirely.",
      },
      {
        title: "The Elysian evening",
        description:
          "One evening, you're invited to wine, music, and karaoke at the house. Casual, optional, and something of a tradition here.",
      },
      {
        title: "Support while you're here",
        description: "Plans change. If they do, reach out directly for the rest of your stay — not a call center, just us.",
      },
    ],
    howItWorks: [
      { step: "01", title: "Before you arrive", description: "You answer a few questions about how you like to travel." },
      { step: "02", title: "We build your stay", description: "You receive a curated plan built around your interests, pace, and dates." },
      { step: "03", title: "Arrival is coordinated", description: "We'll help get you from SEA to Elysian without the usual arrival friction." },
      { step: "04", title: "Make it yours", description: "Use the itinerary as much or as little as you'd like." },
      {
        step: "05",
        title: "One night, stay in",
        description: "Wine, music, and karaoke at the house — totally optional, and something you can opt into while we build your plan.",
      },
    ],
    whoItsFor: [
      "Solo travelers who want good company without obligation",
      "Couples looking for something more personal than a hotel",
      "First-time Seattle visitors who don't know where to start",
      "Anyone who'd rather not spend their trip planning it",
    ],
    valueFraming: {
      heading: "More than a room",
      body: "Every Elysian stay includes private accommodation plus personal trip planning, arrival coordination, and a hosted evening. There are no separate concierge fees.",
    },
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
    neighborhoodHeading: "A quiet base for exploring Seattle",
    neighborhood:
      "Elysian sits in a residential part of Renton, away from the downtown noise but well connected to the region. Seattle, Bellevue, Lake Washington, Southcenter, and SEA are all within easy reach, which lets us build your days in different directions rather than locking you into one neighborhood.",
    nearbyEssentials: [
      "Target and Regal Cinemas at The Landing (5 min by car)",
      "Korean BBQ, sushi, and poke nearby",
      "Freeway access — Bellevue 15 min, Tukwila 10 min",
    ],
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
