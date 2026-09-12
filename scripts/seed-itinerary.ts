import { config } from "dotenv";
config({ path: ".env.local" });
config();

import type { GuestProfile, ItineraryDay } from "../lib/itineraries";

// Demo content only — illustrative placeholders for the concept, not
// verified, bookable recommendations. Swap in the host's actual picks
// before this ever goes to a real guest.

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
      { type: "commute", from: "SEA Airport", to: "Elysian Escape", by: "rideshare", fromTime: "15:00", toTime: "15:45" },
      {
        type: "activity",
        title: "Dinner at The Landing",
        category: "food",
        location: "The Landing, Renton",
        fromTime: "18:00",
        toTime: "19:30",
        notes: "Korean BBQ or sushi, five minutes from the house — an easy first night, no need to go far.",
      },
      {
        type: "activity",
        title: "Settle in",
        category: "relax",
        location: "Elysian Escape",
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
      { type: "commute", from: "Elysian Escape", to: "Downtown Seattle", by: "rideshare", fromTime: "09:00", toTime: "09:35" },
      {
        type: "activity",
        title: "Pike Place Market",
        category: "landmark",
        location: "Pike Place Market",
        fromTime: "09:45",
        toTime: "11:00",
        notes: "Come in from the Western Ave side, not First — skips the tour-group bottleneck at the main arch and drops you right at the fish counters.",
      },
      {
        type: "activity",
        title: "Coffee at the original Starbucks",
        category: "food",
        location: "1912 Pike Pl",
        fromTime: "11:00",
        toTime: "11:45",
        notes: "Touristy, but two blocks from the market and worth seeing once. Order and keep walking rather than trying to sit.",
      },
      { type: "commute", from: "Pike Place", to: "Olympic Sculpture Park", by: "walk", fromTime: "11:45", toTime: "12:05" },
      {
        type: "activity",
        title: "Olympic Sculpture Park",
        category: "nature",
        location: "Olympic Sculpture Park",
        fromTime: "12:05",
        toTime: "13:15",
        notes: "Free, outdoors, right on the water — a good reset after the market crowds.",
      },
      {
        type: "activity",
        title: "Lunch in Pioneer Square",
        category: "food",
        location: "Pioneer Square",
        fromTime: "13:30",
        toTime: "14:30",
      },
      {
        type: "activity",
        title: "Underground Tour",
        category: "landmark",
        location: "Pioneer Square",
        fromTime: "15:00",
        toTime: "16:30",
        notes: "Book the early-afternoon slot — noticeably less crowded than anything after 4pm.",
      },
      { type: "commute", from: "Pioneer Square", to: "Capitol Hill", by: "rideshare", fromTime: "17:00", toTime: "17:20" },
      {
        type: "activity",
        title: "Dinner and a slow evening on Capitol Hill",
        category: "nightlife",
        location: "Capitol Hill",
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
      { type: "commute", from: "Elysian Escape", to: "Ballard", by: "rideshare", fromTime: "10:00", toTime: "10:40" },
      {
        type: "activity",
        title: "Ballard Farmers Market",
        category: "food",
        location: "Ballard Ave",
        fromTime: "10:45",
        toTime: "12:00",
        notes: "Runs Sundays year-round — go early for the good produce, or come after 11:30 if you'd rather browse than fight the crowd.",
      },
      {
        type: "activity",
        title: "Ballard Locks",
        category: "landmark",
        location: "Hiram M. Chittenden Locks",
        fromTime: "12:15",
        toTime: "13:00",
        notes: "There's a fish-ladder viewing room downstairs most visitors miss — worth the detour.",
      },
      { type: "commute", from: "Ballard Locks", to: "Golden Gardens", by: "walk", fromTime: "13:00", toTime: "13:20" },
      {
        type: "activity",
        title: "Golden Gardens Beach",
        category: "waterfront",
        location: "Golden Gardens Park",
        fromTime: "13:30",
        toTime: "16:00",
        notes: "West-facing beach — bring something to sit on and just stay through the afternoon light.",
      },
      {
        type: "activity",
        title: "Dinner back in Ballard",
        category: "food",
        location: "Ballard Ave",
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
      { type: "commute", from: "Elysian Escape", to: "Colman Dock", by: "rideshare", fromTime: "09:30", toTime: "10:00" },
      {
        type: "activity",
        title: "Ferry to Bainbridge Island",
        category: "waterfront",
        location: "Colman Dock",
        fromTime: "10:20",
        toTime: "10:45",
        notes: "Sit on the right side (starboard) heading out — that's the Seattle skyline side, the view everyone photographs on the way back.",
      },
      {
        type: "activity",
        title: "Wander Winslow",
        category: "quiet neighborhoods",
        location: "Bainbridge Island",
        fromTime: "11:20",
        toTime: "14:30",
        notes: "Downtown Winslow is a five-minute walk from the ferry terminal — small, easy to cover entirely on foot.",
      },
      { type: "commute", from: "Bainbridge Island", to: "Seattle", by: "ferry", fromTime: "14:50", toTime: "15:15" },
      {
        type: "activity",
        title: "Kerry Park",
        category: "landmark",
        location: "Kerry Park",
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
      { type: "commute", from: "Elysian Escape", to: "Fremont", by: "rideshare", fromTime: "10:30", toTime: "11:00" },
      {
        type: "activity",
        title: "Fremont Troll",
        category: "landmark",
        location: "Under the Aurora Bridge",
        fromTime: "11:00",
        toTime: "11:30",
        notes: "Mostly a photo stop — don't over-plan around it.",
      },
      {
        type: "activity",
        title: "Lunch in Fremont",
        category: "food",
        location: "N 36th St, Fremont",
        fromTime: "11:45",
        toTime: "13:00",
        notes: "The neighborhood's small enough to just walk the main strip and pick something.",
      },
      {
        type: "activity",
        title: "Gas Works Park",
        category: "nature",
        location: "Gas Works Park",
        fromTime: "13:15",
        toTime: "15:00",
        notes: "Climb the hill behind the old gasworks for a lake view most visitors miss because it's set back from the water.",
      },
      {
        type: "activity",
        title: "Quiet dinner near the house",
        category: "food",
        location: "The Landing, Renton",
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
      { type: "commute", from: "Elysian Escape", to: "Seattle Center", by: "rideshare", fromTime: "10:00", toTime: "10:40" },
      {
        type: "activity",
        title: "Chihuly Garden and Glass",
        category: "landmark",
        location: "Seattle Center",
        fromTime: "11:00",
        toTime: "12:30",
        notes: "Buy the timed-entry ticket online the morning of — walk-up lines build fast around midday on weekdays.",
      },
      {
        type: "activity",
        title: "Lunch at Seattle Center",
        category: "food",
        location: "Seattle Center",
        fromTime: "12:45",
        toTime: "13:30",
      },
      {
        type: "activity",
        title: "Space Needle (optional)",
        category: "landmark",
        location: "Space Needle",
        fromTime: "14:00",
        toTime: "16:00",
        notes: "Only worth the ticket price if the sky's clear — check that morning before committing.",
      },
      {
        type: "activity",
        title: "Last big dinner out",
        category: "nightlife",
        location: "Capitol Hill or Downtown",
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
        location: "Renton",
        fromTime: "10:00",
        toTime: "11:30",
        notes: "Nothing scheduled early — a good day to revisit a favorite spot from earlier in the week.",
      },
      {
        type: "activity",
        title: "Discovery Park",
        category: "nature",
        location: "Discovery Park",
        fromTime: "13:00",
        toTime: "15:00",
        notes: "The biggest green space in the city and the least touristy stop on this list — the lighthouse trail loop takes about 90 minutes.",
      },
      {
        type: "activity",
        title: "Casual dinner near the house",
        category: "food",
        location: "The Landing, Renton",
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
        location: "Elysian Escape",
        fromTime: "08:30",
        toTime: "09:30",
      },
      {
        type: "commute",
        from: "Elysian Escape",
        to: "SEA Airport",
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
