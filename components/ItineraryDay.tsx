"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ItineraryDay as ItineraryDayType, GeoPoint } from "@/lib/itineraries";
import ItineraryDayMap from "./ItineraryDayMap";
import { formatFriendlyDate } from "@/lib/format";

export default function ItineraryDay({ day }: { day: ItineraryDayType }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // While a click-triggered scroll is settling, ignore the observer — it
  // would otherwise see the scroll-in-progress and momentarily fight the
  // click's own selection.
  const suppressObserverRef = useRef(false);
  const suppressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // One point per item: an activity's own location, or a commute's
  // destination (arrival = "where you are now"). If the day opens with a
  // commute, its origin is prepended so the trajectory has a real start.
  const pointOffset = day.items[0]?.type === "commute" ? 1 : 0;
  const points: GeoPoint[] = useMemo(() => {
    const pts: GeoPoint[] = [];
    day.items.forEach((item, i) => {
      if (item.type === "commute" && i === 0) pts.push(item.from);
      pts.push(item.type === "activity" ? item.location : item.to);
    });
    return pts;
  }, [day.items]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserverRef.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const idx = itemRefs.current.findIndex((el) => el === topMost.target);
        if (idx !== -1) setActiveIndex(idx);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => {
      observer.disconnect();
      if (suppressTimeoutRef.current) clearTimeout(suppressTimeoutRef.current);
    };
  }, [day.items]);

  function handleSelect(i: number) {
    // The clicked item is already on screen (that's how it got clicked), so
    // no need to scroll it into place — just guard against a stray observer
    // callback (already queued from whatever scroll got it into view)
    // landing right after and overriding the click.
    setActiveIndex(i);
    suppressObserverRef.current = true;
    if (suppressTimeoutRef.current) clearTimeout(suppressTimeoutRef.current);
    suppressTimeoutRef.current = setTimeout(() => {
      suppressObserverRef.current = false;
    }, 400);
  }

  return (
    <div className="itinerary-day reveal">
      <div className="itinerary-day-head">
        <div className="itinerary-date">{formatFriendlyDate(day.date)}</div>
        {day.title && <h3>{day.title}</h3>}
      </div>

      <div className="itinerary-day-grid">
        <ol className="itinerary-items">
          {day.items.map((item, i) => (
            <li
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`${item.type === "commute" ? "commute" : "activity"}${i === activeIndex ? " active" : ""}`}
              key={i}
              onClick={() => handleSelect(i)}
            >
              <span className="itinerary-time">
                {item.fromTime}
                <span className="to">→ {item.toTime}</span>
              </span>
              <div className="itinerary-body">
                {item.type === "commute" ? (
                  <div className="itinerary-title">
                    {item.from.name} → {item.to.name}
                    <span className="itinerary-by"> · {item.by}</span>
                  </div>
                ) : (
                  <>
                    <div className="itinerary-title">{item.title}</div>
                    <div className="itinerary-location">{item.location.name}</div>
                  </>
                )}
                {item.notes && <p className="itinerary-notes">{item.notes}</p>}
              </div>
            </li>
          ))}
        </ol>

        <div className="itinerary-map-wrap">
          <ItineraryDayMap points={points} activeIndex={activeIndex + pointOffset} />
        </div>
      </div>
    </div>
  );
}
