import React, { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useNavigate } from "react-router-dom";
import MarketRadarFooter from "./market-radar/MarketRadarFooter";
import MarketRadarHeader from "./market-radar/MarketRadarHeader";
import MarketRadarHighlights from "./market-radar/MarketRadarHighlights";
import MarketRadarMap from "./market-radar/MarketRadarMap";
import MarketRadarTable from "./market-radar/MarketRadarTable";
import { normalizeItems, normalizePulseKey } from "./market-radar/utils";
import type { MarketRadarItem } from "./market-radar/types";

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
        <MarketRadarHeader />
        <MarketRadarHighlights pulseCounts={pulseCounts} />
        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
          }}
        >
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <MarketRadarMap data={data} mapCenter={mapCenterLatLng} mapBounds={mapBounds} />
            <MarketRadarTable
              data={data}
              loading={loading}
              error={error}
              onSelectSubmarket={(item) =>
                navigate(`/market_radar_view/${encodeURIComponent(item)}`)
              }
            />
          </div>
        </div>
        <MarketRadarFooter count={data.length} lastUpdated={lastUpdated} />
      </div>
    </section>
  );
};

export default MarketRadar;
