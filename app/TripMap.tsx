"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import type { TripMapPoint } from "../data/map-points";

const colors: Record<string, string> = {
  train: "#47788a",
  walk: "#9a6b47",
  cable: "#80566f",
  flight: "#637089",
  operator: "#b27648",
  transfer: "#70766f",
};

export default function TripMap({
  points,
  activeId,
  onSelect,
  overview = false,
  numberMode = "point",
}: {
  points: TripMapPoint[];
  activeId?: string | null;
  onSelect?: (point: TripMapPoint) => void;
  overview?: boolean;
  numberMode?: "step" | "point";
}) {
  const host = useRef<HTMLDivElement>(null),
    mapRef = useRef<LeafletMap | null>(null),
    markers = useRef<Record<string, Marker>>({}),
    selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  useEffect(() => {
    let alive = true;
    import("leaflet").then((L) => {
      if (!alive || !host.current) return;
      mapRef.current?.remove();
      markers.current = {};
      const map = L.map(host.current, {
        zoomControl: false,
        attributionControl: true,
      });
      mapRef.current = map;
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const bounds = L.latLngBounds([]);
      points.forEach((point, index) => {
        bounds.extend([point.lat, point.lng]);
        const duplicate = points
          .slice(0, index)
          .filter((item) => item.lat === point.lat && item.lng === point.lng).length;
        const icon = L.divIcon({
          className: "trip-pin-wrap",
          html: `<span class="trip-pin ${overview ? "overview" : ""}" style="translate:${duplicate * 10}px ${duplicate * -5}px">${overview ? index + 1 : numberMode === "step" ? point.eventIndex + 1 : point.order}</span>`,
          iconSize: [30, 36],
          iconAnchor: [15, 34],
        });
        const marker = L.marker([point.lat, point.lng], {
          icon,
          title: point.name,
        }).addTo(map);
        marker.on("click", () => selectRef.current?.(point));
        markers.current[point.id] = marker;
        if (index) {
          const previous = points[index - 1],
            kind = point.transport;
          L.polyline(
            [
              [previous.lat, previous.lng],
              [point.lat, point.lng],
            ],
            {
              color: colors[kind] || colors.transfer,
              weight: kind === "walk" ? 2 : 3,
              opacity: 0.78,
              dashArray:
                kind === "walk"
                  ? "3 6"
                  : kind === "train"
                    ? "10 7"
                    : kind === "flight"
                      ? "9 8"
                      : "5 6",
            },
          ).addTo(map);
        }
      });
      if (bounds.isValid())
        map.fitBounds(bounds, {
          padding: [25, 25],
          maxZoom: overview ? 6 : 14,
        });
    });
    return () => {
      alive = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [points, overview, numberMode]);
  useEffect(() => {
    if (!activeId) return;
    const marker = markers.current[activeId];
    if (marker && mapRef.current)
      mapRef.current.setView(marker.getLatLng(), 15, { animate: true });
  }, [activeId]);
  return (
    <div
      className="trip-map"
      ref={host}
      aria-label={overview ? "瑞士至意大利主路线地图" : "当日行程地图"}
    />
  );
}
