"use client";

import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Tooltip
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapVenue = {
  lat: number;
  lng: number;
  shortName?: string;
};

type MapCompetitor = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  gpRiskPerWeek?: number;
};

type ElanMapProps = {
  centerVenue: MapVenue;
  competitors: MapCompetitor[];
  radiusKm: number;
};

export default function ElanMap({
  centerVenue,
  competitors,
  radiusKm
}: ElanMapProps) {
  const center: [number, number] = [centerVenue.lat, centerVenue.lng];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
      <MapContainer
        key={`${center[0]}-${center[1]}`} // force recenter when venue changes
        {...({
          center,
          zoom: 15,
          scrollWheelZoom: false,
          style: { height: 320, width: "100%" }
        } as any)}
      >
        <TileLayer
          {...({
            attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
            url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          } as any)}
        />

        {/* Bubble radius */}
        <Circle
          {...({
            center,
            radius: radiusKm * 1000,
            pathOptions: {
              color: "#22d3ee",
              fillColor: "#22d3ee",
              fillOpacity: 0.08,
              weight: 1
            }
          } as any)}
        />

        {/* EL&N venue marker */}
        <CircleMarker
          {...({
            center,
            radius: 8,
            pathOptions: {
              color: "#22d3ee",
              fillColor: "#22d3ee",
              fillOpacity: 0.9,
              weight: 2
            }
          } as any)}
        >
          <Tooltip
            {...({
              permanent: true,
              direction: "top",
              className: "!bg-slate-900 !text-xs !text-cyan-200"
            } as any)}
          >
            {centerVenue.shortName ?? "EL&N venue"}
          </Tooltip>
        </CircleMarker>

        {/* Competitor markers */}
        {competitors.map((c) => (
          <CircleMarker
            key={c.id}
            {...({
              center: [c.lat, c.lng],
              radius: 7,
              pathOptions: {
                color: "#fb923c",
                fillColor: "#fb923c",
                fillOpacity: 0.9,
                weight: 1.5
              }
            } as any)}
          >
            <Tooltip
              {...({
                direction: "top",
                className: "!bg-slate-900 !text-xs !text-amber-100"
              } as any)}
            >
              <div>
                <strong>{c.name}</strong>
                {typeof c.gpRiskPerWeek === "number" && (
                  <p>GP risk ~ £{c.gpRiskPerWeek.toLocaleString("en-GB")}/week</p>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
