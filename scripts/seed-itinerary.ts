import { config } from "dotenv";
config({ path: ".env.local" });
config();

import type { GuestProfile, ItineraryDay, GeoPoint } from "../lib/itineraries";

// Demo content only — illustrative placeholders for the concept, not
// verified, bookable recommendations. Swap in the host's actual picks
// before this ever goes to a real guest. Coordinates are approximate
// (landmark-level, not exact addresses).

const SEA_AIRPORT: GeoPoint = { name: "SEA Airport", lat: 47.4502, lng: -122.3088 };
const ELYSIAN: GeoPoint = { name: "Elysian Escape", lat: 47.4529, lng: -122.1817 };
const THE_LANDING: GeoPoint = { name: "The Landing, Renton", lat: 47.4853, lng: -122.2087 };
const DOWNTOWN: GeoPoint = { name: "Downtown Seattle", lat: 47.6062, lng: -122.3321 };
const PIKE_PLACE: GeoPoint = { name: "Pike Place Market", lat: 47.6097, lng: -122.3422 };
const ORIGINAL_STARBUCKS: GeoPoint = { name: "1912 Pike Pl", lat: 47.6089, lng: -122.3426 };
const SCULPTURE_PARK: GeoPoint = { name: "Olympic Sculpture Park", lat: 47.6166, lng: -122.3553 };
const PIONEER_SQUARE: GeoPoint = { name: "Pioneer Square", lat: 47.6015, lng: -122.3332 };
const CAPITOL_HILL: GeoPoint = { name: "Capitol Hill", lat: 47.6231, lng: -122.3126 };
const BALLARD: GeoPoint = { name: "Ballard Ave", lat: 47.6684, lng: -122.383 };
const BALLARD_LOCKS: GeoPoint = { name: "Hiram M. Chittenden Locks", lat: 47.6653, lng: -122.3964 };
const GOLDEN_GARDENS: GeoPoint = { name: "Golden Gardens Park", lat: 47.6892, lng: -122.4025 };
const COLMAN_DOCK: GeoPoint = { name: "Colman Dock", lat: 47.6021, lng: -122.3393 };
const BAINBRIDGE: GeoPoint = { name: "Bainbridge Island (Winslow)", lat: 47.6262, lng: -122.5195 };
const KERRY_PARK: GeoPoint = { name: "Kerry Park", lat: 47.6295, lng: -122.3599 };
const FREMONT: GeoPoint = { name: "Fremont (N 36th St)", lat: 47.651, lng: -122.35 };
const FREMONT_TROLL: GeoPoint = { name: "Fremont Troll", lat: 47.6506, lng: -122.3496 };
const GAS_WORKS: GeoPoint = { name: "Gas Works Park", lat: 47.6456, lng: -122.3344 };
const SEATTLE_CENTER: GeoPoint = { name: "Seattle Center", lat: 47.6219, lng: -122.3517 };
const CHIHULY: GeoPoint = { name: "Chihuly Garden and Glass", lat: 47.6206, lng: -122.3494 };
const SPACE_NEEDLE: GeoPoint = { name: "Space Needle", lat: 47.6205, lng: -122.3493 };
const DISCOVERY_PARK: GeoPoint = { name: "Discovery Park", lat: 47.6613, lng: -122.416 };

const guestProfile: GuestProfile = {
  partySize: 1,
  hasRentalCar: false,
  preferences: ["food", "waterfront", "coffee", "quiet neighborhoods", "a little nightlife"],
  pace: "mixed",
  notes: "First time in Seattle, staying solo — wants a mix of food and low-key exploring, open to one livelier night out.",
};

const days: ItineraryDay[] = [
  {
    date: "2026-09-12",
    title: "Arrival",
    items: [
      { type: "commute", from: SEA_AIRPORT, to: ELYSIAN, by: "rideshare", fromTime: "15:00", toTime: "15:45" },
      {
        type: "activity",
        title: "Dinner at The Landing",
        category: "food",
        location: THE_LANDING,
        fromTime: "18:00",
        toTime: "19:30",
        notes: "Korean BBQ or sushi, five minutes from the house — an easy first night, no need to go far.",
      },
      {
        type: "activity",
        title: "Settle in",
        category: "relax",
        location: ELYSIAN,
        fromTime: "20:00",
        toTime: "21:00",
        notes: "Unpack, get oriented, turn in early — save the energy for tomorrow.",
      },
    ],
  },
  {
    date: "2026-09-13",
    title: "Pike Place & the Waterfront",
    items: [
      { type: "commute", from: ELYSIAN, to: DOWNTOWN, by: "rideshare", fromTime: "09:00", toTime: "09:35" },
      {
        type: "activity",
        title: "Pike Place Market",
        category: "landmark",
        location: PIKE_PLACE,
        fromTime: "09:45",
        toTime: "11:00",
        notes: "Come in from the Western Ave side, not First — skips the tour-group bottleneck at the main arch and drops you right at the fish counters.",
      },
      {
        type: "activity",
        title: "Coffee at the original Starbucks",
        category: "food",
        location: ORIGINAL_STARBUCKS,
        fromTime: "11:00",
        toTime: "11:45",
        notes: "Touristy, but two blocks from the market and worth seeing once. Order and keep walking rather than trying to sit.",
      },
      { type: "commute", from: PIKE_PLACE, to: SCULPTURE_PARK, by: "walk", fromTime: "11:45", toTime: "12:05" },
      {
        type: "activity",
        title: "Olympic Sculpture Park",
        category: "nature",
        location: SCULPTURE_PARK,
        fromTime: "12:05",
        toTime: "13:15",
        notes: "Free, outdoors, right on the water — a good reset after the market crowds.",
      },
      {
        type: "activity",
        title: "Lunch in Pioneer Square",
        category: "food",
        location: PIONEER_SQUARE,
        fromTime: "13:30",
        toTime: "14:30",
      },
      {
        type: "activity",
        title: "Underground Tour",
        category: "landmark",
        location: PIONEER_SQUARE,
        fromTime: "15:00",
        toTime: "16:30",
        notes: "Book the early-afternoon slot — noticeably less crowded than anything after 4pm.",
      },
      { type: "commute", from: PIONEER_SQUARE, to: CAPITOL_HILL, by: "rideshare", fromTime: "17:00", toTime: "17:20" },
      {
        type: "activity",
        title: "Dinner and a slow evening on Capitol Hill",
        category: "nightlife",
        location: CAPITOL_HILL,
        fromTime: "18:00",
        toTime: "21:00",
        notes: "Walk Pike/Pine and pick whatever looks good — the whole strip is dense with options.",
      },
    ],
  },
  {
    date: "2026-09-14",
    title: "Ballard & Golden Gardens",
    items: [
      { type: "commute", from: ELYSIAN, to: BALLARD, by: "rideshare", fromTime: "10:00", toTime: "10:40" },
      {
        type: "activity",
        title: "Ballard Farmers Market",
        category: "food",
        location: BALLARD,
        fromTime: "10:45",
        toTime: "12:00",
        notes: "Runs Sundays year-round — go early for the good produce, or come after 11:30 if you'd rather browse than fight the crowd.",
      },
      {
        type: "activity",
        title: "Ballard Locks",
        category: "landmark",
        location: BALLARD_LOCKS,
        fromTime: "12:15",
        toTime: "13:00",
        notes: "There's a fish-ladder viewing room downstairs most visitors miss — worth the detour.",
      },
      { type: "commute", from: BALLARD_LOCKS, to: GOLDEN_GARDENS, by: "walk", fromTime: "13:00", toTime: "13:20" },
      {
        type: "activity",
        title: "Golden Gardens Beach",
        category: "waterfront",
        location: GOLDEN_GARDENS,
        fromTime: "13:30",
        toTime: "16:00",
        notes: "West-facing beach — bring something to sit on and just stay through the afternoon light.",
      },
      {
        type: "activity",
        title: "Dinner back in Ballard",
        category: "food",
        location: BALLARD,
        fromTime: "18:00",
        toTime: "19:30",
        notes: "Ballard Ave has the highest concentration of good options within walking distance.",
      },
    ],
  },
  {
    date: "2026-09-15",
    title: "Bainbridge Island Ferry",
    items: [
      { type: "commute", from: ELYSIAN, to: COLMAN_DOCK, by: "rideshare", fromTime: "09:30", toTime: "10:00" },
      {
        type: "activity",
        title: "Ferry to Bainbridge Island",
        category: "waterfront",
        location: COLMAN_DOCK,
        fromTime: "10:20",
        toTime: "10:45",
        notes: "Sit on the right side (starboard) heading out — that's the Seattle skyline side, the view everyone photographs on the way back.",
      },
      {
        type: "activity",
        title: "Wander Winslow",
        category: "quiet neighborhoods",
        location: BAINBRIDGE,
        fromTime: "11:20",
        toTime: "14:30",
        notes: "Downtown Winslow is a five-minute walk from the ferry terminal — small, easy to cover entirely on foot.",
      },
      { type: "commute", from: BAINBRIDGE, to: COLMAN_DOCK, by: "ferry", fromTime: "14:50", toTime: "15:15" },
      {
        type: "activity",
        title: "Kerry Park",
        category: "landmark",
        location: KERRY_PARK,
        fromTime: "16:00",
        toTime: "17:30",
        notes: "The classic Space Needle skyline photo spot. Go for golden hour, not midday — sunset's around 7:25pm this time of year, so there's time to linger.",
      },
    ],
  },
  {
    date: "2026-09-16",
    title: "Fremont & Gas Works",
    items: [
      { type: "commute", from: ELYSIAN, to: FREMONT, by: "rideshare", fromTime: "10:30", toTime: "11:00" },
      {
        type: "activity",
        title: "Fremont Troll",
        category: "landmark",
        location: FREMONT_TROLL,
        fromTime: "11:00",
        toTime: "11:30",
        notes: "Mostly a photo stop — don't over-plan around it.",
      },
      {
        type: "activity",
        title: "Lunch in Fremont",
        category: "food",
        location: FREMONT,
        fromTime: "11:45",
        toTime: "13:00",
        notes: "The neighborhood's small enough to just walk the main strip and pick something.",
      },
      {
        type: "activity",
        title: "Gas Works Park",
        category: "nature",
        location: GAS_WORKS,
        fromTime: "13:15",
        toTime: "15:00",
        notes: "Climb the hill behind the old gasworks for a lake view most visitors miss because it's set back from the water.",
      },
      {
        type: "activity",
        title: "Quiet dinner near the house",
        category: "food",
        location: THE_LANDING,
        fromTime: "19:00",
        toTime: "21:00",
        notes: "A lighter night after a lot of walking.",
      },
    ],
  },
  {
    date: "2026-09-17",
    title: "Chihuly & Seattle Center",
    items: [
      { type: "commute", from: ELYSIAN, to: SEATTLE_CENTER, by: "rideshare", fromTime: "10:00", toTime: "10:40" },
      {
        type: "activity",
        title: "Chihuly Garden and Glass",
        category: "landmark",
        location: CHIHULY,
        fromTime: "11:00",
        toTime: "12:30",
        notes: "Buy the timed-entry ticket online the morning of — walk-up lines build fast around midday on weekdays.",
      },
      {
        type: "activity",
        title: "Lunch at Seattle Center",
        category: "food",
        location: SEATTLE_CENTER,
        fromTime: "12:45",
        toTime: "13:30",
      },
      {
        type: "activity",
        title: "Space Needle (optional)",
        category: "landmark",
        location: SPACE_NEEDLE,
        fromTime: "14:00",
        toTime: "16:00",
        notes: "Only worth the ticket price if the sky's clear — check that morning before committing.",
      },
      {
        type: "activity",
        title: "Last big dinner out",
        category: "nightlife",
        location: CAPITOL_HILL,
        fromTime: "18:30",
        toTime: "20:30",
        notes: "Worth picking somewhere a little nicer for the last full night.",
      },
    ],
  },
  {
    date: "2026-09-18",
    title: "Last Full Day",
    items: [
      {
        type: "activity",
        title: "Slow morning, coffee nearby",
        category: "coffee",
        location: THE_LANDING,
        fromTime: "10:00",
        toTime: "11:30",
        notes: "Nothing scheduled early — a good day to revisit a favorite spot from earlier in the week.",
      },
      {
        type: "activity",
        title: "Discovery Park",
        category: "nature",
        location: DISCOVERY_PARK,
        fromTime: "13:00",
        toTime: "15:00",
        notes: "The biggest green space in the city and the least touristy stop on this list — the lighthouse trail loop takes about 90 minutes.",
      },
      {
        type: "activity",
        title: "Casual dinner near the house",
        category: "food",
        location: THE_LANDING,
        fromTime: "18:00",
        toTime: "19:30",
        notes: "Pack tonight, not tomorrow morning — checkout is 10am.",
      },
    ],
  },
  {
    date: "2026-09-19",
    title: "Checkout",
    items: [
      {
        type: "activity",
        title: "Coffee and pack up",
        category: "relax",
        location: ELYSIAN,
        fromTime: "08:30",
        toTime: "09:30",
      },
      {
        type: "commute",
        from: ELYSIAN,
        to: SEA_AIRPORT,
        by: "rideshare",
        fromTime: "09:30",
        toTime: "10:00",
        notes: "Checkout is 10am — leave a buffer for security if it's a weekday morning flight.",
      },
    ],
  },
];

async function main() {
  const siteUrl = process.env.ADMIN_SITE_URL || "https://retreat.tedditory.co";
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) {
    console.error("Set ADMIN_API_TOKEN in .env.local before running this.");
    process.exit(1);
  }

  const referenceCode = process.argv[2] || "FZQGZ9";

  console.log(`Running migration on ${siteUrl}...`);
  const migrateRes = await fetch(new URL("/api/admin/migrate", siteUrl), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const migrateJson = await migrateRes.json();
  if (!migrateRes.ok || !migrateJson.ok) {
    console.error("Migration failed:", migrateJson.error || migrateRes.status);
    process.exit(1);
  }
  console.log("Migration ok:", migrateJson.ran);

  console.log(`Seeding itinerary for ${referenceCode}...`);
  const res = await fetch(new URL("/api/admin/itineraries", siteUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ referenceCode, guestProfile, days }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    console.error(json.error || `Request failed (${res.status})`);
    process.exit(1);
  }

  console.log(`Seeded. View at ${siteUrl}/itineraries/${referenceCode}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
