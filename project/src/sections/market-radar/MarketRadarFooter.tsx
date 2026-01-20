import React from "react";

type MarketRadarFooterProps = {
  count: number;
  lastUpdated: Date | null;
};

const MarketRadarFooter: React.FC<MarketRadarFooterProps> = ({ count, lastUpdated }) => (
  <div
    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 px-6 py-3 text-xs text-slate-400"
    style={{
      background:
        "linear-gradient(135deg, rgba(9,16,30,0.98) 0%, rgba(9,19,32,0.98) 100%)",
    }}
  >
    <div className="flex items-center gap-6">
      <span className="text-slate-300">{count} markets tracked</span>
      <span>
        Last updated:{" "}
        <span className="text-slate-200">
          {lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading..."}
        </span>
      </span>
    </div>
    <span className="text-slate-500">Click a market to view detailed analysis</span>
  </div>
);

export default MarketRadarFooter;
