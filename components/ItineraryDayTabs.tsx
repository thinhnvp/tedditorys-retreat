"use client";

import { useState } from "react";
import type { ItineraryDay as ItineraryDayType } from "@/lib/itineraries";
import ItineraryDay from "./ItineraryDay";
import { formatFriendlyDate } from "@/lib/format";

function shortDate(iso: string): string {
  return formatFriendlyDate(iso).replace(/, \d{4}$/, "");
}

export default function ItineraryDayTabs({ days }: { days: ItineraryDayType[] }) {
  const [activeDay, setActiveDay] = useState(0);
  const day = days[activeDay];

  return (
    <div className="itinerary-tabs-wrap">
      <div className="itinerary-tabs">
        {days.map((d, i) => (
          <button
            key={d.date}
            type="button"
            className={`itinerary-tab${i === activeDay ? " active" : ""}`}
            onClick={() => setActiveDay(i)}
          >
            <span className="itinerary-tab-date">{shortDate(d.date)}</span>
            {d.title && <span className="itinerary-tab-title">{d.title}</span>}
          </button>
        ))}
      </div>

      {/* Keyed by date so switching tabs fully remounts the day — resets
          scroll-sync state and, importantly, tears down the previous map so
          only one Leaflet instance ever exists at a time. */}
      <ItineraryDay day={day} key={day.date} />
    </div>
  );
}
