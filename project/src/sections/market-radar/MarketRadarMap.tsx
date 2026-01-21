import React from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { PULSE_COLORS } from "./constants";
import { normalizePulseKey } from "./utils";
import type { MarketRadarItem } from "./types";
import MapViewUpdater from "./MapViewUpdater";

type MarketRadarMapProps = {
  data: MarketRadarItem[];
  mapCenter: LatLngExpression;
  mapBounds: LatLngBoundsExpression | null;
};

const MarketRadarMap: React.FC<MarketRadarMapProps> = ({ data, mapCenter, mapBounds }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-xl font-semibold text-slate-900">Market Radar Map</p>
      {/* <div className="flex gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
        {Object.keys(PULSE_COLORS).map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PULSE_COLORS[key].dot }} />
            <span>{PULSE_COLORS[key].label}</span>
          </div>
        ))}
      </div> */}
    </div>
    <div
      className="relative h-[420px] overflow-hidden rounded-2xl border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <MapContainer className="h-full w-full" center={mapCenter} zoom={4} zoomControl={true}>
        <MapViewUpdater center={mapCenter} bounds={mapBounds} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {data.map((item, idx) => {
          const pulseKey = normalizePulseKey(item.marketPulse);
          const color = PULSE_COLORS[pulseKey]?.dot ?? "#21C7D9";
          return (
            <CircleMarker
              key={`${item.sub_market_name}-${idx}`}
              center={[item.latitude, item.longitude]}
              radius={7}
              pathOptions={{
                color: "#FFFFFF",
                weight: 2,
                fillColor: color,
                fillOpacity: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
                {item.sub_market_name} ({item.region})
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  </div>
);

export default MarketRadarMap;
