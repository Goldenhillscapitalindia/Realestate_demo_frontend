import React, { useMemo, useState } from "react";
import { PULSE_COLORS } from "./constants";
import { normalizePulseKey } from "./utils";
import type { MarketRadarItem } from "./types";

type MarketRadarTableProps = {
  data: MarketRadarItem[];
  loading: boolean;
  error: string | null;
  onSelectsub_market_name: (item: MarketRadarItem) => void;
};

const MarketRadarTable: React.FC<MarketRadarTableProps> = ({
  data,
  loading,
  error,
  onSelectsub_market_name,
}) => {
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data;
    return data.filter((item) => {
      const submarket = item.sub_market_name?.toLowerCase() ?? "";
      const region = item.region?.toLowerCase() ?? "";
      return submarket.includes(normalized) || region.includes(normalized);
    });
  }, [data, query]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-200">SubMarket Pulse</p>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search submarket or region"
          className="h-9 w-full rounded-full border border-white/10 bg-[#0B1220] px-4 text-xs text-slate-200 placeholder:text-slate-500 focus:border-white/30 focus:outline-none sm:w-64"
        />
      </div>
      <div className="max-h-[420px] overflow-hidden rounded-2xl border border-white/10">
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="sticky top-0 bg-[#0B1220] text-xs uppercase tracking-[0.15em] text-slate-500">
              <tr>
                <th className="px-4 py-3">submarket name</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Market Pulse</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                const pulseKey = normalizePulseKey(item.marketPulse);
                const color = PULSE_COLORS[pulseKey]?.dot ?? "#21C7D9";
                return (
                  <tr
                    key={`${item.sub_market_name}-${idx}`}
                    className="cursor-pointer border-t border-white/5 transition hover:bg-white/5"
                    onClick={() => onSelectsub_market_name(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectsub_market_name(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <td className="px-4 py-3 text-slate-100">{item.sub_market_name}</td>
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
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        {item.marketPulse}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!filteredData.length && !loading && (
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
  );
};

export default MarketRadarTable;
