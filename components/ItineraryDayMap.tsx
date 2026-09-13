"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { GeoPoint } from "@/lib/itineraries";

const ACCENT = "#3A6B57";
const MUTED = "#B9C4BE";
const FOCUS_ZOOM = 15;

function dotIcon(L: typeof import("leaflet"), active: boolean) {
  const size = active ? 18 : 11;
  return L.divIcon({
    className: "itinerary-pin",
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${
      active ? ACCENT : "#fff"
    };border:2px solid ${active ? ACCENT : MUTED};box-shadow:0 1px 4px rgba(0,0,0,.25);"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function ItineraryDayMap({
  points,
  activeIndex,
  defaultBoundsPoints,
  focusPoints,
}: {
  points: GeoPoint[];
  activeIndex: number;
  /** What to fit on mount, before anything's selected — the day's actual
   *  stops, not commute endpoints that might be miles apart. */
  defaultBoundsPoints: GeoPoint[];
  /** Where to focus for the current selection: one point to zoom in close
   *  on a stop, or two to fit a commute leg — zooming out only when a
   *  commute is actually what's being shown. */
  focusPoints: GeoPoint[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, { scrollWheelZoom: false, attributionControl: false });
      // Esri's free "Light Gray Canvas" — a minimal grey basemap (no key
      // required) with a thin separate label layer on top. CartoDB Positron
      // was tried first but now requires an API key on this tier.
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Esri, HERE, Garmin, © OpenStreetMap contributors", maxZoom: 16 }
      ).addTo(map);
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16 }
      ).addTo(map);
      L.control.attribution({ prefix: false, position: "bottomright" }).addTo(map);

      const latLngs = points.map((p) => [p.lat, p.lng] as [number, number]);
      L.polyline(latLngs, { color: ACCENT, weight: 2, opacity: 0.6, dashArray: "1 8", lineCap: "round" }).addTo(map);

      markersRef.current = points.map((p, i) =>
        L.marker([p.lat, p.lng], { icon: dotIcon(L, i === activeIndex) }).addTo(map).bindTooltip(p.name, {
          direction: "top",
          offset: [0, -8],
        })
      );

      const boundsSource = defaultBoundsPoints.length > 0 ? defaultBoundsPoints : points;
      const boundsLatLngs = boundsSource.map((p) => [p.lat, p.lng] as [number, number]);
      if (boundsLatLngs.length > 1) {
        map.fitBounds(L.latLngBounds(boundsLatLngs), { padding: [32, 32] });
      } else if (boundsLatLngs.length === 1) {
        map.setView(boundsLatLngs[0], FOCUS_ZOOM);
      }

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || markers.length === 0) return;

    import("leaflet").then((L) => {
      markers.forEach((marker, i) => marker.setIcon(dotIcon(L, i === activeIndex)));

      if (focusPoints.length === 1) {
        map.flyTo([focusPoints[0].lat, focusPoints[0].lng], FOCUS_ZOOM, { animate: true, duration: 0.6 });
      } else if (focusPoints.length > 1) {
        const bounds = L.latLngBounds(focusPoints.map((p) => [p.lat, p.lng] as [number, number]));
        map.flyToBounds(bounds, { padding: [48, 48], animate: true, duration: 0.6 });
      }
    });
  }, [activeIndex, focusPoints]);

  return <div ref={containerRef} className="itinerary-map" />;
}
