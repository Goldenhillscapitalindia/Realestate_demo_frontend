import React, { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useNavigate } from "react-router-dom";

type RawMarketRadarItem = {
  region?: string;
  submarket?: string;
  submarketname?: string;
  market_pulse?: string;
  marketPulse?: string;
  pulse?: string;
  latitude?: number | string;
  longitude?: number | string;
  lat?: number | string;
  lng?: number | string;
  coordinates?: {
    latitude?: number | string;
    longitude?: number | string;
    lat?: number | string;
    lng?: number | string;
    lattitude?: number | string;
    langitude?: number | string;
  };
};

type MarketRadarItem = {
  region: string;
  submarket: string;
  marketPulse: string;
  latitude: number;
  longitude: number;
};

const PULSE_COLORS: Record<string, { dot: string; glow: string; label: string }> = {
  strong: { dot: "#2ED573", glow: "rgba(46, 213, 115, 0.45)", label: "Strong" },
  improving: { dot: "#21C7D9", glow: "rgba(33, 199, 217, 0.45)", label: "Improving" },
  mixed: { dot: "#F4B740", glow: "rgba(244, 183, 64, 0.45)", label: "Mixed" },
  weakening: { dot: "#FF5A4A", glow: "rgba(255, 90, 74, 0.45)", label: "Weakening" },
};

const normalizePulseKey = (value: string) => value.toLowerCase().trim();

const MarketRadar: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState<MarketRadarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/market_radar_data_test/`);
        const payload = response.data?.data ?? response.data ?? [];
        const rows = Array.isArray(payload) ? payload : [payload];
        const normalized = normalizeItems(rows);
        if (!active) return;
        setData(normalized);
        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError("Failed to load market radar data.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [API_URL]);

  const pulseCounts = useMemo(() => {
    return data.reduce<Record<string, number>>((acc, item) => {
      const key = normalizePulseKey(item.marketPulse);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  const mapCenter = useMemo(() => {
    if (!data.length) {
      return { lat: 39.5, lng: -98.35 };
    }
    const total = data.reduce(
      (acc, item) => {
        acc.lat += item.latitude;
        acc.lng += item.longitude;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    return { lat: total.lat / data.length, lng: total.lng / data.length };
  }, [data]);

  const mapBounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (!data.length) return null;
    const lats = data.map((item) => item.latitude);
    const lngs = data.map((item) => item.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }, [data]);

  const mapCenterLatLng = useMemo<LatLngExpression>(
    () => [mapCenter.lat, mapCenter.lng],
    [mapCenter.lat, mapCenter.lng]
  );

  return (
    <section className="min-h-screen px-6 py-10" style={{ backgroundColor: "#060B14" }}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div
          className="rounded-2xl border border-white/10 px-6 py-4 shadow-[0_0_40px_rgba(0,140,255,0.15)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(12,20,35,0.95) 0%, rgba(10,15,30,0.9) 100%)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(27, 202, 234, 0.15)" }}
              >
                <span style={{ color: "#20C7D9" }}>O</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Market Signal Radar</p>
                <h2 className="text-xl font-semibold text-slate-100">Market Signal Radar</h2>
              </div>
            </div>
            <div
              className="rounded-full px-4 py-1 text-sm font-semibold text-cyan-100"
              style={{
                backgroundColor: "rgba(0, 193, 255, 0.15)",
                border: "1px solid rgba(0, 193, 255, 0.35)",
              }}
            >
              AI-Powered
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div
            className="rounded-2xl border border-white/10 p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-cyan-300">*</span>
              <h3 className="text-base font-semibold text-cyan-200">AI Market Pulse</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              AI detects shifts in absorption efficiency and pricing pressure across key submarkets.
              Track improving momentum and areas under stress in near real time.
            </p>
          </div>
          <div
            className="rounded-2xl border border-white/10 p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Market Pulse</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
              {Object.keys(PULSE_COLORS).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: PULSE_COLORS[key].dot,
                      boxShadow: `0 0 12px ${PULSE_COLORS[key].glow}`,
                    }}
                  />
                  <span className="flex-1">{PULSE_COLORS[key].label}</span>
                  <span className="text-slate-400">{pulseCounts[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
          }}
        >
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-200">Market Radar Map</p>
                <div className="flex gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {Object.keys(PULSE_COLORS).map((key) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: PULSE_COLORS[key].dot }}
                      />
                      <span>{PULSE_COLORS[key].label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10"
                style={{ backgroundColor: "#0B1220" }}
              >
                <MapContainer className="h-full w-full" zoomControl={true}>
                  <MapViewUpdater center={mapCenterLatLng} bounds={mapBounds} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {data.map((item, idx) => {
                    const pulseKey = normalizePulseKey(item.marketPulse);
                    const color = PULSE_COLORS[pulseKey]?.dot ?? "#21C7D9";
                    return (
                      <CircleMarker
                        key={`${item.submarket}-${idx}`}
                        center={[item.latitude, item.longitude]}
                        radius={7}
                        pathOptions={{
                          color: "#0B1220",
                          weight: 2,
                          fillColor: color,
                          fillOpacity: 1,
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
                          {item.submarket} ({item.region})
                        </Tooltip>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-200">Submarket Pulse Table</p>
              <div className="max-h-[420px] overflow-hidden rounded-2xl border border-white/10">
                <div className="max-h-[420px] overflow-auto">
                  <table className="w-full text-left text-sm text-slate-200">
                    <thead className="sticky top-0 bg-[#0B1220] text-xs uppercase tracking-[0.15em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Submarket</th>
                        <th className="px-4 py-3">Region</th>
                        <th className="px-4 py-3">Market Pulse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, idx) => {
                        const pulseKey = normalizePulseKey(item.marketPulse);
                        const color = PULSE_COLORS[pulseKey]?.dot ?? "#21C7D9";
                        return (
                          <tr
                            key={`${item.submarket}-${idx}`}
                            className="cursor-pointer border-t border-white/5 transition hover:bg-white/5"
                            onClick={() =>
                              navigate(`/market_radar_view/${encodeURIComponent(item.submarket)}`)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                navigate(`/market_radar_view/${encodeURIComponent(item.submarket)}`);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <td className="px-4 py-3 text-slate-100">{item.submarket}</td>
                            <td className="px-4 py-3 text-slate-400">{item.region}</td>
                            <td className="px-4 py-3">
                              <span
                                className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold"
                                style={{
                                  backgroundColor: "rgba(15, 23, 42, 0.6)",
                                  border: `1px solid ${color}`,
                                  color,
                                }}
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                {item.marketPulse}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {!data.length && !loading && (
                        <tr>
                          <td className="px-4 py-6 text-center text-slate-400" colSpan={3}>
                            No market radar data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 px-6 py-3 text-xs text-slate-400"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
          }}
        >
          <div className="flex items-center gap-6">
            <span className="text-slate-300">{data.length} markets tracked</span>
            <span>
              Last updated:{" "}
              <span className="text-slate-200">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading..."}
              </span>
            </span>
          </div>
          <span className="text-slate-500">Click a market to view detailed analysis</span>
        </div>
      </div>
    </section>
  );
};

const normalizeItems = (items: RawMarketRadarItem[]): MarketRadarItem[] =>
  items
    .map((item) => {
      const latitude =
        item.latitude ??
        item.lat ??
        item.coordinates?.latitude ??
        item.coordinates?.lat ??
        item.coordinates?.lattitude;
      const longitude =
        item.longitude ??
        item.lng ??
        item.coordinates?.longitude ??
        item.coordinates?.lng ??
        item.coordinates?.langitude;

      return {
        region: String(item.region ?? "Unknown"),
        submarket: String(item.submarket ?? item.submarketname ?? "Unknown"),
        marketPulse: String(item.market_pulse ?? item.marketPulse ?? item.pulse ?? "Mixed"),
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
    })
    .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));

export default MarketRadar;

type MapViewUpdaterProps = {
  center: LatLngExpression;
  bounds: LatLngBoundsExpression | null;
};

const MapViewUpdater: React.FC<MapViewUpdaterProps> = ({ center, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView(center, 4);
    }
  }, [bounds, center, map]);

  return null;
};
